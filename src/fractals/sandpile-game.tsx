import * as React from "react";

import { ControlBarInput } from "../shared/control-bar-input";
import { ProcessingComponent } from "../shared/processing-component";
import { getStrings, LocalizedStrings } from "../strings";
import { SandpileSketch, SandpileSketchProps } from "./sandpile-sketch";

export class SandpileGame extends React.Component<{}, SandpileSketchProps>
{
    public state: SandpileSketchProps = { isHexaGrid: false, nbStepsPerIteration: 10 };
    private strings: LocalizedStrings = getStrings();
    private sketch = new SandpileSketch(this.state);

    public render() {
        return (
            <ProcessingComponent
                sketch={this.sketch}
                commandsSection={this.renderCommands()}
            />
        );
    }

    private renderCommands(): JSX.Element {
      return (
        <div>
          <ControlBarInput
            strings={this.strings}
            resetCallback={this.sketch.resetGrid}
            playPauseCallback={this.sketch.pause}
            oneStepCallback={this.sketch.playOneStep}
            skipFastForwardCallback={this.sketch.generate}
          />
        </div>
      );
    }
}
