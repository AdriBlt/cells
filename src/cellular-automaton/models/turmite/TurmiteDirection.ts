import { randomInt } from "src/utils/random";

import { AutomatonOrientation } from "../AutomatonOrientation";

export enum TurmiteDirection {
  NO_TURN, // 1, "N"
  RIGHT, //   2, "R"
  U_TURN, //  4, "U"
  LEFT, //    8, "L"
}

const ALL_DIRECTIONS: TurmiteDirection[] = Object.keys(TurmiteDirection)
  .filter((k) => typeof TurmiteDirection[k] === "number")
  .map((k) => TurmiteDirection[k]);

export function getTurmiteDirectionNumber(dir: TurmiteDirection): number {
  switch (dir) {
    case TurmiteDirection.NO_TURN:
      return 1;
    case TurmiteDirection.RIGHT:
      return 2;
    case TurmiteDirection.U_TURN:
      return 4;
    case TurmiteDirection.LEFT:
      return 8;
    default:
      throw new Error("TurmiteDirections.getTurmiteDirectionNumber");
  }
}

export function parseTurmiteDirection(dir: number | string): TurmiteDirection {
  switch (dir) {
    case 1:
    case "N":
      return TurmiteDirection.NO_TURN;
    case 2:
    case "R":
      return TurmiteDirection.RIGHT;
    case 4:
    case "U":
      return TurmiteDirection.U_TURN;
    case 8:
    case "L":
      return TurmiteDirection.LEFT;
    default:
      throw new Error(
        "TurmiteDirection.parseTurmiteDirection: invalid letter/number"
      );
  }
}

export function getTurmiteDirectionLetter(dir: TurmiteDirection): string {
  switch (dir) {
    case TurmiteDirection.NO_TURN:
      return "N";
    case TurmiteDirection.RIGHT:
      return "R";
    case TurmiteDirection.U_TURN:
      return "U";
    case TurmiteDirection.LEFT:
      return "L";
    default:
      throw new Error("TurmiteDirections.getTurmiteDirectionLetter");
  }
}

export function applyRotation(
  dir: TurmiteDirection,
  orientation: AutomatonOrientation
): AutomatonOrientation {
  switch (dir) {
    case TurmiteDirection.NO_TURN:
      return orientation;
    case TurmiteDirection.RIGHT:
      switch (orientation) {
        case AutomatonOrientation.NORTH:
          return AutomatonOrientation.EAST;
        case AutomatonOrientation.EAST:
          return AutomatonOrientation.SOUTH;
        case AutomatonOrientation.SOUTH:
          return AutomatonOrientation.WEST;
        case AutomatonOrientation.WEST:
          return AutomatonOrientation.NORTH;
        default:
          break;
      }
      break;
    case TurmiteDirection.U_TURN:
      switch (orientation) {
        case AutomatonOrientation.NORTH:
          return AutomatonOrientation.SOUTH;
        case AutomatonOrientation.EAST:
          return AutomatonOrientation.WEST;
        case AutomatonOrientation.SOUTH:
          return AutomatonOrientation.NORTH;
        case AutomatonOrientation.WEST:
          return AutomatonOrientation.EAST;
        default:
          break;
      }
      break;
    case TurmiteDirection.LEFT:
      switch (orientation) {
        case AutomatonOrientation.NORTH:
          return AutomatonOrientation.WEST;
        case AutomatonOrientation.EAST:
          return AutomatonOrientation.NORTH;
        case AutomatonOrientation.SOUTH:
          return AutomatonOrientation.EAST;
        case AutomatonOrientation.WEST:
          return AutomatonOrientation.SOUTH;
        default:
          break;
      }
      break;
    default:
      break;
  }
  return orientation;
}

export function getNextTurmiteDirection(
  dir: TurmiteDirection
): TurmiteDirection {
  switch (dir) {
    case TurmiteDirection.NO_TURN:
      return TurmiteDirection.RIGHT;
    case TurmiteDirection.RIGHT:
      return TurmiteDirection.U_TURN;
    case TurmiteDirection.U_TURN:
      return TurmiteDirection.LEFT;
    case TurmiteDirection.LEFT:
      return TurmiteDirection.NO_TURN;
    default:
      throw new Error("TurmiteDirections.getNextTurmiteDirection");
  }
}

export function getRandomTurmiteDirection(): TurmiteDirection {
  return ALL_DIRECTIONS[randomInt(0, ALL_DIRECTIONS.length)];
}
