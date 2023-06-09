import * as React from "react";

import { ProcessingComponent } from "../shared/processing-component";
import { FractalSketch } from "./fractal-sketch";
import { BurningShip } from "./models/fractals/burning-ship";

export class BurningShipFractalGame extends React.Component {
  private sketch = new FractalSketch(new BurningShip());

  public render() {
    return (
      <ProcessingComponent
        sketch={this.sketch}
      />
    );
  }
}
