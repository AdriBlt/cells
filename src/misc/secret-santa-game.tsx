import * as React from "react";
import { Button, Card, Collapse } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

import { SantaBinaryEngine } from "./santa-binary-engine";
import { SantaEngine } from "./santa-engine";
import { GiftAssignmentResult, Santa } from "./santa/santa-model";

interface SantaDraw {
  title: string;
  engine: Santa;
}

interface SantaSection {
  assignments: GiftAssignmentResult[];
  isOpen: boolean;
}

interface SecretSantaState {
  sections: SantaSection[];
}

export class SecretSantaGame extends React.Component<{}, SecretSantaState> {
  public state: SecretSantaState;

  private draws: SantaDraw[] = [
    { title: "Verrat", engine: getVerratEngine() },
    { title: "Verrat kids", engine: getVerratKidsEngine() },
    { title: "Olivier : parents", engine: getOlivierParentEngine() },
    { title: "Olivier : parents \u2192 enfants", engine: getOlivierParentEnfantEngine() },
    { title: "Olivier : enfants", engine: getOlivierEnfantEngine() },
  ];

  constructor(props: {}) {
    super(props);
    this.state = {
      sections: this.draws.map(d => ({ assignments: computeAssignments(d.engine), isOpen: true })),
    };
  }

  public render = () => (
    <div style={{ padding: 10 }}>
      {this.draws.map((draw, i) => this.renderSection(draw, this.state.sections[i], i))}
    </div>
  );

  private renderSection(draw: SantaDraw, section: SantaSection, index: number): JSX.Element {
    return (
      <Card key={draw.title} style={{ marginBottom: 10 }}>
        <Card.Header style={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="link"
            onClick={() => this.toggleSection(index)}
            aria-expanded={section.isOpen}
            style={{ flex: 1, textAlign: "left", fontWeight: "bold", padding: 0 }}
          >
            <span style={{ marginRight: 5 }}>
              {section.isOpen ? <Icon.ChevronUp /> : <Icon.ChevronDown />}
            </span>
            {draw.title}
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            title="Refaire ce tirage"
            aria-label={`Refaire le tirage ${draw.title}`}
            onClick={() => this.recomputeSection(index)}
          >
            <Icon.ArrowClockwise />
          </Button>
        </Card.Header>
        <Collapse in={section.isOpen}>
          <div>
            <Card.Body>
              <ul style={{ marginBottom: 0 }}>
                {section.assignments.map(a => (
                  <li key={`${a.from}->${a.to}`}>{`${a.from} offre un cadeau \u00e0 ${a.to}`}</li>
                ))}
              </ul>
            </Card.Body>
          </div>
        </Collapse>
      </Card>
    );
  }

  private toggleSection(index: number): void {
    this.updateSection(index, s => ({ ...s, isOpen: !s.isOpen }));
  }

  private recomputeSection(index: number): void {
    const assignments = computeAssignments(this.draws[index].engine);
    this.updateSection(index, s => ({ ...s, assignments }));
  }

  private updateSection(index: number, update: (s: SantaSection) => SantaSection): void {
    this.setState(state => ({
      sections: state.sections.map((s, i) => (i === index ? update(s) : s)),
    }));
  }
}

function computeAssignments(engine: Santa): GiftAssignmentResult[] {
  engine.computeGifts();
  return engine.getAssignments();
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

function getVerratKidsEngine() {
  const engine = new SantaEngine();
  engine.addSiblings('Lucie', 'Clémence', 'Gabriel');
  engine.addSiblings('Capucine');
  engine.addSiblings('Raphaëlle', 'Sienne', 'Victoria');
  engine.addSiblings('Jim');
  engine.addSiblings('Baptiste', 'Tristant');
  engine.addSiblings('Colette');
  engine.addSiblings('Arthur', 'Sasha');
  engine.addSiblings('Marin');
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