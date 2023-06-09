import { AutomatonOrientation } from "../AutomatonOrientation";

export enum AntDirections {
  LEFT,
  RIGHT,
}

export function applyRotation(
  direction: AntDirections,
  orientation: AutomatonOrientation
): AutomatonOrientation {
  switch (orientation) {
    case AutomatonOrientation.NORTH:
      switch (direction) {
        case AntDirections.LEFT:
          return AutomatonOrientation.WEST;
        case AntDirections.RIGHT:
          return AutomatonOrientation.EAST;
        default:
          throw new Error("AntDirection.applyRotation");
      }
    case AutomatonOrientation.EAST:
      switch (direction) {
        case AntDirections.LEFT:
          return AutomatonOrientation.NORTH;
        case AntDirections.RIGHT:
          return AutomatonOrientation.SOUTH;
        default:
          throw new Error("AntDirection.applyRotation");
      }
    case AutomatonOrientation.SOUTH:
      switch (direction) {
        case AntDirections.LEFT:
          return AutomatonOrientation.EAST;
        case AntDirections.RIGHT:
          return AutomatonOrientation.WEST;
        default:
          throw new Error("AntDirection.applyRotation");
      }
    case AutomatonOrientation.WEST:
      switch (direction) {
        case AntDirections.LEFT:
          return AutomatonOrientation.SOUTH;
        case AntDirections.RIGHT:
          return AutomatonOrientation.NORTH;
        default:
          throw new Error("AntDirection.applyRotation");
      }
    default:
  }
  return orientation;
}
