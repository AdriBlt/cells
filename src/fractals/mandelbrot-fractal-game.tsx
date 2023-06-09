import * as React from "react";

import { ProcessingComponent } from "../shared/processing-component";
import { FractalSketch } from "./fractal-sketch";
import { MandelbrotFractal } from "./models/fractals/mandelbrot";

export class MandelbrotFractalGame extends React.Component {
  private sketch = new FractalSketch(new MandelbrotFractal());

  public render() {
    return (
      <ProcessingComponent
        sketch={this.sketch}
      />
    );
  }
}
