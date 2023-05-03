import { Color, COLORS } from "../../../utils/color";
import { AutomatonType } from "../AutomatonType";
import { GameOfLifeCell } from "./GameOfLifeCell";

export enum GameOfLifeCellState {
  DEAD,
  LIVING,
  BORN,
  TRANSIT,
  DYING,
  IMMUNE,
}

export class GameOfLifeType implements AutomatonType {
  constructor(private cellState: GameOfLifeCellState) {}

  public getBackground(): Color {
    switch (this.cellState) {
      case GameOfLifeCellState.DEAD:
        return COLORS.LightGray;
      case GameOfLifeCellState.LIVING:
        return COLORS.Blue;
      case GameOfLifeCellState.BORN:
        return COLORS.Green;
      case GameOfLifeCellState.TRANSIT:
        return COLORS.Yellow;
      case GameOfLifeCellState.DYING:
        return COLORS.Red;
      case GameOfLifeCellState.IMMUNE:
        return COLORS.Magenta;
      default:
        throw new Error("GameOfLifeType.getBackground: unknown state");
    }
  }
}

export function getColoredType(cell: GameOfLifeCell): GameOfLifeCellState {
  if (cell.isImmune()) {
    return GameOfLifeCellState.IMMUNE;
  }
  if (cell.getCurrentStatus()) {
    if (cell.getPreviousStatus()) {
      if (cell.getNextStatus()) {
        return GameOfLifeCellState.LIVING;
      } else {
        return GameOfLifeCellState.DYING;
      }
    } else {
      if (cell.getNextStatus()) {
        return GameOfLifeCellState.BORN;
      } else {
        return GameOfLifeCellState.TRANSIT;
      }
    }
  } else {
    return GameOfLifeCellState.DEAD;
  }
}

export function getBurningType(cell: GameOfLifeCell): GameOfLifeCellState {
  if (cell.getCurrentStatus()) {
    return GameOfLifeCellState.LIVING;
  } else {
    if (cell.getPreviousStatus()) {
      return GameOfLifeCellState.DYING;
    } else {
      return GameOfLifeCellState.DEAD;
    }
  }
}

export function getSimpleType(cell: GameOfLifeCell): GameOfLifeCellState {
  if (cell.getCurrentStatus()) {
    return GameOfLifeCellState.LIVING;
  } else {
    return GameOfLifeCellState.DEAD;
  }
}
