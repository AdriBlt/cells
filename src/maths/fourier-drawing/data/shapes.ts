import { Point } from "../../../utils/points";

export function getSquare(n: number): Point[] {
    const points: Point[] = [];
    const base = 100;
    for (let i = 0; i < n; i++) {
      points.push({ x: base + (i * base) / n, y: base });
    }
    for (let i = 0; i < n; i++) {
      points.push({ x: 2 * base, y: base + (i * base) / n });
    }
    for (let i = 0; i < n; i++) {
      points.push({ x: 2 * base - (i * base) / n, y: 2 * base });
    }
    for (let i = 0; i < n; i++) {
      points.push({ x: base, y: 2 * base - (i * base) / n });
    }
    return points;
}

export function getTriangle(n: number): Point[] {
    const points: Point[] = [];
    const base = 100;
    for (let i = 0; i < n; i++) {
      points.push({ x: base + (i * base) / 2 / n, y: 2 * base - (i * base) / n });
    }
    for (let i = 0; i < n; i++) {
      points.push({ x: 1.5 * base + (i * base) / 2 / n, y: base + (i * base) / n });
    }
    for (let i = 0; i < n; i++) {
      points.push({ x: 2 * base - (i * base) / n, y: 2 * base });
    }
    return points;
}
