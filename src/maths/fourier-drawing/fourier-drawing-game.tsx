import * as React from "react";

import { CheckboxInput, CheckboxInputProps } from "../../shared/checkbox-input";
import { ControlBarInput } from "../../shared/control-bar-input";
import { NumberInput, NumberInputProps } from "../../shared/number-input";
import { ProcessingComponent } from "../../shared/processing-component";
import { getStrings, LocalizedStrings } from "../../strings";
import { FourierDrawingSketch, FourierDrawingsProps } from "./fourier-drawing-sketch";

export class FourierDrawingGame extends React.Component<{}, FourierDrawingsProps>
{
  public state = {
    numberOfCircles: 0,
    showOriginal: false,
    maxNumberOfFrequencies: 0,
  };
  private strings: LocalizedStrings = getStrings();
  private sketch = new FourierDrawingSketch({
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
        <NumberInput {...this.getNumberOfCirclesProps()} />
        <CheckboxInput {...this.showOriginalProps()} />
        <div>
          <ControlBarInput
            strings={this.strings}
            resetCallback={this.sketch.restart}
            playPauseCallback={this.sketch.pause}
            oneStepCallback={this.sketch.playOneStep}
          />
        </div>
      </div>
    );
  }

  private getNumberOfCirclesProps = (): NumberInputProps => {
    return {
      min: 1,
      max: this.state.maxNumberOfFrequencies,
      label: this.strings.fourierDrawing.numberOfCircles,
      value: this.state.numberOfCircles,
      onValueChanged: (value: number) => this.sketch.setNumberOfCircles(value),
    };
  };

  private showOriginalProps(): CheckboxInputProps {
    return {
      label: this.strings.fourierDrawing.showOriginal,
      value: this.state.showOriginal,
      onValueChanged: (value: boolean) => this.sketch.setShowOriginal(value),
    }
  }
}
