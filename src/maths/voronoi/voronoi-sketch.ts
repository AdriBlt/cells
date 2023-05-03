import * as p5 from "p5";

import { PlayableSketch } from "../../services/playable-sketch";
import { COLORS , setFillColor, setStrokeColor } from "../../utils/color";
import { getKeyFromCode, KeyBoard } from "../../utils/keyboard";
import { clamp } from "../../utils/numbers";
import { random } from "../../utils/random";
import { createVector, Vector } from "../../utils/vector";
import { Engine } from "./models/engine";
import { Point } from "./models/point";

const WIDTH = 800;
const HEIGHT = 500;

const CANVAS_MARGIN = 0;
const CANVAS_WIDTH = WIDTH - 2 * CANVAS_MARGIN;
const CANVAS_HEIGHT = HEIGHT - 2 * CANVAS_MARGIN;

const POSITION_MARGIN = 5;

const NB_STARTING_POINTS = 100;

interface SpeedPoint {
  position: Point;
  speed: Vector;
  acceleration: Vector;
}

export class VoronoiSketch extends PlayableSketch {
  private engine = new Engine(CANVAS_WIDTH, CANVAS_HEIGHT);
  private points: SpeedPoint[];

  private showDelaunayTriangulation = false;
  private showVoronoiCells = true;

  public setShowDelaunayTriangulation(show: boolean): void {
    this.showDelaunayTriangulation = show;
    this.drawCanvas();
  }

  public setShowVoronoiCells(show: boolean): void {
    this.showVoronoiCells = show;
    this.drawCanvas();
  }

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(WIDTH, HEIGHT);

    this.points = [];
    for (let i = 0; i < NB_STARTING_POINTS; i++) {
      this.addPoint();
    }

    this.engine.generateVoronoiEdgesFromDelaunay();
    this.draw();
  }

  public draw(): void {
    this.updatePointsPositionWithForces();
    this.drawCanvas();
  }

  public keyPressed(): void {
    const key = this.p5js && getKeyFromCode(this.p5js.keyCode);

    if (key === KeyBoard.SPACE) {
      this.addPoint();
    }
  }

  private addPoint(): void {
    const speed = random(0, 2);
    const direction = random(0, 2 * Math.PI);
    this.points.push({
      position: new Point(
        random(POSITION_MARGIN, CANVAS_WIDTH - POSITION_MARGIN),
        random(POSITION_MARGIN, CANVAS_HEIGHT - POSITION_MARGIN)),
      speed: createVector(speed * Math.cos(direction), speed * Math.sin(direction)),
      acceleration: createVector(),
    });
  }

  private drawCanvas(): void {
    setFillColor(this.p5js, COLORS.White);
    setStrokeColor(this.p5js, COLORS.Black);
    this.p5js.strokeWeight(2);
    this.p5js.rect(0, 0, WIDTH, HEIGHT);

    if (this.showDelaunayTriangulation) {
      this.drawTriangulation();
    }

    if (this.showVoronoiCells) {
      this.drawVoronoi();
    }

    this.drawPoints();
  }

  private drawTriangulation(): void {
    this.p5js.strokeWeight(1);
    setStrokeColor(this.p5js, COLORS.Red);
    this.engine.delaunayTriangulation.forEach(triangle => {
      const v = triangle.Vertices;
      this.p5js.line(CANVAS_MARGIN + v[0].X, CANVAS_MARGIN + v[0].Y, CANVAS_MARGIN + v[1].X, CANVAS_MARGIN + v[1].Y);
      this.p5js.line(CANVAS_MARGIN + v[1].X, CANVAS_MARGIN + v[1].Y, CANVAS_MARGIN + v[2].X, CANVAS_MARGIN + v[2].Y);
      this.p5js.line(CANVAS_MARGIN + v[0].X, CANVAS_MARGIN + v[0].Y, CANVAS_MARGIN + v[2].X, CANVAS_MARGIN + v[2].Y);
    });
  }

  private drawVoronoi(): void {
    this.p5js.noFill();
    this.p5js.strokeWeight(1);
    setStrokeColor(this.p5js, COLORS.Blue);

    this.engine.voronoiEdges.forEach(e => {
      this.p5js.line(
        CANVAS_MARGIN + e.point1.X, CANVAS_MARGIN + e.point1.Y,
        CANVAS_MARGIN + e.point2.X, CANVAS_MARGIN + e.point2.Y);
      });

    // Curved polygons
    // this.engine.voronoiCells.forEach((edges, point) => {
    //   // this.p5js.beginShape();
    //   // edges.forEach(p => this.p5js.vertex(CANVAS_MARGIN + p.X, CANVAS_MARGIN + p.Y));
    //   // this.p5js.endShape(this.p5js.CLOSE);
    //   drawPolygon(
    //     this.p5js,
    //     edges.map(p => ({ x: CANVAS_MARGIN + p.X, y: CANVAS_MARGIN + p.Y })),
    //     100,
    //     50
    //   )
    // });
  }

  private drawPoints(): void {
    const pointRadius = 6;
    this.p5js.noStroke();
    setFillColor(this.p5js, COLORS.Black);
    this.engine.points.forEach(point => {
      this.p5js.ellipse(CANVAS_MARGIN + point.X, CANVAS_MARGIN + point.Y, pointRadius, pointRadius);
    });
  }

  private updatePointsPositionWithForces(): void {
    const deltaT = 1;
    const coefForce = 10;
    this.points.forEach(p => {
      // Force from walls
      const x = p.position.X;
      const altX = CANVAS_WIDTH - x;
      const y = p.position.Y;
      const altY = CANVAS_HEIGHT - y;
      const fX = coefForce * (1 / (x * x) - 1 / (altX * altX));
      const fY = coefForce * (1 / (y * y) - 1 / (altY * altY));
      p.acceleration = createVector(fX, fY);
    });
    for (let i = 0; i < this.points.length; i++) {
      for (let j = i + 1; j < this.points.length; j++) {
        const dX = this.points[i].position.X - this.points[j].position.X;
        const dY = this.points[i].position.Y - this.points[j].position.Y;
        const d2 = dX * dX + dY * dY;
        const d = Math.sqrt(d2);
        const force = coefForce / d2;
        const fX = force * dX / d;
        const fY = force * dY / d;
        this.points[i].acceleration.add(fX, fY);
        this.points[j].acceleration.add(-fX, -fY);
      }
    }
    this.points.forEach(p => {
      p.speed.add(deltaT * p.acceleration.x, deltaT * p.acceleration.y);
      p.position.X = clamp(p.position.X + deltaT * p.speed.x, POSITION_MARGIN, CANVAS_WIDTH - POSITION_MARGIN);
      p.position.Y = clamp(p.position.Y + deltaT * p.speed.y, POSITION_MARGIN, CANVAS_HEIGHT - POSITION_MARGIN);
    });

    const voronoiPoints = this.points.map(p => p.position);
    this.engine.setPoints(voronoiPoints);
  }
}
