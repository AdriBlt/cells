import * as React from "react";

import { shuffleList } from "../utils/list-helpers";

interface Guest {
  name: string;
  cannotGiftTo: string[];
}

interface GiftAssignment {
  from: string;
  to: string;
}

interface SecretSantaState {
  giftAssignment: GiftAssignment[];
}

export class SecretSantaGame extends React.Component<{}, SecretSantaState>
{
  public state = { giftAssignment: [] as GiftAssignment[] };
  private guests: Guest[] = [];

  public componentDidMount() {
    // ALL GUESTS
    this.addCouple('Jeanne', 'Maxime');
    this.addCouple('Anne', 'Alex');
    this.addCouple('Claire', 'Cédric');
    this.addCouple('Thérèse', 'Vincent');
    this.addCouple('Jean-Emmanuel', 'Emilie');
    this.addCouple('Bernie', 'Léo');
    this.addCouple('Agnès', 'Adrien');
    this.addCouple('Elisabeth', 'Alban');

    // INCOMPATIBILITIES
    this.addIncompatibility('Agnès', 'Thérèse');
    this.addIncompatibility('Adrien', 'Thérèse');
    this.addIncompatibility('Agnès', 'Vincent');
    this.addIncompatibility('Adrien', 'Vincent');
    this.addIncompatibility('Agnès', 'Bernie');
    this.addIncompatibility('Adrien', 'Bernie');
    this.addIncompatibility('Agnès', 'Léo');
    this.addIncompatibility('Adrien', 'Léo');
    this.addIncompatibility('Agnès', 'Anne');
    this.addIncompatibility('Adrien', 'Anne');
    this.addIncompatibility('Agnès', 'Alex');
    this.addIncompatibility('Adrien', 'Alex');

    this.addIncompatibility('Elisabeth', 'Thérèse', true);
    this.addIncompatibility('Elisabeth', 'Vincent', true);
    this.addIncompatibility('Alban', 'Thérèse', true);
    this.addIncompatibility('Alban', 'Vincent', true);

    this.addIncompatibility('Emilie', 'Thérèse');

    // COMPUTE
    this.computeGifts();
  }

  public render = () => {
    const { giftAssignment } = this.state;

    if (giftAssignment.length === 0) {
      return null;
    }

    return (
      <div>
        <ul>
          {giftAssignment.map(a => (<li>{`${a.from} offre un cadeau à ${a.to}`}</li>))}
        </ul>
      </div>
    );
  }

  private addCouple = (name1: string, name2: string): void => {
    this.guests.push({
      name: name1,
      cannotGiftTo: [ name2 ],
    });
    this.guests.push({
      name: name2,
      cannotGiftTo: [ name1 ],
    });
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
    const guestNames = this.guests.map(g => g.name);
    let giftAssignment: GiftAssignment[];
    do {
      shuffleList(guestNames);
      giftAssignment = this.getAssignment(guestNames);
    } while (!this.isValidAssignment(giftAssignment));
    this.setState({ giftAssignment });
  }

  private getAssignment = (guestNames: string[]): GiftAssignment[] => {
    const assignment: GiftAssignment[] = [];
    let lastName = guestNames[guestNames.length - 1];
    for (let i = 0; i < guestNames.length; i++) {
      const name = guestNames[i];
      assignment.push({ from: lastName, to: name });
      lastName = name;
    }
    return assignment;
  }

  private isValidAssignment = (giftAssignment: GiftAssignment[]): boolean => {
    for (let i = 0; i < giftAssignment.length; i++) {
      const guest = this.getGuest(giftAssignment[i].from);
      if (guest.cannotGiftTo.includes(giftAssignment[i].to)) {
        return false;
      }
    }
    return true;
  }

  private getGuest = (name: string): Guest => {
    const guest = this.guests.find(g => g.name === name);
    if (!guest) {
      throw new Error(`Cannot find name ${guest}`);
    }

    return guest;
  }
}
