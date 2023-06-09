import { observer } from "mobx-react";
import * as React from "react";
import { Button } from "react-bootstrap";

import { NumberInput, NumberInputProps } from "../../shared/number-input";
import { ProcessingComponent } from "../../shared/processing-component";
import { getStrings, LocalizedStrings } from "../../strings";
import { MultiplicationCircleSketch } from "./multiplication-circle-sketch";

@observer
export class MultiplicationCircleGame extends React.Component {
  private strings: LocalizedStrings = getStrings();
  private sketch = new MultiplicationCircleSketch();

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
        <NumberInput {...this.getMultiplicatorProps()} />
        <NumberInput {...this.getSpeedProps()} />
        <Button onClick={this.sketch.pause} block={true}>
          {this.strings.shared.playPause}
        </Button>
      </div>
    );
  }

  private getMultiplicatorProps = (): NumberInputProps => {
    return {
      step: this.sketch.multiplicatorIncrement,
      label: this.strings.multiplicationCircle.multiplicator,
      value: this.sketch.multiplicator,
      onValueChanged: (value: number) => {
        this.sketch.setMultiplicatorValue(value);
      },
    };
  };

  private getSpeedProps = (): NumberInputProps => {
    return {
      step: 0.001,
      label: this.strings.multiplicationCircle.speed,
      value: this.sketch.multiplicatorIncrement,
      onValueChanged: (value: number) => {
        this.sketch.multiplicatorIncrement = value;
      },
    };
  };
}
