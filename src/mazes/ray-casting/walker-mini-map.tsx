import * as React from "react";

import { ProcessingComponent } from "../../shared/processing-component";
import { MiniMapSketch } from "./mini-map-sketch";
import { RayCastingWalkerGameProps } from "./ray-casting-walker";

export function WalkerMiniMap(props: RayCastingWalkerGameProps) {
    const sketch = new MiniMapSketch(props.rayCastingProps, props.miniMapInfo);
    return (<ProcessingComponent sketch={sketch} />);
}
