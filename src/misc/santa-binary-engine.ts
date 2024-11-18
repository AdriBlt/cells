import { shuffleList } from "../utils/list-helpers";
import { GiftAssignmentResult, Guest, Santa } from "./santa/santa-model";

export class SantaBinaryEngine implements Santa {
  private giftAssignment: GiftAssignmentResult[] = [];
  private givers: Guest[] = [];
  private receivers: string[] = [];

  public getAssignments() {
    return this.giftAssignment;
  }

  public addGiver = (name: string, cannotGiftTo?: string[]): void => {
    this.givers.push({ name, cannotGiftTo: cannotGiftTo || [] });
  }

  public addReceiver = (name: string ): void => {
    this.receivers.push(name);
  }

  public computeGifts = (): void => {
    const receiversNames = this.receivers.map(g => g);
    let giftAssignment: GiftAssignmentResult[] | null;
    do {
      shuffleList(receiversNames);
      giftAssignment = this.getAssignment(this.givers, receiversNames);
    } while (!giftAssignment);
    this.giftAssignment = giftAssignment;
  }

  public getAssignment = (givers: Guest[], receivers: string[]): GiftAssignmentResult[] | null => {
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