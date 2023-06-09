import {
  getTurmiteDirectionNumber,
  TurmiteDirection,
} from "./TurmiteDirection";

export class TurmiteDecisions {
  private nextCellStatus: boolean;
  private nextDirection: TurmiteDirection;
  private nextTurmiteStatus: number;

  constructor(
    cell: boolean = false,
    dir: TurmiteDirection = TurmiteDirection.NO_TURN,
    turmite: number = 0
  ) {
    this.nextCellStatus = cell;
    this.nextDirection = dir;
    this.nextTurmiteStatus = turmite;
  }

  public getNextCellStatus(): boolean {
    return this.nextCellStatus;
  }

  public getNextDirection(): TurmiteDirection {
    return this.nextDirection;
  }

  public getNextTurmiteStatus(): number {
    return this.nextTurmiteStatus;
  }

  public setNextCellStatus(nextCellState: boolean): void {
    this.nextCellStatus = nextCellState;
  }

  public setNextDirection(nextDirection: TurmiteDirection): void {
    this.nextDirection = nextDirection;
  }

  public setNextTurmiteStatus(nextTurmiteStatus: number): void {
    this.nextTurmiteStatus = nextTurmiteStatus;
  }

  public getCode(): string {
    return (
      this.boolToString(this.getNextCellStatus()) +
      " " +
      getTurmiteDirectionNumber(this.getNextDirection()) +
      " " +
      this.getNextTurmiteStatus()
    );
  }

  private boolToString(bool: boolean): string {
    if (bool) {
      return "1";
    }
    return "0";
  }
}
