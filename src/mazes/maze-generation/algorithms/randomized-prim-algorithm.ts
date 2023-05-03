
import { Heap } from "src/utils/heap";

import { randomInt } from "../../../utils/random";
import { BaseMazeGenerationAlgorithm } from "../base-maze-generation-algorithm";
import { Cell, GenerationStatus, MazePath, Status } from "../model";

type WeightedMazePath = MazePath & { weight: number };

export class RandomizedPrimAlgorithm extends BaseMazeGenerationAlgorithm {
    private pathsToExplore: Heap<WeightedMazePath> = new Heap(value => value.weight);

    public initialize(): void {
        this.resetPaths();
        this.pathsToExplore.clear();
        this.exploreCell(this.paths[randomInt(this.height)][randomInt(this.width)].cell);
        this.status = GenerationStatus.Ongoing;
    }

    public computeOneStep(): boolean {
        if (this.pathsToExplore.length === 0) {
            this.status = GenerationStatus.Completed;
            return true;
        }

        const exploredPath: MazePath = this.pathsToExplore.pop()!;

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
        if (path && path.status === Status.Filled) {
            this.pathsToExplore.push({ ...path, weight: randomInt(100)});
            path.status = Status.Focused;
            this.onUpdatePath(path);
        }
    }
}
