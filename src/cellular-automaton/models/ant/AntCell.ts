import { AutomatonCell } from "../AutomatonCell";

export class AntCell implements AutomatonCell {
  private type: number;

  constructor(public x: number, public y: number, cellType: number = 0) {
    this.setType(cellType);
  }

  public getType(): number {
    return this.type;
  }

  public setType(type: number): void {
    this.type = type;
  }
}
