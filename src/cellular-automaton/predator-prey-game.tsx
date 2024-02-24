import * as React from "react";

import { CheckboxInput, CheckboxInputProps } from "../shared/checkbox-input";
import { GraphLine } from "../shared/graph/graph-line";
import { SelectInput, SelectInputProps } from "../shared/select-input";
import { formatString } from "../utils/string-formating-utilities";
import { GameModes } from "./AutomatonInterfaceSize";
import { CellularAutomatonGame } from "./cellular-automaton-game";
import { CellularAutomatonSketch } from "./cellular-automaton-sketch";
import { BorderCells } from "./models/BorderCells";
import { PredatorPreyMatrix } from "./models/predator-prey/PredatorPreyMatrix";
import { PredatorPreyMode, PredatorPreyModeList, PredatorPreyParameters } from "./models/predator-prey/PredatorPreyParameters";

interface PredatorPreyState {
  mode: PredatorPreyMode;
  borders: BorderCells;
  isHexaGrid: boolean;
}

export class PredatorPreyGame extends CellularAutomatonGame<
  PredatorPreyMatrix,
  PredatorPreyState
> {
  public state: PredatorPreyState = this.getState(new PredatorPreyParameters());
  protected matrix = new PredatorPreyMatrix();
  protected sketch = new CellularAutomatonSketch<PredatorPreyMatrix>(
    this.matrix,
    GameModes.PREDATOR_PREY
  );

  protected getState(rule: PredatorPreyParameters): PredatorPreyState {
    return {
      mode: rule.numberOfStates,
      borders: rule.getBorderType(),
      isHexaGrid: rule.isHexaGrid(),
    };
  }

  protected getCommands(): JSX.Element {
    return (
      <div>
        <SelectInput {...this.getModesProps()} />
        <SelectInput {...this.getBordersProps()} />
        <CheckboxInput {...this.getIsHexaProps()} />
      </div>
    );
  }

  // todo: rules + graph
  protected renderInfoSection(): JSX.Element {
    return (
      <div>
        <span>{this.strings.predatorPrey.tips}</span>
        <GraphLine height={150} width={300} {...this.matrix.getGraphLinesProps()} />
      </div>
    );
  }

  private getModesProps(): SelectInputProps<PredatorPreyMode> {
    return {
      label: this.strings.predatorPrey.mode,
      options: PredatorPreyModeList,
      selectedOption: this.state.mode,
      onOptionChanged: (selectedMode: PredatorPreyMode) => {
        this.sketch.matrix.getRules().numberOfStates = selectedMode;
        this.updateState();
        this.sketch.updateAllCells();
      },
      getName: (mode: PredatorPreyMode) => formatString(this.strings.predatorPrey.modeNameFormat, mode.toString()),
    };
  }

  private getIsHexaProps(): CheckboxInputProps {
    return {
      label: this.strings.predatorPrey.hexGrid,
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
      label: this.strings.predatorPrey.borders,
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
}
