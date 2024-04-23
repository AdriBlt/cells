import * as React from "react";
import { Button } from "react-bootstrap";

import { CheckboxInput } from "../../shared/checkbox-input";
import { NumberInput, NumberInputProps } from "../../shared/number-input";
import { ProcessingComponent } from "../../shared/processing-component";
import { SelectInput, SelectInputProps } from "../../shared/select-input";
import { getStrings, LocalizedStrings } from "../../strings";
import { pluralizeString } from "../../utils/string-formating-utilities";
import { DefaultProps, MinesweeperProps, MinesweeperSketch } from "./minesweeper-sketch";
import { GameStatus } from "./models/game-status";
import { LevelDifficulty, LevelDifficultyConst } from "./models/level-difficulty";

export class MinesweeperGame extends React.Component<{}, MinesweeperProps>
{
  public state = DefaultProps;
  private strings: LocalizedStrings = getStrings();
  private sketch = new MinesweeperSketch({
    onPropsChange: (p) => this.setState(p)
  });

  public render() {
      return (
          <ProcessingComponent
              sketch={this.sketch}
              commandsSection={this.renderCommands()}
              infoSection={this.renderInfoSection()}
          />
      );
  }

  protected renderCommands(): JSX.Element {
    return (
      <div>
        <SelectInput {...this.getDifficultyProps()} />
        <NumberInput {...this.getWidthProps()} />
        <NumberInput {...this.getHeightProps()} />
        <NumberInput {...this.getMinesProps()} />
        <CheckboxInput
          label={this.strings.minesweeper.autoResolve}
          value={this.state.isAutoResolve}
          onValueChanged={(v) => this.sketch.setAutoResolve(v)}
        />
        <Button onClick={() => this.sketch.resetGrid()} block={true}>
          {this.strings.shared.newGame}
        </Button>
      </div>
    );
  }

  protected renderInfoSection(): JSX.Element {
    const endTextMessage =
      this.state.gameStatus === GameStatus.Victory
        ? this.strings.shared.victory
        : this.state.gameStatus === GameStatus.Failure
        ? this.strings.shared.failure
        : "";
    return (
      <div>
        <p
          style={{
            color: this.state.remainingMines < 0 ? "red" : "black",
          }}
        >
          <i>
            {pluralizeString(
              this.strings.minesweeper.remainingMines_plural,
              this.state.remainingMines
            )}
          </i>
        </p>
        <span>
          <b>{endTextMessage}</b>
        </span>
      </div>
    );
  }

  private getDifficultyProps(): SelectInputProps<LevelDifficulty> {
    return {
      label: this.strings.minesweeper.difficulty,
      options: LevelDifficultyConst.values,
      selectedOption: this.state.selectedDifficulty,
      onOptionChanged: difficulty => this.sketch.changeDifficulty(difficulty),
      getName: difficulty => difficulty.name,
    };
  }

  private getWidthProps(): NumberInputProps {
    return {
      min: LevelDifficultyConst.minSide,
      max: LevelDifficultyConst.maxSide,
      label: this.strings.minesweeper.width,
      value: this.state.nbCols,
      onValueChanged: (value) => {
        this.sketch.setProps({ nbCols: value });
        this.updateMinesAndDifficultyIfNeeded();
      },
    };
  }

  private getHeightProps(): NumberInputProps {
    return {
      min: LevelDifficultyConst.minSide,
      max: LevelDifficultyConst.maxSide,
      label: this.strings.minesweeper.height,
      value: this.state.nbRows,
      onValueChanged: (value) => {
        this.sketch.setProps({ nbRows: value });
        this.updateMinesAndDifficultyIfNeeded();
      },
    };
  }

  private getMinesProps(): NumberInputProps {
    return {
      min: LevelDifficultyConst.minMines,
      max: LevelDifficultyConst.maxMines,
      label: this.strings.minesweeper.mines,
      value: this.state.nbMines,
      onValueChanged: (value) => {
        this.sketch.setProps({ nbMines: value });
        this.updateMinesAndDifficultyIfNeeded();
      },
    };
  }

  private updateMinesAndDifficultyIfNeeded = (): void => {
    const maxMines = this.state.nbCols * this.state.nbRows - 1;
    if (this.state.nbMines > maxMines) {
      this.sketch.setProps({ nbMines: maxMines });
    }

    this.sketch.findDifficulty();
  };
}
