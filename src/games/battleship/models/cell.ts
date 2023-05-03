import { CellStatus } from "./cell-status";
import { Ship } from "./ship";

export class Cell {
  public ship?: Ship;
  public status: CellStatus = CellStatus.Unknown;

  constructor(
    public i: number,
    public j: number,
    public updataCellCallback: (cell: Cell) => void
  ) {}

  public fire(): void {
    if (!this.ship) {
      this.status = CellStatus.Water;
    } else {
      this.status = CellStatus.Hit;
      this.ship.updateCellsIfSunk();
    }

    this.updataCellCallback(this);
  }
}
