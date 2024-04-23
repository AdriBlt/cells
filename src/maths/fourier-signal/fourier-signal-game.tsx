import * as React from "react";
import { Button } from "react-bootstrap";

import { NumberInput, NumberInputProps } from "../../shared/number-input";
import { ProcessingComponent } from "../../shared/processing-component";
import { SelectInput, SelectInputProps } from "../../shared/select-input";
import { getStrings, LocalizedStrings } from "../../strings";
import { SignalType } from "../fourier/SignalType";
import {
  DefaultProps,
  FourierSignalProps,
  FourierSignalSketch,
  MAX_FREQUENCY_COUNT,
} from "./fourier-signal-sketch";

export class FourierSignalGame extends React.Component<{}, FourierSignalProps> {
  public state = DefaultProps;
  private strings: LocalizedStrings = getStrings();
  private sketch = new FourierSignalSketch({
    onPropsChange: (p) => this.setState(p)
  });

  public render() {
    return (
      <ProcessingComponent
        sketch={this.sketch}
        commandsSection={this.renderCommands()}
      />
    );
  }

  protected renderCommands(): JSX.Element {
    return (
      <div>
        <SelectInput {...this.getSignalTypeProps()} />
        <NumberInput {...this.getFrequencyCountProps()} />
        <Button onClick={() => this.sketch.reset()} block={true}>
          {this.strings.shared.reset}
        </Button>
      </div>
    );
  }

  private getSignalTypeProps = (): SelectInputProps<SignalType> => {
    const options: SignalType[] = [
      SignalType.SQUARE,
      SignalType.SAWTOOTH,
      SignalType.TRIANGLE,
      SignalType.RANDOM,
    ];
    return {
      label: this.strings.fourierSignal.signal,
      options,
      selectedOption: this.state.signal.type,
      onOptionChanged: (type: SignalType) => {
        if (type !== undefined && type !== this.state.signal.type) {
          this.sketch.changeSignalType(type);
        }
      },
      getName: (type: SignalType) => {
        const strings = this.strings.fourierSignal.signalNames;
        switch (type) {
          case SignalType.SQUARE: return strings.square;
          case SignalType.SAWTOOTH: return strings.sawtooth;
          case SignalType.TRIANGLE: return strings.triangle;
          case SignalType.RANDOM: return strings.random;
          default: return '';
        }
      }
    };
  };

  private getFrequencyCountProps = (): NumberInputProps => {
    return {
      min: 1,
      max: MAX_FREQUENCY_COUNT,
      label: this.strings.fourierSignal.frequency,
      value: this.state.numberOfCircles,
      onValueChanged: (value: number) => {
        this.sketch.changeFrequencyCount(value);
      },
    };
  };
}
