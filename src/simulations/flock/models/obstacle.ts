import { createVector, Vector } from "../../../utils/vector";

export interface Obstacle {
  getNormalPosition(position: Vector): Vector;
}

export enum Axe {
  X,
  Y,
  Z
}

export class Wall implements Obstacle {
  constructor(private axe: Axe, private value: number) {}
  public getNormalPosition(position: Vector): Vector {
    switch (this.axe) {
      case Axe.X:
        return createVector(position.x - this.value, 0, 0);
      case Axe.Y:
        return createVector(0, position.y - this.value, 0);
      case Axe.Z:
        return createVector(0, 0, position.z - this.value);
      default:
        return createVector(0, 0, 0);
    }
  }
}
