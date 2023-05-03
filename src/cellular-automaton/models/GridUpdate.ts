export enum GridUpdate {
  NONE,
  CELL,
  BLOCK,
  ALL,
}

export type NextStateGridUpdate =
  | {
      update: GridUpdate.ALL | GridUpdate.NONE;
    }
  | {
      update: GridUpdate.CELL | GridUpdate.BLOCK;
      x: number;
      y: number;
    };
