import * as React from "react";

import { ProcessingComponent } from "../../shared/processing-component";
import { GraphLineInfo, GraphLineSketch } from "./graph-line-sketch";

export function GraphLine(props: GraphLineInfo) {
    const sketch = new GraphLineSketch(props);
    return (<ProcessingComponent sketch={sketch} />);
}
