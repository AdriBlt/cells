import { observer } from "mobx-react";
import * as React from "react";
import { ControlBarInput } from "src/shared/control-bar-input";

import { ProcessingComponent } from "../../shared/processing-component";
import { getStrings, LocalizedStrings } from "../../strings";
import { SpirographSketch } from "./spirograph-sketch";

@observer
export class SpirographGame extends React.Component {
  private strings: LocalizedStrings = getStrings();
  private sketch = new SpirographSketch();

  public render() {
    return (
      <ProcessingComponent
        sketch={this.sketch}
        commandsSection={this.renderCommandSection()}
      />
    );
  }

  protected renderCommandSection(): JSX.Element {
    return <div/>;
  }

  protected renderCommands(): JSX.Element {
    return (
      <div>
        <div>
          <ControlBarInput
            strings={this.strings}
            resetCallback={this.sketch.reset}
            playPauseCallback={this.sketch.pause}
            oneStepCallback={this.sketch.playOneStep}
          />
        </div>
      </div>
    );
  }

}
