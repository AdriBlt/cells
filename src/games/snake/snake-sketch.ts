import * as p5 from "p5";

import { ProcessingSketch } from "../../services/processing.service";
import { getKeyFromCode, KeyBoard } from "../../utils/keyboard";
import { Cell } from "./models/cell";
import { Direction } from "./models/direction";
import { SnakeEngine } from "./models/snake-engine";
import { SnakeInterface } from "./models/snake-interface";

// Variables
const w = 20;
const h = 20;
const side = 10;
const marginTop = 50;
const marginLeft = 50;

export class SnakeSketch implements ProcessingSketch, SnakeInterface {
  private engine: SnakeEngine;
  private p5js: p5;

  constructor() {
    this.engine = new SnakeEngine(w, h, this);
  }

  public setup(p: p5): void {
    this.p5js = p;

    this.p5js.createCanvas(marginLeft + w * side + 1, marginTop + h * side + 1);
    /*
            radio = createRadio();
            radio.position(20, 20);
            radio.option('Solo', 1);
            radio.option('VS PLAYER', 2);
            radio.option('VS CPU', 3);
        */

    this.p5js.fill(0);
    this.p5js.stroke(0);

    for (let i = 0; i < h; i++) {
      const y = marginTop + i * side;
      for (let j = 0; j < w; j++) {
        const x = marginLeft + j * side;
        this.p5js.rect(x, y, side, side);
      }
    }
  }

  public draw(): void {
    this.engine.nextFrame();
  }

  public mousePressed(): void {
    this.engine.start();
  }

  public keyPressed(): void {
    const key = getKeyFromCode(this.p5js.keyCode);
    if (key === KeyBoard.LEFT) {
      this.engine.movePrimary(Direction.LEFT);
    } else if (key === KeyBoard.UP) {
      this.engine.movePrimary(Direction.UP);
    } else if (key === KeyBoard.RIGHT) {
      this.engine.movePrimary(Direction.RIGHT);
    } else if (key === KeyBoard.DOWN) {
      this.engine.movePrimary(Direction.DOWN);
    } else if (key === KeyBoard.Q) {
      this.engine.moveSecondary(Direction.LEFT);
    } else if (key === KeyBoard.Z) {
      this.engine.moveSecondary(Direction.UP);
    } else if (key === KeyBoard.D) {
      this.engine.moveSecondary(Direction.RIGHT);
    } else if (key === KeyBoard.S) {
      this.engine.moveSecondary(Direction.DOWN);
    } else if (key === KeyBoard.SPACE || key === KeyBoard.ENTER) {
      this.engine.start();
    }
  }

  public displayStartingScreen(): void {
    // tslint:disable-next-line:no-console
    console.log("Start");
  }

  public displayEndGameScreen(): void {
    // tslint:disable-next-line:no-console
    console.log("End");
  }

  public updateCell(cell: Cell): void {
    const y = marginTop + cell.i * side;
    const x = marginLeft + cell.j * side;

    if (cell.isSnake) {
      this.p5js.fill(this.p5js.color(0, 255, 0));
      this.p5js.stroke(0);
    } else if (cell.hasFood) {
      this.p5js.fill(this.p5js.color(255, 0, 0));
      this.p5js.stroke(0);
    } else if (cell.isWall) {
      this.p5js.fill(255);
      this.p5js.noStroke();
    } else {
      this.p5js.fill(0);
    }

    this.p5js.rect(x, y, side, side);
  }
}
