import { isOutOfBounds } from "../../../utils/numbers";
import { generateBoats } from "./board-generator";
import { Cell } from "./cell";
import { CellStatus } from "./cell-status";
import { Ship } from "./ship";
import { ShipStatus } from "./ship-status";

export const NB_ROWS = 10;
export const NB_COLS = 10;
const SHIPS_LENGTH = [5, 4, 3, 3, 2];

export class Board {
  public cells: Cell[][] = [];
  public ships: Ship[] = [];

  constructor(private updataCellCallback: (cell: Cell) => void) {}

  public resetBoard(): void {
    this.cells = [];
    this.ships = [];
    for (let i = 0; i < NB_ROWS; i++) {
      this.cells[i] = [];
      for (let j = 0; j < NB_COLS; j++) {
        const cell = new Cell(i, j, this.updataCellCallback);
        this.cells[i][j] = cell;
        this.updataCellCallback(cell);
      }
    }
  }

  public setShips() {
    this.ships = generateBoats(SHIPS_LENGTH, NB_ROWS, NB_COLS).map(b => {
      const boat = new Ship();
      boat.length = b.length;
      boat.cells = [];
      for (let c = 0; c < b.length; c++) {
        const i = b.i + (b.isHorizontal ? 0 : c);
        const j = b.j + (b.isHorizontal ? c : 0);
        const cell = this.getCell(i, j);
        cell.ship = boat;
        boat.cells.push(cell);
        this.updataCellCallback(cell);
      }
      return boat;
    });
  }

  public fire(i: number, j: number): boolean {
    const cell = this.getCell(i, j);

    if (cell.status !== CellStatus.Unknown) {
      return false;
    }

    cell.fire();
    return true;
  }

  public areAllShipsSunk(): boolean {
    for (const ship of this.ships) {
      if (ship.status !== ShipStatus.Sunk) {
        return false;
      }
    }
    return true;
  }

  public getCell(i: number, j: number): Cell {
    if (isOutOfBounds(i, 0, NB_ROWS) || isOutOfBounds(j, 0, NB_COLS)) {
      throw new Error("Board.fire: parameters out of bounds");
    }

    return this.cells[i][j];
  }
}
