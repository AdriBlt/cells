import { AutomatonCell } from "../AutomatonCell";

export class ElementaryRulesCell implements AutomatonCell {
  private status: boolean;

  constructor(public x: number, public y: number, b: boolean) {
    this.setCurrentStatus(b);
  }

  public getCurrentStatus(): boolean {
    return this.status;
  }

  public setCurrentStatus(stat: boolean): void {
    this.status = stat;
  }
}
