import { AutomatonCell } from "./AutomatonCell";
import { AutomatonType } from "./AutomatonType";
import { BorderCells } from "./BorderCells";

export abstract class AutomatonParameters {
  constructor(
    private borderType: BorderCells,
    private isHexa: boolean = false
  ) {}

  public setBorders(border: BorderCells): void {
    this.borderType = border;
  }

  public getBorderType(): BorderCells {
    return this.borderType;
  }

  public setHexaGrid(value: boolean): void {
    this.isHexa = value;
  }

  public isHexaGrid(): boolean {
    return this.isHexa;
  }

  public abstract getType(cell: AutomatonCell): AutomatonType;
}
