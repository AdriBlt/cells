import { peekRandomElement } from "../../../utils/list-helpers";
import { AutomatonCell } from "../AutomatonCell";
import { AutomatonParameters } from "../AutomatonParameters";
import { AutomatonType } from "../AutomatonType";
import { BorderCells } from "../BorderCells";
import { PredatorPreyCell } from "./PredatorPreyCell";
import { PredatorPreyState, PredatorPreyType } from "./PredatorPreyType";

export enum PredatorPreyMode {
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}
export const PredatorPreyModeList = [
  PredatorPreyMode.THREE,
  PredatorPreyMode.FOUR,
  PredatorPreyMode.FIVE,
];

const CellStatePool: {[key in PredatorPreyMode]: PredatorPreyState[]} = {
  [PredatorPreyMode.THREE]: [PredatorPreyState.HEN, PredatorPreyState.FOX, PredatorPreyState.SNAKE],
  [PredatorPreyMode.FOUR]: [PredatorPreyState.HEN, PredatorPreyState.FOX, PredatorPreyState.SNAKE, PredatorPreyState.EAGLE],
  [PredatorPreyMode.FIVE]: [PredatorPreyState.HEN, PredatorPreyState.FOX, PredatorPreyState.SNAKE, PredatorPreyState.EAGLE, PredatorPreyState.SHARK],
}
const Predators: {[key in PredatorPreyState]: PredatorPreyState[]} = {
  [PredatorPreyState.HEN]: [PredatorPreyState.FOX, PredatorPreyState.EAGLE],
  [PredatorPreyState.SNAKE]: [PredatorPreyState.SHARK, PredatorPreyState.HEN],
  [PredatorPreyState.FOX]: [PredatorPreyState.SHARK, PredatorPreyState.SNAKE],
  [PredatorPreyState.SHARK]: [PredatorPreyState.HEN, PredatorPreyState.EAGLE],
  [PredatorPreyState.EAGLE]: [PredatorPreyState.SNAKE, PredatorPreyState.FOX],
}

export class PredatorPreyParameters extends AutomatonParameters {
  private _numberOfStates: PredatorPreyMode;

  public get numberOfStates(): PredatorPreyMode {
    return this._numberOfStates;
  }
  public set numberOfStates(value: PredatorPreyMode) {
    this._numberOfStates = value;
  }

  constructor() {
    super(BorderCells.Torus);
    this.numberOfStates = PredatorPreyMode.THREE;
  }

  public getType(cell: AutomatonCell): AutomatonType {
    return new PredatorPreyType((cell as PredatorPreyCell).getCurrentStatus());
  }

  public getRandomStatus(): PredatorPreyState {
    return peekRandomElement(CellStatePool[this.numberOfStates]);
  }

  public changeStatus(cell: PredatorPreyCell): void {
    const statuses = CellStatePool[this.numberOfStates];
    const index = statuses.indexOf(cell.getCurrentStatus());
    const status = index >= 0
      ? statuses[(index + 1) % statuses.length]
      : peekRandomElement(statuses)
    cell.setPreviousStatus(cell.getCurrentStatus());
    cell.setCurrentStatus(status);
  }

  public getNextStatus(cellState: PredatorPreyState, neighbourStates: PredatorPreyState[]): PredatorPreyState {
    const neighbourPredators = neighbourStates.filter((state) => Predators[cellState].includes(state));
    return neighbourPredators.length === 0
      ? cellState
      : peekRandomElement(neighbourPredators);
  }
}
