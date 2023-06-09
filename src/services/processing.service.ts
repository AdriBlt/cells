import * as p5 from "p5";

import { isMouseWheelEvent } from "./processing-contracts";

export interface ProcessingSketch {
  setup(p: p5): void;
  draw(): void;
  preload?(p: p5): void;
  keyPressed?(): void;
  mousePressed?(): void;
  mouseReleased?(): void;
  mouseDragged?(): void;
  mouseMoved?(): void;
  mouseClicked?(): void;
  mouseWheel?(delta: number): void;
}

export class ProcessingService {
  private p5js: p5;

  public sketch(processingSketch: ProcessingSketch, containerId: string): void {
    this.remove();

    const element = document.getElementById(containerId) || undefined;
    this.p5js = new p5((p: p5) => {
      p.setup = () => processingSketch.setup(p);
      p.draw = () => processingSketch.draw && processingSketch.draw();
      p.preload = () => processingSketch.preload && processingSketch.preload(p);
      p.keyPressed = () =>
        processingSketch.keyPressed && processingSketch.keyPressed();
      p.mousePressed = () =>
        processingSketch.mousePressed && processingSketch.mousePressed();
      p.mouseDragged = () =>
        processingSketch.mouseDragged && processingSketch.mouseDragged();
      p.mouseReleased = () =>
        processingSketch.mouseReleased && processingSketch.mouseReleased();
      p.mouseMoved = () =>
        processingSketch.mouseMoved && processingSketch.mouseMoved();
      p.mouseClicked = () =>
        processingSketch.mouseClicked && processingSketch.mouseClicked();
      p.mouseWheel = (event) =>
        processingSketch.mouseWheel &&
        isMouseWheelEvent(event) &&
        processingSketch.mouseWheel(event.delta);
    }, element);
  }

  public remove(): void {
    if (this.p5js) {
      this.p5js.remove();
    }
  }
}
