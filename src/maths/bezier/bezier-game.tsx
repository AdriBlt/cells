import * as React from "react";

import { ControlBarInput } from "../../shared/control-bar-input";
import { ProcessingComponent } from "../../shared/processing-component";
import { getStrings, LocalizedStrings } from "../../strings";
import { BezierSketch } from "./bezier-sketch";

export class BezierGame extends React.Component {
  private strings: LocalizedStrings = getStrings();
  private sketch = new BezierSketch();

  public render() {
    return (
      <ProcessingComponent
        sketch={this.sketch}
        commandsSection={this.renderCommands()}
        infoSection={this.renderInfoSection()}
      />
    );
  }

  protected renderCommands(): JSX.Element {
    return <div>
      <ControlBarInput
        strings={this.strings}
        resetCallback={this.sketch.restart}
        playPauseCallback={this.sketch.pause}
        oneStepCallback={this.sketch.playOneStep}
      />
    </div>;
  }

  protected renderInfoSection(): JSX.Element {
    return <div />;
  }
}
