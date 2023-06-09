import * as React from "react";

import { createVector } from "../../utils/vector";
import { MazeAlgorithmType } from "../maze-generation/maze-generation-sketch";
import { createMazeGenerationAlgorithm } from "../maze-generation/maze-helpers";
import { CellPaths, GenerationStatus, MazeGenerationAlgorithm, Status } from "../maze-generation/model";
import { MazeGame, MazeGameData } from "./maze-game";

const MAP_RATIO = 1;
const NB_MAZE_ROW = 20;
const NB_MAZE_COL = 20;
const NB_MATRIX_ROW = 2 * NB_MAZE_ROW + 1;
const NB_MATRIX_COL = 2 * NB_MAZE_COL + 1;
const MATRIX_HEIGHT = MAP_RATIO * NB_MATRIX_ROW;
const MATRIX_WIDTH = MAP_RATIO * NB_MATRIX_COL;

export function GeneratedMazeGame() {
    return <MazeGame fetchMazeData={fetchMazeData} />;
}

function fetchMazeData(): Promise<MazeGameData> {
    return generateMaze(MazeAlgorithmType.DepthExploration)
        .then(cellPaths => {
            const position = 1.1 * MAP_RATIO;
            const direction = Math.SQRT1_2;
            return {
                matrix: generateMazeMatrix(cellPaths),
                playerInitialPosition: createVector(position, position),
                playerInitialDirection: createVector(direction, direction),
            };
        });
}

function generateMaze(mazeType: MazeAlgorithmType): Promise<CellPaths[][]> {
    return new Promise((resolve) => {
        // tslint:disable-next-line:no-empty
        const algorithm: MazeGenerationAlgorithm = createMazeGenerationAlgorithm(mazeType, NB_MAZE_COL, NB_MAZE_ROW, () => {}, () => {});
        algorithm.initialize();
        while (algorithm.getGenerationStatus() === GenerationStatus.Ongoing) {
            algorithm.computeOneGenerationIteration();
        }

        resolve(algorithm.paths);
    });
}

function generateMazeMatrix(paths: CellPaths[][]): boolean[][] {
    const matrix: boolean[][] = [];
    for (let i = 0; i < MATRIX_HEIGHT; i++) {
        const line: boolean[] = [];
        for (let j = 0; j < MATRIX_WIDTH; j++) {
            line.push(getMazeMatrixCellValue(paths, i, j));
        }
        matrix.push(line);
    }
    return matrix;
}

function getMazeMatrixCellValue(paths: CellPaths[][], i: number, j: number): boolean {
    const ii = Math.floor(i / MAP_RATIO) - 1;
    const jj = Math.floor(j / MAP_RATIO) - 1;

    if (ii < 0 || ii === NB_MATRIX_ROW - 2 || jj < 0 || jj === NB_MATRIX_COL - 2) {
        // Outside walls
        return true;
    }

    const oddRow = ii % 2 === 1;
    const oddColumn = jj % 2 === 1;

    const iCell = Math.floor(ii / 2);
    const jCell = Math.floor(jj / 2);

    const cellPaths = paths[iCell][jCell];

    if (oddRow && oddColumn) {
        // dead column
        return true;
    } else if (oddRow) {
        // bottom path
        return cellPaths.bottom && cellPaths.bottom.status === Status.Filled || false;
    } else if (oddColumn) {
        // right path
        return cellPaths.right && cellPaths.right.status === Status.Filled || false;
    } else {
        // Walkable cell
        return cellPaths.cell.status === Status.Filled;
    }
}