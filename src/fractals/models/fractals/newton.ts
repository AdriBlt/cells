import { Complex } from "../../../numbers/Complex";
import { Polynom } from "../../../numbers/Polynom";
import { Color, COLORS, lerpColor } from "../../../utils/color";
import { ColorSet } from "../color-set";
import { Fractal } from "../fractal";
import { ConvergenceStatus, FractalResult } from "../models";

enum ColorMode {
    Bassin,
    Iterations,
}

export class Newton implements Fractal {
    public defaultSize: { min: Complex; max: Complex; } = {
        min: new Complex(-2, -1.5),
        max: new Complex(2, 1.5),
    };
    public maxIterations: number = 500;
    public maxSquareMod: number = 0;

    private colorMode: ColorMode = ColorMode.Bassin;
    private maxIterColors = ColorSet.getDifferentColors(this.maxIterations + 1);

    private bassins: Map<Complex, Color>;
    private polynom: Polynom;
    private derive: Polynom;

    constructor(p: Polynom) {
        this.setPolynom(p);
        // this.setPolynom(new Polynom(new Complex(1), new Complex(0), new Complex(-2), new Complex(2)));
    }

    public setPolynom(p: Polynom): void {
        if (p == null) {
            throw new Error("Polynome null.");
        }
        this.bassins = new Map<Complex, Color>();
        this.polynom = p;
        this.derive = p.derive();

        const roots = this.polynom.getRoots();
        if (roots == null) {
            throw new Error("Polynome de degre trop grand.");
        }

        const distinctRoots: Complex[] = [];
        roots.forEach((c) => {
            if (distinctRoots.indexOf(c) < 0) {
                distinctRoots.push(c);
            }
        });

        const colors = ColorSet.getDifferentColors(distinctRoots.length);
        let k = 0;
        for (const c of distinctRoots) {
            this.bassins.set(c, colors[k++]);
        }
    }

    public getConvergenceResult(z0: Complex): FractalResult {
        let z = z0;
        for (let n = 0; n < this.maxIterations; n++) {
            const zz = this.getIterationComplex(z);

            if (zz === null) {
                return {
                    point: z,
                    iterations: n,
                    status: ConvergenceStatus.Diverged,
                };
            }

            if (z.isEqual(zz) || this.bassins.has(zz)) {
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

    public getIterationComplex(z: Complex): Complex | null {
        const value = this.polynom.getValue(z);
        const deriveVal = this.derive.getValue(z);

        if (value.isNul()) {
            return z;
        }

        if (deriveVal.isNul()) {
            return null;
        }

        return z.minus(value.divide(deriveVal));
    }

    public getResultColor(result: FractalResult): Color {
        if (this.colorMode === ColorMode.Iterations) {
            return this.maxIterColors[result.iterations];
        }

        if (result.status === ConvergenceStatus.Diverged) {
            return COLORS.White;
        }

        let minColor = COLORS.White;
        let minDistSq = -1;
        this.bassins.forEach((color, root) => {
            const distSq = root.getSquareDistanceFrom(result.point);
            if (minDistSq < 0 || distSq < minDistSq) {
                minDistSq = distSq;
                minColor = color;
            }
        });

        // const ratio = result.iterations / this.maxIterations
        // const p = Math.sqrt(10 * ratio);
        const nbColors = 5;
        const p = (result.iterations % nbColors) / nbColors;
        return lerpColor(minColor, COLORS.White, p);
    }

    public toggleColorMode(): void {
        if (this.colorMode === ColorMode.Iterations) {
            this.colorMode = ColorMode.Bassin;
        } else {
            this.colorMode = ColorMode.Iterations;
        }
    }
}
