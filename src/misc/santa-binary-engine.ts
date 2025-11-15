import { shuffleList } from "../utils/list-helpers";
import { GiftAssignmentResult, Guest } from "./santa/santa-model";

export interface SantaBinaryOption {
  givers: Array<[string, (string[])?]>;
  receivers: string[];
}

export class SantaBinaryEngine  {
  private giftAssignment: GiftAssignmentResult[] = [];
  private givers: Guest[] = [];
  private receivers: string[] = [];

  constructor(options: SantaBinaryOption) {
    this.setup(options);
    this.computeGifts();
  }

  public getAssignments() {
    return this.giftAssignment;
  }

    private setup(options: SantaBinaryOption) {
      options.givers.forEach(giver => {
        this.addGiver(giver[0], giver[1]);
      });
      (options.receivers || []).forEach(receiver => this.addReceiver(receiver));
    }

  private addGiver = (name: string, cannotGiftTo?: string[]): void => {
    this.givers.push({ name, cannotGiftTo: cannotGiftTo || [] });
  }

  private addReceiver = (name: string ): void => {
    this.receivers.push(name);
  }

  private computeGifts = (): void => {
    const receiversNames = this.receivers.map(g => g);
    let giftAssignment: GiftAssignmentResult[] | null;
    do {
      shuffleList(receiversNames);
      giftAssignment = this.getAssignment(this.givers, receiversNames);
    } while (!giftAssignment);
    this.giftAssignment = giftAssignment;
  }

  private getAssignment = (givers: Guest[], receivers: string[]): GiftAssignmentResult[] | null => {
    const assignment: GiftAssignmentResult[] = [];
    const size = Math.min(givers.length, receivers.length);
    for (let i = 0; i < size; i++) {
        if (givers[i].cannotGiftTo.includes(receivers[i])) {
            return null;
        }

        assignment.push({ from: givers[i].name, to: receivers[i] });
    }

    return assignment;
  }
}