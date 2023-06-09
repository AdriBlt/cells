import { Complex } from "../../numbers/Complex";

export enum Directions {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

export enum ConvergenceStatus {
    Unknown,
    Converged,
    Diverged,
}

export interface FractalResult {
  point: Complex;
  iterations: number;
  status: ConvergenceStatus;
}
