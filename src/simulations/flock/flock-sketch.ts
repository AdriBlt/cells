import * as p5 from "p5";

import { ProcessingSketch } from "../../services/processing.service";
import { Vector } from "../../utils/vector";
import { Boid } from "./models/boid";
import { Flock } from "./models/flock";
import { Axe, Obstacle, Wall } from "./models/obstacle";

const WIDTH = 800;
const HEIGHT = 500;
const DEPTH = (WIDTH + HEIGHT) / 2;
const NUMBER_OF_BOIDS = 200;

export class FlockSketch implements ProcessingSketch {
  public flock: Flock = new Flock(WIDTH, HEIGHT, DEPTH, NUMBER_OF_BOIDS);
  public obstacles: Obstacle[] = [
    new Wall(Axe.X, 0),
    new Wall(Axe.Y, 0),
    new Wall(Axe.Z, 0),
    new Wall(Axe.X, WIDTH),
    new Wall(Axe.Y, HEIGHT),
    new Wall(Axe.Z, DEPTH)
  ];
  private p5js: p5;

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(WIDTH, HEIGHT);
  }

  public draw(): void {
    this.flock.updateForces(this.obstacles);

    this.p5js.background(0);

    this.p5js.noFill();
    this.p5js.strokeWeight(1);
    this.p5js.stroke(255, 0, 0);

    let isFirst = true;
    for (const boid of this.flock.boids) {
      boid.update(isFirst);
      this.edges(boid);
      if (isFirst) {
        if (this.flock.traits.isTailVisible) {
          this.drawTail(boid);
        }
        isFirst = false;
      }
    }

    this.p5js.strokeWeight(6);
    this.p5js.stroke(255);

    isFirst = true;
    for (const boid of this.flock.boids) {
      if (isFirst) {
        this.p5js.stroke(255, 0, 0);
        isFirst = false;
      } else {
        this.p5js.stroke(255);
      }

      this.drawBoid(boid);
    }
  }

  public mousePressed(): void {
    // NOOP
  }

  public keyPressed(): void {
    // NOOP
  }

  private drawBoid(boid: Boid): void {
    this.p5js.point(boid.position.x, boid.position.y);
    /*
    const headSize = 3;
    const sideSIze = 1;
    const head = boid.velocity.copy().setMag(headSize);
    const side = boid.velocity
      .copy()
      .rotate(Math.PI / 2)
      .setMag(sideSIze);
    this.p5js.beginShape(this.p5js.TRIANGLES);
    this.p5js.vertex(boid.position.x + head.x, boid.position.y + head.y);
    this.p5js.vertex(boid.position.x + side.x, boid.position.y + side.y);
    this.p5js.vertex(boid.position.x - side.x, boid.position.y - side.y);
    this.p5js.endShape();
    */
  }

  private drawTail(boid: Boid): void {
    const distanceThreshold = (WIDTH + HEIGHT) / 3;
    let lastPos: Vector | undefined;
    this.p5js.beginShape();
    for (const pos of boid.oldPositions.toList()) {
      if (lastPos && lastPos.dist(pos) > distanceThreshold) {
        this.p5js.endShape();
        this.p5js.beginShape();
      }
      this.p5js.vertex(pos.x, pos.y);
      lastPos = pos;
    }

    if (lastPos && lastPos.dist(boid.position) < distanceThreshold) {
      this.p5js.vertex(boid.position.x, boid.position.y);
      this.p5js.endShape();
    }
  }

  private edges(boid: Boid): void {
    const w = this.p5js.width;
    const h = this.p5js.height;
    const d = (w + h) / 2;

    if (boid.position.x > w) {
      boid.position.x = 0;
    } else if (boid.position.x < 0) {
      boid.position.x = w;
    }

    if (boid.position.y > h) {
      boid.position.y = 0;
    } else if (boid.position.y < 0) {
      boid.position.y = h;
    }

    if (boid.position.z > d) {
      boid.position.z = 0;
    } else if (boid.position.y < 0) {
      boid.position.z = d;
    }
  }
}
