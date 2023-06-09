import { Complex } from "../../../numbers/Complex";
import { Color, COLORS, lerpColor } from "../../../utils/color";
import { Fractal } from "../fractal";
import { ConvergenceStatus, FractalResult } from "../models";

export class BurningShip implements Fractal {
    public maxIterations: number = 1000;
    public maxSquareMod: number = 4;
    public defaultSize: { min: Complex; max: Complex; } = {
        min: new Complex(-2, -2),
        max: new Complex(2, 2),
    };

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
        const x = z.getRe();
        const y = z.getIm();
        const re = x + x - y * y + z0.getRe();
        const im = Math.abs(2 * x * y) + z0.getIm();
        return new Complex(re, im);
    }

    public getResultColor(result: FractalResult): Color {
        if (result.iterations === this.maxIterations) {
            return COLORS.Black;
        }

        const p = 1.0 * result.iterations / this.maxIterations;
        return lerpColor(COLORS.Red, COLORS.White, p);
    }
}
