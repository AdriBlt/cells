import { observable } from "mobx";
import * as p5 from "p5";

import { PlayableSketch } from "../../services/playable-sketch";
import { COLORS, setBackground, setStrokeColor } from "../../utils/color";
import { getKeyFromCode, KeyBoard } from "../../utils/keyboard";
import { findGCD } from "../../utils/numbers";
import { Vector } from "../../utils/vector";

const WIDTH = 800;
const HEIGHT = 500;
const NUMBER_OF_POINTS = 360;
const RADIUS = 100;
const TEXT_MARGIN = 100;

export class RosesSketch extends PlayableSketch {
  @observable public coefNumerator: number = 1;
  @observable public coefDenominator: number = 3;

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(WIDTH, HEIGHT);
    this.p5js.noLoop();
  }

  public draw(): void {
    this.show();
  }

  public setNumerator = (value: number): void => {
    this.coefNumerator = Math.max(1, value);
    this.show();
  };

  public setDenominator = (value: number): void => {
    this.coefDenominator = Math.max(1, value);
    this.show();
  };

  public keyPressed(): void {
    const key = getKeyFromCode(this.p5js.keyCode);
    if (key === KeyBoard.R) {
      this.coefNumerator = 1;
      this.coefDenominator = 1;
      this.show()
    } else if (key === KeyBoard.LEFT) {
      this.setNumerator(this.coefNumerator - 1);
    } else if (key === KeyBoard.RIGHT) {
      this.setNumerator(this.coefNumerator + 1);
    } else if (key === KeyBoard.UP) {
      this.setDenominator(this.coefDenominator + 1);
    } else if (key === KeyBoard.DOWN) {
      this.setDenominator(this.coefDenominator - 1);
    }
  }

  private show(): void {
    setBackground(this.p5js, COLORS.White);
    setStrokeColor(this.p5js, COLORS.Black);
    this.p5js.noFill();
    this.p5js.strokeWeight(1);

    this.p5js.push();
    this.p5js.translate(WIDTH / 2, HEIGHT / 2);

    this.p5js.beginShape();
    const deltaAngle = this.p5js.radians(360 / NUMBER_OF_POINTS);
    const maxAngle = this.p5js.TWO_PI * this.coefDenominator / findGCD(this.coefNumerator, this.coefDenominator);
    for (let a = 0; a < maxAngle; a += deltaAngle) {
      const r = RADIUS * Math.cos(a * this.coefNumerator / this.coefDenominator);
      const point = Vector.fromAngle(a, r);
      this.p5js.vertex(point.x, point.y);
    }
    this.p5js.endShape(this.p5js.CLOSE);

    this.p5js.pop();

    // TEXT
    this.p5js.textSize(40);
    this.p5js.fill(0, 0, 255);
    this.p5js.text("k = " + (this.coefNumerator / this.coefDenominator).toFixed(3), WIDTH - 2 * TEXT_MARGIN, TEXT_MARGIN);
  }
}
