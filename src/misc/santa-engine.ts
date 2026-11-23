import { shuffleList } from "../utils/list-helpers";
import { GiftAssignment, Guest, Santa } from "./santa/santa-model";

export class SantaEngine implements Santa {
  private giftAssignment: GiftAssignment[] = [];
  private guests: Guest[] = [];

  public getAssignments() {
    return this.giftAssignment.map(a => ({ from: a.from.name, to: a.to.name}));
  }

  public addCouple = (name1: string, name2: string): void => {
    this.guests.push({
      name: name1,
      cannotGiftTo: [ name2 ],
    });
    this.guests.push({
      name: name2,
      cannotGiftTo: [ name1 ],
    });
  }

  public addPerson = (name: string): void => {
    this.guests.push({ name, cannotGiftTo: [] });
  }

  public addIncompatibility = (name1: string, name2: string, twoSides = false): void => {
    const guest1 = this.getGuest(name1);
    const guest2 = this.getGuest(name2);
    guest1.cannotGiftTo.push(name2);
    if (twoSides) {
      guest2.cannotGiftTo.push(name1);
    }
  }

  public computeGifts = (): void => {
    const guestNames = this.guests.map(g => g);
    let giftAssignment: GiftAssignment[];
    do {
      shuffleList(guestNames);
      giftAssignment = this.getAssignment(guestNames);
    } while (!this.isValidAssignment(giftAssignment));
    this.giftAssignment = giftAssignment;
  }

  public getAssignment = (guests: Guest[]): GiftAssignment[] => {
    const assignment: GiftAssignment[] = [];
    let lastGuest = guests[guests.length - 1];
    for (let i = 0; i < guests.length; i++) {
      const name = guests[i];
      assignment.push({ from: lastGuest, to: name });
      lastGuest = name;
    }
    return assignment;
  }

  public isValidAssignment = (giftAssignment: GiftAssignment[]): boolean => {
    for (let i = 0; i < giftAssignment.length; i++) {
      const guest = giftAssignment[i].from;
      if (guest.cannotGiftTo.includes(giftAssignment[i].to.name)) {
        return false;
      }
    }
    return true;
  }

  public getGuest = (name: string): Guest => {
    const guest = this.guests.find(g => g.name === name);
    if (!guest) {
      throw new Error(`Cannot find name ${guest}`);
    }

    return guest;
  }
}