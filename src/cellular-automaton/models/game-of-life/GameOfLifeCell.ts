import { AutomatonCell } from "../AutomatonCell";

export class GameOfLifeCell implements AutomatonCell {
  private alivePrec: boolean;
  private aliveNow: boolean;
  private aliveNext: boolean;
  private immune: boolean;

  constructor(public x: number, public y: number, state: boolean = false) {
    this.alivePrec = state;
    this.aliveNow = state;
    this.aliveNext = state;
    this.immune = state;
  }

  public nextStep(): void {
    this.alivePrec = this.aliveNow;
    this.aliveNow = this.aliveNext;
  }

  public getPreviousStatus(): boolean {
    return this.alivePrec;
  }

  public getCurrentStatus(): boolean {
    return this.aliveNow;
  }

  public getNextStatus(): boolean {
    return this.aliveNext;
  }

  public setPreviousStatus(prev: boolean): void {
    this.alivePrec = prev;
  }

  public setCurrentStatus(stat: boolean): void {
    this.aliveNow = stat;
  }

  public setNextStatus(next: boolean): void {
    this.aliveNext = next;
  }

  public isImmune(): boolean {
    return this.immune;
  }

  public setImmune(imm: boolean): void {
    this.immune = imm;
  }

  public setStatus(p: boolean, c: boolean, n: boolean): void {
    this.setPreviousStatus(p);
    this.setCurrentStatus(c);
    this.setNextStatus(n);
  }
}
