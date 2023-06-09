import * as p5 from "p5";

import { PlayableSketch } from "../../services/playable-sketch";
import { COLORS, setBackground, setFillColor, setStrokeColor } from "../../utils/color";
import { LinkedList } from "../../utils/linked-list";
import { isOutOfBounds } from "../../utils/numbers";
import { createVector, Vector } from "../../utils/vector";
import { NBodiesEngine } from "./models/engine";
import { BodyInfo, CameraMode, ViewMode } from "./models/models";

const WIDTH = 1300;
const HEIGHT = 800;
const HALF_WIDTH = WIDTH / 2;
const HALF_HEIGHT = HEIGHT / 2;

const SKIP_FORWARD = 1000;
const COMPUTES_PER_STEP = 100;

export class NBodiesSketch extends PlayableSketch {
  private engine: NBodiesEngine = new NBodiesEngine();
  private cameraMode: ViewMode = { type: CameraMode.LockOnBarycenter };

  private zoom: number = 0.000001;

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(WIDTH, HEIGHT);
    this.reset();
  }

  public draw(): void {
    for (let t = 0; t < COMPUTES_PER_STEP; t++) {
      this.engine.computeOneStep();
    }
    this.updateSketch();
  }

  public skipForward = (): void => {
    for (let t = 0; t < SKIP_FORWARD; t++) {
      this.engine.computeOneStep();
    }

    this.updateSketch();
  }

  public mouseWheel(delta: number): void {
    if (delta > 0) {
      this.zoom *= 0.9;
    } else {
      this.zoom /= 0.9;
    }

    this.updateSketch();
  }

  public reset = (): void => {
    this.engine.reset();
  };

  public setBodies = (bodies: BodyInfo[]): void => {
    this.engine.setInputs(bodies);
  }

  public setViewMode = (viewMode: ViewMode): void => {
    this.cameraMode = viewMode;
  }

  private updateSketch = (): void => {
    setBackground(this.p5js, COLORS.Black);

    if (this.isPaused) {
      this.drawTails();
    }
    this.drawBodies();
  }

  private drawTails(): void {
    const offsetFunction = this.getTailOffsetFunction();
    this.p5js.noFill();
    this.p5js.strokeWeight(2);
    this.engine.bodies.forEach(planet => {
      setStrokeColor(this.p5js, planet.info.color);
      this.p5js.beginShape();
      planet.tail.toList().forEach((point, i) => {
        const offset = offsetFunction(i);
        this.p5js.vertex(
          HALF_WIDTH + this.zoom * (point.x - offset.x),
          HALF_HEIGHT + this.zoom * (point.y - offset.y),
        );
      });
      this.p5js.endShape();
    });
  }

  private drawBodies(): void {
    const offset = this.getBodiesOffset();
    this.p5js.noStroke();
    this.engine.bodies.forEach(planet => {
      setFillColor(this.p5js, planet.info.color);
      const x = HALF_WIDTH + this.zoom * (planet.position.x - offset.x);
      const y = HALF_HEIGHT + this.zoom * (planet.position.y - offset.y);
      const r = Math.max(2, Math.log(planet.info.radius)); // this.zoom * planet.info.radius;
      this.p5js.ellipse(x, y, r, r);
      this.p5js.textSize(10);
      this.p5js.text(planet.info.name, x + r, y - r);
    });
  }

  private getTailOffsetFunction(): (i: number) => Vector {
    const zero = createVector(0, 0);

    if (this.cameraMode.type === CameraMode.LockOnBarycenter
      || this.cameraMode.type === CameraMode.LockOnBody) {
        const offset = this.getSelectedBody().peekTail() || zero;
        return () => offset;
    }

    if (this.cameraMode.type === CameraMode.ViewFromBarycenter
      || this.cameraMode.type === CameraMode.ViewFromBody) {
        const tail = this.getSelectedBody().toList();
        return (i: number) => {
          return isOutOfBounds(i, 0, tail.length) ? zero : tail[i];
        }
    }

    return () => zero; // TODO: current offset
  }

  private getBodiesOffset(): Vector {
    if (this.cameraMode.type === CameraMode.Free) {
        return createVector(0, 0);
    }

    return this.getSelectedBody().peekTail() || createVector(0, 0);
  }

  private getSelectedBody(): LinkedList<Vector> {
    return (this.cameraMode.type === CameraMode.LockOnBody
      || this.cameraMode.type === CameraMode.ViewFromBody)
      && this.cameraMode.bodyIndex >= 0
      && this.cameraMode.bodyIndex < this.engine.bodies.length
      ? this.engine.bodies[this.cameraMode.bodyIndex].tail
      : this.engine.barycenterList;
  }
}
