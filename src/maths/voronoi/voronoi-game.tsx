import * as React from "react";

import { CheckboxInput } from "../../shared/checkbox-input";
import { ControlBarInput } from "../../shared/control-bar-input";
import { ProcessingComponent } from "../../shared/processing-component";
import { getStrings, LocalizedStrings } from "../../strings";
import { VoronoiSketch } from "./voronoi-sketch";

interface VoronoiState {
  showVoronoiCells: boolean;
  showDelaunayTriangulation: boolean;
}
export class VoronoiGame extends React.Component<{}, VoronoiState> {
  public state: VoronoiState = {
    showVoronoiCells: true,
    showDelaunayTriangulation: false,
  };
  private strings: LocalizedStrings = getStrings();
  private sketch = new VoronoiSketch();

  public render() {
    return (
      <ProcessingComponent
        sketch={this.sketch}
        commandsSection={this.renderCommands()}
      />
    );
  }

  protected renderCommands(): JSX.Element {
    return <div>
      <CheckboxInput
        label={this.strings.voronoi.showVoronoi}
        value={this.state.showVoronoiCells}
        onValueChanged={value => this.setState(
          { showVoronoiCells: value },
          () => this.sketch.setShowVoronoiCells(value))}
      />
      <CheckboxInput
        label={this.strings.voronoi.showDelaunay}
        value={this.state.showDelaunayTriangulation}
        onValueChanged={value => this.setState(
          { showDelaunayTriangulation: value },
          () => this.sketch.setShowDelaunayTriangulation(value))}
      />
      <ControlBarInput
        strings={this.strings}
        playPauseCallback={this.sketch.pause}
      />
    </div>;
  }
}
