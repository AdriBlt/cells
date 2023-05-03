import * as p5 from "p5";
import * as React from "react";

import {
  ProcessingService,
  ProcessingSketch,
} from "../../services/processing.service";
import { COLORS, setFillColor, setStrokeColor } from "../../utils/color";
import { getCellCoordinate } from "../../utils/mouse";
import { getAntType } from "../models/ant/AntType";

export interface AntDirectionRuleProps {
  index: number;
  value: string;
  onClick: () => void;
}

const CELL_SIDE = 25;
const MARGIN = 10;

export class AntDirectionRule extends React.Component<AntDirectionRuleProps>
  implements ProcessingSketch {
  private readonly processingContainerId: string;
  private readonly processingService = new ProcessingService();
  private p5js: p5;

  constructor(props: AntDirectionRuleProps) {
    super(props);
    this.processingContainerId = `antDirectionRule${this.props.index}`;
  }

  public componentDidMount(): void {
    this.processingService.sketch(this, this.processingContainerId);
  }

  public componentWillUnmount(): void {
    this.processingService.remove();
  }

  public componentDidUpdate(): void {
    this.drawCell();
  }

  public render(): JSX.Element {
    return <div id={this.processingContainerId} />;
  }

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.noLoop();

    this.p5js.createCanvas(CELL_SIDE, CELL_SIDE + 2 * MARGIN);

    this.drawCell();
  }

  public draw(): void {
    // NOOP
  }

  public mouseClicked(): void {
    const coord = getCellCoordinate(
      this.p5js.mouseX,
      this.p5js.mouseY,
      1,
      1,
      CELL_SIDE,
      0,
      MARGIN
    );
    if (coord && coord.i === 0 && coord.j === 0) {
      this.props.onClick();
    }
  }

  private drawCell(): void {
    this.p5js.strokeWeight(1);
    setStrokeColor(this.p5js, COLORS.Black);
    setFillColor(this.p5js, getAntType(this.props.index).getBackground());
    this.p5js.rect(0, MARGIN, CELL_SIDE, CELL_SIDE);

    this.p5js.strokeWeight(2);
    setStrokeColor(this.p5js, COLORS.White);
    setFillColor(this.p5js, COLORS.Red);
    this.p5js.textAlign(this.p5js.CENTER, this.p5js.CENTER);
    this.p5js.text(this.props.value, CELL_SIDE / 2, MARGIN + CELL_SIDE / 2);
  }
}
