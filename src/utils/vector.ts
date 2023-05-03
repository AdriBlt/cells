import * as p5 from "p5";

export class Vector extends p5.Vector {}

export function createVector(x?: number, y?: number, z?: number): Vector {
  return p5.prototype.createVector(x, y, z);
}

export function createVectorRandom3D(): Vector {
  return p5.Vector.random3D();
}

export function createVectorRandom2D(): Vector {
  return p5.Vector.random2D();
}
