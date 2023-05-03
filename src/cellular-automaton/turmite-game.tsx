import * as React from "react";
import { Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

import { CheckboxInput, CheckboxInputProps } from "../shared/checkbox-input";
import { SelectInput, SelectInputProps } from "../shared/select-input";
import { LocalizedStrings } from "../strings";
import { randomBool, randomInt } from "../utils/random";
import { GameModes } from "./AutomatonInterfaceSize";
import { CellularAutomatonGame } from "./cellular-automaton-game";
import { CellularAutomatonSketch } from "./cellular-automaton-sketch";
import { TurmiteRule } from "./components/turmite-rule";
import {
  getNextTurmiteDirection,
  getRandomTurmiteDirection,
  parseTurmiteDirection,
  TurmiteDirection,
} from "./models/turmite/TurmiteDirection";
import { TurmiteMatrix } from "./models/turmite/TurmiteMatrix";
import {
  getTurmiteIndex,
  TurmiteParameters,
} from "./models/turmite/TurmiteParameters";

interface TurmiteState {
  cellState: boolean;
  direction: TurmiteDirection;
  turmiteState: number;
}

interface TurmiteGameState {
  decisions: TurmiteState[];
  selectedBehavior: TurmiteBehavior;
  isThreeStateTurmite: boolean;
}

interface TurmiteBehavior {
  name: string;
  decisions: TurmiteState[];
  isThreeStateTurmite: boolean;
}

export class TurmiteGame extends CellularAutomatonGame<
  TurmiteMatrix,
  TurmiteGameState
> {
  public registeredRules: TurmiteBehavior[] = getRegisteredRules(this.strings);
  public state: TurmiteGameState = this.getState(new TurmiteParameters());

  protected sketch = new CellularAutomatonSketch<TurmiteMatrix>(
    new TurmiteMatrix(),
    GameModes.LANGTONS_ANT
  );

  protected getState(rule: TurmiteParameters): TurmiteGameState {
    const isThreeStateTurmite = rule.isThreeStatesMode();
    const decisions = [
      getDecision(rule, false, 0),
      getDecision(rule, true, 0),
      getDecision(rule, false, 1),
      getDecision(rule, true, 1),
    ];
    if (isThreeStateTurmite) {
      decisions.push(getDecision(rule, false, 2), getDecision(rule, true, 2));
    }

    const turmineBehavior: TurmiteBehavior = {
      decisions,
      isThreeStateTurmite,
      name: this.getRuleName(decisions, isThreeStateTurmite),
    };
    return {
      decisions,
      isThreeStateTurmite,
      selectedBehavior: turmineBehavior,
    };
  }

  protected getCommands(): JSX.Element {
    return (
      <div>
        <SelectInput
          {...this.getRulesProps()}
          appendComponent={
            <Button onClick={this.shuffleRule}>
              <Icon.Shuffle />
            </Button>
          }
        />
        {this.renderTurmiteRule(false, 0)}
        {this.renderTurmiteRule(true, 0)}
        {this.renderTurmiteRule(false, 1)}
        {this.renderTurmiteRule(true, 1)}
        {this.state.isThreeStateTurmite && (
          <>
            {this.renderTurmiteRule(false, 2)}
            {this.renderTurmiteRule(true, 2)}
          </>
        )}
        <CheckboxInput {...this.getNumberOfStatusProps()} />
      </div>
    );
  }

  protected renderInfoSection(): JSX.Element {
    return <span>{this.strings.turmite.tips}</span>;
  }

  private getRulesProps = (): SelectInputProps<TurmiteBehavior> => {
    const options = this.registeredRules;
    options.push({
      decisions: [],
      isThreeStateTurmite: false,
      name: this.strings.turmite.ruleCustom,
    });
    return {
      label: this.strings.turmite.ruleSelector,
      options,
      selectedOption: this.state.selectedBehavior,
      onOptionChanged: (behavior: TurmiteBehavior): void => {
        if (behavior.name !== this.strings.turmite.ruleCustom) {
          this.setRule(
            behavior.decisions,
            behavior.isThreeStateTurmite
            );
          }
      },
      getName: behavior => behavior.name,
    };
  };

  private shuffleRule = (): void => {
    const rules: TurmiteState[] = [];
    const statesSize = this.state.isThreeStateTurmite ? 3 : 2;
    const decisionsSize = 2 * statesSize;
    for (let i = 0; i < decisionsSize; i++) {
      rules.push({
        cellState: randomBool(),
        direction: getRandomTurmiteDirection(),
        turmiteState: randomInt(0, statesSize),
      });
    }

    this.setRule(rules, this.state.isThreeStateTurmite);
  };

  private setRule = (
    decisions: TurmiteState[],
    isThreeStateTurmite: boolean
  ): void => {
    const rules = this.sketch.matrix.getRules();
    rules.setThreeStatesModes(isThreeStateTurmite);
    updateRules(rules, decisions);
    this.updateState();
  };

  private getRuleName(
    decisions: TurmiteState[],
    isThreeStateTurmite: boolean
  ): string {
    if (this.registeredRules) {
      for (const rule of this.registeredRules) {
        if (
          isThreeStateTurmite === rule.isThreeStateTurmite &&
          isSameRule(decisions, rule.decisions)
        ) {
          return rule.name;
        }
      }
    }

    return this.strings.turmite.ruleCustom;
  }

  private renderTurmiteRule(
    cellStatus: boolean,
    turmiteStatus: number
  ): JSX.Element {
    const rules = this.sketch.matrix.getRules();
    const index = getTurmiteIndex(cellStatus, turmiteStatus);
    const turmiteState = this.state.decisions[index];
    return (
      <TurmiteRule
        index={index}
        turmiteStatus={turmiteStatus}
        cellStatus={cellStatus}
        nextCellStatus={turmiteState.cellState}
        nextDirection={turmiteState.direction}
        nextTurmiteStatus={turmiteState.turmiteState}
        onNextCellColorChange={() => {
          rules.setCellColor(
            cellStatus,
            turmiteStatus,
            !turmiteState.cellState
          );
          this.updateState();
        }}
        onNextDirectionChange={() => {
          rules.setDirection(
            cellStatus,
            turmiteStatus,
            getNextTurmiteDirection(turmiteState.direction)
          );
          this.updateState();
        }}
        onNextTurmiteColorChange={() => {
          const numberOfTurmiteStatus = this.state.isThreeStateTurmite ? 3 : 2;
          rules.setTurmiteStatus(
            cellStatus,
            turmiteStatus,
            (turmiteState.turmiteState + 1) % numberOfTurmiteStatus
          );
          this.updateState();
        }}
      />
    );
  }

  private getNumberOfStatusProps = (): CheckboxInputProps => {
    return {
      label: this.strings.turmite.threeStateLabel,
      value: this.state.isThreeStateTurmite,
      onValueChanged: () => {
        this.sketch.matrix
          .getRules()
          .setThreeStatesModes(!this.state.isThreeStateTurmite);
        this.updateState();
      },
      tooltip: this.strings.turmite.threeStateTooltip,
    };
  };
}

function getDecision(
  rule: TurmiteParameters,
  cellState: boolean,
  turmiteState: number
): TurmiteState {
  const decision = rule.getDecision(cellState, turmiteState);
  return {
    turmiteState: decision.getNextTurmiteStatus(),
    cellState: decision.getNextCellStatus(),
    direction: decision.getNextDirection(),
  };
}

function updateRules(
  rule: TurmiteParameters,
  decisions: TurmiteState[]
): TurmiteParameters {
  for (let i = 0; i < decisions.length; i++) {
    const cellStatus = parseBool(Math.floor(i % 2));
    const turmiteState = Math.floor(i / 2);
    rule.setCellColor(cellStatus, turmiteState, decisions[i].cellState);
    rule.setDirection(cellStatus, turmiteState, decisions[i].direction);
    rule.setTurmiteStatus(cellStatus, turmiteState, decisions[i].turmiteState);
  }

  return rule;
}

function parseBool(value: number): boolean {
  switch (value) {
    case 0:
      return false;
    case 1:
      return true;
    default:
      throw new Error("TurmiteGame.parseBool");
  }
}

function isSameRule(a: TurmiteState[], b: TurmiteState[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (
      a[i].cellState !== b[i].cellState ||
      a[i].direction !== b[i].direction ||
      a[i].turmiteState !== b[i].turmiteState
    ) {
      return false;
    }
  }

  return true;
}

function getRegisteredRules(strings: LocalizedStrings): TurmiteBehavior[] {
  return [
    createRule(
      strings.turmite.ruleSpiralGrowth,
      [
        [1, 1, 1],
        [1, 8, 0],
        [1, 2, 1],
        [0, 1, 0],
      ],
      false
    ),
    createRule(
      strings.turmite.ruleChaoticHighway,
      [
        [1, 2, 1],
        [0, 2, 1],
        [1, 1, 0],
        [1, 1, 1],
      ],
      false
    ),
    createRule(
      strings.turmite.ruleChaoticGrowth,
      [
        [1, 2, 1],
        [1, 8, 1],
        [1, 2, 1],
        [0, 2, 0],
      ],
      false
    ),
    createRule(
      strings.turmite.ruleFramedGrowth,
      [
        [1, 8, 0],
        [1, 2, 1],
        [0, 2, 0],
        [0, 8, 1],
      ],
      false
    ),
    createRule(
      strings.turmite.ruleFibonacciSpiral,
      [
        [1, 8, 1],
        [1, 8, 1],
        [1, 2, 1],
        [0, 1, 0],
      ],
      false
    ),
    createRule(
      strings.turmite.ruleSnowflakeFractal,
      [[1, 8, 1], [1, 2, 0], [1, 4, 1], [1, 4, 2], [], [0, 4, 0]],
      true
    ),
  ];
}

function createRule(
  name: string,
  bytes: number[][],
  isThreeStateTurmite: boolean
): TurmiteBehavior {
  if (bytes.length !== (isThreeStateTurmite ? 6 : 4)) {
    throw new Error("TurmiteGame.createRule: invalid decisions length");
  }

  const decisions: TurmiteState[] = [];
  for (const decision of bytes) {
    if (decision.length === 0) {
      decisions.push({
        cellState: false,
        direction: TurmiteDirection.NO_TURN,
        turmiteState: 0,
      });
    } else if (decision.length !== 3) {
      throw new Error("TurmiteGame.createRule: invalid byte length");
    } else {
      const cellState = parseBool(decision[0]);
      const direction = parseTurmiteDirection(decision[1]);
      const turmiteState = decision[2];
      decisions.push({ cellState, direction, turmiteState });
    }
  }

  return { name, decisions, isThreeStateTurmite };
}
