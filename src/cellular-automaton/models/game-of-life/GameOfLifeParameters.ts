import { AutomatonCell } from "../AutomatonCell";
import { AutomatonParameters } from "../AutomatonParameters";
import { BorderCells } from "../BorderCells";
import { GameOfLifeCell } from "./GameOfLifeCell";
import { GameOfLifeMode, GameOfLifeModes, getMode } from "./GameOfLifeMode";
import {
  GameOfLifeCellState,
  GameOfLifeType,
  getBurningType,
  getColoredType,
  getSimpleType,
} from "./GameOfLifeType";

export class GameOfLifeParameters extends AutomatonParameters {
  private born: boolean[];
  private stay: boolean[];
  private burnState: boolean;
  private hasColors: boolean;
  private mode: GameOfLifeMode;

  constructor() {
    super(BorderCells.Torus);
    this.born = [];
    this.stay = [];
    this.hasColors = true;
    this.initRules(GameOfLifeModes.QuadLife);
  }

  public initRules(automate: GameOfLifeMode): void {
    const size = automate.isHexa ? 7 : 9;
    this.mode = automate;
    const borns = automate.borns;
    const stays = automate.stays;
    for (let i = 0; i < size; i++) {
      this.born[i] = false;
      this.stay[i] = false;
    }
    for (const b of borns) {
      if (b >= 0 && b < size) {
        this.born[b] = true;
      }
    }
    for (const b of stays) {
      if (b >= 0 && b < size) {
        this.stay[b] = true;
      }
    }
    this.burnState = automate.burns;
    this.setHexaGrid(automate.isHexa);
  }

  public getNextStatus(cell: GameOfLifeCell, nbAlive: number): boolean {
    if (cell.getCurrentStatus()) {
      return this.stay[nbAlive];
    }
    if (this.burnState) {
      if (cell.getPreviousStatus()) {
        return false;
      }
    }
    return this.born[nbAlive];
  }

  public getType(cell: AutomatonCell): GameOfLifeType {
    return new GameOfLifeType(this.getState(cell));
  }

  public getState(cell: AutomatonCell): GameOfLifeCellState {
    if (cell instanceof GameOfLifeCell) {
      const gCell = cell as GameOfLifeCell;
      if (this.burnState) {
        return getBurningType(gCell);
      }
      if (this.hasColors) {
        return getColoredType(gCell);
      }
      return getSimpleType(gCell);
    }
    return GameOfLifeCellState.DEAD;
  }

  public setBorns(value: number, selected: boolean): void {
    if (0 <= value && value < this.born.length) {
      this.born[value] = selected;
      this.updateAutomaton();
    }
  }

  public setStays(value: number, selected: boolean): void {
    if (0 <= value && value < this.stay.length) {
      this.stay[value] = selected;
      this.updateAutomaton();
    }
  }

  public setBurns(burn: boolean): void {
    this.burnState = burn;
    this.updateAutomaton();
  }

  public setColors(color: boolean): void {
    this.hasColors = color;
  }

  public isColored(): boolean {
    return this.hasColors;
  }

  public updateMode(cell: GameOfLifeMode): void {
    if (this.mode === cell) {
      return;
    }
    if (cell === GameOfLifeModes.Custom) {
      this.mode = cell;
      return;
    }
    this.initRules(cell);
  }

  public isBorn(value: number): boolean {
    if (0 <= value && value < this.born.length) {
      return this.born[value];
    }
    return false;
  }

  public isStay(value: number): boolean {
    if (0 <= value && value < this.stay.length) {
      return this.stay[value];
    }
    return false;
  }

  public changeStatus(cell: GameOfLifeCell): void {
    if (cell.getCurrentStatus()) {
      cell.setPreviousStatus(true);
      cell.setCurrentStatus(false);
      return;
    }

    if (this.burnState) {
      if (cell.getPreviousStatus()) {
        cell.setPreviousStatus(false);
        return;
      }
    }

    cell.setPreviousStatus(false);
    cell.setCurrentStatus(true);
  }

  public getMode(): GameOfLifeMode {
    return this.mode;
  }

  public setHexaGrid(value: boolean) {
    if (this.isHexaGrid() !== value) {
      if (value) {
        // Length: 9 => 7
        this.born.splice(7, 2);
        this.stay.splice(7, 2);
      } else {
        // Length: 7 => 9
        this.born.push(false, false);
        this.stay.push(false, false);
      }

      super.setHexaGrid(value);
      this.updateAutomaton();
    }
  }

  private updateAutomaton(): void {
    this.mode = getMode(
      this.born,
      this.stay,
      this.burnState,
      this.isHexaGrid()
    );
  }
}
