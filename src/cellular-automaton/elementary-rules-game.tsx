import * as React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

import { NumberInput, NumberInputProps } from "../shared/number-input";
import { randomInt } from "../utils/random";
import { GameModes } from "./AutomatonInterfaceSize";
import { CellularAutomatonGame } from "./cellular-automaton-game";
import { CellularAutomatonSketch } from "./cellular-automaton-sketch";
import { BiteRule } from "./components/bite-rule";
import { ElementaryRulesMatrix } from "./models/elementaryrules/ElementaryRulesMatrix";
import { ElementaryRulesParameters } from "./models/elementaryrules/ElementaryRulesParameters";

interface ElementaryRulesState {
  ruleNumber: number;
  binaries: boolean[];
}

const INPUT_COUNT = 8;
const INPUTS: number[] = Array.from(Array(INPUT_COUNT).keys()).map(
  (i) => INPUT_COUNT - 1 - i
);

export class ElementaryRulesGame extends CellularAutomatonGame<
  ElementaryRulesMatrix,
  ElementaryRulesState
> {
  public state: ElementaryRulesState = this.getState(
    new ElementaryRulesParameters()
  );

  protected sketch = new CellularAutomatonSketch<ElementaryRulesMatrix>(
    new ElementaryRulesMatrix(),
    GameModes.ELEMENTARY_RULES
  );

  protected getState(rule: ElementaryRulesParameters): ElementaryRulesState {
    return {
      ruleNumber: rule.getRuleNumber(),
      binaries: INPUTS.map((i) => rule.getBinaryRule(i)),
    };
  }

  protected getCommands(): JSX.Element {
    return (
      <div>
        <NumberInput
          {...this.getRuleNumberProps()}
          appendComponent={
            <Button onClick={this.shuffleRule}>
              <Icon.Shuffle />
            </Button>
          }
        />
        <Container>
          <Row>
            {INPUTS.map((index, i) => (
              <Col sm={3}>
                <BiteRule
                  key={index}
                  index={index}
                  value={this.state.binaries[i]}
                  onClick={() => {
                    this.sketch.matrix.getRules().updateBinary(index);
                    this.updateState();
                  }}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    );
  }

  protected renderInfoSection(): JSX.Element {
    return <span>{this.strings.elementaryRules.tips}</span>;
  }

  private getRuleNumberProps(): NumberInputProps {
    return {
      label: this.strings.elementaryRules.ruleNumber,
      min: 0,
      max: 255,
      step: 1,
      value: this.state.ruleNumber,
      onValueChanged: (selectedRule: number) => {
        this.sketch.matrix.getRules().setRuleNumber(selectedRule);
        this.updateState();
      },
    };
  }

  private shuffleRule = (): void => {
    const rule = randomInt(0, 256);
    this.sketch.matrix.getRules().setRuleNumber(rule);
    this.updateState();
  };
}
