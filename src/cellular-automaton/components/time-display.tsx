import * as p5 from "p5";
import * as React from "react";

import {
  ProcessingService,
  ProcessingSketch,
} from "../../services/processing.service";
import { COLORS, setFillColor } from "../../utils/color";
import { formatString } from "../../utils/string-formating-utilities";
import { CellularAutomatonSketch } from "../cellular-automaton-sketch";
import { AutomatonCell } from "../models/AutomatonCell";
import { AutomatonMatrix } from "../models/AutomatonMatrix";
import { AutomatonParameters } from "../models/AutomatonParameters";

export interface TimeDisplayProps<
  T extends AutomatonMatrix<AutomatonCell, AutomatonParameters>
> {
  sketch: CellularAutomatonSketch<T>;
  timeLabelFormat: string;
}

export class TimeDisplay<
  T extends AutomatonMatrix<AutomatonCell, AutomatonParameters>
> extends React.Component<TimeDisplayProps<T>> implements ProcessingSketch {
  private readonly processingContainerId: string = "timeDisplay";
  private readonly processingService = new ProcessingService();
  private p5js: p5;

  public componentDidMount(): void {
    this.processingService.sketch(this, this.processingContainerId);
  }

  public componentWillUnmount(): void {
    this.processingService.remove();
  }

  public render(): JSX.Element {
    return <div id={this.processingContainerId} />;
  }

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(200, 50);
  }

  public draw(): void {
    this.p5js.noStroke();
    setFillColor(this.p5js, COLORS.White);
    this.p5js.rect(0, 0, this.p5js.width, this.p5js.height);

    setFillColor(this.p5js, COLORS.Black);
    this.p5js.textAlign(this.p5js.LEFT, this.p5js.CENTER);
    this.p5js.text(
      formatString(this.props.timeLabelFormat, `${this.props.sketch.time}`),
      0,
      0,
      this.p5js.width,
      this.p5js.height
    );
  }
}
