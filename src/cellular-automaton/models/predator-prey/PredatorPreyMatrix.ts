import { GraphLineInfo, LineInfo } from "../../../shared/graph/graph-line-sketch";
import { getDirectNeighboursInOrder } from "../../../utils/grid-helper";
import { isDefined } from "../../../utils/list-helpers";
import { Point } from "../../../utils/points";
import { random } from "../../../utils/random";
import { AutomatonLook } from "../AutomatonLook";
import { AutomatonMatrix } from "../AutomatonMatrix";
import { GridUpdate, NextStateGridUpdate } from "../GridUpdate";
import { PredatorPreyCell } from "./PredatorPreyCell";
import { PredatorPreyParameters } from "./PredatorPreyParameters";
import { PredatorPreyState } from "./PredatorPreyType";

const GRAPH_LENGTH = 150;

export class PredatorPreyMatrix extends AutomatonMatrix<
  PredatorPreyCell,
  PredatorPreyParameters
> {
  private time = 0; // TODO REMOVE
  private predatorCount: {[key in PredatorPreyState]: Point[]};

  constructor() {
    super(new PredatorPreyParameters());
    this.resetLines();
  }

  public initialize(nbX: number, nbY: number): void {
    this.xSize = nbX;
    this.ySize = nbY;
    this.matrix = [];
    for (let x = 0; x < this.xSize; x++) {
      this.matrix[x] = [];
      for (let y = 0; y < this.ySize; y++) {
        this.matrix[x][y] = new PredatorPreyCell(x, y, this.getInitialState(x, y));
      }
    }
    this.resetLines();
  }

  public nextStep(): NextStateGridUpdate {
    const count: {[key in PredatorPreyState]: number} = {
      [PredatorPreyState.HEN]: 0,
      [PredatorPreyState.SNAKE]: 0,
      [PredatorPreyState.FOX]: 0,
      [PredatorPreyState.SHARK]: 0,
      [PredatorPreyState.EAGLE]: 0,
    };
    for (let x = 0; x < this.xSize; x++) {
      for (let y = 0; y < this.ySize; y++) {
        const cell = this.getCell(x, y);
        cell.nextStep();
        count[cell.getCurrentStatus()]++;
      }
    }

    const total = Object.values(count).reduce((s, v) => s + v, 0);
    Object.keys(count).forEach((key) => {
      this.predatorCount[key].push({ x: this.time, y: total > 0 ? Math.floor(100 * count[key] / total) : 0 });
      if (this.predatorCount[key].length > GRAPH_LENGTH) {
        this.predatorCount[key].shift();
      }
    });
    this.setNextStatus();
    this.time++;

    return { update: GridUpdate.ALL };
  }

  public getLook(x: number, y: number): AutomatonLook {
    const background = this.getRules()
      .getType(this.getCell(x, y))
      .getBackground();
    return new AutomatonLook(background);
  }

  public getCell(x: number, y: number): PredatorPreyCell {
    return super.getCell(x, y) as PredatorPreyCell;
  }

  public changeStatus(x: number, y: number): GridUpdate {
    const cell = this.getCell(x, y);
    this.getRules().changeStatus(cell);
    this.setBlockCellNextStatus(x, y);
    return GridUpdate.BLOCK;
  }

  public setRandomCells(): void {
    const proba = 0.1;
    for (let x = 0; x < this.xSize; x++) {
      for (let y = 0; y < this.ySize; y++) {
        if (random() < proba) {
          this.changeStatus(x, y);
        }
      }
    }

    this.setNextStatus();
  }

  public getGraphLinesProps(): Pick<GraphLineInfo, 'getLines' | 'getScale'> {
    const timelineMax = Math.max(this.time, GRAPH_LENGTH);
    return {
      getLines: () => this.getGraphLines(),
      getScale: () => ({
        min: { x: timelineMax - GRAPH_LENGTH, y: 0},
        max: { x: timelineMax, y: 100},
      }),
    }
  }

  private getGraphLines(): LineInfo[] {
    return this.getRules().predatorPreyStates.map((state) => {
      return {
        points: this.predatorCount[state],
        color: this.getRules().getStateType(state).getBackground(),
      };
    })
  }

  private getInitialState(x: number, y: number): PredatorPreyState {
    const states = this.getRules().predatorPreyStates;
    const xFromMiddle = x - this.xSize / 2;
    const yFromMiddle = y - this.ySize / 2;
    const theta = Math.atan2(yFromMiddle, xFromMiddle);
    const index = Math.floor(states.length * (0.5 + theta / (2 * Math.PI)));
    return states[index];
  }

  private setNextStatus(): void {
    for (let x = 0; x < this.xSize; x++) {
      for (let y = 0; y < this.ySize; y++) {
        this.setCellNextStatus(x, y);
      }
    }
  }

  private setCellNextStatus(x: number, y: number): void {
    const cell = this.getCell(x, y);
    const neighbours = this.getNeighbourCells(x, y).filter(isDefined).map((nc) => nc.getCurrentStatus());
    const nextStatus = this.getRules().getNextStatus(cell.getCurrentStatus(), neighbours);
    cell.setNextStatus(nextStatus);
  }

  private setBlockCellNextStatus(x: number, y: number): void {
    const neighbours = this.getNeighbourCells(x, y);
    neighbours.push(this.getCell(x, y));
    for (const cell of neighbours) {
      if (cell) {
        this.setCellNextStatus(cell.x, cell.y);
      }
    }
  }

  private getNeighbourCells(
    x: number,
    y: number
  ): Array<PredatorPreyCell | null> {
    return getDirectNeighboursInOrder(x, y, this.getRules().isHexaGrid())
      .map(p => this.getCellOnBorder(p.i, p.j));
  }

  private resetLines() {
    this.time = 0;
    this.predatorCount = {
      [PredatorPreyState.HEN]: [],
      [PredatorPreyState.SNAKE]: [],
      [PredatorPreyState.FOX]: [],
      [PredatorPreyState.SHARK]: [],
      [PredatorPreyState.EAGLE]: [],
    };
  }
}
