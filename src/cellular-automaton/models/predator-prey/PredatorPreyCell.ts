import { AutomatonCell } from "../AutomatonCell";
import { PredatorPreyState } from "./PredatorPreyType";

export class PredatorPreyCell implements AutomatonCell {
  private statePrec: PredatorPreyState;
  private stateNow: PredatorPreyState;
  private stateNext: PredatorPreyState;

  constructor(public x: number, public y: number, state: PredatorPreyState) {
    this.statePrec = state;
    this.stateNow = state;
    this.stateNext = state;
  }

  public nextStep(): void {
    this.statePrec = this.stateNow;
    this.stateNow = this.stateNext;
  }

  public getPreviousStatus(): PredatorPreyState {
    return this.statePrec;
  }

  public getCurrentStatus(): PredatorPreyState {
    return this.stateNow;
  }

  public getNextStatus(): PredatorPreyState {
    return this.stateNext;
  }

  public setPreviousStatus(prev: PredatorPreyState): void {
    this.statePrec = prev;
  }

  public setCurrentStatus(stat: PredatorPreyState): void {
    this.stateNow = stat;
  }

  public setNextStatus(next: PredatorPreyState): void {
    this.stateNext = next;
  }

  public setStatus(p: PredatorPreyState, c: PredatorPreyState, n: PredatorPreyState): void {
    this.setPreviousStatus(p);
    this.setCurrentStatus(c);
    this.setNextStatus(n);
  }
}
