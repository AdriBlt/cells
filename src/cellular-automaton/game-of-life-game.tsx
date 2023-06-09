import * as React from "react";
import { Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";

import { CheckboxInput, CheckboxInputProps } from "../shared/checkbox-input";
import { SelectInput, SelectInputProps } from "../shared/select-input";
import { GameModes } from "./AutomatonInterfaceSize";
import { CellularAutomatonGame } from "./cellular-automaton-game";
import { CellularAutomatonSketch } from "./cellular-automaton-sketch";
import { BorderCells } from "./models/BorderCells";
import { GameOfLifeMatrix } from "./models/game-of-life/GameOfLifeMatrix";
import { GameOfLifeMode, GameOfLifeModesList } from "./models/game-of-life/GameOfLifeMode";
import { GameOfLifeParameters } from "./models/game-of-life/GameOfLifeParameters";

interface GameOfLifeState {
  mode: GameOfLifeMode;
  isBurning: boolean;
  isColored: boolean;
  borders: BorderCells;
  isHexaGrid: boolean;
}

export class GameOfLifeGame extends CellularAutomatonGame<
  GameOfLifeMatrix,
  GameOfLifeState
> {
  public state: GameOfLifeState = this.getState(new GameOfLifeParameters());

  protected sketch = new CellularAutomatonSketch<GameOfLifeMatrix>(
    new GameOfLifeMatrix(),
    GameModes.GAME_OF_LIFE
  );

  protected getState(rule: GameOfLifeParameters): GameOfLifeState {
    return {
      mode: rule.getMode(),
      isBurning: rule.getMode().burns,
      isColored: rule.isColored(),
      borders: rule.getBorderType(),
      isHexaGrid: rule.isHexaGrid(),
    };
  }

  protected getCommands(): JSX.Element {
    return (
      <div>
        <SelectInput {...this.getModesProps()} />
        {this.renderBornConditions()}
        {this.renderLiveConditions()}
        <CheckboxInput {...this.getBurnsProps()} />
        <CheckboxInput {...this.getColoredProps()} />
        <SelectInput {...this.getBordersProps()} />
        <CheckboxInput {...this.getIsHexaProps()} />
      </div>
    );
  }

  protected renderInfoSection(): JSX.Element {
    return <span>{this.strings.gameOfLife.tips}</span>;
  }

  private getModesProps(): SelectInputProps<GameOfLifeMode> {
    return {
      label: this.strings.gameOfLife.mode,
      options: GameOfLifeModesList,
      selectedOption: this.state.mode,
      onOptionChanged: (selectedMode: GameOfLifeMode) => {
        this.sketch.matrix.getRules().updateMode(selectedMode);
        this.updateState();
        this.sketch.updateAllCells();
      },
      getName: (mode: GameOfLifeMode) => mode.name,
    };
  }

  private getBurnsProps(): CheckboxInputProps {
    return {
      label: this.strings.gameOfLife.burning,
      value: this.state.isBurning,
      onValueChanged: (value: boolean) => {
        this.sketch.matrix.getRules().setBurns(value);
        this.updateState();
      },
      tooltip: this.strings.gameOfLife.burningTooltip,
    };
  }

  private getColoredProps(): CheckboxInputProps {
    return {
      label: this.strings.gameOfLife.colors,
      value: this.state.isColored,
      onValueChanged: (value: boolean) => {
        this.sketch.matrix.getRules().setColors(value);
        this.updateState();
      },
      tooltip: this.strings.gameOfLife.colorsTooltip,
      disabled: this.state.isBurning,
    };
  }

  private getIsHexaProps(): CheckboxInputProps {
    return {
      label: this.strings.gameOfLife.hexGrid,
      value: this.state.isHexaGrid,
      onValueChanged: (value: boolean) => {
        this.sketch.matrix.getRules().setHexaGrid(value);
        this.updateState();
      },
    };
  }

  private getBordersProps(): SelectInputProps<BorderCells> {
    const borderValues = [
      BorderCells.Torus,
      BorderCells.Dead,
      BorderCells.Alive,
      BorderCells.Mirror,
    ];
    return {
      label: this.strings.gameOfLife.borders,
      options: borderValues,
      selectedOption: this.state.borders,
      onOptionChanged: (selectedBorder: string) => {
        const border = Object.keys(BorderCells).find(
          (m) => m === selectedBorder
        );
        if (border) {
          this.sketch.matrix.getRules().setBorders(BorderCells[border]);
          this.updateState();
        }
      },
      getName: (border: BorderCells) => border,
    };
  }

  private renderBornConditions(): React.ReactNode {
    const rules = this.sketch.matrix.getRules();
    return this.renderNumberOfCellsConditions(
      this.strings.gameOfLife.bornConditions,
      (i) => rules.isBorn(i),
      (i, b) => rules.setBorns(i, b)
    );
  }

  private renderLiveConditions(): React.ReactNode {
    const rules = this.sketch.matrix.getRules();
    return this.renderNumberOfCellsConditions(
      this.strings.gameOfLife.liveConditions,
      (i) => rules.isStay(i),
      (i, b) => rules.setStays(i, b)
    );
  }

  private renderNumberOfCellsConditions(
    label: string,
    getValue: (i: number) => boolean,
    setValue: (i: number, b: boolean) => void
  ): React.ReactNode {
    const numberOfConditions = this.sketch.matrix.getRules().isHexaGrid() ? 7 : 9;
    return (
      <ButtonToolbar>
        {label}
        <ButtonGroup>
          {Array.from(Array(numberOfConditions).keys()).map((i) => (
            <Button
              key={i}
              variant={getValue(i) ? "primary" : "secondary"}
              onClick={() => {
                setValue(i, !getValue(i));
                this.updateState();
              }}
            >
              {i}
            </Button>
          ))}
        </ButtonGroup>
      </ButtonToolbar>
    );
  }
}
