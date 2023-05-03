import { LinkedList } from "../../../utils/linked-list";
import { random } from "../../../utils/random";
import {
  createVector,
  createVectorRandom3D,
  Vector,
} from "../../../utils/vector";
import { FlockTraits } from "./flock-traits";

export class Boid {
  public position: Vector;
  public velocity: Vector;
  public acceleration: Vector;

  public cohesionVector: Vector = createVector();
  public alignmentVector: Vector = createVector();
  public separationVector: Vector = createVector();

  public cohesionCount: number = 0;
  public alignmentCount: number = 0;
  public separationCount: number = 0;

  public oldPositions = new LinkedList<Vector>();

  private readonly traits: FlockTraits;

  constructor(traits: FlockTraits) {
    this.traits = traits;
    this.position = createVector();
    this.velocity = createVectorRandom3D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
  }

  public update(savePosition: boolean = false): void {
    this.updateForces();
    this.updateMomentum(savePosition);
    this.resetForces();
  }

  private updateForces() {
    // Alignment
    if (this.alignmentCount > 0) {
      this.alignmentVector.div(this.alignmentCount);
      this.alignmentVector.setMag(this.traits.maxSpeed);
      this.alignmentVector.sub(this.velocity);
      this.alignmentVector.limit(this.traits.maxForce);
    }
    // Separation
    if (this.separationCount > 0) {
      this.separationVector.div(this.separationCount);
      this.separationVector.setMag(this.traits.maxSpeed);
      this.separationVector.sub(this.velocity);
      this.separationVector.limit(this.traits.maxForce);
    }
    // Cohesion
    if (this.cohesionCount > 0) {
      this.cohesionVector.div(this.cohesionCount);
      this.cohesionVector.sub(this.position);
      this.cohesionVector.setMag(this.traits.maxSpeed);
      this.cohesionVector.sub(this.velocity);
      this.cohesionVector.limit(this.traits.maxForce);
    }

    this.cohesionVector.mult(this.traits.cohesionWeight);
    this.alignmentVector.mult(this.traits.alignmentWeight);
    this.separationVector.mult(this.traits.separationWeight);

    this.acceleration.add(this.cohesionVector);
    this.acceleration.add(this.alignmentVector);
    this.acceleration.add(this.separationVector);
  }

  private updateMomentum(savePosition: boolean = false) {
    if (savePosition) {
      this.oldPositions.insertTail(this.position.copy());
      if (this.oldPositions.count > 50) {
        this.oldPositions.popHead();
      }
    }

    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.traits.maxSpeed);
    this.acceleration.mult(0);
  }

  private resetForces() {
    this.cohesionVector.mult(0);
    this.alignmentVector.mult(0);
    this.separationVector.mult(0);
    this.cohesionCount = 0;
    this.alignmentCount = 0;
    this.separationCount = 0;
  }
}
