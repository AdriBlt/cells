import { random, randomInt } from "./random";

export function shuffleList<T>(list: T[]): void {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
    }
}

export function createDefaultMatrix<T>(
    width: number,
    height: number,
    getDefaultValue: (i: number, j: number) => T
): T[][] {
    const matrix: T[][] = [];
    for (let i = 0; i < height; i++) {
        const line: T[] = [];
        for (let j = 0; j < width; j++) {
            line.push(getDefaultValue(i, j));
        }
        matrix.push(line);
    }
    return matrix;
}

export function createDefaultFlatMatrix<T>(
    nbRows: number,
    nbCols: number,
    getDefaultValue: (i: number, j: number) => T
): T[] {
    const matrix: T[] = [];
    for (let i = 0; i < nbRows; i++) {
        for (let j = 0; j < nbCols; j++) {
            matrix.push(getDefaultValue(i, j));
        }
    }
    return matrix;
}

export function createDefaultList<T>(length: number, getDefaultValue: (i: number) => T): T[] {
    return [...Array(length)].map((_, index) => getDefaultValue(index));
}

export function removeRandomElement<T>(list: T[]): T {
    const index = randomInt(0, list.length);
    return list.splice(index, 1)[0];
}

export function peekRandomElement<T>(list: T[]): T {
    const index = randomInt(0, list.length);
    return list[index];
}

export function peekRandomElementWithWeight<T>(list: T[], weights: number[]): T {
    if (list.length !== weights.length) {
        throw new Error("Invalid arguments");
    }

    let total = 0;
    weights.forEach(w => total += w);
    const p = random(0, total);
    let elementMax = 0;
    for (let i = 0; i < list.length; i++) {
        elementMax += weights[i];
        if (p < elementMax) {
            return list[i];
        }
    }
    return list[list.length - 1];
}

export function peekLast<T>(list: T[]): T {
    return list[list.length - 1];
}

export function addIfNotNull<T>(list: T[], element: T | null): boolean {
    if (!element) {
        return false;
    }

    list.push(element);
    return true;
}

export function findMin(list: number[]): number {
    let min = Infinity;
    list.forEach(element => {
        if (min > element) {
            min = element;
        }
    });
    return min;
}

export function findMinElement<T>(list: T[], getValue: (element: T) => number): T {
    let min = Infinity;
    let minElement = undefined as unknown as T;
    list.forEach(element => {
        const value = getValue(element);
        if (min > value) {
            min = value;
            minElement = element;
        }
    });
    return minElement;
}

export function findMaxElement<T>(list: T[], getValue: (element: T) => number): T {
    let max = -Infinity;
    let maxElement = undefined as unknown as T;
    list.forEach(element => {
        const value = getValue(element);
        if (max < value) {
            max = value;
            maxElement = element;
        }
    });
    return maxElement;
}

export function isDefined<T>(item: T | null | undefined): item is T {
    return item !== null && item !== undefined;
}