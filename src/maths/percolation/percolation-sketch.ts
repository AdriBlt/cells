import * as p5 from "p5";

import { PlayableSketch } from "../../services/playable-sketch";
import { Color, COLORS, setBackground, setFillColor } from "../../utils/color";
import { LinkedList } from "../../utils/linked-list";
import { createDefaultMatrix, peekRandomElement } from "../../utils/list-helpers";
import { randomBool, randomInt } from "../../utils/random";
import { drawSquare } from "../../utils/shape-drawer-helpers";

const WIDTH = 800;
const HEIGHT = 500;
const MARGIN_TOP = 30;
const MARGIN_LEFT = 10;
const SIDE = 5;
const NB_COLS = Math.floor((WIDTH - MARGIN_LEFT) / SIDE);
const NB_ROWS = Math.floor((HEIGHT - MARGIN_TOP) / SIDE);

const TIMEFRAMES = 10;

type Connection = { right: number; down: number };
type Cell = { i: number; j: number };
type Region = { id: number; color: Color; cells: LinkedList<Cell>};

export class PercolationSketch extends PlayableSketch {
  private slider: p5.Element;
  private matrixColors: Region[][][];

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(WIDTH, HEIGHT);

    setBackground(this.p5js, COLORS.White);
    this.p5js.noStroke();

    this.slider = this.p5js.createSlider(0, TIMEFRAMES, TIMEFRAMES / 2, 1);
    this.slider.position(10, 10);
    this.slider.style('width', '80px');

    this.initialize();
  }

  public draw(): void {
    this.show();
  }

  private show(): void {
    const t = this.slider.value();
    for (let i = 0; i < NB_ROWS; i++) {
      for (let j = 0; j < NB_COLS; j++) {
        setFillColor(this.p5js, this.matrixColors[t][i][j].color);
        drawSquare(this.p5js, j, i, SIDE, MARGIN_LEFT, MARGIN_TOP);
      }
    }
  }

  private initialize() {
    const matrixConnections: Connection[][] = createDefaultMatrix(NB_COLS, NB_ROWS, () => ({
      right: randomInt(0, TIMEFRAMES),
      down: randomInt(0, TIMEFRAMES)
    }));
    const allColors = Object.values(COLORS);
    let lastMatrix = createDefaultMatrix(NB_COLS, NB_ROWS, (i, j) => {
      const region = { id: i * NB_COLS + j, color: peekRandomElement(allColors), cells: new LinkedList<Cell>() }
      region.cells.insertTail({ i, j });
      return region;
    });
    this.matrixColors = [lastMatrix];
    for (let t = 0; t < TIMEFRAMES; t++) {
      const nextMatrix = this.getNextMatrix(lastMatrix, matrixConnections, t);
      this.matrixColors.push(nextMatrix);
      lastMatrix = nextMatrix;
    }
  }

  private getNextMatrix(
    lastMatrix: Region[][],
    matrixConnections: Connection[][],
    t: number,
  ): Region[][] {
    const nextMatrix = createDefaultMatrix(NB_COLS, NB_ROWS, (i, j) => ({
      id: lastMatrix[i][j].id,
      color: lastMatrix[i][j].color,
      cells: lastMatrix[i][j].cells.clone(),
    }));
    for (let i = 0; i < NB_ROWS; i++) {
      for (let j = 0; j < NB_COLS; j++) {
        if (i < NB_ROWS - 1
          && nextMatrix[i][j].id !== nextMatrix[i + 1][j].id
          && matrixConnections[i][j].down <= t
        ) {
          this.merge(nextMatrix[i][j], nextMatrix[i + 1][j], nextMatrix);
        }

        if (j < NB_COLS - 1
          && nextMatrix[i][j].id !== nextMatrix[i][j + 1].id
          && matrixConnections[i][j].right <= t
        ) {
          this.merge(nextMatrix[i][j], nextMatrix[i][j + 1], nextMatrix);
        }
      }
    }

    return nextMatrix;
  }

  private merge(a: Region, b: Region, matrix: Region[][]): void {
    if (a.cells.count < b.cells.count) {
      this.changeRegion(a, b, matrix);
    } else if (a.cells.count > b.cells.count) {
      this.changeRegion(b, a, matrix);
    } else if (randomBool()) {
      this.changeRegion(a, b, matrix);
    } else {
      this.changeRegion(b, a, matrix);
    }
  }

  private changeRegion(small: Region, big: Region, matrix: Region[][]): void {
    const cellsToUpdate = small.cells;
    cellsToUpdate.forEach(c => {
      const r = matrix[c.i][c.j];
      r.id = big.id;
      r.cells = big.cells;
      r.color = big.color;
      big.cells.insertTail(c);
    });
  }
}
