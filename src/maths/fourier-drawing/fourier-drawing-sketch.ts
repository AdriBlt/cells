import { computed, observable } from "mobx";
import * as p5 from "p5";

import { Complex } from "../../numbers/Complex";
import { PlayableSketch } from "../../services/playable-sketch";
import { getKeyFromCode, KeyBoard } from "../../utils/keyboard";
import { LinkedList } from "../../utils/linked-list";
import { clamp, isStatisticallyNull } from "../../utils/numbers";
import { Extremum, findExtremum, Point } from "../../utils/points";
import { parseSvg } from "../../utils/svgParser";
import { createVector, Vector } from "../../utils/vector";
import { FourierParameter } from "../fourier/FourierParameter";
import { getFourierParameter } from "../fourier/FourierTransform";
import { GeoCoordinates } from "./data";

const WIDTH = 800;
const HEIGHT = 600;
const MARGIN = 10;
const CENTER: Vector = createVector(WIDTH / 2, HEIGHT / 2);

const COORDINATES: Point[][] = GeoCoordinates;
export class FourierDrawingSketch extends PlayableSketch {
  @observable public numberOfCircles: number;
  @observable public showOriginal: boolean = false;
  @computed public get maxNumberOfFrequencies() { return this.points.length; }

  private time: number = 0;
  private shape: LinkedList<Point> = new LinkedList<Point>();
  private frequencies: FourierParameter[] = [];
  @observable private points: Complex[] = [];
  private timeIncrement: number = 0;
  private currentlySelectedIndex = 0;
  private speed = 1;

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(WIDTH, HEIGHT);

    this.resetPoints();

    // this.replaceData("/data/fourier/north-america.svg");
  }

  public draw(): void {
    this.runOneStep();
  }

  public restart = (): void => {
    this.time = 0;
    this.shape.clear();
    this.drawElements();
  }

  public setShowOriginal(value: boolean): void {
    this.showOriginal = value;
    if (this.isPaused) {
      this.drawElements();
    }
  }

  public setNumberOfCircles(value: number): void {
    this.numberOfCircles = clamp(value, 1, this.maxNumberOfFrequencies);
    if (this.isPaused) {
      this.drawElements();
    }
  }

  public keyPressed(): void {
    const key = this.p5js && getKeyFromCode(this.p5js.keyCode);

    if (key === KeyBoard.SPACE) {
      this.pause();
    } else if (key === KeyBoard.R) {
      this.restart();
    } else if (key === KeyBoard.ENTER) {
      this.playOneStep();
    } else if (key === KeyBoard.UP) {
      this.setNumberOfCircles(Math.min(this.numberOfCircles + 1, this.maxNumberOfFrequencies));
    } else if (key === KeyBoard.DOWN) {
      this.setNumberOfCircles(Math.max(this.numberOfCircles - 1, 1));
    } else if (key === KeyBoard.LEFT) {
      this.currentlySelectedIndex = this.currentlySelectedIndex === 0
        ? COORDINATES.length - 1
        : this.currentlySelectedIndex - 1;
      this.resetPoints();
    } else if (key === KeyBoard.RIGHT) {
      this.currentlySelectedIndex = this.currentlySelectedIndex === COORDINATES.length - 1
        ? 0
        : this.currentlySelectedIndex + 1;
      this.resetPoints();
    }
  }

  protected replaceData(filePath: string): void {
    parseSvg(filePath)
    .then(value => {
      let path: Point[] = [];
      value.forEach(v => {
        if (v.length > path.length) {
          path = v;
        }
      })
      this.setPoints(path);
    })
    .catch(error => {
      // tslint:disable-next-line: no-console
      console.log(error);
    });
  }

  private resetPoints = (): void => {
    this.setPoints(COORDINATES[this.currentlySelectedIndex]);
  }

  private setPoints = (path: Point[]): void => {
    this.points = this.movePathToCenter(path);
    this.showOriginal = false;
    this.numberOfCircles = 3;
    this.timeIncrement = this.speed * 2 * Math.PI / this.maxNumberOfFrequencies;
    this.computeFrequencies();
    this.restart();
  }

  private runOneStep = (): void => {
    this.drawElements();

    this.time += this.timeIncrement;
    if (this.time > 2 * Math.PI) {
      this.time = 0;
    }
  }

  private drawElements = (): void => {
    this.p5js.background(255);

    if (this.showOriginal) {
      this.drawOriginal();
    }

    this.drawCircles();
    this.drawShape();
  }

  private drawOriginal(): void {
    this.p5js.noFill();
    this.p5js.stroke(255, 0, 0);
    this.p5js.strokeWeight(1);
    this.p5js.beginShape();
    for (const point of this.points) {
      this.p5js.vertex(point.x, point.y);
    }

    this.p5js.endShape(this.p5js.CLOSE);
  }

  private computeFrequencies(): void {
    this.frequencies = [];
    for (let i = 0; i < this.points.length; i++) {
      this.frequencies.push(getFourierParameter(i, this.points));
    }

    this.frequencies.sort(
      (a: FourierParameter, b: FourierParameter) => b.amplitude - a.amplitude
    );
  }

  private movePathToCenter(path: Point[], extremum: Extremum = findExtremum(path)): Complex[] {
    const xRatio = (WIDTH - 2 * MARGIN) / (extremum.max.x - extremum.min.x);
    const yRatio = (HEIGHT - 2 * MARGIN) / (extremum.max.y - extremum.min.y);
    const ratio = Math.min(xRatio, yRatio);
    const xOffset = CENTER.x - (ratio * (extremum.max.x + extremum.min.x)) / 2;
    const yOffset = CENTER.y - (ratio * (extremum.max.y + extremum.min.y)) / 2;
    const points: Complex[] = path.map((p) => {
      const x = ratio * p.x + xOffset;
      const y = ratio * p.y + yOffset;
      return new Complex(x, y);
    });
    return points;
  }

  private drawCircles(): void {
    let center = new Vector();
    // "+1" for connection with the root anchor
    const max = Math.min(1 + this.numberOfCircles, this.frequencies.length);
    for (let i = 0; i < max; i++) {
      center = this.drawCircleAndReturnPoint(center, this.frequencies[i], i === 0);
    }

    if (!this.isPaused) {
      this.addPointToShape({ x: center.x, y: center.y });
    }
  }

  private addPointToShape(point: Point): void {
    this.shape.insertHead(point);
    if (this.shape.count * this.speed > this.maxNumberOfFrequencies) {
      this.shape.popTail();
    }
  }

  private drawCircleAndReturnPoint(
    center: Vector,
    parameter: FourierParameter,
    skipEllipse: boolean = false,
  ): Vector {
    if (isStatisticallyNull(parameter.amplitude)) {
      return center;
    }

    const point = Vector.fromAngle(
      parameter.frequency * this.time + parameter.phase,
      parameter.amplitude
      ).add(center);

    if (!skipEllipse) {
      this.p5js.noFill();
      this.p5js.stroke(100, 100);

      this.p5js.strokeWeight(1);
      this.p5js.ellipse(
        center.x,
        center.y,
        2 * parameter.amplitude
      );

      this.p5js.strokeWeight(3);
      this.p5js.line(center.x, center.y, point.x, point.y);
    }

    return point;
  }

  private drawShape(): void {
    this.p5js.noFill();
    this.p5js.stroke(0);
    this.p5js.strokeWeight(2);
    this.p5js.beginShape();
    let point = this.shape.head;
    while (point !== undefined) {
      this.p5js.vertex(point.value.x, point.value.y);
      point = point.next;
    }

    this.p5js.endShape();
  }
}