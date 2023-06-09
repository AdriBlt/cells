import { Cell } from "./cell";
import { CellStatus } from "./cell-status";
import { ShipStatus } from "./ship-status";

export class Ship {
  public length: number;
  public cells: Cell[];
  public status: ShipStatus = ShipStatus.Hidden;

  public updateCellsIfSunk(): void {
    this.status = ShipStatus.Hit;
    for (const cell of this.cells) {
      if (cell.status === CellStatus.Unknown) {
        return;
      }
    }

    this.status = ShipStatus.Sunk;
    for (const cell of this.cells) {
      cell.status = CellStatus.Sunk;
      cell.updataCellCallback(cell);
    }
  }
}
