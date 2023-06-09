import { removeRandomElement } from "../../../utils/list-helpers";
import { randomInt } from "../../../utils/random";
import { BaseMazeGenerationAlgorithm, CellNeighbor } from "../base-maze-generation-algorithm";
import { Cell, GenerationStatus, Status } from "../model";

export class DepthExplorationAlgorithm extends BaseMazeGenerationAlgorithm {
    private cellsToExplore: Cell[] = [];

    public initialize(): void {
        this.resetPaths();
        this.cellsToExplore = [];
        this.exploreCell(this.paths[randomInt(this.height)][randomInt(this.width)].cell);
        this.status = GenerationStatus.Ongoing;
    }

    public computeOneStep(): boolean {
        if (this.cellsToExplore.length === 0) {
            this.status = GenerationStatus.Completed;
            return true;
        }

        const lastCell = this.cellsToExplore[this.cellsToExplore.length - 1];
        const nonExploredNeighbors: CellNeighbor[] = []
        this.getCellNeighbors(lastCell)
            .forEach((neighbor: CellNeighbor) => {
                if (neighbor.cell.status !== Status.Empty) {
                    nonExploredNeighbors.push(neighbor);
                } else if (neighbor.path.status === Status.Focused) {
                    neighbor.path.status = Status.Filled;
                    this.onUpdatePath(neighbor.path);
                }
            });

        if (nonExploredNeighbors.length === 0) {
            this.cellsToExplore.pop();
            return false;
        }

        const exploredNeighbor: CellNeighbor = removeRandomElement(nonExploredNeighbors);

        nonExploredNeighbors.forEach(neighbor => {
            if (neighbor.path.status !== Status.Focused) {
                neighbor.path.status = Status.Focused;
                this.onUpdatePath(neighbor.path);
            }
        });

        exploredNeighbor.path.status = Status.Empty;
        this.onUpdatePath(exploredNeighbor.path);

        this.exploreCell(exploredNeighbor.cell);

        return true;
    }

    private exploreCell(cell: Cell): void {
        cell.status = Status.Empty;
        this.onUpdateCell(cell);
        this.cellsToExplore.push(cell);
    }
}
