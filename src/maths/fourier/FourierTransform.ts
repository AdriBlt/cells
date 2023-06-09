import { Complex } from "../../numbers/Complex";
import { FourierParameter } from "./FourierParameter";

export function getFourierParameter(
  frequency: number,
  points: Complex[]
): FourierParameter {
  let sum = new Complex();
  const N = points.length;
  for (let n = 0; n < N; n++) {
    const point = points[n];
    const phi = -(2 * Math.PI * frequency * n) / N;
    const frequencyPoint = Complex.fromAngle(phi);
    sum = sum.add(point.multiply(frequencyPoint));
  }

  sum = sum.divideByReal(N);

  return {
    frequency,
    amplitude: sum.getModule(),
    phase: sum.getAngle(),
  };
}
