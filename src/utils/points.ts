import { isBetweenIncluded } from "./numbers";

export interface Point {
  x: number;
  y: number;
}

export interface Extremum {
  min: Point;
  max: Point;
}

export function findExtremum(points: Point[]): Extremum {
  return findExtremumMatrix([points]);
}

export function findExtremumMatrix(points: Point[][]): Extremum {
  if (points.length === 0 || points[0].length === 0) {
    throw new Error("Points.findExtremum: empty list of points");
  }

  const { x, y } = points[0][0];
  const extremum = {
    min: { x, y },
    max: { x, y },
  };

  for (const array of points) {
    for (const point of array) {
      if (point.x < extremum.min.x) {
        extremum.min.x = point.x;
      } else if (point.x > extremum.max.x) {
        extremum.max.x = point.x;
      }

      if (point.y < extremum.min.y) {
        extremum.min.y = point.y;
      } else if (point.y > extremum.max.y) {
        extremum.max.y = point.y;
      }
    }
  }

  return extremum;
}

export function squaredDistance(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

export function isBetweenExtremumIncluded(p: Point, e: Extremum): boolean {
  return isBetweenIncluded(p.x, e.min.x, e.max.x) && isBetweenIncluded(p.y, e.min.y, e.max.y);
}
