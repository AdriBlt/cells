import { Cell } from './cell';

function getEmpty(w: number, h: number): Cell[] {
    return [];
}

function getCorners(w: number, h: number): Cell[] {
    const cells = [];
    const gap = Math.max(Math.min(w, h) / 10, 2);
    for (let i = 0; i < 4; i++) {
        cells.push(new Cell(gap + i, gap));
        cells.push(new Cell(gap, gap + i));

        cells.push(new Cell(gap + i, w - 1 - gap));
        cells.push(new Cell(gap, w - 1 - gap - i));

        cells.push(new Cell(h - 1 - gap - i, gap));
        cells.push(new Cell(h - 1 - gap, gap + i));

        cells.push(new Cell(h - 1 - gap - i, w - 1 - gap));
        cells.push(new Cell(h - 1 - gap, w - 1 - gap - i));
    }

    return cells;
}

function getCross(w: number, h: number): Cell[] {
    const cells = [];

    const center = Math.floor(w / 2);
    for (let i = 0; i < h; i++) {
        cells.push(new Cell(i, center));
    }

    const middle = Math.floor(h / 2);
    for (let j = 0; j < h; j++) {
        cells.push(new Cell(middle, j));
    }

    return cells;
}

const collection: Array<((w: number, h: number) => Cell[]) > = [
    getEmpty,
    getCorners,
    // getCross,
];

export const Walls = {
    getEmpty,
    getCorners,
    getCross,
    getRandomWalls(w: number, h: number): Cell[] {
        const i = Math.floor(Math.random() * collection.length);
        return collection[i](w, h);
    }
}
