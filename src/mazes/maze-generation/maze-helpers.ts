import { DepthExplorationAlgorithm } from "./algorithms/depth-exploration-algorithm";
import { KruskalAlgorithm } from "./algorithms/kruskal-algorithm";
import { RandomTraversalAlgorithm } from "./algorithms/random-traversal-algorithm";
import { RandomizedPrimAlgorithm } from "./algorithms/randomized-prim-algorithm";
import { RecursiveSubdivisionAlgorithm } from "./algorithms/recursive-subdivision-algorithm";
import { WilsonAlgorithm } from "./algorithms/wilson-algorithm";
import { MazeAlgorithmType } from "./maze-generation-sketch";
import { Cell, MazeGenerationAlgorithm, MazePath } from "./model";

export function areCellsEqual(a: Cell, b: Cell): boolean {
    return a.row === b.row && a.column === b.column;
}

export function createMazeGenerationAlgorithm(
    type: MazeAlgorithmType,
    width: number,
    height: number,
    onUpdateCell: (cell: Cell) => void,
    onUpdatePath: (path: MazePath, updateDeadWalls?: boolean) => void,
): MazeGenerationAlgorithm {
    switch (type) {
        case MazeAlgorithmType.RecursiveSubdivision:
            return new RecursiveSubdivisionAlgorithm(
                width, height, onUpdateCell, onUpdatePath,
            );
        case MazeAlgorithmType.DepthExploration:
            return new DepthExplorationAlgorithm(
                width, height, onUpdateCell, onUpdatePath,
            );
        case MazeAlgorithmType.Kruskal:
            return new KruskalAlgorithm(
                width, height, onUpdateCell, onUpdatePath,
            );
        case MazeAlgorithmType.RandomTraversal:
            return new RandomTraversalAlgorithm(
                width, height, onUpdateCell, onUpdatePath,
            );
        case MazeAlgorithmType.RandomizedPrim:
            return new RandomizedPrimAlgorithm(
                width, height, onUpdateCell, onUpdatePath,
            );
        case MazeAlgorithmType.Wilson:
            return new WilsonAlgorithm(
                width, height, onUpdateCell, onUpdatePath,
            );
        default:
            throw new Error("Unknown type: " + type);
    }
}
