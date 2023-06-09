import { observable } from "mobx";
import * as p5 from "p5";

import { PlayableSketch } from "../../services/playable-sketch";
import { getKeyFromCode, KeyBoard } from "../../utils/keyboard";
import { createVector, Vector } from "../../utils/vector";

const WIDTH = 800;
const HEIGHT = 800;
const RADIUS = 350;
const DOT_PADDING = 5;
const TEXT_MARGIN = 100;

export class MultiplicationCircleSketch extends PlayableSketch {
  @observable public numberOfPoints: number = 250;
  @observable public multiplicator: number = 0;
  @observable public multiplicatorIncrement: number = 0.005;

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(WIDTH, HEIGHT);
  }

  public draw(): void {
    this.drawCircle();
    this.multiplicator += this.multiplicatorIncrement;
  }

  public previousInt = (): void => {
    this.setMultiplicatorValue(Math.ceil(this.multiplicator - 1));
  };

  public nextInt = (): void => {
    this.setMultiplicatorValue(Math.floor(this.multiplicator + 1));
  };

  public setMultiplicatorValue = (value: number): void => {
    this.multiplicator = value;
    this.drawCircle();
  };

  public keyPressed(): void {
    const key = getKeyFromCode(this.p5js.keyCode);
    if (key === KeyBoard.LEFT) {
      this.previousInt();
    } else if (key === KeyBoard.UP) {
      this.setMultiplicatorValue(
        this.multiplicator + this.multiplicatorIncrement
      );
    } else if (key === KeyBoard.RIGHT) {
      this.nextInt();
    } else if (key === KeyBoard.DOWN) {
      this.setMultiplicatorValue(
        this.multiplicator - this.multiplicatorIncrement
      );
    } else if (key === KeyBoard.SPACE) {
      // SPACE
      this.pause();
    }
  }

  private drawCircle(): void {
    this.p5js.background(255);
    this.p5js.noFill();
    this.p5js.strokeWeight(1);

    const center = createVector(WIDTH / 2, HEIGHT / 2);

    // DRAW CIRCLE
    this.p5js.stroke(0);
    this.p5js.ellipse(center.x, center.y, 2 * RADIUS);

    const getPoint = (i: number): Vector => {
      return Vector.fromAngle(
        Math.PI + (i * 2 * Math.PI) / this.numberOfPoints,
        radius
      ).add(center);
    };

    // DOTS
    const radius = RADIUS - DOT_PADDING;
    for (let i = 0; i < this.numberOfPoints; i++) {
      const point = getPoint(i);
      this.p5js.ellipse(point.x, point.y, 2);
    }

    // LINES
    this.p5js.stroke(0, 0, 255);
    for (let i = 0; i < this.numberOfPoints; i++) {
      const start = getPoint(i);
      const end = getPoint((i * this.multiplicator) % this.numberOfPoints);
      this.p5js.line(start.x, start.y, end.x, end.y);
    }

    // TEXT
    this.p5js.textSize(40);
    this.p5js.fill(0, 0, 255);
    this.p5js.text(`${this.multiplicator}`, WIDTH - TEXT_MARGIN, TEXT_MARGIN);
  }
}
