import { AutomatonCell } from "../AutomatonCell";

export class TurmiteCell implements AutomatonCell {
  private state: boolean;

  constructor(public x: number, public y: number, status: boolean = false) {
    this.setStatus(status);
  }

  public getStatus(): boolean {
    return this.state;
  }

  public setStatus(status: boolean): void {
    this.state = status;
  }
}
