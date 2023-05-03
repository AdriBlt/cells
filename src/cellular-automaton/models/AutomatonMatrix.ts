import { AutomatonCell } from "./AutomatonCell";
import { AutomatonLook } from "./AutomatonLook";
import { AutomatonParameters } from "./AutomatonParameters";
import { BorderCells } from "./BorderCells";
import { GridUpdate, NextStateGridUpdate } from "./GridUpdate";

export abstract class AutomatonMatrix<
  TCell extends AutomatonCell,
  TParameters extends AutomatonParameters
> {
  protected xSize: number = 0;
  protected ySize: number = 0;
  protected matrix: TCell[][] = [];
  protected rules: TParameters;

  constructor(param: TParameters) {
    this.rules = param;
  }

  public abstract initialize(nbX: number, nbY: number): void;
  public abstract nextStep(): NextStateGridUpdate;
  public abstract getLook(x: number, y: number): AutomatonLook;
  public abstract setRandomCells(): void;
  public abstract changeStatus(x: number, y: number): GridUpdate;
  public changeStatusSpecial?(x: number, y: number): GridUpdate;

  public getRules(): TParameters {
    return this.rules;
  }

  public getCell(x: number, y: number): TCell {
    if (0 <= x && x < this.xSize && 0 <= y && y < this.ySize) {
      return this.matrix[x][y];
    }
    throw new Error("AutomatonMatrix.getCell: incorrect argument");
  }

  public getCellOnBorder(xx: number, yy: number): TCell | null {
    if (0 <= xx && xx < this.xSize && 0 <= yy && yy < this.ySize) {
      return this.getCell(xx, yy);
    }

    return this.getBorderCell(xx, yy);
  }

  protected getBorderCell(xx: number, yy: number): TCell | null {
    switch (this.getRules().getBorderType()) {
      case BorderCells.Mirror: // Closest
        const xm = Math.min(Math.max(xx, 0), this.xSize - 1);
        const ym = Math.min(Math.max(yy, 0), this.ySize - 1);
        return this.getCell(xm, ym);
      case BorderCells.Torus: // On the other side
        const xt = (xx + this.xSize) % this.xSize;
        const yt = (yy + this.ySize) % this.ySize;
        return this.getCell(xt, yt);
      case BorderCells.Alive: // Alive
      case BorderCells.Dead: // Dead
      default:
        return null;
    }
  }
}
