import { createDefaultMatrix, removeRandomElement } from "../../../utils/list-helpers";
import { BaseMazeGenerationAlgorithm } from "../base-maze-generation-algorithm";
import { Cell, GenerationStatus, MazePath, Status } from "../model";

export class KruskalAlgorithm extends BaseMazeGenerationAlgorithm {
    private cellsIndex: number[][] = [];
    private pathsToExplore: MazePath[] = [];
    private lastExploredPath: MazePath | null = null;

    public initialize(): void {
        this.resetPaths();
        this.cellsIndex = createDefaultMatrix(
            this.width,
            this.height,
            (i, j) => this.width *  i + j,
        );
        this.pathsToExplore = [];
        this.paths.forEach(line => line.forEach(cell => {
            if (cell.right) {
                this.pathsToExplore.push(cell.right);
            }
            if (cell.bottom) {
                this.pathsToExplore.push(cell.bottom);
            }
        }));
        this.lastExploredPath = null;
        this.status = GenerationStatus.Ongoing;
    }

    public computeOneStep(): boolean {
        if (this.lastExploredPath) {
            this.lastExploredPath.status = Status.Empty;
            this.onUpdatePath(this.lastExploredPath);
            this.lastExploredPath = null;
        }

        if (this.pathsToExplore.length === 0) {
            this.status = GenerationStatus.Completed;
            return true;
        }

        const exploredPath: MazePath = removeRandomElement(this.pathsToExplore);
        const cell1 = exploredPath.cell;
        const cell2 = this.getDestinationCell(exploredPath);

        const index1 = this.getIndex(cell1);
        const index2 = this.getIndex(cell2);

        if (index1 === index2) {
            return false;
        }

        if (cell1.status !== Status.Empty) {
            cell1.status = Status.Empty;
            this.onUpdateCell(cell1);
        }

        if (cell2.status !== Status.Empty) {
            cell2.status = Status.Empty;
            this.onUpdateCell(cell2);
        }

        exploredPath.status = Status.Focused;
        this.onUpdatePath(exploredPath);
        this.lastExploredPath = exploredPath;

        // Merging the two sets of indexes
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.cellsIndex[i][j] === index2) {
                    this.cellsIndex[i][j] = index1;
                }
            }
        }

        return true;
    }

    private getIndex(cell: Cell): number {
        return this.cellsIndex[cell.row][cell.column];
    }
}
