import { random } from "../../../utils/random";
import { createVector, Vector } from "../../../utils/vector";
import { Boid } from "./boid";
import { FlockTraits } from "./flock-traits";
import { Obstacle } from "./obstacle";

export class Flock {
  public boids: Boid[] = [];
  public traits: FlockTraits = {
    maxForce: 0.2,
    maxSpeed: 5,
    separationPerceptionRadius: 20,
    alignmentPerceptionRadius: 50,
    cohesionPerceptionRadius: 70,
    separationWeight: 2,
    alignmentWeight: 1,
    cohesionWeight: 1.5,
    isTailVisible: true,
    sigthLimit: -0.9
  };

  constructor(width: number, height: number, depth: number, countBoid: number) {
    const w = width / 3;
    const h = height / 3;
    const d = depth / 3;
    for (let i = 0; i < countBoid; i++) {
      const boid = new Boid(this.traits);
      boid.position = createVector(w + random(w), h + random(h), d + random(d));
      this.boids.push(boid);
    }
  }

  public updateForces(obstacles: Obstacle[] = []) {
    const count = this.boids.length;
    for (let i = 0; i < count; i++) {
      const boid = this.boids[i];
      for (let j = i + 1; j < count; j++) {
        const other = this.boids[j];
        this.updateForcesWithOtherBoid(boid, other);
      }
      this.updateForcesWithObstacles(boid, obstacles);
    }
  }

  private updateForcesWithOtherBoid(boid: Boid, other: Boid): void {
    const distance = boid.position.dist(other.position);
    const boidSeesOther = this.seesBoid(boid, other);
    const otherSeesBoid = this.seesBoid(other, boid);

    // Alignment
    if (distance < this.traits.alignmentPerceptionRadius) {
      if (boidSeesOther) {
        boid.alignmentVector.add(other.velocity);
        boid.alignmentCount++;
      }

      if (otherSeesBoid) {
        other.alignmentVector.add(boid.velocity);
        other.alignmentCount++;
      }
    }

    // Separation
    if (distance < this.traits.separationPerceptionRadius) {
      const diff = Vector.sub(boid.position, other.position);
      diff.div(distance * distance);

      if (boidSeesOther) {
        boid.separationVector.add(diff);
        boid.separationCount++;
      }

      if (otherSeesBoid) {
        other.separationVector.sub(diff);
        other.separationCount++;
      }
    }

    // Cohesion
    if (distance < this.traits.cohesionPerceptionRadius) {
      if (boidSeesOther) {
        boid.cohesionVector.add(other.position);
        boid.cohesionCount++;
      }

      if (otherSeesBoid) {
        other.cohesionVector.add(boid.position);
        other.cohesionCount++;
      }
    }
  }

  private updateForcesWithObstacles(boid: Boid, obstacles: Obstacle[]): void {
    for (const obstacle of obstacles) {
      const diff = obstacle.getNormalPosition(boid.position);
      const distance = diff.mag();
      if (distance < this.traits.separationPerceptionRadius) {
        diff.div(distance * distance);
        boid.separationVector.add(diff);
        boid.separationCount++;
      }
    }
  }

  private seesBoid(boid: Boid, other: Boid) {
    const direction = other.position.copy().add(boid.position.copy().mult(-1));
    return dotNormalized(direction, boid.velocity) > this.traits.sigthLimit;
  }
}

function dotNormalized(v1: Vector, v2: Vector): number {
  const magnitudes = v1.mag() * v2.mag();
  if (magnitudes === 0) {
    return 0;
  }

  return v1.dot(v2) / magnitudes;
}
