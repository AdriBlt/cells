import { getAntType } from "../ant/AntType";
import { AutomatonCell } from "../AutomatonCell";
import { AutomatonParameters } from "../AutomatonParameters";
import { AutomatonType } from "../AutomatonType";
import { BorderCells } from "../BorderCells";
import { TurmiteCell } from "./TurmiteCell";
import { TurmiteDecisions } from "./TurmiteDecisions";
import { TurmiteDirection } from "./TurmiteDirection";
import { getTurmiteType } from "./TurmiteType";

export class TurmiteParameters extends AutomatonParameters {
  private decisions: TurmiteDecisions[];

  constructor(border: BorderCells = BorderCells.Torus) {
    super(border);
    this.decisions = getDefaultParameters(4);
  }

  public isThreeStatesMode(): boolean {
    switch (this.decisions.length) {
      case 4:
        return false;
      case 6:
        return true;
      default:
        throw new Error(
          `TurmiteParameters.isThreeStatesMode(): invalidlength ${this.decisions.length}`
        );
    }
  }

  public setThreeStatesModes(value: boolean): void {
    if (this.isThreeStatesMode() === value) {
      return;
    }

    if (value) {
      this.decisions.push(new TurmiteDecisions(), new TurmiteDecisions());
    } else {
      this.decisions.splice(4, 2);
      for (const decision of this.decisions) {
        if (decision.getNextTurmiteStatus() > 1) {
          decision.setNextTurmiteStatus(0);
        }
      }
    }
  }

  public getDecision(cell: boolean, turmite: number): TurmiteDecisions {
    return this.decisions[getTurmiteIndex(cell, turmite)];
  }

  public getType(cell: AutomatonCell): AutomatonType {
    if (cell instanceof TurmiteCell) {
      const tCell = cell as TurmiteCell;
      return getTurmiteType(tCell.getStatus());
    }
    return getAntType(0);
  }

  public setCellColor(
    cellStatus: boolean,
    turmiteStatus: number,
    value: boolean
  ): void {
    this.getDecision(cellStatus, turmiteStatus).setNextCellStatus(value);
  }

  public setTurmiteStatus(
    cellStatus: boolean,
    turmiteStatus: number,
    value: number
  ): void {
    this.getDecision(cellStatus, turmiteStatus).setNextTurmiteStatus(value);
  }

  public setDirection(
    cellStatus: boolean,
    turmiteStatus: number,
    value: TurmiteDirection
  ): void {
    this.getDecision(cellStatus, turmiteStatus).setNextDirection(value);
  }
}

export function getTurmiteIndex(cellStatus: boolean, turmiteStatus: number) {
  return (cellStatus ? 1 : 0) + 2 * turmiteStatus;
}

function getDefaultParameters(size: number): TurmiteDecisions[] {
  const decisions: TurmiteDecisions[] = [];
  for (let i = 0; i < size; i++) {
    // Chaotic Highway
    decisions.push(
      new TurmiteDecisions(
        i !== 1,
        i < 2 ? TurmiteDirection.RIGHT : TurmiteDirection.NO_TURN,
        i !== 2 ? 1 : 0
      )
    );
  }

  return decisions;
}
