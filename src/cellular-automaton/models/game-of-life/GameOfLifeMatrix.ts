import { getNeighbourCells } from "../../../utils/grid-helper";
import { random } from "../../../utils/random";
import { AutomatonLook } from "../AutomatonLook";
import { AutomatonMatrix } from "../AutomatonMatrix";
import { BorderCells } from "../BorderCells";
import { GridUpdate, NextStateGridUpdate } from "../GridUpdate";
import { GameOfLifeCell } from "./GameOfLifeCell";
import { GameOfLifeParameters } from "./GameOfLifeParameters";

export class GameOfLifeMatrix extends AutomatonMatrix<
  GameOfLifeCell,
  GameOfLifeParameters
> {
  constructor() {
    super(new GameOfLifeParameters());
  }

  public initialize(nbX: number, nbY: number): void {
    this.xSize = nbX;
    this.ySize = nbY;
    this.matrix = [];
    for (let x = 0; x < this.xSize; x++) {
      this.matrix[x] = [];
      for (let y = 0; y < this.ySize; y++) {
        this.matrix[x][y] = new GameOfLifeCell(x, y);
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

  public getCell(x: number, y: number): GameOfLifeCell {
    return super.getCell(x, y) as GameOfLifeCell;
  }

  public changeStatus(x: number, y: number): GridUpdate {
    const cell = this.getCell(x, y);
    this.getRules().changeStatus(cell);
    this.setBlockCellNextStatus(x, y);
    return GridUpdate.BLOCK;
  }

  public changeStatusSpecial(x: number, y: number): GridUpdate {
    const cell = this.getCell(x, y);
    cell.setImmune(!cell.isImmune());
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
    if (cell.isImmune()) {
      cell.setNextStatus(true);
    } else {
      const nbAlive = this.getNeighbourNumber(x, y);
      const nextStatus = this.getRules().getNextStatus(cell, nbAlive);
      cell.setNextStatus(nextStatus);
    }
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

  private getNeighbourNumber(x: number, y: number): number {
    let nbAlive = 0;
    const neighbours = this.getNeighbourCells(x, y);
    for (const cell of neighbours) {
      if (cell != null) {
        if (cell.getCurrentStatus()) {
          nbAlive++;
        }
      } else if (this.getRules().getBorderType() === BorderCells.Alive) {
        nbAlive++;
      }
    }
    return nbAlive;
  }

  private getNeighbourCells(
    x: number,
    y: number
  ): Array<GameOfLifeCell | null> {
    return getNeighbourCells(x, y, this.getRules().isHexaGrid())
      .map(p => this.getCellOnBorder(p.x, p.y));
  }
}
