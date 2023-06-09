import * as p5 from "p5";

import { ProcessingSketch } from "../../services/processing.service";
import { Color, COLORS, setBackground, setFillColor } from "../../utils/color";
import { Point } from "../../utils/points";
import { createMazeGenerationAlgorithm } from "./maze-helpers";
import { Cell, Direction, GenerationStatus, MazeGenerationAlgorithm, MazePath, Status } from "./model";

export enum MazeAlgorithmType {
    RecursiveSubdivision = 'RecursiveSubdivision',
    DepthExploration = 'DepthExploration',
    Kruskal = 'Kruskal',
    RandomTraversal = 'RandomTraversal',
    RandomizedPrim = 'RandomizedPrim',
    Wilson = 'Wilson',
}

const NB_COLUMNS = 80;
const NB_ROWS = 50;
const CELL_SIDE = 5;

const WIDTH = CELL_SIDE * (2 * NB_COLUMNS + 1);
const HEIGHT = CELL_SIDE * (2 * NB_ROWS + 1);

export class MazeGenerationSketch implements ProcessingSketch {
    private p5js: p5;
    private algorithm: MazeGenerationAlgorithm;

    private isRunningGeneration = false;

    constructor(private selectedAlgorithmType: MazeAlgorithmType) {}

    public setup(p: p5): void {
        this.p5js = p;
        this.p5js.createCanvas(WIDTH, HEIGHT);
        setBackground(this.p5js, COLORS.Black);
        this.p5js.noLoop();

        this.algorithm = this.createAlgorithmGenerator();
        this.reset();
        this.startGeneration();
    }

    public reset = (): void => {
        setBackground(this.p5js, COLORS.Black);
        if (this.algorithm.isStartingEmpty) {
            this.p5js.noStroke();
            setFillColor(this.p5js, COLORS.White);
            this.p5js.rect(CELL_SIDE, CELL_SIDE, CELL_SIDE * (2 * NB_COLUMNS - 1), CELL_SIDE * (2 * NB_ROWS - 1));
        }

        this.algorithm.initialize();
    }

    public togglePlayPause = (): void => {
        if (this.isRunningGeneration) {
            this.stopGeneration();
        } else {
            this.startGeneration();
        }
    }

    public playOneStep = (): void => {
        if (this.isRunningGeneration) {
            this.stopGeneration();
        }

        this.draw();
    }

    public skipGeneration = (): void => {
        this.stopGeneration();

        if (this.algorithm.getGenerationStatus() === GenerationStatus.Uninitialized) {
            this.algorithm.initialize();
        }

        while (this.algorithm.getGenerationStatus() === GenerationStatus.Ongoing) {
            this.algorithm.computeOneGenerationIteration();
        }
    }

    public setAlgorithmType = (type: MazeAlgorithmType): void => {
        if (this.selectedAlgorithmType === type) {
            return;
        }

        this.selectedAlgorithmType = type;
        this.algorithm = this.createAlgorithmGenerator();
        this.reset();
        this.startGeneration();
    }

    public draw(): void {
        switch (this.algorithm.getGenerationStatus()) {
            case GenerationStatus.Uninitialized:
                this.algorithm.initialize();
                return;
            case GenerationStatus.Ongoing:
                this.algorithm.computeOneGenerationIteration();
                return;
            case GenerationStatus.Completed:
                console.log("FINISHED");
                this.stopGeneration();
                return;
            case GenerationStatus.Error:
            default:
                console.log("ERROR");
                this.isRunningGeneration = false;
                return;
        }
    }

    private startGeneration(): void {
        this.isRunningGeneration = true;
        this.p5js.loop();
    }

    private stopGeneration(): void {
        this.isRunningGeneration = false;
        this.p5js.noLoop();
    }

    private onUpdateCell = (cell: Cell): void => {
        this.drawCellOrPath(this.getCellCoordinates(cell), this.getColor(cell.status));
    }

    private onUpdatePath = (path: MazePath, updateDeadWalls?: boolean): void => {
        const coordinates = this.getPathCoordinates(path);
        this.drawCellOrPath(coordinates, this.getColor(path.status));

        if (updateDeadWalls) {
            if (path.direction === Direction.Right) {
                this.drawCellOrPath({ x: coordinates.x, y: coordinates.y - 1 }, COLORS.Black);
                this.drawCellOrPath({ x: coordinates.x, y: coordinates.y + 1 }, COLORS.Black);
            } else if (path.direction === Direction.Bottom) {
                this.drawCellOrPath({ x: coordinates.x - 1, y: coordinates.y }, COLORS.Black);
                this.drawCellOrPath({ x: coordinates.x + 1, y: coordinates.y }, COLORS.Black);
            }
        }
    }

    private drawCellOrPath(point: Point, color: Color): void {
        this.p5js.noStroke();
        setFillColor(this.p5js, color);
        this.p5js.rect(CELL_SIDE * point.x, CELL_SIDE * point.y, CELL_SIDE, CELL_SIDE);
    }

    private getCellCoordinates(cell: Cell): Point {
        return {
            x: 1 + 2 * cell.column,
            y: 1 + 2 * cell.row,
        };
    }

    private getPathCoordinates(path: MazePath): Point {
        const { x, y } = this.getCellCoordinates(path.cell);
        return {
            x: x + (path.direction === Direction.Right ? 1 : 0),
            y: y + (path.direction === Direction.Bottom ? 1 : 0),
        };
    }

    private getColor(status: Status): Color {
        switch (status) {
            case Status.Empty:
                return COLORS.White;
            case Status.Focused:
                return COLORS.Red;
            case Status.Filled:
                return COLORS.Black;
            default:
                throw new Error("Unknown color");
        }
    }

    private createAlgorithmGenerator(): MazeGenerationAlgorithm {
        return createMazeGenerationAlgorithm(this.selectedAlgorithmType, NB_COLUMNS, NB_ROWS, this.onUpdateCell, this.onUpdatePath);
    }
}
