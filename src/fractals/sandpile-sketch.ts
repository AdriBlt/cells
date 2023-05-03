import * as p5 from "p5";

import { PlayableSketch } from "../services/playable-sketch";
import { color, Color, COLORS, setBackground, setFillColor, setStrokeColor } from "../utils/color";
import { getNeighbourCells } from "../utils/grid-helper";
import { createDefaultMatrix } from "../utils/list-helpers";
import { isOutOfBounds } from "../utils/numbers";
import { Point } from "../utils/points";
import { drawHexagon, drawSquare } from "../utils/shape-drawer-helpers";

enum GenerationState {
    BeforeGeneration,
    Generated,
    AfterGeneration,
}

const W = 600;
const H = 600;
const CELL_SIZE = 3;
const MATRIX_WIDTH = 1 + Math.floor((W / CELL_SIZE - 1) / 2);
const MATRIX_HEIGHT = 1 + Math.floor((H / CELL_SIZE - 1) / 2);
const CANVAS_WIDTH = CELL_SIZE * (2 * MATRIX_WIDTH + 1);
const CANVAS_HEIGHT = CELL_SIZE * (2 * MATRIX_HEIGHT + 1);
const MARGIN_LEFT = 0;
const MARGIN_TOP = 0;
const MIDDLE_X = MARGIN_LEFT + MATRIX_WIDTH * CELL_SIZE;
const MIDDLE_Y = MARGIN_TOP + MATRIX_HEIGHT * CELL_SIZE;

export interface SandpileSketchProps {
    isHexaGrid: boolean;
    nbStepsPerIteration: number;
}

export class SandpileSketch extends PlayableSketch {
    private cells: number[][];
    private nextCells: number[][];
    private generationState = GenerationState.BeforeGeneration;

    constructor(
        private props: SandpileSketchProps
    ) {
        super();
    }

    public setup(p: p5): void {
        this.p5js = p;
        this.p5js.createCanvas(W, H);
        this.resetGrid();
    }

    public resetGrid = (): void => {
        this.generationState = GenerationState.BeforeGeneration;
        this.cells = createDefaultMatrix(MATRIX_WIDTH, MATRIX_HEIGHT, () => 0);
        this.drawGrid();
    }

    public draw(): void {
        let shouldPause = false;
        for (let i = 0; i < this.props.nbStepsPerIteration; i++) {
            this.toppleSand();
            if (this.generationState === GenerationState.Generated) {
                shouldPause = true;
                break;
            }
        }

        this.drawGrid();

        if (shouldPause) {
            this.pause();
        }
    }

    public generate = (): void => {
        this.stop();
        while (this.generationState === GenerationState.BeforeGeneration && this.isPaused) {
            this.toppleSand();
        }

        this.drawGrid();
    }

    private drawGrid(): void {
        setBackground(this.p5js, COLORS.White);

        this.p5js.noStroke();
        this.drawPoint(0, 0, COLORS.Black);
        for (let i = 1; i < MATRIX_WIDTH; i++) {
            const hColor = this.getSandCountColor(this.cells[i][0]);
            this.drawPoint(i, 0, hColor);
            this.drawPoint(-i, 0, hColor);

            const vColor = this.getSandCountColor(this.cells[0][i]);
            this.drawPoint(0, i, vColor);
            this.drawPoint(0, -i, vColor);

            for (let j = 1; j < MATRIX_HEIGHT; j++) {
                const pixelColor = this.getSandCountColor(this.cells[i][j]);
                this.drawPoint(i, j, pixelColor);
                this.drawPoint(i, -j, pixelColor);
                this.drawPoint(-i, j, pixelColor);
                this.drawPoint(-i, -j, pixelColor);
            }
        }

        setStrokeColor(this.p5js, COLORS.Black);
        this.p5js.noFill();
        this.p5js.rect(MARGIN_LEFT, MARGIN_TOP, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    private toppleSand(): void {
        if (this.generationState === GenerationState.Generated) {
            this.generationState = GenerationState.AfterGeneration;
        }

        this.nextCells = createDefaultMatrix(MATRIX_WIDTH, MATRIX_HEIGHT, (i, j) => this.cells[i][j]);
        this.getNeighbourCells(0, 0).map(({ x, y }) =>
            this.updateNeighbourCell(x, y, true)
        );
        for (let i = 1; i < MATRIX_WIDTH; i++) {
            this.updateCell(i, 0, true);
            this.updateCell(0, i, true);

            for (let j = 1; j < MATRIX_HEIGHT; j++) {
                this.updateCell(i, j, false);
            }
        }

        this.cells = this.nextCells;
    }

    private updateCell = (i: number, j: number, isOnBorder: boolean): void => {
        if (this.cells[i][j] < this.cellsMaxValue) {
            return;
        }

        this.nextCells[i][j] -= this.cellsMaxValue;

        this.getNeighbourCells(i, j).map(({ x, y }) =>
            this.updateNeighbourCell(x, y, isOnBorder)
        );
    }

    private updateNeighbourCell = (i: number, j: number, isOnBorder: boolean): void => {
        if (!isOutOfBounds(i, 0, MATRIX_WIDTH)
            && !isOutOfBounds(j, 0, MATRIX_HEIGHT))
        {
            this.nextCells[i][j]++;
            if (!isOnBorder && (i === 0 || j === 0)) {
                this.nextCells[i][j]++;
            }
        } else {
            // This stops the algorithm when the circle hits the square
            // when isOnBorder=true, as we only compute one quarter, we go "out of bound" on the borders
            if (!isOnBorder && this.generationState === GenerationState.BeforeGeneration) {
                this.generationState = GenerationState.Generated;
            }
        }
    }

    private getNeighbourCells(i: number, j: number): Point[] {
        return this.props.isHexaGrid
            ? getNeighbourCells(i, j, true)
            : [
                { x: i, y: j - 1 },
                { x: i, y: j + 1 },
                { x: i - 1, y: j },
                { x: i + 1, y: j },
            ];
    }

    private drawPoint(i: number, j: number, pixelColor: Color): void {
        setFillColor(this.p5js, pixelColor);

        if (this.props.isHexaGrid) {
            drawHexagon(this.p5js, i, j, CELL_SIZE, MIDDLE_X, MIDDLE_Y);
        } else {
            drawSquare(this.p5js, i, j, CELL_SIZE, MIDDLE_X, MIDDLE_Y);
        }
    }

    private getSandCountColor(sandCount: number): Color {
        const max = this.cellsMaxValue + 1;
        const v = 255 * (max - sandCount) / max;
        return color(v, v, v);
        // switch (sandCount) {
        //     case 6: return COLORS.Purple;
        //     case 5: return COLORS.DarkGreen;
        //     case 4: return COLORS.Blue;
        //     case 3: return COLORS.LimeGreen;
        //     case 2: return COLORS.Red;
        //     case 1: return COLORS.Yellow;
        //     case 0:
        //     default: return COLORS.White;
        // }
    }

    private get cellsMaxValue(): number {
        return this.props.isHexaGrid ? 6 : 4;
    }
}
