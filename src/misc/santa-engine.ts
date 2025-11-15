import { shuffleList } from "../utils/list-helpers";
import { GiftAssignment, Guest } from "./santa/santa-model";

export interface SantaOption {
  groups: string[][];
  imcompatibilities?: Array<[string, string, boolean?]>;
}

export class SantaEngine
{
  private giftAssignment: GiftAssignment[] = [];
  private guests: Guest[] = [];

  constructor(options: SantaOption) {
    this.setup(options);
    this.computeGifts();
  }

  public getAssignments() {
    return this.giftAssignment.map(a => ({ from: a.from.name, to: a.to.name}));
  }

  private setup(options: SantaOption) {
    options.groups.forEach(group => {
      group.forEach((name, index) => {
        const cannotGiftTo = [...group];
        cannotGiftTo.splice(index, 1);
        this.guests.push({ name, cannotGiftTo });
      })
    });
    (options.imcompatibilities || []).forEach(incompat => this.addIncompatibility(incompat[0], incompat[1], incompat[2]));
  }

  private addIncompatibility = (name1: string, name2: string, twoSides = false): void => {
    const guest1 = this.getGuest(name1);
    const guest2 = this.getGuest(name2);
    guest1.cannotGiftTo.push(name2);
    if (twoSides) {
      guest2.cannotGiftTo.push(name1);
    }
  }

  private computeGifts = (): void => {
    const receivers = this.guests.map(g => g);
    let giftAssignment: GiftAssignment[] | null = null;
    do {
      shuffleList(receivers);
      giftAssignment = this.getAssignment(receivers);
    } while (!giftAssignment);
    this.giftAssignment = giftAssignment;
  }

  private getAssignment = (receivers: Guest[]): GiftAssignment[] | null => {
    const assignment: GiftAssignment[] = [];
    for (let i = 0; i < receivers.length; i++) {
      const from = this.guests[i];
      const to = receivers[i];
      if (this.guests[i].cannotGiftTo.includes(to.name)) {
        return null;
      }

      assignment.push({ from, to });
    }

    return assignment;
  }

  private getGuest = (name: string): Guest => {
    const guest = this.guests.find(g => g.name === name);
    if (!guest) {
      throw new Error(`Cannot find name ${guest}`);
    }

    return guest;
  }
}
