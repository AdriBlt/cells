import * as React from "react";

import { Asset, getAssetPath } from "../../assets";
import { readBlackAndWhiteImage } from "../../utils/image-helper";
import { createVector } from "../../utils/vector";
import { MazeGame, MazeGameData } from "./maze-game";

const MAP_RATIO = 4;

export function AlixMazeGame() {
    return <MazeGame fetchMazeData={fetchMazeData} />;
}

function fetchMazeData(): Promise<MazeGameData> {
    return readBlackAndWhiteImage(getAssetPath(Asset.MazeImage))
        .then((matrix: boolean[][]) => {
            return {
                matrix: getReducedMatrix(matrix),
                playerInitialPosition: createVector(
                    matrix.length / MAP_RATIO / 2,
                    matrix.length / MAP_RATIO / 2,
                ),
                playerInitialDirection: createVector(0, -1),
                mapCellSide: 2,
            };
        });
}

function getReducedMatrix(matrix: boolean[][]): boolean[][] {
    const reducedHeight = Math.ceil(matrix.length / MAP_RATIO);
    const reducedWidth = Math.ceil(matrix[0].length / MAP_RATIO);

    const deltaWidthHeight = reducedWidth - reducedHeight;
    const startingColPosition = Math.floor(deltaWidthHeight / 2)

    const reducedMatrix: boolean[][] = [];
    for (let i = 0; i < reducedHeight; i++) {
        const line: boolean[] = [];
        for (let j = 0; j < reducedHeight; j++) {
            line.push(getReducedValue(matrix, i, startingColPosition + j));
        }
        reducedMatrix.push(line);
    }
    return reducedMatrix;
}

function getReducedValue(matrix: boolean[][], i: number, j: number): boolean {
    const iStart = i * MAP_RATIO;
    const iEnd = Math.min(iStart + MAP_RATIO, matrix.length);
    const jStart = j * MAP_RATIO;
    const jEnd = Math.min(jStart + MAP_RATIO, matrix[0].length);
    for (let ii = iStart; ii < iEnd; ii++) {
        for (let jj = jStart; jj < jEnd; jj++) {
            if (matrix[ii][jj]) {
                return true;
            }
        }
    }
    return false;
}
