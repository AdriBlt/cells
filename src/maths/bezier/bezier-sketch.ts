import * as p5 from "p5";

import { PlayableSketch } from "../../services/playable-sketch";
import { COLORS , colorWithAlpha, setBackground, setFillColor, setStrokeColor } from "../../utils/color";
import { clamp } from "../../utils/numbers";
import { Point, squaredDistance } from "../../utils/points";
import { Engine } from "./engine";

const WIDTH = 900;
const HEIGHT = 500;
const NB_POINTS = 100;
const POINT_RADIUS = 15;
const SQUARED_RADIUS = POINT_RADIUS * POINT_RADIUS;

export class BezierSketch extends PlayableSketch {
  private engine: Engine = new Engine(NB_POINTS);
  private time: number = 0;

  private selectedPoint: Point | null = null;

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(WIDTH, HEIGHT);

    this.engine.setPoints([
      { x: 50, y: 400 },
      { x: 200, y: 100 },
      { x: 350, y: 200 },
      { x: 600, y: 300 },
      { x: 150, y: 400 },
    ]);
  }

  public draw(): void {
    this.drawCanvas();

    this.time++;
    if (this.time === NB_POINTS) {
      this.time = 0;
    }
  }

  public restart = (): void => {
    this.time = 0;
  }

  public mousePressed = (): void => {
    const mouse = {
      x: this.p5js.mouseX,
      y: this.p5js.mouseY,
    };
    this.engine.anchorPoints.forEach(p => {
      if (squaredDistance(mouse, p) < SQUARED_RADIUS) {
        this.selectedPoint = p;
      }
    });
  }

  public mouseDragged = (): void => {
    if (!!this.selectedPoint) {
      this.selectedPoint.x = clamp(this.p5js.mouseX, 0, WIDTH);
      this.selectedPoint.y = clamp(this.p5js.mouseY, 0, HEIGHT);
      this.engine.computePoints();
      this.drawCanvas();
    }
  }

  public mouseReleased = (): void => {
    this.selectedPoint = null;
  }

  private drawCanvas(): void {
    setBackground(this.p5js, COLORS.White);
    this.drawCurve(this.engine);
  }

  private drawCurve(engine: Engine): void {
    this.p5js.noFill();

    // Draw initial lines
    this.p5js.strokeWeight(1);
    setStrokeColor(this.p5js, colorWithAlpha(COLORS.Black, 150));
    this.p5js.beginShape();
    engine.anchorPoints.forEach(p => this.p5js.vertex(p.x, p.y));
    this.p5js.endShape();

    // Draw iteration lines
    this.p5js.strokeWeight(2);
    setStrokeColor(this.p5js, colorWithAlpha(COLORS.Blue, 100));
    engine.points.forEach(line => {
      this.p5js.beginShape();
      line.forEach(timePoints => {
        const p = timePoints[this.time];
        this.p5js.vertex(p.x, p.y);
      });
      this.p5js.endShape();
    });

    // Draw final curve
    this.p5js.strokeWeight(3);
    setStrokeColor(this.p5js, COLORS.Red);
    const curve = engine.getCurve();
    this.p5js.beginShape();
    for (let t = 0; t <= this.time; t++) {
      const p = curve[t];
      this.p5js.vertex(p.x, p.y);
    }
    this.p5js.endShape();

    // Draw anchor points
    this.p5js.strokeWeight(1);
    setStrokeColor(this.p5js, COLORS.Black);
    setFillColor(this.p5js, COLORS.LightGray);
    engine.anchorPoints.forEach(p => {
      this.p5js.ellipse(p.x, p.y, POINT_RADIUS, POINT_RADIUS);
    });
  }
}
