import * as p5 from "p5";

import { PlayableSketch } from "../services/playable-sketch";
import { COLORS, setFillColor, setStrokeColor } from "../utils/color";
import { getKeyFromCode, KeyBoard } from "../utils/keyboard";
import { getCellCoordinate } from "../utils/mouse";
import {
  drawArrow,
  drawCircle,
  drawHexagon,
  drawSquare,
} from "../utils/shape-drawer-helpers";
import { AutomatonInterfaceSize } from "./AutomatonInterfaceSize";
import { AutomatonCell } from "./models/AutomatonCell";
import { AutomatonMatrix } from "./models/AutomatonMatrix";
import { AutomatonOrientation, getAngle } from "./models/AutomatonOrientation";
import { AutomatonParameters } from "./models/AutomatonParameters";
import { GridUpdate, NextStateGridUpdate } from "./models/GridUpdate";

const WIDTH = 1000;
const HEIGHT = 800;
const MARGIN_LEFT = 0;
const MARGIN_TOP = 20;

export class CellularAutomatonSketch<
  Matrix extends AutomatonMatrix<AutomatonCell, AutomatonParameters>
> extends PlayableSketch {
  private get cellSize(): number {
    return this.interfaceSize.getCellSize();
  }

  public time: number = 0;

  constructor(
    public matrix: Matrix,
    private interfaceSize: AutomatonInterfaceSize
  ) {
    super();
  }

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(WIDTH, HEIGHT);

    this.resetGrid();
    this.randomizeGrid();
  }

  public draw(): void {
    this.runOneStep();
  }

  public mousePressed = (): void => {
    const coord = getCellCoordinate(
      this.p5js.mouseX,
      this.p5js.mouseY,
      this.interfaceSize.getSizeX(),
      this.interfaceSize.getSizeY(),
      this.cellSize,
      MARGIN_LEFT,
      MARGIN_TOP,
      this.matrix.getRules().isHexaGrid()
    );
    if (!coord) {
      return;
    }

    const x = coord.j;
    const y = coord.i;
    if (this.p5js.mouseButton === this.p5js.LEFT) {
      const update = this.matrix.changeStatus(x, y);
      this.updateCells({ x, y, update });
    } else if (this.p5js.mouseButton === this.p5js.RIGHT) {
      if (this.matrix.changeStatusSpecial) {
        const update = this.matrix.changeStatusSpecial(x, y);
        this.updateCells({ x, y, update });
      }
    }
  };

  public keyPressed = (): void => {
    const key = getKeyFromCode(this.p5js.keyCode);
    if (key === KeyBoard.SPACE) {
      this.pause();
    } else if (key === KeyBoard.ENTER) {
      this.playOneStep();
    }
  };

  public resetGrid = (): void => {
    this.matrix.initialize(
      this.interfaceSize.getSizeX(),
      this.interfaceSize.getSizeY()
    );
    this.updateAllCells();
    this.time = 0;
  };

  public randomizeGrid = (): void => {
    this.matrix.setRandomCells();
    this.updateAllCells();
  };

  public updateAllCells = (): void => {
    this.p5js.background(255);
    for (let x = 0; x < this.interfaceSize.getSizeX(); x++) {
      for (let y = 0; y < this.interfaceSize.getSizeY(); y++) {
        this.updateCell(x, y);
      }
    }
  };

  private runOneStep = (): void => {
    const update = this.matrix.nextStep();
    this.updateCells(update);
    this.time++;
  };

  private updateCells(gridUpdate: NextStateGridUpdate): void {
    switch (gridUpdate.update) {
      case GridUpdate.ALL:
           this.updateAllCells();
           break;
      case GridUpdate.BLOCK:
           this.updateBlock(gridUpdate.x, gridUpdate.y);
           break;
      case GridUpdate.CELL:
           this.updateCell(gridUpdate.x, gridUpdate.y);
           break;
      case GridUpdate.NONE:
      default:
    }
  }

  private updateBlock(x: number, y: number): void {
    const sizeX = this.interfaceSize.getSizeX();
    const sizeY = this.interfaceSize.getSizeY();
    for (let dX = -1; dX <= 1; dX++) {
      for (let dY = -1; dY <= 1; dY++) {
        const xx = (x + dX + sizeX) % sizeX;
        const yy = (y + dY + sizeY) % sizeY;
        this.updateCell(xx, yy);
      }
    }
  }

  private updateCell(x: number, y: number): void {
    const look = this.matrix.getLook(x, y);

    setFillColor(this.p5js, look.background);
    if (this.interfaceSize.hasBorder()) {
      setStrokeColor(this.p5js, COLORS.Black);
    } else {
      this.p5js.noStroke();
    }

    if (this.matrix.getRules().isHexaGrid()) {
      drawHexagon(this.p5js, x, y, this.cellSize, MARGIN_LEFT, MARGIN_TOP);
    } else {
      drawSquare(this.p5js, x, y, this.cellSize, MARGIN_LEFT, MARGIN_TOP);
    }

    if (look.color) {
      setFillColor(this.p5js, look.color);
      switch (look.orientation) {
        case AutomatonOrientation.NORTH:
        case AutomatonOrientation.EAST:
        case AutomatonOrientation.SOUTH:
        case AutomatonOrientation.WEST:
        case AutomatonOrientation.NORTH_EAST:
        case AutomatonOrientation.SOUTH_EAST:
        case AutomatonOrientation.SOUTH_WEST:
        case AutomatonOrientation.NORTH_WEST:
        case AutomatonOrientation.HEX_TOP_RIGHT:
        case AutomatonOrientation.HEX_TOP_LEFT:
        case AutomatonOrientation.HEX_BOTTOM_LEFT:
        case AutomatonOrientation.HEX_BOTTOM_RIGHT:
          drawArrow(
            this.p5js,
            x,
            y,
            getAngle(look.orientation),
            this.cellSize,
            MARGIN_LEFT,
            MARGIN_TOP
          );
          break;

        case AutomatonOrientation.CENTERED:
          drawCircle(
            this.p5js,
            x,
            y,
            this.interfaceSize.getCellSize(),
            MARGIN_LEFT,
            MARGIN_TOP
          );
          break;

        case AutomatonOrientation.NONE:
        default:
      }
    }
  }
}
