import * as React from "react";

import { ProcessingComponent } from "../../shared/processing-component";
import { SnakeSketch } from "./snake-sketch";

export class SnakeGame extends React.Component
{
  private sketch = new SnakeSketch();

  public render() {
    return (
        <ProcessingComponent
            sketch={this.sketch}
        />
    );
  }
}
