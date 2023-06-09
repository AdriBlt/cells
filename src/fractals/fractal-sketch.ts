import * as p5 from "p5";

import { ProcessingSketch } from "../services/processing.service";
import { COLORS, setStrokeColor } from "../utils/color";
import { getKeyFromCode, KeyBoard } from "../utils/keyboard";
import { isOutOfBounds } from "../utils/numbers";
import { setPixel } from "../utils/pixel-helper";
import { Point } from "../utils/points";
import { FractalEngine } from "./models/engine";
import { Fractal } from "./models/fractal";
import { Directions } from "./models/models";

const w = 800;
const h = 600;

const MIN_DRAG_RECT_SIDE = 10;

export class FractalSketch implements ProcessingSketch {
  private p5js: p5;

  private engine: FractalEngine;

  private fractalImage: p5.Image;
  private draggingPointStart: Point | undefined;

  constructor(fractal: Fractal) {
    this.engine = new FractalEngine(w, h, fractal);
  }

  public setFractal(fractal: Fractal): void {
    this.engine.setFractal(fractal);
    this.resetFractal();
  }

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(w, h);
    this.p5js.pixelDensity(1);
    this.fractalImage = this.p5js.createImage(w, h);

    this.resetFractal();
  }

  public draw(): void {
    // NOOP
  }

  public mouseWheel(delta: number): void {
    if (isOutOfBounds(this.p5js.mouseX, 0, w) || isOutOfBounds(this.p5js.mouseY, 0, h)) {
      return;
    }

    const isZoomIn = delta < 0;
    this.engine.zoomOnPoint(this.p5js.mouseY, this.p5js.mouseX, isZoomIn);
  }

  public keyPressed(): void {
    const key = getKeyFromCode(this.p5js.keyCode);
    if (key === KeyBoard.LEFT) {
      this.engine.move(Directions.LEFT);
    } else if (key === KeyBoard.UP) {
      this.engine.move(Directions.UP);
    } else if (key === KeyBoard.RIGHT) {
      this.engine.move(Directions.RIGHT);
    } else if (key === KeyBoard.DOWN) {
      this.engine.move(Directions.DOWN);
    } else if (key === KeyBoard.C) {
      this.engine.toggleColorMode();
    } else if (key === KeyBoard.R) {
      this.resetFractal();
    } else if (key === KeyBoard.P || key === KeyBoard.M) {
      let i: number;
      let j: number;
      if (isOutOfBounds(this.p5js.mouseX, 0, w) || isOutOfBounds(this.p5js.mouseY, 0, h)) {
        i = h / 2;
        j = w / 2;
      } else {
        i = this.p5js.mouseY;
        j = this.p5js.mouseX;
      }
      const isZoomIn = key === KeyBoard.P;
      this.engine.zoomOnPoint(i, j, isZoomIn);
    } else {
      return;
    }

    this.drawFractal();
  }

  public mousePressed(): void {
    this.draggingPointStart =
      this.p5js.mouseButton === this.p5js.LEFT
        ? { x: this.p5js.mouseX, y: this.p5js.mouseY }
        : undefined;
  }

  public mouseDragged(): void {
    this.p5js.image(this.fractalImage, 0, 0);

    if (this.draggingPointStart) {
      setStrokeColor(this.p5js, COLORS.Red);
      this.p5js.noFill();
      this.p5js.rect(
        this.draggingPointStart.x,
        this.draggingPointStart.y,
        this.p5js.mouseX - this.draggingPointStart.x,
        this.p5js.mouseY - this.draggingPointStart.y
      );
    }
  }

  public mouseReleased(): void {
    if (this.draggingPointStart) {
      const rectWidth = Math.abs(this.p5js.mouseX - this.draggingPointStart.x);
      const rectHeight = Math.abs(this.p5js.mouseY - this.draggingPointStart.y);

      if (rectWidth > MIN_DRAG_RECT_SIDE && rectHeight > MIN_DRAG_RECT_SIDE) {
        // ZOOMING IN
        this.engine.zoomOnRectangle({
          iMin: Math.min(this.draggingPointStart.y, this.p5js.mouseY),
          iMax: Math.max(this.draggingPointStart.y, this.p5js.mouseY),
          jMin: Math.min(this.draggingPointStart.x, this.p5js.mouseX),
          jMax: Math.max(this.draggingPointStart.x, this.p5js.mouseX),
        });
        this.drawFractal();
      } else {
        this.p5js.image(this.fractalImage, 0, 0);
      }

      this.draggingPointStart = undefined;
    }
  }

  private resetFractal(): void {
    this.engine.resetFractal();
    this.engine.computeFractal();
    this.drawFractal();
  }

  private drawFractal(): void {
    this.fractalImage.loadPixels();

    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        const c = this.engine.getColor(i, j);
        setPixel(this.fractalImage, i, j, c);
      }
    }

    this.fractalImage.updatePixels();
    this.p5js.image(this.fractalImage, 0, 0);
  }
}
