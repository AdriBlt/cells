import { AutomatonCell } from "../AutomatonCell";
import { AutomatonParameters } from "../AutomatonParameters";
import { BorderCells } from "../BorderCells";
import { AntCell } from "./AntCell";
import { AntDirections } from "./AntDirections";
import { AntType, getAntType } from "./AntType";

export class AntParameters extends AutomatonParameters {
  private nbAnt: number;
  private directions: AntDirections[];

  constructor(
    ants: number = 1,
    dirs: AntDirections[] = [AntDirections.RIGHT, AntDirections.LEFT]
  ) {
    super(BorderCells.Torus);
    this.nbAnt = ants;
    this.directions = dirs;
  }

  public getType(cell: AutomatonCell): AntType {
    if (cell instanceof AntCell) {
      const aCell = cell as AntCell;
      return getAntType(aCell.getType());
    }
    return getAntType(0);
  }

  public getNbColors(): number {
    return this.directions.length;
  }

  public getNbAnt(): number {
    return this.nbAnt;
  }

  public setNbAnt(nbAnt: number): void {
    this.nbAnt = nbAnt;
  }

  public getDirection(index: number): AntDirections | null {
    if (0 <= index && index < this.directions.length) {
      return this.directions[index];
    }
    return null;
  }

  public setDirection(index: number, direction: AntDirections): void {
    if (0 <= index && index < this.directions.length) {
      this.directions[index] = direction;
    }
  }

  public addDirection(dir: AntDirections): void {
    this.directions.push(dir);
  }

  public removeDirection(): void {
    this.directions = this.directions.slice(0, this.directions.length - 1);
  }
}
