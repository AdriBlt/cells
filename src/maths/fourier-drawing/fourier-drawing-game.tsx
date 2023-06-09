import { observer } from "mobx-react";
import * as React from "react";

import { CheckboxInput, CheckboxInputProps } from "../../shared/checkbox-input";
import { ControlBarInput } from "../../shared/control-bar-input";
import { NumberInput, NumberInputProps } from "../../shared/number-input";
import { ProcessingComponent } from "../../shared/processing-component";
import { getStrings, LocalizedStrings } from "../../strings";
import { FourierDrawingSketch } from "./fourier-drawing-sketch";

@observer
export class FourierDrawingGame extends React.Component
{
  private strings: LocalizedStrings = getStrings();
  private sketch = new FourierDrawingSketch();

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
      max: this.sketch.maxNumberOfFrequencies,
      label: this.strings.fourierDrawing.numberOfCircles,
      value: this.sketch.numberOfCircles,
      onValueChanged: (value: number) => this.sketch.setNumberOfCircles(value),
    };
  };

  private showOriginalProps(): CheckboxInputProps {
    return {
      label: this.strings.fourierDrawing.showOriginal,
      value: this.sketch.showOriginal,
      onValueChanged: (value: boolean) => this.sketch.setShowOriginal(value),
    }
  }
}
