import * as p5 from "p5";
import * as React from "react";

import {
  ProcessingService,
  ProcessingSketch,
} from "../../services/processing.service";
import { COLORS, setFillColor, setStrokeColor } from "../../utils/color";
import { getCellCoordinate } from "../../utils/mouse";
import {
  drawArrow,
  drawSquare,
  drawTextOnSquare,
} from "../../utils/shape-drawer-helpers";
import { AutomatonOrientation, getAngle } from "../models/AutomatonOrientation";
import { getTurmiteColor } from "../models/turmite/Turmite";
import {
  getTurmiteDirectionLetter,
  getTurmiteDirectionNumber,
  TurmiteDirection,
} from "../models/turmite/TurmiteDirection";
import { getTurmiteType } from "../models/turmite/TurmiteType";

export interface TurmiteRuleProps {
  index: number;
  turmiteStatus: number;
  cellStatus: boolean;
  nextCellStatus: boolean;
  nextDirection: TurmiteDirection;
  nextTurmiteStatus: number;
  onNextCellColorChange: () => void;
  onNextDirectionChange: () => void;
  onNextTurmiteColorChange: () => void;
}

const CELL_SIDE = 30;
const MARGIN = 10;

export class TurmiteRule extends React.Component<TurmiteRuleProps>
  implements ProcessingSketch {
  private readonly processingContainerId: string;
  private readonly processingService = new ProcessingService();
  private p5js: p5;

  constructor(props: TurmiteRuleProps) {
    super(props);
    this.processingContainerId = `turmiteRule${this.props.index}`;
  }

  public componentDidMount(): void {
    this.processingService.sketch(this, this.processingContainerId);
  }

  public componentWillUnmount(): void {
    this.processingService.remove();
  }

  public componentDidUpdate(): void {
    this.drawRule();
  }

  public render(): JSX.Element {
    return <div id={this.processingContainerId} />;
  }

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.noLoop();
    this.p5js.createCanvas(8 * CELL_SIDE, 1 * CELL_SIDE + 2 * MARGIN);
    this.drawRule();
  }

  public draw(): void {
    // NOOP
  }

  public mouseClicked(): void {
    const coord = getCellCoordinate(
      this.p5js.mouseX,
      this.p5js.mouseY,
      5,
      1,
      CELL_SIDE,
      0,
      MARGIN
    );
    if (coord && coord.i === 0) {
      switch (coord.j) {
        case 2:
          this.props.onNextCellColorChange();
          break;
        case 3:
          this.props.onNextDirectionChange();
          break;
        case 4:
          this.props.onNextTurmiteColorChange();
          break;
        default:
      }
    }
  }

  private drawRule(): void {
    this.p5js.strokeWeight(1);
    setStrokeColor(this.p5js, COLORS.Black);

    const i = 0;

    // CURRENT STATE
    let j = 0;
    setFillColor(
      this.p5js,
      getTurmiteType(this.props.cellStatus).getBackground()
    );
    drawSquare(this.p5js, j, i, CELL_SIDE, 0, MARGIN);
    setFillColor(this.p5js, getTurmiteColor(this.props.turmiteStatus));
    drawArrow(
      this.p5js,
      j,
      i,
      getAngle(AutomatonOrientation.HEX_TOP_RIGHT),
      CELL_SIDE,
      0,
      MARGIN
    );

    // NEXT CELL COLOR
    j = 2;
    setFillColor(
      this.p5js,
      getTurmiteType(this.props.nextCellStatus).getBackground()
    );
    drawSquare(this.p5js, j, i, CELL_SIDE, 0, MARGIN);

    // NEXT DIRECTION
    j = 3;
    setFillColor(this.p5js, COLORS.White);
    drawSquare(this.p5js, j, i, CELL_SIDE, 0, MARGIN);
    setFillColor(this.p5js, COLORS.Black);
    this.p5js.textSize(20);
    drawTextOnSquare(
      this.p5js,
      j,
      i,
      getTurmiteDirectionLetter(this.props.nextDirection),
      CELL_SIDE,
      0,
      MARGIN,
      8
    );

    // NEXT TURMITE COLOR
    j = 4;
    setFillColor(this.p5js, COLORS.White);
    drawSquare(this.p5js, j, i, CELL_SIDE, 0, MARGIN);
    setFillColor(this.p5js, getTurmiteColor(this.props.nextTurmiteStatus));
    drawArrow(
      this.p5js,
      j,
      i,
      getAngle(AutomatonOrientation.HEX_TOP_RIGHT),
      CELL_SIDE,
      0,
      MARGIN
    );

    // RULE CODE
    j = 6;
    this.p5js.noStroke();
    setFillColor(this.p5js, COLORS.White);
    drawSquare(this.p5js, j, i, CELL_SIDE, 0, MARGIN);
    this.p5js.rect(
      j * CELL_SIDE,
      i * CELL_SIDE + MARGIN,
      3 * CELL_SIDE,
      CELL_SIDE
    );
    setFillColor(this.p5js, COLORS.Black);
    this.p5js.textSize(15);
    drawTextOnSquare(
      this.p5js,
      j,
      0,
      `{${this.props.nextCellStatus ? "1" : "0"},${getTurmiteDirectionNumber(
        this.props.nextDirection
      )},${this.props.nextTurmiteStatus ? "1" : "0"}}`,
      CELL_SIDE,
      0,
      MARGIN,
      10
    );
  }
}
