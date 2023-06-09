import * as React from "react";
import { Col, Container, Row } from "react-bootstrap";

import { NumberInput, NumberInputProps } from "../shared/number-input";
import { randomInt } from "../utils/random";
import { GameModes } from "./AutomatonInterfaceSize";
import { CellularAutomatonGame } from "./cellular-automaton-game";
import { CellularAutomatonSketch } from "./cellular-automaton-sketch";
import { AntDirectionRule } from "./components/ant-direction-rule";
import { AntDirections } from "./models/ant/AntDirections";
import { AntMatrix } from "./models/ant/AntMatrix";
import { AntParameters } from "./models/ant/AntParameters";
import { AntTypeState } from "./models/ant/AntType";

interface AntGameState {
  numberOfColors: number;
  numberOfAnts: number;
  directions: Array<AntDirections | null>;
}

const ANT_COLORS: AntTypeState[] = Object.keys(AntTypeState)
  .filter((k) => typeof AntTypeState[k] === "number")
  .map((k) => AntTypeState[k]);
const ANT_DIRECTIONS: AntDirections[] = Object.keys(AntDirections)
  .filter((k) => typeof AntDirections[k] === "number")
  .map((k) => AntDirections[k]);

export class AntGame extends CellularAutomatonGame<AntMatrix, AntGameState> {
  public state: AntGameState = this.getState(new AntParameters());

  protected sketch = new CellularAutomatonSketch<AntMatrix>(
    new AntMatrix(),
    GameModes.LANGTONS_ANT
  );

  protected getState(rule: AntParameters): AntGameState {
    return {
      numberOfColors: rule.getNbColors(),
      numberOfAnts: rule.getNbAnt(),
      directions: ANT_COLORS.map((i) => rule.getDirection(i)),
    };
  }

  protected getCommands(): JSX.Element {
    return (
      <div>
        <NumberInput {...this.getColorsProps()} />
        <Container>
          <Row>
            {ANT_COLORS.map((index, i) => {
              const dir = this.state.directions[i];
              return (
                dir !== null && (
                  <Col sm={3} key={index}>
                    <AntDirectionRule
                      index={index}
                      value={this.getAntDirectionLetter(dir)}
                      onClick={() => {
                        const currentIndex = dir as number;
                        const nextIndex =
                          (currentIndex + 1) % ANT_DIRECTIONS.length;
                        this.sketch.matrix
                          .getRules()
                          .setDirection(i, ANT_DIRECTIONS[nextIndex]);
                        this.updateState();
                      }}
                    />
                  </Col>
                )
              );
            })}
          </Row>
        </Container>
      </div>
    );
  }

  protected renderInfoSection(): JSX.Element {
    return <span>{this.strings.ant.tips}</span>;
  }

  private getColorsProps(): NumberInputProps {
    return {
      min: 2,
      max: ANT_COLORS.length,
      step: 1,
      label: this.strings.ant.colors,
      value: this.state.numberOfColors,
      onValueChanged: (nbColors: number) => {
        const rules = this.sketch.matrix.getRules();
        while (rules.getNbColors() > nbColors) {
          rules.removeDirection();
        }
        while (rules.getNbColors() < nbColors) {
          const dir: AntDirections =
            ANT_DIRECTIONS[randomInt(0, ANT_DIRECTIONS.length)];
          rules.addDirection(dir);
        }
        this.updateState();
      },
    };
  }

  private getAntDirectionLetter(direction: AntDirections): string {
    switch (direction) {
      case AntDirections.LEFT:
        return this.strings.ant.left;
      case AntDirections.RIGHT:
        return this.strings.ant.right;
      default:
        throw new Error("AntGame.getAntDirectionLetter");
    }
  }
}
