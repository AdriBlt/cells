import { random, randomInt } from "../../../utils/random";
import { AutomatonLook } from "../AutomatonLook";
import { AutomatonMatrix } from "../AutomatonMatrix";
import { AutomatonOrientation } from "../AutomatonOrientation";
import { GridUpdate, NextStateGridUpdate } from "../GridUpdate";
import { Ant } from "./Ant";
import { AntCell } from "./AntCell";
import { applyRotation } from "./AntDirections";
import { AntParameters } from "./AntParameters";

export class AntMatrix extends AutomatonMatrix<AntCell, AntParameters> {
  private ants: Ant[];

  constructor() {
    super(new AntParameters());
  }

  public initialize(nbX: number, nbY: number): void {
    this.xSize = nbX;
    this.ySize = nbY;
    this.matrix = [];
    for (let x = 0; x < this.xSize; x++) {
      this.matrix[x] = [];
      for (let y = 0; y < this.ySize; y++) {
        this.matrix[x][y] = new AntCell(x, y);
      }
    }

    this.ants = [];
    const nbAnt = this.getRules().getNbAnt();
    const pasX = Math.floor(this.xSize / (nbAnt + 1));
    const midY = Math.floor(this.ySize / 2);
    for (let i = 0; i < nbAnt; i++) {
      this.ants.push(new Ant(++i * pasX, midY));
    }
  }

  public nextStep(): NextStateGridUpdate {
    for (const ant of this.ants) {
      let x = ant.getX();
      let y = ant.getY();
      const type = this.getCell(x, y).getType();
      const direction = this.getRules().getDirection(type);

      if (direction === null) {
        // THE COLOR HAS BEEN REMOVED
        // LET'S CONTINUE FORWARD...
      } else {
        // Ant turns
        ant.setOrientation(applyRotation(direction, ant.getOrientation()));
      }

      // Flips color
      this.increaseType(x, y);

      // Ant moves
      switch (ant.getOrientation()) {
        case AutomatonOrientation.NORTH:
          y--;
          if (y < 0) {
            y += this.ySize;
          }
          ant.setY(y);
          break;
        case AutomatonOrientation.EAST:
          x++;
          if (x >= this.xSize) {
            x -= this.xSize;
          }
          ant.setX(x);
          break;
        case AutomatonOrientation.SOUTH:
          y++;
          if (y >= this.ySize) {
            y -= this.ySize;
          }
          ant.setY(y);
          break;
        case AutomatonOrientation.WEST:
          x--;
          if (x < 0) {
            x += this.xSize;
          }
          ant.setX(x);
          break;
        default:
      }
    }

    // TODO SWITCH TO ALL WHEN MORE THAN 1 ANT
    return {
      update: GridUpdate.BLOCK,
      x: this.ants[0].getX(),
      y: this.ants[0].getY(),
    };
  }

  public getAnt(x: number, y: number): Ant | null {
    for (const ant of this.ants) {
      if (x === ant.getX() && y === ant.getY()) {
        return ant;
      }
    }
    return null;
  }

  public getLook(x: number, y: number): AutomatonLook {
    const background = this.getRules()
      .getType(this.getCell(x, y))
      .getBackground();
    const ant = this.getAnt(x, y);
    if (ant != null) {
      return new AutomatonLook(
        background,
        ant.getOrientation(),
        ant.getColor()
      );
    }
    return new AutomatonLook(background);
  }

  public setRandomCells(): void {
    const proba = 0.1;
    const nbTypes = this.getRules().getNbColors();
    for (let x = 0; x < this.xSize; x++) {
      for (let y = 0; y < this.ySize; y++) {
        if (random() < proba) {
          this.getCell(x, y).setType(randomInt(0, nbTypes));
        }
      }
    }
  }

  public changeStatus(x: number, y: number): GridUpdate {
    this.increaseType(x, y);
    return GridUpdate.CELL;
  }

  private increaseType(x: number, y: number): void {
    const nbTypes = this.getRules().getNbColors();
    const cell = this.getCell(x, y);
    const type = (cell.getType() + 1) % nbTypes;
    cell.setType(type);
  }
}
