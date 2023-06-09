import * as React from "react";

import { ProcessingComponent } from "../../shared/processing-component";
import { CurvedPolygonSketch } from "./curved-polygon-sketch";

export class CurvedPolygonGame extends React.Component {
  private sketch = new CurvedPolygonSketch();

  public render() {
    return (
      <ProcessingComponent
        sketch={this.sketch}
      />
    );
  }
}
