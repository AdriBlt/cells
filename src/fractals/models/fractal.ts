import { Complex } from "../../numbers/Complex";
import { Color } from "../../utils/color";
import { FractalResult } from "./models";

export interface Fractal {
  maxIterations: number;
  maxSquareMod: number;
  defaultSize: { min: Complex; max: Complex };
  getIterationComplex(z: Complex, z0: Complex): Complex | null;
  getConvergenceResult(z0: Complex): FractalResult;
  getResultColor(result: FractalResult): Color;
  toggleColorMode?(): void;
}
