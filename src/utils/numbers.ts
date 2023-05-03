import { Complex } from "../numbers/Complex";

export function isOutOfBounds(
  x: number,
  minIncluded: number,
  maxExcluded: number
): boolean {
  return x < minIncluded || x >= maxExcluded;
}

export function isInGrid(
  i: number,
  j: number,
  nbRows: number,
  nbCols: number
): boolean {
  return !isOutOfBounds(i, 0, nbRows) && !isOutOfBounds(j, 0, nbCols);
}

export function isBetweenIncluded(
  x: number,
  minIncluded: number,
  maxIncluded: number
): boolean {
  return x >= minIncluded && x <= maxIncluded;
}

export function doSegmentsIntersect(
  min1: number,
  max1: number,
  min2: number,
  max2: number
): boolean {
  return min1 <= max2 && min2 <= max1;
}

const epsilon = 0.0001;
export function isStatisticallyNull(value: number): boolean {
  return value < epsilon && value > -epsilon;
}

export function areNumbersStaticticallyEqual(a: number, b: number): boolean {
  return isStatisticallyNull(a - b);
}

export function areComplexesStaticticallyEqual(a: Complex, b: Complex): boolean {
  return isStatisticallyNull(a.getSquareDistanceFrom(b));
}

export function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

export function lerp(valueA: number, valueB: number, p: number) {
  return (1 - p) * valueA + p * valueB;
}

export function findGCD(a: number, b: number): number {
  let x = Math.floor(Math.max(a, b));
  let y = Math.floor(Math.min(a, b));
  if (x <= 0 || y <= 0) {
    return -1;
  }
  while (y > 0) {
    const tmp = x % y;
    x = y;
    y = tmp;
  }
  return x;
}