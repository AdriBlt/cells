import { createDefaultMatrix } from "../../utils/list-helpers";
import { Cell, CellPaths, Direction, GenerationStatus, MazeGenerationAlgorithm, MazePath, Status } from "./model";

export type CellNeighbor = { cell: Cell, path: MazePath };

export abstract class BaseMazeGenerationAlgorithm implements MazeGenerationAlgorithm {
    protected status: GenerationStatus = GenerationStatus.Uninitialized;
    public paths: CellPaths[][] = [];

    constructor(
        protected width: number,
        protected height: number,
        protected onUpdateCell: (cell: Cell) => void,
        protected onUpdatePath: (path: MazePath, updateDeadWalls?: boolean) => void,
    ) {
        this.resetPaths();
    }

    public getGenerationStatus(): GenerationStatus {
        return this.status;
    }

    public abstract initialize(): void;
    public abstract computeOneStep(): boolean;

    public computeOneGenerationIteration(): void {
        while (true) {
            if (this.computeOneStep()) {
                return;
            }
        }
    }

    protected resetPaths(
        cellStatus: Status = Status.Filled,
        pathStatus: Status = Status.Filled,
    ): void {
        this.paths = createDefaultMatrix(
            this.width,
            this.height,
            (i, j) => {
                const cell: Cell = { row: i, column: j, status: cellStatus };
                const right = j === this.width - 1 ? null
                    : { cell, direction: Direction.Right, status: pathStatus };
                const bottom = i === this.height - 1 ? null
                    : { cell, direction: Direction.Bottom, status: pathStatus };
                return { cell, right, bottom }
            });
    }

    protected getDestinationCell(exploredPath: MazePath): Cell {
        switch (exploredPath.direction) {
            case Direction.Right:
                if (exploredPath.cell.column < this.width) {
                    return this.paths[exploredPath.cell.row][exploredPath.cell.column + 1].cell;
                }
                break;
            case Direction.Bottom:
                if (exploredPath.cell.row < this.height) {
                    return this.paths[exploredPath.cell.row + 1][exploredPath.cell.column].cell;
                }
                break;
            default:
        }

        throw new Error("BaseMazeGenerationAlgorithm.getDestinationCell");
    }

    protected getCellNeighbors({ row: i, column: j }: Cell): CellNeighbor[] {
        const neighbors: CellNeighbor[] = [];
        if (i > 0) {
            const cell = this.paths[i - 1][j].cell;
            const path = this.paths[i - 1][j].bottom!;
            neighbors.push({ cell, path });
        }
        if (j > 0) {
            const cell = this.paths[i][j - 1].cell;
            const path = this.paths[i][j - 1].right!;
            neighbors.push({ cell, path });
        }
        if (i < this.height - 1) {
            const cell = this.paths[i + 1][j].cell;
            const path = this.paths[i][j].bottom!;
            neighbors.push({ cell, path });
        }
        if (j < this.width - 1) {
            const cell = this.paths[i][j + 1].cell;
            const path = this.paths[i][j].right!;
            neighbors.push({ cell, path });
        }
        return neighbors;
    }
}
