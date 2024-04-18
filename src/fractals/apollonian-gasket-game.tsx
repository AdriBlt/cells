import * as React from "react";

import { ControlBarInput } from "../shared/control-bar-input";
import { ProcessingComponent } from "../shared/processing-component";
import { getStrings, LocalizedStrings } from "../strings";
import { ApollonianGasketSketch } from "./apollonian-gasket-sketch";

export class ApollonianGasketGame extends React.Component
{
    private strings: LocalizedStrings = getStrings();
    private sketch = new ApollonianGasketSketch();

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
            resetCallback={this.sketch.resetAll}
            playPauseCallback={this.sketch.pause}
            oneStepCallback={this.sketch.drawOneStep}
            // skipFastForwardCallback={this.sketch.generate}
          />
        </div>
      );
    }
}
