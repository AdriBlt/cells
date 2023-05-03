import { Complex } from "../../numbers/Complex";
import { random } from "../../utils/random";
import { Vector } from "../../utils/vector";
import { FourierParameter } from "./FourierParameter";
import { SignalType } from "./SignalType";

type ValueEvaluator = (time: number) => number;

export interface Signal {
  type: SignalType;
  getFrequencyParameter: (frequency: number) => FourierParameter;
  getExpectedValue: ValueEvaluator;
}

const squareSignal: Signal = {
  type: SignalType.SQUARE,
  getFrequencyParameter: (frequency) => {
    return {
      frequency,
      amplitude: frequency % 2 < 1 ? 0 : 4 / (frequency * Math.PI),
      phase: 0,
    };
  },
  getExpectedValue: (time) => {
    return (time / Math.PI) % 2 < 1 ? -1 : 1;
  },
};

const sawToothSignal: Signal = {
  type: SignalType.SAWTOOTH,
  getFrequencyParameter: (frequency) => {
    return {
      frequency,
      amplitude: frequency === 0 ? 0 : 2 / (frequency * Math.PI),
      phase: 0,
    };
  },
  getExpectedValue: (time) => {
    return ((time / Math.PI) % 2) - 1;
  },
};

const triangleSignal: Signal = {
  type: SignalType.TRIANGLE,
  getFrequencyParameter: (frequency) => {
    let amplitude;
    if (frequency % 2 < 1) {
      amplitude = 0;
    } else {
      const value = 8 / (frequency * frequency * Math.PI * Math.PI);
      amplitude = frequency % 4 < 2 ? value : -value;
    }

    return {
      frequency,
      amplitude,
      phase: 0,
    };
  },
  getExpectedValue: (time) => {
    const value = (time / Math.PI) % 2;
    return value < 0.5
      ? -2 * value
      : value < 1.5
      ? 2 * value - 2
      : -2 * value + 4;
  },
};

function computeSignal(
  getExpectedValue: ValueEvaluator,
  type: SignalType
): Signal {
  const N = 10000;
  return {
    type,
    getFrequencyParameter: (frequency) => {
      let sum = new Complex();
      for (let n = 0; n < N; n++) {
        const time = (2 * Math.PI * n) / N;
        const value = getExpectedValue(time);
        const phi = -frequency * time;
        const point = Vector.fromAngle(phi, value);
        sum = sum.add(new Complex(point.x, point.y));
      }

      sum = sum.divideByReal(N);

      return {
        frequency,
        amplitude: 2 * sum.getModule(), // Factor 2 because we lack negative frequencies
        phase: sum.getAngle() - Math.PI / 2, // Rotating one quarter
      };
    },
    getExpectedValue,
  };
}

function makeRandomPeriodicSignal(): ValueEvaluator {
  const N = 10;
  const parameters: FourierParameter[] = [];
  for (let i = 0; i < N; i++) {
    parameters.push({
      frequency: (2 * Math.PI * i) / N,
      amplitude: random(-0.5, 0.5),
      phase: random(0, 2 * Math.PI),
    });
  }

  return (time: number) => {
    let value = 0;
    for (const param of parameters) {
      value += param.amplitude * Math.sin(param.frequency * time + param.phase);
    }

    return value;
  };
}

function getEvaluator(type: SignalType): ValueEvaluator {
  switch (type) {
    case SignalType.SQUARE:
      return squareSignal.getExpectedValue;
    case SignalType.SAWTOOTH:
      return sawToothSignal.getExpectedValue;
    case SignalType.TRIANGLE:
      return triangleSignal.getExpectedValue;
    case SignalType.RANDOM:
      return makeRandomPeriodicSignal();
    default:
      throw new Error("Signal.getEvaluator: unknown type");
  }
}

export function getSignal(type: SignalType): Signal {
  return computeSignal(getEvaluator(type), type);
}
