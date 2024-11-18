import * as React from "react";

import { SantaBinaryEngine } from "./santa-binary-engine";
import { SantaEngine } from "./santa-engine";
import { GiftAssignmentResult, Santa } from "./santa/santa-model";

const divider = "*************************************";
export class SecretSantaGame extends React.Component<{}, { giftAssignment: GiftAssignmentResult[][] }>
{
  public state = { giftAssignment: [] as GiftAssignmentResult[][] };
  private engines: Santa[] = [
    getVerratEngine(),
    getOlivierParentEngine(),
    getOlivierParentEnfantEngine(),
    getOlivierEnfantEngine()
  ];

  public componentDidMount() {
    // COMPUTE
    const assignments = this.engines.map(e => {
      e.computeGifts();
      return e.getAssignments();
    });
    this.setState({ giftAssignment: assignments });
  }

  public render = () => {

    return (
      <div>
        <div>{divider}</div>
        {this.state.giftAssignment.map((giftAssignment, i) => (
          <>
            <ul key={i}>
              {giftAssignment.map(a => (<li>{`${a.from} offre un cadeau à ${a.to}`}</li>))}
            </ul>
            <div>{divider}</div>
          </>
        ))}
      </div>
    );
  }
}

function getVerratEngine() {
  const engine = new SantaEngine();

  // ALL GUESTS
  engine.addCouple('Jeanne', 'Maxime');
  engine.addCouple('Anne', 'Alex');
  engine.addCouple('Claire', 'Cédric');
  engine.addCouple('Thérèse', 'Vincent');
  engine.addCouple('Jean-Emmanuel', 'Emilie');
  engine.addCouple('Bernie', 'Léo');
  engine.addCouple('Agnès', 'Adrien');
  engine.addCouple('Elisabeth', 'Alban');

  // INCOMPATIBILITIES
  engine.addIncompatibility('Agnès', 'Thérèse');
  engine.addIncompatibility('Adrien', 'Thérèse');
  engine.addIncompatibility('Agnès', 'Vincent');
  engine.addIncompatibility('Adrien', 'Vincent');
  engine.addIncompatibility('Agnès', 'Bernie');
  engine.addIncompatibility('Adrien', 'Bernie');
  engine.addIncompatibility('Agnès', 'Léo');
  engine.addIncompatibility('Adrien', 'Léo');
  engine.addIncompatibility('Agnès', 'Anne');
  engine.addIncompatibility('Adrien', 'Anne');
  engine.addIncompatibility('Agnès', 'Alex');
  engine.addIncompatibility('Adrien', 'Alex');

  engine.addIncompatibility('Elisabeth', 'Thérèse', true);
  engine.addIncompatibility('Elisabeth', 'Vincent', true);
  engine.addIncompatibility('Alban', 'Thérèse', true);
  engine.addIncompatibility('Alban', 'Vincent', true);

  engine.addIncompatibility('Emilie', 'Thérèse');

  return engine;
}

function getOlivierParentEngine() {
  const engine = new SantaEngine();

  // ALL GUESTS
  engine.addCouple('Gilles', 'Véro');
  engine.addCouple('Bertrand', 'Aurélie');
  engine.addPerson('Caro');
  engine.addPerson('Sophie');

  return engine;
}

function getOlivierParentEnfantEngine() {
  const engine = new SantaBinaryEngine();

  // GIVER
  engine.addGiver('Gilles', ['Adri&Agnès', 'Alix&Julien']);
  engine.addGiver('Véro', ['Adri&Agnès', 'Alix&Julien']);
  engine.addGiver('Sophie');
  engine.addGiver('Bertrand', ['Benoit&Savannah', 'Clement&Léna', 'Margot']);
  engine.addGiver('Aurélie', ['Benoit&Savannah', 'Clement&Léna', 'Margot']);
  engine.addGiver('Caro', ['Bilal']);

  // RECEIVER
  ['Adri&Agnès', 'Alix&Julien', 'Benoit&Savannah', 'Clement&Léna', 'Margot', 'Bilal'].forEach(r => engine.addReceiver(r))

  return engine;
}

function getOlivierEnfantEngine() {
  const engine = new SantaEngine();

  // ALL GUESTS
  engine.addCouple('Adri', 'Agnès');
  engine.addCouple('Alix', 'Julien');
  engine.addCouple('Benoit', 'Savannah');
  engine.addPerson('Clément');
  engine.addPerson('Margot');
  engine.addPerson('Bilal');

  engine.addIncompatibility('Adri', 'Alix', true);
  engine.addIncompatibility('Agnès', 'Alix', true);
  engine.addIncompatibility('Adri', 'Julien', true);
  engine.addIncompatibility('Agnès', 'Julien', true);
  engine.addIncompatibility('Benoit', 'Clément', true);
  engine.addIncompatibility('Benoit', 'Margot', true);
  engine.addIncompatibility('Savannah', 'Clément', true);
  engine.addIncompatibility('Savannah', 'Margot', true);
  engine.addIncompatibility('Clément', 'Margot', true);

  return engine;
}