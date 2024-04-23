import * as React from "react";

import { ProcessingComponent } from "../../shared/processing-component";
import { StarsProps, StarsSketch } from "./stars-sketch";

export class StarsGame extends React.Component<{}, StarsProps> {
  public state = { selectedConstellation: "" };
  private sketch = new StarsSketch({
    onSelectedConstellation: (p) => this.setState(p)
  });

  public render() {
    return (
      <ProcessingComponent
        sketch={this.sketch}
        infoSection={this.renderInfoSection()}
      />
    );
  }

  protected renderInfoSection(): JSX.Element {
    return <span>{this.state.selectedConstellation}</span>;
  }
}
