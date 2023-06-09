export enum AutomatonOrientation {
  NONE,
  CENTERED,
  // 4 WAYS
  NORTH,
  EAST,
  SOUTH,
  WEST,
  // 8 WAYS (Square Grids)
  NORTH_EAST,
  SOUTH_EAST,
  SOUTH_WEST,
  NORTH_WEST,
  // 6 WAYS (Hex Grids), with NORTH et SOUTH
  HEX_TOP_RIGHT,
  HEX_TOP_LEFT,
  HEX_BOTTOM_LEFT,
  HEX_BOTTOM_RIGHT,
}

export function getAngle(orientation: AutomatonOrientation): number {
  switch (orientation) {
    // 4 WAYS
    case AutomatonOrientation.NORTH:
      return Math.PI / 2;
    case AutomatonOrientation.EAST:
      return 0;
    case AutomatonOrientation.SOUTH:
      return -Math.PI / 2;
    case AutomatonOrientation.WEST:
      return Math.PI;

    // 8 WAYS (Square Grids)
    case AutomatonOrientation.NORTH_EAST:
      return Math.PI / 4;
    case AutomatonOrientation.SOUTH_EAST:
      return -Math.PI / 4;
    case AutomatonOrientation.SOUTH_WEST:
      return (-3 * Math.PI) / 4;
    case AutomatonOrientation.NORTH_WEST:
      return (3 * Math.PI) / 4;

    // 6 WAYS (Hex Grids), with NORTH et SOUTH
    case AutomatonOrientation.HEX_TOP_RIGHT:
      return Math.PI / 6;
    case AutomatonOrientation.HEX_TOP_LEFT:
      return (5 * Math.PI) / 6;
    case AutomatonOrientation.HEX_BOTTOM_LEFT:
      return (-5 * Math.PI) / 6;
    case AutomatonOrientation.HEX_BOTTOM_RIGHT:
      return -Math.PI / 6;

    case AutomatonOrientation.NONE:
    case AutomatonOrientation.CENTERED:
    default:
      return 0;
  }
}
