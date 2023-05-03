import { randomInt } from "../../../utils/random";
import { BaseMazeGenerationAlgorithm } from "../base-maze-generation-algorithm";
import { GenerationStatus, Status } from "../model";

interface DivisionCoordinates {
    iMin: number;
    iMax: number
    jMin: number;
    jMax: number;
}

export class RecursiveSubdivisionAlgorithm extends BaseMazeGenerationAlgorithm {
    public isStartingEmpty: boolean = true;
    private divisionsToExplore: DivisionCoordinates[] = [];

    public initialize(): void {
        this.resetPaths(Status.Empty, Status.Empty);
        this.divisionsToExplore = [{
            iMin: 0,
            iMax: this.height,
            jMin: 0,
            jMax: this.width,
        }];
        this.status = GenerationStatus.Ongoing;
    }

    public computeOneStep(): boolean {
        if (this.divisionsToExplore.length === 0) {
            this.status = GenerationStatus.Completed;
            return true;
        }

        const { iMin, iMax, jMin, jMax } = this.divisionsToExplore.pop()!;

        // One cell/column/row only, nothing to do
        if (iMax - iMin === 1 || jMax - jMin === 1) {
            return false;
        }

        const iCut = computeCut(iMin, iMax);
        const jCut = computeCut(jMin, jMax);
        // A C
        // B D
        this.divisionsToExplore.push({ iMin: iCut, iMax, jMin: jCut, jMax }); // D
        this.divisionsToExplore.push({ iMin, iMax: iCut, jMin: jCut, jMax }); // C
        this.divisionsToExplore.push({ iMin: iCut, iMax, jMin, jMax: jCut }); // B
        this.divisionsToExplore.push({ iMin, iMax: iCut, jMin, jMax: jCut }); // A

        // 3 of the 4 separation (between A/C, B/D, A/B and C/D) will have a path
        // The last one will not.
        const openings: number[] = [
            randomInt(iMin, iCut), // i, between A and C
            randomInt(iCut, iMax), // i, between B and D
            randomInt(jMin, jCut), // j, between A and B
            randomInt(jCut, jMax), // j, between C and D
        ];
        const closedOpeningIndex = randomInt(0, 4);
        openings[closedOpeningIndex] = -1;

        // Updating the paths between the sections
        for (let i = iMin; i < iMax; i++) {
            const path = this.paths[i][jCut - 1].right;
            if (path) {
                path.status = (i === openings[0] || i === openings[1])
                    ? Status.Empty
                    : Status.Filled;
                this.onUpdatePath(path, true);
            }
        }

        for (let j = jMin; j < jMax; j++) {
            const path = this.paths[iCut - 1][j].bottom;
            if (path) {
                path.status =  (j === openings[2] || j === openings[3])
                    ? Status.Empty
                    : Status.Filled;
                this.onUpdatePath(path, true);
            }
        }

        return true;
    }
}

function computeCut(min: number, max: number): number {
    // TODO: Gaussian law
    return randomInt(min + 1, max);
}