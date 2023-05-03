import { Observer } from "mobx-react";
import * as React from "react";

import { ProcessingComponent } from "../../shared/processing-component";
import { StarsSketch } from "./stars-sketch";

export class StarsGame extends React.Component
{
  private sketch = new StarsSketch();

  public render() {
    return (
      <ProcessingComponent
        sketch={this.sketch}
        infoSection={this.renderInfoSection()}
      />
    );
  }

  protected renderInfoSection(): JSX.Element {
    return (
      <Observer>
        {() => <div>{this.sketch.selectedConstellation}</div>}
      </Observer>
    );
  }
}
