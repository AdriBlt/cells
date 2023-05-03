import * as p5 from "p5";

import { ProcessingSketch } from "../../services/processing.service";
import { COLORS, setBackground, setFillColor, setStrokeColor } from "../../utils/color";
import { clamp } from "../../utils/numbers";
import { Point, squaredDistance } from "../../utils/points";
import { drawPolygon } from "./curved-polygon-helper";

const WIDTH = 900;
const HEIGHT = 500;
const NB_POINTS = 100;

const CORNER_RADIUS = 100;

const POINT_RADIUS = 10;
const SQUARED_RADIUS = POINT_RADIUS * POINT_RADIUS;

export class CurvedPolygonSketch implements ProcessingSketch {
  private p5js: p5;
  private points: Point[] = [];

  private selectedPoint: Point | null = null;

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(WIDTH, HEIGHT);
    this.p5js.noLoop();

    this.points = [
      { x: 200, y: 200 },
      { x: 600, y: 200 },
      { x: 500, y: 400 },
      { x: 300, y: 400 },
    ];
  }

  public draw(): void {
    setBackground(this.p5js, COLORS.White);

    this.p5js.noFill();
    this.p5js.strokeWeight(2);
    setStrokeColor(this.p5js, COLORS.Black);

    drawPolygon(this.p5js, this.points, CORNER_RADIUS, NB_POINTS);

    // Draw anchor points
    this.p5js.strokeWeight(1);
    setStrokeColor(this.p5js, COLORS.Black);
    setFillColor(this.p5js, COLORS.LightGray);
    this.points.forEach(p => {
      this.p5js.ellipse(p.x, p.y, POINT_RADIUS, POINT_RADIUS);
    });
  }

  public mousePressed = (): void => {
    const mouse = {
      x: this.p5js.mouseX,
      y: this.p5js.mouseY,
    };
    this.points.forEach(p => {
      if (squaredDistance(mouse, p) < SQUARED_RADIUS) {
        this.selectedPoint = p;
      }
    });
  }

  public mouseDragged = (): void => {
    if (!!this.selectedPoint) {
      this.selectedPoint.x = clamp(this.p5js.mouseX, 0, WIDTH);
      this.selectedPoint.y = clamp(this.p5js.mouseY, 0, HEIGHT);
      this.draw();
    }
  }

  public mouseReleased = (): void => {
    this.selectedPoint = null;
  }
}
