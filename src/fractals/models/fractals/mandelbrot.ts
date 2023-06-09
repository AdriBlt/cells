import { Complex } from "../../../numbers/Complex";
import { Color, COLORS, lerpColor } from "../../../utils/color";
import { Fractal } from "../fractal";
import { ConvergenceStatus, FractalResult } from "../models";

export class MandelbrotFractal implements Fractal {
    public defaultSize: { min: Complex; max: Complex; } = {
        min: new Complex(-2.0, -1.0),
        max: new Complex(1.0, 0),
    };
    public maxIterations: number = 200;
    public maxSquareMod: number = 4;

    public getConvergenceResult(z0: Complex): FractalResult {
        let z = z0;
        for (let n = 0; n < this.maxIterations; n++) {
            const zz = this.getIterationComplex(z, z0);

            if (zz.getSquareModule() >= this.maxSquareMod) {
                return {
                    point: z,
                    iterations: n,
                    status: ConvergenceStatus.Diverged,
                };
            }

            if (z.isEqual(zz)) {
                return {
                    point: zz,
                    iterations: n,
                    status: ConvergenceStatus.Converged,
                };
            }

            z = zz;
        }

        return {
            point: z,
            iterations: this.maxIterations,
            status: ConvergenceStatus.Unknown,
        };
    }

    public getIterationComplex(z: Complex, z0: Complex): Complex {
        return z.getSquare().add(z0);
    }

    public getResultColor(result: FractalResult): Color {
        switch (result.status) {
            case ConvergenceStatus.Converged:
            case ConvergenceStatus.Unknown:
                return COLORS.Black;
            case ConvergenceStatus.Diverged:
            default:
        }

        const p = Math.log2(1 + result.iterations) / Math.log2(1 + this.maxIterations);
        return lerpColor(COLORS.DarkBlue, COLORS.White, p);
    }
}
