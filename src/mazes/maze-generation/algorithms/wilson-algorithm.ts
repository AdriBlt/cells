import { peekLast, peekRandomElement } from "../../../utils/list-helpers";
import { randomInt } from "../../../utils/random";
import { BaseMazeGenerationAlgorithm, CellNeighbor } from "../base-maze-generation-algorithm";
import { areCellsEqual } from "../maze-helpers";
import { Cell, GenerationStatus, MazePath, Status } from "../model";

export class WilsonAlgorithm extends BaseMazeGenerationAlgorithm {
    private cellsOnLine: Cell[] = [];
    private pathsOnLine: MazePath[] = [];

    public initialize(): void {
        this.resetPaths();
        this.cellsOnLine = [];
        this.pathsOnLine = [];

        const firstCell = this.paths[randomInt(this.height)][randomInt(this.width)].cell;
        firstCell.status = Status.Empty;
        this.onUpdateCell(firstCell);

        this.status = GenerationStatus.Ongoing;
    }

    public computeOneStep(): boolean {
        if (this.cellsOnLine.length === 0) {
            const seed = this.findSeedCell();

            // No more free cells: done
            if (!seed) {
                this.status = GenerationStatus.Completed;
                return true;
            }

            // Planting a new seed
            seed.status = Status.Focused;
            this.onUpdateCell(seed);
            this.cellsOnLine.push(seed);
            return true;
        }

        const tail = peekLast(this.cellsOnLine);
        const neighbors = this.getCellNeighbors(tail);

        // Removing the previous element
        if (this.cellsOnLine.length > 1) {
            const previousCell = this.cellsOnLine[this.cellsOnLine.length - 2];
            const index = neighbors.findIndex(n => areCellsEqual(n.cell, previousCell));
            if (index < 0) {
                this.status = GenerationStatus.Error;
                return true;
            }

            neighbors.splice(index, 1);
        }

        // Randomly picking the next element
        const selectedNeighbor = peekRandomElement(neighbors);

        switch (selectedNeighbor.cell.status) {
            case Status.Filled:
                // Line growing
                this.growLine(selectedNeighbor);
                return true;
            case Status.Focused:
                // Line cutting itself
                this.cutLine(selectedNeighbor.cell);
                return true;
            case Status.Empty:
                // Connecting line to the maze
                this.connectLine(selectedNeighbor.path);
                return true;
            default:
                this.status = GenerationStatus.Error;
                return true;
        }
    }

    private connectLine(lastPath: MazePath) {
        this.pathsOnLine.push(lastPath);

        this.pathsOnLine.forEach(path => {
            path.status = Status.Empty;
            this.onUpdatePath(path);
        })

        this.cellsOnLine.forEach(cell => {
            cell.status = Status.Empty;
            this.onUpdateCell(cell);
        })

        this.pathsOnLine = [];
        this.cellsOnLine = [];
    }

    private cutLine(cell: Cell): void {
        const index = this.cellsOnLine.findIndex(c => areCellsEqual(c, cell));
        if (index < 0) {
            this.status = GenerationStatus.Error;
            return;
        }

        while (this.cellsOnLine.length > 1) {
            const tail = peekLast(this.cellsOnLine);
            if (areCellsEqual(tail, cell)) {
                break;
            }

            const pathToRemove = this.pathsOnLine.pop()!;
            pathToRemove.status = Status.Filled;
            this.onUpdatePath(pathToRemove);

            const cellToRemove = this.cellsOnLine.pop()!;
            cellToRemove.status = Status.Filled;
            this.onUpdateCell(cellToRemove);
        }
    }

    private growLine({cell, path}: CellNeighbor): void {
        path.status = Status.Focused;
        this.onUpdatePath(path);
        this.pathsOnLine.push(path);

        cell.status = Status.Focused;
        this.onUpdateCell(cell);
        this.cellsOnLine.push(cell);
    }

    private findSeedCell(): Cell | null {
        const cells: Cell[] = [];
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.paths[i][j].cell.status !== Status.Empty) {
                    cells.push(this.paths[i][j].cell);
                }
            }
        }
        return cells.length === 0
            ? null
            : peekRandomElement(cells);
    }
}
