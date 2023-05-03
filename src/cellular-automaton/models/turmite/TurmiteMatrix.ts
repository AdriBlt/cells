import { random, randomBool } from "../../../utils/random";
import { AutomatonLook } from "../AutomatonLook";
import { AutomatonMatrix } from "../AutomatonMatrix";
import { AutomatonOrientation } from "../AutomatonOrientation";
import { GridUpdate, NextStateGridUpdate } from "../GridUpdate";
import { Turmite } from "./Turmite";
import { TurmiteCell } from "./TurmiteCell";
import { applyRotation } from "./TurmiteDirection";
import { TurmiteParameters } from "./TurmiteParameters";

export class TurmiteMatrix extends AutomatonMatrix<
  TurmiteCell,
  TurmiteParameters
> {
  private turmite: Turmite;

  constructor() {
    super(new TurmiteParameters());
  }

  public initialize(nbX: number, nbY: number): void {
    this.xSize = nbX;
    this.ySize = nbY;
    this.matrix = [];
    for (let x = 0; x < this.xSize; x++) {
      this.matrix[x] = [];
      for (let y = 0; y < this.ySize; y++) {
        this.matrix[x][y] = new TurmiteCell(x, y);
      }
    }

    const xDep = Math.floor(this.xSize / 2);
    const yDep = Math.floor(this.ySize / 2);
    this.turmite = new Turmite(xDep, yDep);
  }

  public nextStep(): NextStateGridUpdate {
    let x = this.turmite.getX();
    let y = this.turmite.getY();
    const dir = this.turmite.getOrientation();
    const cellStatus = this.getCell(x, y).getStatus();
    const turmiteStatus = this.turmite.getStatus();

    const decision = this.getRules().getDecision(cellStatus, turmiteStatus);

    const nextDirection = decision.getNextDirection();
    const nextCell = decision.getNextCellStatus();
    const nextTurmine = decision.getNextTurmiteStatus();

    // Flips color
    this.getCell(x, y).setStatus(nextCell);

    // Turmite turns
    const nextDir = applyRotation(nextDirection, dir);
    this.turmite.setOrientation(nextDir);

    // Turmite moves
    switch (nextDir) {
      case AutomatonOrientation.NORTH:
        y--;
        if (y < 0) {
          y += this.ySize;
        }
        this.turmite.setY(y);
        break;
      case AutomatonOrientation.EAST:
        x++;
        if (x >= this.xSize) {
          x -= this.xSize;
        }
        this.turmite.setX(x);
        break;
      case AutomatonOrientation.SOUTH:
        y++;
        if (y >= this.ySize) {
          y -= this.ySize;
        }
        this.turmite.setY(y);
        break;
      case AutomatonOrientation.WEST:
        x--;
        if (x < 0) {
          x += this.xSize;
        }
        this.turmite.setX(x);
        break;
      default:
    }

    // Flips Turmite
    this.turmite.setStatus(nextTurmine);
    return { update: GridUpdate.BLOCK, x, y };
  }

  public getLook(x: number, y: number): AutomatonLook {
    const background = this.getRules()
      .getType(this.getCell(x, y))
      .getBackground();
    if (this.turmite.isIn(x, y)) {
      return new AutomatonLook(
        background,
        this.turmite.getOrientation(),
        this.turmite.getColor()
      );
    }
    return new AutomatonLook(background);
  }

  public setRandomCells(): void {
    const proba = 0.1;
    for (let x = 0; x < this.xSize; x++) {
      for (let y = 0; y < this.ySize; y++) {
        if (random() < proba) {
          this.getCell(x, y).setStatus(randomBool());
        }
      }
    }
  }

  public changeStatus(x: number, y: number): GridUpdate {
    const cell = this.getCell(x, y);
    cell.setStatus(!cell.getStatus());
    return GridUpdate.CELL;
  }
}
