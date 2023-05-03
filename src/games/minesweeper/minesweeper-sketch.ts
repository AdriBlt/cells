import { observable } from "mobx";
import * as p5 from "p5";

import { ProcessingSketch } from "../../services/processing.service";
import { getKeyFromCode, KeyBoard } from "../../utils/keyboard";
import { getCellCoordinate } from "../../utils/mouse";
import { Cell } from "./models/cell";
import { CellStatus } from "./models/cell-status";
import { Engine } from "./models/engine";
import { GameStatus } from "./models/game-status";
import {
  LevelDifficulty,
  LevelDifficultyConst,
} from "./models/level-difficulty";
import { MinesweeperInterface } from "./models/minesweeper-interface";

// Variables
const LEFT_MARGIN = 0;
const TOP_MARGIN = 10;
const SQUARE_SIDE = 30;

export class MinesweeperSketch
  implements ProcessingSketch, MinesweeperInterface {
  // Elements
  @observable public gameStatus: GameStatus = GameStatus.Initial;
  @observable public selectedDifficulty: LevelDifficulty =
    LevelDifficultyConst.Expert;
  @observable public nbCols: number = this.selectedDifficulty.numberCols;
  @observable public nbRows: number = this.selectedDifficulty.numberRows;
  @observable public nbMines: number = this.selectedDifficulty.numberMines;
  @observable public remainingMines: number = this.nbMines;
  @observable public isAutoResolve: boolean = true;

  private engine: Engine;
  private p5js: p5;

  constructor() {
    this.engine = new Engine(this);
  }

  public setAutoResolve = (value: boolean): void => {
    this.engine.isAutoResolve = value;
    this.isAutoResolve = value;
  };

  public changeDifficulty(level: LevelDifficulty): void {
    if (level.numberMines > 0) {
      this.nbCols = level.numberCols;
      this.nbRows = level.numberRows;
      this.nbMines = level.numberMines;
    }
  }

  public setup(p: p5): void {
    this.p5js = p;

    this.p5js.createCanvas(1200, 1000);

    this.resetGrid();

    this.p5js.noLoop();
  }

  public draw(): void {
    // NO LOOP
  }

  public mousePressed(): void {
    const coord = getCellCoordinate(
      this.p5js.mouseX,
      this.p5js.mouseY,
      this.engine.nbCols,
      this.engine.nbRows,
      SQUARE_SIDE,
      LEFT_MARGIN,
      TOP_MARGIN
    );
    if (!coord) {
      return;
    }

    const cell = this.engine.getCell(coord.i, coord.j);
    if (this.p5js.mouseButton === this.p5js.LEFT) {
      this.engine.leftClick(cell);
    } else if (this.p5js.mouseButton === this.p5js.RIGHT) {
      this.engine.rightClick(cell);
    }
  }

  public keyPressed(): void {
    if (getKeyFromCode(this.p5js.keyCode) === KeyBoard.R) {
      this.resetGrid();
    }
  }

  public drawMinesCount(): void {
    this.remainingMines = this.engine.minesCount;
  }

  public drawCell(cell: Cell): void {
    const y = TOP_MARGIN + cell.i * SQUARE_SIDE;
    const x = LEFT_MARGIN + cell.j * SQUARE_SIDE;
    this.p5js.stroke(0);
    this.p5js.strokeWeight(1);
    if (cell.state === CellStatus.Opened) {
      this.p5js.fill(255);
    } else if (cell.state === CellStatus.Flagged) {
      this.p5js.fill(255, 0, 0);
    } else {
      this.p5js.fill(180);
    }

    this.p5js.rect(x, y, SQUARE_SIDE, SQUARE_SIDE);

    this.p5js.fill(0);

    if (cell.state === CellStatus.Opened) {
      if (cell.isMine) {
        this.drawMine(cell);
      } else if (cell.minesAround > 0) {
        let digitColor = this.p5js.color(255);
        if (cell.minesAround === 1) {
          digitColor = this.p5js.color(0, 0, 255); // blue
        } else if (cell.minesAround === 2) {
          digitColor = this.p5js.color(0, 128, 0); // green
        } else if (cell.minesAround === 3) {
          digitColor = this.p5js.color(255, 0, 0); // red
        } else if (cell.minesAround === 4) {
          digitColor = this.p5js.color(128, 0, 128); // purple
        } else if (cell.minesAround === 5) {
          digitColor = this.p5js.color(128, 0, 0); // maroon
        } else if (cell.minesAround === 6) {
          digitColor = this.p5js.color(64, 224, 208); // turquoise
        } else if (cell.minesAround === 7) {
          digitColor = this.p5js.color(0); // black
        } else if (cell.minesAround === 8) {
          digitColor = this.p5js.color(128); // gray
        }

        this.p5js.strokeWeight(1);
        this.p5js.fill(digitColor);
        this.p5js.stroke(digitColor);
        this.p5js.text(
          cell.minesAround,
          x + SQUARE_SIDE / 2.5,
          y + SQUARE_SIDE / 1.5
        );
      }
    } else if (cell.state === CellStatus.Flagged) {
      // NO-OP
    } else if (cell.state === CellStatus.Suspected) {
      this.p5js.text("?", x + SQUARE_SIDE / 2.5, y + SQUARE_SIDE / 1.5);
    }

    this.drawBorder();
  }

  public drawMine(cell: Cell): void {
    const y = TOP_MARGIN + cell.i * SQUARE_SIDE;
    const x = LEFT_MARGIN + cell.j * SQUARE_SIDE;
    this.p5js.fill(this.p5js.color(255, 0, 0));
    this.p5js.stroke(0);
    this.p5js.strokeWeight(1);
    this.p5js.ellipse(
      x + SQUARE_SIDE / 2,
      y + SQUARE_SIDE / 2,
      SQUARE_SIDE / 4,
      SQUARE_SIDE / 4
    );
    this.drawBorder();
  }

  public setGameStatus(status: GameStatus): void {
    this.gameStatus = status;
  }

  public resetGrid(): void {
    this.setGameStatus(GameStatus.Initial);

    // Erase previous game
    this.p5js.stroke(255);
    this.p5js.fill(255);
    this.p5js.rect(
      LEFT_MARGIN - 1,
      TOP_MARGIN - 1,
      this.p5js.width - LEFT_MARGIN,
      this.p5js.height
    );

    // Victory/Defeat text
    this.p5js.rect(0, 150, 140, 50);

    // Draw bord

    this.engine.resetEngine(
      this.nbRows,
      this.nbCols,
      this.nbMines,
      this.isAutoResolve
    );

    this.p5js.stroke(0);
    this.p5js.strokeWeight(1);
    this.p5js.fill(180);

    for (let i = 0; i < this.nbRows; i++) {
      const y = TOP_MARGIN + i * SQUARE_SIDE;
      for (let j = 0; j < this.nbCols; j++) {
        const x = LEFT_MARGIN + j * SQUARE_SIDE;
        this.p5js.rect(x, y, SQUARE_SIDE, SQUARE_SIDE);
      }
    }

    this.drawBorder();

    this.drawMinesCount();
  }

  public findDifficulty(): void {
    for (const difficulty of LevelDifficultyConst.values) {
      if (
        difficulty.numberCols === this.nbCols &&
        difficulty.numberRows === this.nbRows &&
        difficulty.numberMines === this.nbMines
      ) {
        this.selectedDifficulty = difficulty;
        return;
      }
    }

    this.selectedDifficulty = LevelDifficultyConst.Custom;
  }

  private drawBorder(): void {
    this.p5js.stroke(0);
    this.p5js.strokeWeight(3);
    this.p5js.noFill();

    this.p5js.rect(
      LEFT_MARGIN,
      TOP_MARGIN,
      this.engine.nbCols * SQUARE_SIDE,
      this.engine.nbRows * SQUARE_SIDE
    );
  }
}
