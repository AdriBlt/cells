import { randomBool } from "../../../utils/random";
import { AutomatonLook } from "../AutomatonLook";
import { AutomatonMatrix } from "../AutomatonMatrix";
import { GridUpdate, NextStateGridUpdate } from "../GridUpdate";
import { ElementaryRulesCell } from "./ElementaryRulesCell";
import { ElementaryRulesParameters } from "./ElementaryRulesParameters";

export class ElementaryRulesMatrix extends AutomatonMatrix<
  ElementaryRulesCell,
  ElementaryRulesParameters
> {
  constructor() {
    super(new ElementaryRulesParameters());
  }

  public initialize(nbX: number, nbY: number): void {
    this.xSize = nbX;
    this.ySize = nbY;
    this.matrix = [];
    for (let x = 0; x < this.xSize; x++) {
      this.matrix[x] = [];
      for (let y = 0; y < this.ySize; y++) {
        this.matrix[x][y] = new ElementaryRulesCell(x, y, false);
      }
    }

    const middle = Math.floor(this.xSize / 2);
    const lastLine = this.ySize - 1;
    this.getCell(middle, lastLine).setCurrentStatus(true);
  }

  public nextStep(): NextStateGridUpdate {
    const lastLine = this.ySize - 1;
    for (let y = 0; y < lastLine; y++) {
      for (let x = 0; x < this.xSize; x++) {
        this.getCell(x, y).setCurrentStatus(
          this.getCell(x, y + 1).getCurrentStatus()
        );
      }
    }

    for (let x = 0; x < this.xSize; x++) {
      const neighbour = this.getNeighbourCells(x, lastLine);
      const next = this.getRules().getNextStatus(neighbour);
      this.getCell(x, lastLine).setCurrentStatus(next);
    }

    return { update: GridUpdate.ALL };
  }

  public getLook(x: number, y: number): AutomatonLook {
    const background = this.getRules()
      .getType(this.getCell(x, y))
      .getBackground();
    return new AutomatonLook(background);
  }

  public setRandomCells(): void {
    const lastLine = this.ySize - 1;
    for (let x = 0; x < this.xSize; x++) {
      this.getCell(x, lastLine).setCurrentStatus(randomBool());
    }
  }

  public changeStatus(x: number, y: number): GridUpdate {
    const cell = this.getCell(x, this.ySize - 1);
    cell.setCurrentStatus(!cell.getCurrentStatus());
    return GridUpdate.ALL;
  }

  private getNeighbourCells(x: number, y: number): boolean[] {
    const size = 3;
    const bools = [];
    for (let i = 0; i < size; i++) {
      const cell = this.getCellOnBorder(x + 1 - i, y - 1);
      if (cell == null) {
        bools[i] = false;
      } else {
        bools[i] = cell.getCurrentStatus();
      }
    }
    return bools;
  }
}
