import { observable } from "mobx";
import * as p5 from "p5";

import { PlayableSketch } from "../../services/playable-sketch";
import { COLORS, setBackground, setFillColor, setStrokeColor } from "../../utils/color";
import { getKeyFromCode, KeyBoard } from "../../utils/keyboard";
import { drawSquare } from "../../utils/shape-drawer-helpers";
import { getEuclidianRythm } from "./euclidian-rythms-helper";

const WIDTH = 600;
const HEIGHT = 600;
const MARGIN_LEFT = 0;
const MARGIN_TOP = 10;
const SIDE = Math.min(HEIGHT - MARGIN_TOP, WIDTH - MARGIN_LEFT);
const CELL_COLOR = COLORS.DarkBlue;
export const MIN_TIMESTEPS = 2;

export class EuclidianRythmsSketch extends PlayableSketch {
  @observable public timesteps: number = MIN_TIMESTEPS;

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(WIDTH, HEIGHT);
    this.stop();
  }

  public draw = (): void => {
    this.timesteps++;
    this.show();
  }

  public setTimesteps = (value: number): void => {
    this.timesteps = Math.max(MIN_TIMESTEPS, value);
    this.show();
  };

  public keyPressed = (): void => {
    const key = getKeyFromCode(this.p5js.keyCode);
    if (key === KeyBoard.LEFT) {
      this.setTimesteps(this.timesteps - 1);
    } else if (key === KeyBoard.RIGHT) {
      this.setTimesteps(this.timesteps + 1);
    }
  }

  private show(): void {
    setBackground(this.p5js, COLORS.White);
    this.p5js.strokeWeight(1);

    const n = this.timesteps;
    const cellSize = SIDE / n;

    setStrokeColor(this.p5js, CELL_COLOR);
    this.p5js.noFill();
    this.p5js.rect(MARGIN_LEFT, MARGIN_TOP, SIDE, SIDE);

    for (let i = 0; i < n; i++) {
      const rythm = getEuclidianRythm(i + 1, n);
      for (let j = 0; j < n; j++) {
        if (rythm[j]) {
          setStrokeColor(this.p5js, CELL_COLOR);
          setFillColor(this.p5js, CELL_COLOR);
        } else {
          this.p5js.noStroke();
          this.p5js.noFill();
        }

        drawSquare(this.p5js, j, i, cellSize, MARGIN_LEFT, MARGIN_TOP);
      }
    }
  }
}
