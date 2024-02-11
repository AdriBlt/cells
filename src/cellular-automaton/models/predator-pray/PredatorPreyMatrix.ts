import { getDirectNeighboursInOrder } from "../../../utils/grid-helper";
import { isDefined } from "../../../utils/list-helpers";
import { random } from "../../../utils/random";
import { AutomatonLook } from "../AutomatonLook";
import { AutomatonMatrix } from "../AutomatonMatrix";
import { GridUpdate, NextStateGridUpdate } from "../GridUpdate";
import { PredatorPreyCell } from "./PredatorPreyCell";
import { PredatorPreyParameters } from "./PredatorPreyParameters";
import { PredatorPreyState } from "./PredatorPreyType";

export class PredatorPreyMatrix extends AutomatonMatrix<
  PredatorPreyCell,
  PredatorPreyParameters
> {
  constructor() {
    super(new PredatorPreyParameters());
  }

  public initialize(nbX: number, nbY: number): void {
    this.xSize = nbX;
    this.ySize = nbY;
    this.matrix = [];
    for (let x = 0; x < this.xSize; x++) {
      this.matrix[x] = [];
      for (let y = 0; y < this.ySize; y++) {
        this.matrix[x][y] = new PredatorPreyCell(x, y, PredatorPreyState.FOX);
      }
    }
  }

  public nextStep(): NextStateGridUpdate {
    for (let x = 0; x < this.xSize; x++) {
      for (let y = 0; y < this.ySize; y++) {
        this.getCell(x, y).nextStep();
      }
    }

    this.setNextStatus();
    return { update: GridUpdate.ALL };
  }

  public getLook(x: number, y: number): AutomatonLook {
    const background = this.getRules()
      .getType(this.getCell(x, y))
      .getBackground();
    return new AutomatonLook(background);
  }

  public getCell(x: number, y: number): PredatorPreyCell {
    return super.getCell(x, y) as PredatorPreyCell;
  }

  public changeStatus(x: number, y: number): GridUpdate {
    const cell = this.getCell(x, y);
    this.getRules().changeStatus(cell);
    this.setBlockCellNextStatus(x, y);
    return GridUpdate.BLOCK;
  }

  public setRandomCells(): void {
    const proba = 0.1;
    for (let x = 0; x < this.xSize; x++) {
      for (let y = 0; y < this.ySize; y++) {
        if (random() < proba) {
          this.changeStatus(x, y);
        }
      }
    }

    this.setNextStatus();
  }

  private setNextStatus(): void {
    for (let x = 0; x < this.xSize; x++) {
      for (let y = 0; y < this.ySize; y++) {
        this.setCellNextStatus(x, y);
      }
    }
  }

  private setCellNextStatus(x: number, y: number): void {
    const cell = this.getCell(x, y);
    const neighbours = this.getNeighbourCells(x, y).filter(isDefined).map((nc) => nc.getCurrentStatus());
    const nextStatus = this.getRules().getNextStatus(cell.getCurrentStatus(), neighbours);
    cell.setNextStatus(nextStatus);
  }

  private setBlockCellNextStatus(x: number, y: number): void {
    const neighbours = this.getNeighbourCells(x, y);
    neighbours.push(this.getCell(x, y));
    for (const cell of neighbours) {
      if (cell) {
        this.setCellNextStatus(cell.x, cell.y);
      }
    }
  }

  private getNeighbourCells(
    x: number,
    y: number
  ): Array<PredatorPreyCell | null> {
    return getDirectNeighboursInOrder(x, y, this.getRules().isHexaGrid())
      .map(p => this.getCellOnBorder(p.i, p.j));
  }
}
