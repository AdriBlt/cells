import { doSegmentsIntersect, isBetweenIncluded } from "../../../utils/numbers";
import { randomBool, randomInt } from "../../../utils/random";

interface BoatPosition {
  length: number;
  i: number;
  j: number;
  isHorizontal: boolean;
}

export function generateBoats(
  boatsLength: number[],
  height: number,
  width: number
): BoatPosition[] {
  for (let i = 0; i < 1000; i++) {
    const boats = tryGenerateBoats(boatsLength, height, width);
    if (boats) {
      return boats;
    }
  }
  throw new Error("BoardGenerator.generateBoats: too many iterations");
}

function tryGenerateBoats(
  boatsLength: number[],
  height: number,
  width: number
): BoatPosition[] | null {
  const boats: BoatPosition[] = [];
  for (const boatLength of boatsLength) {
    const isHorizontal = randomBool();
    const maxI = height - (isHorizontal ? 0 : boatLength);
    const maxJ = width - (isHorizontal ? boatLength : 0);
    const i = randomInt(0, maxI);
    const j = randomInt(0, maxJ);
    const boat = { length: boatLength, i, j, isHorizontal };
    for (const otherBoat of boats) {
      if (doBoatsIntersect(boat, otherBoat)) {
        return null;
      }
    }
    boats.push(boat);
  }
  return boats;
}

function doBoatsIntersect(b1: BoatPosition, b2: BoatPosition): boolean {
  if (b1.isHorizontal) {
    if (b2.isHorizontal) {
      // b1 and b2 horizontal
      return (
        b1.i === b2.i &&
        doSegmentsIntersect(b1.j, b1.j + b1.length, b2.j, b2.j + b2.length)
      );
    } else {
      return (
        isBetweenIncluded(b1.i, b2.i, b2.i + b2.length) &&
        isBetweenIncluded(b2.j, b1.j, b1.j + b1.length)
      );
    }
  } else {
    if (b2.isHorizontal) {
      return (
        isBetweenIncluded(b1.j, b2.j, b2.j + b2.length) &&
        isBetweenIncluded(b2.i, b1.i, b1.i + b1.length)
      );
    } else {
      // b1 and b2 vertical
      return (
        b1.j === b2.j &&
        doSegmentsIntersect(b1.i, b1.i + b1.length, b2.i, b2.i + b2.length)
      );
    }
  }
}
