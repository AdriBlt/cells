import { Point } from "./points";

// If isHexa, return all 6 direct neighbours
// If not, return all 8 neighbours (direct + corners)
export function getNeighbourCells(
    x: number,
    y: number,
    isHexa: boolean
): Point[] {
    const neighbours: Point[] = [];
    for (let dX = -1; dX <= 1; dX++) {
        for (let dY = -1; dY <= 1; dY++) {
            if (dX === 0 && dY === 0) {
                continue;
            }
            if (isHexa && dX !== 0 && dY === (x % 2 === 0 ? 1 : -1)) {
                continue;
            }

            neighbours.push({ x: x + dX, y: y + dY });
        }
    }

    return neighbours;
}

// Return cells in order: UP, then clockwise
// If isHexa, return all 6 direct neighbours
// If not, return all 4 direct neighbours
export function getDirectNeighboursInOrder(
    i: number,
    j: number,
    isHexa: boolean
): Array<{i: number; j: number}> {
    const neighbours = [
        { i: i - 1, j }, // NORTH
        { i, j: j + 1 }, // EAST
        { i: i + 1, j }, // SOUTH
        { i, j: j - 1 }, // WEST
    ];

    if (!isHexa) {
        return neighbours;
    }

    if (i % 2 === 0) {
        neighbours.splice(1, 0, { i: i - 1, j: j + 1 });
        neighbours.splice(5, 0, { i: i - 1, j: j - 1 });
    } else {
        neighbours.splice(2, 0, { i: i + 1, j: j + 1 });
        neighbours.splice(4, 0, { i: i + 1, j: j - 1 });
    }

    return neighbours;
}
