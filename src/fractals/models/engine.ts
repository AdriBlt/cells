import { Complex } from "../../numbers/Complex";
import { color, Color } from "../../utils/color";
import { createDefaultMatrix } from "../../utils/list-helpers";
import { Fractal } from "./fractal";
import { Directions, FractalResult } from "./models";

export class FractalEngine {
    private min: Complex;
    private max: Complex;

    private results: FractalResult[][][] = [];

    constructor(
        private width: number,
        private height: number,
        private fractal: Fractal,
        private antiAliasingSize: number = 2,
    ) {
        this.resetFractal();
    }

    public setFractal(fractal: Fractal): void {
        this.fractal = fractal;
        this.resetFractal();
    }

    public setAntiAliasing(aaSize: number): void {
        this.antiAliasingSize = aaSize;
    }

    public resetFractal() {
        this.results = createDefaultMatrix(this.width, this.height, () => ([]));
        this.min = this.fractal.defaultSize.min;
        this.max = this.fractal.defaultSize.max;
        this.checkScales();
    }

    public move(dir: Directions): void {
        let dirXW = 0;
        let dirYH = 0;
        switch (dir) {
            case Directions.DOWN:
                dirYH = 1;
                break;
            case Directions.LEFT:
                dirXW = -1;
                break;
            case Directions.RIGHT:
                dirXW = 1;
                break;
            case Directions.UP:
                dirYH = -1;
                break;
            default:
                break;
        }

        const deltaW = Math.floor(this.width / 3);
        const deltaH = Math.floor(this.height / 3);

        const deltaX = this.deltaX;
        const deltaY = this.deltaY;

        const moveX = dirXW * deltaX * deltaW;
        const moveY = dirYH * deltaY * deltaH;

        this.min = this.min.add(new Complex(moveX, moveY));
        this.max = this.max.add(new Complex(moveX, moveY));

        if (dir === Directions.DOWN) {
            for (let i = 0; i < this.height - deltaH; i++) {
                this.results[i] = this.results[i + deltaH];
            }
            this.computeFractal({ iMin: this.height - deltaH });
        } else if (dir === Directions.UP) {
            for (let i = this.height - 1; i >= deltaH; i--) {
                this.results[i] = this.results[i - deltaH];
            }
            this.computeFractal({ iMax: deltaH });
        } else if (dir === Directions.RIGHT) {
            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width - deltaW; j++) {
                    this.results[i][j] = this.results[i][j + deltaW];
                }
            }
            this.computeFractal({ jMin: this.width - deltaW });
        } else if (dir === Directions.LEFT) {
            for (let i = 0; i < this.height; i++) {
                for (let j = this.width - 1; j >= deltaW; j--) {
                    this.results[i][j] = this.results[i][j - deltaW];
                }
            }
            this.computeFractal({ jMax: deltaW });
        }
    }

    public zoomOnPoint(i: number, j: number, isZoomIn: boolean): void {
        const z0 = this.getPointOnScreen(i, j);
        const w = this.max.x - this.min.x;
        const h = this.max.y - this.min.y;
        const coef = 1.3;
        const deltaW = (isZoomIn ? w / coef : w * coef) / 2;
        const deltaH = (isZoomIn ? h / coef : h * coef) / 2;
        this.min = new Complex(z0.x - deltaW, z0.y - deltaH);
        this.max = new Complex(z0.x + deltaW, z0.y + deltaH);

        this.checkScales();
        // TODO optimize, save 1/4th of computation?
        this.computeFractal();
    }

    public zoomOnRectangle(rectangle: { iMin: number; iMax: number; jMin: number; jMax: number; }): void {
        const min = this.getPointOnScreen(rectangle.iMin, rectangle.jMin);
        const max = this.getPointOnScreen(rectangle.iMax, rectangle.jMax);
        this.min = min;
        this.max = max;
        this.checkScales();
        this.computeFractal();
    }

    public computeFractal(options?: {
        iMin?: number,
        iMax?: number,
        jMin?: number,
        jMax?: number,
    }): void {
        const iMin = (!options || options.iMin === undefined) ? 0 : options.iMin;
        const iMax = (!options || options.iMax === undefined) ? this.height : options.iMax;
        const jMin = (!options || options.jMin === undefined) ? 0 : options.jMin;
        const jMax = (!options || options.jMax === undefined) ? this.width : options.jMax;

        for (let i = iMin; i < iMax; i++) {
            for (let j = jMin; j < jMax; j++) {
                this.results[i][j] = this.computeResult(i, j);
            }
        }
    }

    public getColor(i: number, j: number): Color {
        return this.getMeanColorFromAA(this.results[i][j]);
    }

    public toggleColorMode() {
      if (this.fractal.toggleColorMode) {
          this.fractal.toggleColorMode();
      }
    }

    private getPointOnScreen(i: number, j: number): Complex {
        return new Complex(
            this.min.x + j * this.deltaX,
            this.min.y + i * this.deltaY,
        );
    }

    private get deltaX(): number { return (this.max.x - this.min.x) / this.width; }
    private get deltaY(): number { return (this.max.y - this.min.y) / this.height; }

    private computeResult(i: number, j: number): FractalResult[] {
        const z0 = this.getPointOnScreen(i, j);

        const result = [];
        for (let jj = 0; jj < this.antiAliasingSize; jj++) {
            const x = z0.x + (jj * this.deltaX) / this.antiAliasingSize;
            for (let ii = 0; ii < this.antiAliasingSize; ii++) {
                const y = z0.y + (ii * this.deltaY) / this.antiAliasingSize;
                result.push(this.fractal.getConvergenceResult(new Complex(x, y)));
            }
        }

        return result;
    }

    private checkScales(): void {
        const sizeX = this.max.x - this.min.x;
        const sizeY = this.max.y - this.min.y;
        const ratioWidth = this.width / sizeX;
        const ratioHeight = this.height / sizeY;

        if (ratioWidth > ratioHeight) {
            const newDeltaX = this.width / ratioHeight;
            const marge = (newDeltaX - sizeX) / 2;
            this.min = this.min.addRe(-marge);
            this.max = this.max.addRe(marge);
        }

        if (ratioWidth < ratioHeight) {
            const newDeltaY = this.height / ratioWidth;
            const marge = (newDeltaY - sizeY) / 2;
            this.min = this.min.addIm(-marge);
            this.max = this.max.addIm(marge);
        }
    }

    private getMeanColorFromAA(resultsAA: FractalResult[]): Color {
        let r = 0;
        let g = 0;
        let b = 0;
        for (const result of resultsAA) {
            const c = this.fractal.getResultColor(result);
            r += c.r;
            g += c.g;
            b += c.b;
        }
        const sizeAA = resultsAA.length;
        if (sizeAA > 1) {
            r /= sizeAA;
            g /= sizeAA;
            b /= sizeAA;
        }
        return color(r, g, b);
    }
}
