import * as p5 from "p5";
import * as React from "react";

import {
  ProcessingService,
  ProcessingSketch,
} from "../../services/processing.service";
import { COLORS, setFillColor, setStrokeColor } from "../../utils/color";
import { getCellCoordinate } from "../../utils/mouse";
import { getElementaryRulesType } from "../models/elementaryrules/ElementaryRulesType";

export interface BiteRuleProps {
  index: number;
  value: boolean;
  onClick: () => void;
}

const CELL_SIDE = 15;
const MARGIN = 10;

export class BiteRule extends React.Component<BiteRuleProps>
  implements ProcessingSketch {
  private readonly processingContainerId: string;
  private readonly parentBites: boolean[];
  private readonly processingService = new ProcessingService();
  private p5js: p5;

  constructor(props: BiteRuleProps) {
    super(props);
    this.processingContainerId = `biteRule${this.props.index}`;
    this.parentBites = [];
    let parentNumber = Math.floor(this.props.index);
    for (let i = 0; i < 3; i++) {
      this.parentBites.unshift(parentNumber % 2 === 1);
      parentNumber = Math.floor(parentNumber / 2);
    }
  }

  public componentDidMount(): void {
    this.processingService.sketch(this, this.processingContainerId);
  }

  public componentWillUnmount(): void {
    this.processingService.remove();
  }

  public componentDidUpdate(): void {
    this.drawCell(1, 1, this.props.value);
  }

  public render(): JSX.Element {
    return <div id={this.processingContainerId} />;
  }

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.noLoop();

    this.p5js.createCanvas(3 * CELL_SIDE, 2 * CELL_SIDE + 2 * MARGIN);

    for (let i = 0; i < 3; i++) {
      this.drawCell(i, 0, this.parentBites[i]);
    }

    this.drawCell(1, 1, this.props.value);
  }

  public draw(): void {
    // NOOP
  }

  public mouseClicked(): void {
    const coord = getCellCoordinate(
      this.p5js.mouseX,
      this.p5js.mouseY,
      3,
      2,
      CELL_SIDE,
      0,
      MARGIN
    );
    if (coord && coord.i === 1 && coord.j === 1) {
      this.props.onClick();
    }
  }

  private drawCell(i: number, j: number, isAlive: boolean): void {
    this.p5js.strokeWeight(1);
    setStrokeColor(this.p5js, COLORS.Black);
    setFillColor(this.p5js, getElementaryRulesType(isAlive).getBackground());
    this.p5js.rect(i * CELL_SIDE, j * CELL_SIDE + MARGIN, CELL_SIDE, CELL_SIDE);
  }
}
