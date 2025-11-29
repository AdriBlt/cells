import * as React from "react";

import { SantaBinaryEngine } from "./santa-binary-engine";
import { SantaEngine } from "./santa-engine";
import { GiftAssignmentResult } from "./santa/santa-model";

const divider = "*************************************";

interface SecretSantaState {
  giftAssignments: GiftAssignmentResult[][];
}

export class SecretSantaGame extends React.Component<{}, SecretSantaState>
{
  public state: SecretSantaState = { giftAssignments: [] };

  public componentDidMount() {
    const giftAssignments = [
      getVerratAdultEngine(),
      getVerratKidsEngine(),
      getOlivierParentEngine(),
      getOlivierParentEnfantEngine(),
      getOlivierEnfantEngine(),
      getOlivierEnfantParentEngine()
    ];
    this.setState({ giftAssignments });
  }

  public render = () => {
    return (
      <div>
        <div>{divider}</div>
        {this.state.giftAssignments.map((giftAssignment, i) => (
          <>
            <ul key={i}>
              {this.renderAssignment(giftAssignment)}
            </ul>
            <div>{divider}</div>
          </>
        ))}
      </div>
    );
  }

  private renderAssignment(giftAssignment: GiftAssignmentResult[]) {
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
}

function getVerratAdultEngine() {
  const engine = new SantaEngine({
      groups: [
        ['Jeanne', 'Maxime'],
        ['Anne', 'Alex'],
        ['Claire', 'Cédric'],
        ['Thérèse', 'Vincent'],
        ['Jean-Emmanuel', 'Emilie'],
        ['Bernie', 'Léo'],
        ['Agnès', 'Adrien'],
        ['Elisabeth', 'Alban'],
        ['Lucie', 'Enzo'],
      ],
      imcompatibilities: [
        ['Agnès', 'Thérèse'],
        ['Adrien', 'Thérèse'],
        ['Agnès', 'Vincent'],
        ['Adrien', 'Vincent'],
        ['Agnès', 'Anne'],
        ['Adrien', 'Anne'],
        ['Agnès', 'Alex'],
        ['Adrien', 'Alex'],

        ['Elisabeth', 'Thérèse', true],
        ['Elisabeth', 'Vincent', true],
        ['Alban', 'Thérèse', true],
        ['Alban', 'Vincent', true],

        ['Emilie', 'Thérèse'],
        ['Cédric', 'Vincent'],
        ['Jeanne', 'Thérèse'],
        ['Jeanne', 'Vincent'],
        ['Maxime', 'Thérèse'],
        ['Maxime', 'Vincent'],
      ]
    });

  return engine.getAssignments();
}

function getVerratKidsEngine() {
  const engine = new SantaEngine({
      groups: [
        ['Clémence', 'Gabriel'],
        ['Raphaëlle', 'Sienne', 'Victoria'],
        ['Capucine'],
        ['Jim'],
        ['Baptiste', 'Tristan'],
        ['Colette'],
        ['Arthur', 'Sasha'],
        ['Marin'],
      ]
    });
  return engine.getAssignments();
}

function getOlivierParentEngine() {
  const engine = new SantaEngine({
    groups: [
      ['Gilles', 'Véro'],
      ['Bertrand', 'Aurélie'],
      ['Caro'],
      ['Sophie'],
    ]
  });

  return engine.getAssignments();
}

function getOlivierParentEnfantEngine() {
  const engine = new SantaBinaryEngine({
    givers: [
    [ 'Gilles', ['Adri&Agnès', 'Alix&Julien']],
    [ 'Véro', ['Adri&Agnès', 'Alix&Julien']],
    [ 'Sophie'],
    [ 'Bertrand', ['Benoit&Savannah', 'Clement', 'Margot']],
    [ 'Aurélie', ['Benoit&Savannah', 'Clement', 'Margot']],
    [ 'Caro', ['Bilal']],
    ],
    receivers: [
      'Adri&Agnès',
      'Alix&Julien',
      'Benoit&Savannah',
      'Clement',
      'Margot',
      'Bilal',
    ]
  });

  return engine.getAssignments();
}

function getOlivierEnfantEngine() {
  const engine = new SantaEngine({
    groups: [
      ['Adri', 'Agnès', 'Alix', 'Julien'],
      ['Benoit', 'Savannah', 'Clément', 'Margot'],
      ['Bilal'],
    ]
  });

  return engine.getAssignments();
}

function getOlivierEnfantParentEngine() {
  const engine = new SantaBinaryEngine({
    givers: [
    [ 'Adri&Agnès', ['Gilles', 'Véro']],
    [ 'Alix&Julien', ['Gilles', 'Véro']],
    [ 'Benoit&Savannah', ['Bertrand', 'Aurélie']],
    [ 'Clement', ['Bertrand', 'Aurélie']],
    [ 'Margot', ['Bertrand', 'Aurélie']],
    [ 'Bilal', ['Caro']],
    ],
    receivers: [
      'Gilles',
      'Véro',
      'Sophie',
      'Bertrand',
      'Aurélie',
      'Caro',
    ]
  });

  return engine.getAssignments();
}