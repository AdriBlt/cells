import { observable } from "mobx";
import * as p5 from "p5";

import { ProcessingSketch } from "../../services/processing.service";
import { LinkedList } from "../../utils/linked-list";
import { isStatisticallyNull } from "../../utils/numbers";
import { createVector, Vector } from "../../utils/vector";
import { FourierParameter } from "../fourier/FourierParameter";
import { getSignal, Signal } from "../fourier/Signal";
import { SignalType } from "../fourier/SignalType";
import { WavePoint } from "../fourier/WavePoint";

const WIDTH = 800;
const HEIGHT = 600;
const CENTER: Vector = createVector(220, 300);
const BASE_RADIUS = 75;
const WAVE_LEFT = 450;
const SHAPE_MAX_LENGTH = 500;
const ARROW_LENGTH = 5;
const ARROW_WIDTH = 3;
const TIME_INCREMENT = 0.02;
export const MAX_FREQUENCY_COUNT = 100;

export class FourierSignalSketch implements ProcessingSketch {
  @observable public numberOfCircles: number = 20;
  @observable public signal: Signal = getSignal(SignalType.SQUARE);
  private p5js: p5;
  private time: number = 0;
  private shape: LinkedList<WavePoint> = new LinkedList<WavePoint>();
  private frequencies: FourierParameter[] = [];

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(WIDTH, HEIGHT);
    this.computeFrequencies();
  }

  public draw(): void {
    this.p5js.background(255);

    this.drawCircles();
    this.drawArrow();
    this.drawShape();
    this.drawExpectedSignal();
    this.drawWave();

    this.time += TIME_INCREMENT;
  }

  public changeFrequencyCount = (nbCircles: number) => {
    this.numberOfCircles = Math.min(nbCircles, MAX_FREQUENCY_COUNT);
  };

  public changeSignalType = (type: SignalType) => {
    this.signal = getSignal(type);
    this.shape.clear();
    this.computeFrequencies();
  };

  public reset = (): void => {
    this.shape.clear();
    this.time = 0;
    if (this.signal.type === SignalType.RANDOM) {
      this.signal = getSignal(SignalType.RANDOM);
    }
  };

  private computeFrequencies(): void {
    this.frequencies = [];

    for (let i = 0; i < MAX_FREQUENCY_COUNT; i++) {
      this.frequencies.push(this.signal.getFrequencyParameter(i));
    }

    this.frequencies.sort(
      (a: FourierParameter, b: FourierParameter) => b.amplitude - a.amplitude
    );
  }

  private drawCircles(): void {
    let center = CENTER;
    const max = Math.min(this.numberOfCircles, this.frequencies.length);
    for (let i = 0; i < max; i++) {
      center = this.drawCircleAndReturnPoint(center, this.frequencies[i]);
    }

    this.shape.insertHead({
      x: center.x,
      y: center.y,
      expected:
        CENTER.y - BASE_RADIUS * this.signal.getExpectedValue(this.time),
    });
    if (this.shape.count > SHAPE_MAX_LENGTH) {
      this.shape.popTail();
    }
  }

  private drawCircleAndReturnPoint(
    center: Vector,
    parameter: FourierParameter
  ): Vector {
    if (isStatisticallyNull(parameter.amplitude)) {
      return center;
    }

    this.p5js.noFill();
    this.p5js.stroke(0);

    this.p5js.strokeWeight(1);
    this.p5js.ellipse(
      center.x,
      center.y,
      2 * BASE_RADIUS * parameter.amplitude
    );

    const point = Vector.fromAngle(
      parameter.frequency * this.time + parameter.phase,
      BASE_RADIUS * parameter.amplitude
    ).add(center);

    this.p5js.strokeWeight(3);
    this.p5js.line(center.x, center.y, point.x, point.y);

    return point;
  }

  private drawArrow(): void {
    this.p5js.stroke(255, 0, 0, 100);
    this.p5js.strokeWeight(3);
    this.p5js.beginShape();
    const point = this.shape.peekHead();
    if (!point) {
      return;
    }

    this.p5js.vertex(point.x, point.y);
    this.p5js.vertex(WAVE_LEFT - ARROW_LENGTH, point.y);
    this.p5js.vertex(WAVE_LEFT - ARROW_LENGTH, point.y - ARROW_WIDTH);
    this.p5js.vertex(WAVE_LEFT, point.y);
    this.p5js.vertex(WAVE_LEFT - ARROW_LENGTH, point.y + ARROW_WIDTH);
    this.p5js.vertex(WAVE_LEFT - ARROW_LENGTH, point.y);

    this.p5js.endShape();
  }

  private drawShape(): void {
    this.p5js.noFill();
    this.p5js.stroke(150, 100);
    this.p5js.strokeWeight(3);
    this.p5js.beginShape();
    let point = this.shape.head;
    while (point !== undefined) {
      this.p5js.vertex(point.value.x, point.value.y);
      point = point.next;
    }

    this.p5js.endShape();
  }

  private drawExpectedSignal() {
    this.p5js.stroke(0, 255, 0, 100);
    this.p5js.strokeWeight(3);
    this.p5js.beginShape();
    let point = this.shape.head;
    let x = WAVE_LEFT;
    while (point !== undefined) {
      this.p5js.vertex(x, point.value.expected);
      point = point.next;
      x++;
    }

    this.p5js.endShape();
  }

  private drawWave(): void {
    this.p5js.noFill();
    this.p5js.stroke(0);
    this.p5js.strokeWeight(2);
    this.p5js.beginShape();
    let point = this.shape.head;
    let x = WAVE_LEFT;
    while (point !== undefined) {
      this.p5js.vertex(x, point.value.y);
      point = point.next;
      x++;
    }

    this.p5js.endShape();
  }
}
