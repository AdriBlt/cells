import { removeRandomElement } from "../../../utils/list-helpers";
import { randomInt } from "../../../utils/random";
import { BaseMazeGenerationAlgorithm } from "../base-maze-generation-algorithm";
import { Cell, GenerationStatus, MazePath, Status } from "../model";

export class RandomTraversalAlgorithm extends BaseMazeGenerationAlgorithm {
    private pathsToExplore: MazePath[] = [];

    public initialize(): void {
        this.resetPaths();
        this.pathsToExplore = [];
        this.exploreCell(this.paths[randomInt(this.height)][randomInt(this.width)].cell);
        this.status = GenerationStatus.Ongoing;
    }

    public computeOneStep(): boolean {
        if (this.pathsToExplore.length === 0) {
            this.status = GenerationStatus.Completed;
            return true;
        }

        const exploredPath: MazePath = removeRandomElement(this.pathsToExplore);

        const cell1 = exploredPath.cell;
        const cell2 = this.getDestinationCell(exploredPath);

        if (cell1.status === Status.Empty && cell2.status === Status.Empty) {
            exploredPath.status = Status.Filled;
            this.onUpdatePath(exploredPath);
            return false;
        }

        exploredPath.status = Status.Empty;
        this.onUpdatePath(exploredPath);
        this.exploreCell(cell1);
        this.exploreCell(cell2);
        return true;
    }

    private exploreCell(cell: Cell): void {
        if (cell.status === Status.Empty) {
            return;
        }

        cell.status = Status.Empty;
        this.onUpdateCell(cell);

        this.getCellNeighbors(cell).forEach(neighbor => {
            if (neighbor.cell.status !== Status.Empty) {
                this.addPathToExplore(neighbor.path)
            }
        });
    }

    private addPathToExplore = (path: MazePath): void => {
        if (path.status === Status.Filled) {
            this.pathsToExplore.push(path);
            path.status = Status.Focused;
            this.onUpdatePath(path);
        }
    }
}