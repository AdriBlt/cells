import { observable } from "mobx";
import * as p5 from "p5";

import { ProcessingSketch } from "../../services/processing.service";
import { getKeyFromCode, KeyBoard } from "../../utils/keyboard";
import { getCellCoordinate } from "../../utils/mouse";
import { Move } from "./models/ai-opponent";
import { BattleshipInterface } from "./models/battleship-interface";
import { Board, NB_COLS, NB_ROWS } from "./models/board";
import { Cell } from "./models/cell";
import { CellStatus } from "./models/cell-status";
import { Engine } from "./models/engine";
import { GameStatus } from "./models/game-status";
import { Ship } from "./models/ship";
import { ShipStatus } from "./models/ship-status";

// Variables
type Margin = { left: number; top: number };
const OPPONENT_MARGIN: Margin = { left: 0, top: 10 };
const PLAYER_MARGIN: Margin = { left: 0, top: 380 };
const SQUARE_SIDE = 36;

enum ShipVisibility {
  ALL,
  ONLY_SUNK,
  NONE,
}

/**
 * TODO
 * Better code for colors
 * Pre game interactivity
 * Display opponent remaining ships
 * Heatmap AI
 */
export class BattleshipSketch implements ProcessingSketch, BattleshipInterface {
  // Elements

  @observable public gameStatus: GameStatus = GameStatus.Initial;
  private engine: Engine;
  private p5js: p5;

  constructor() {
    this.engine = new Engine(this);
  }

  public setup = (p: p5): void => {
    this.p5js = p;
    this.p5js.createCanvas(400, 800);
    this.resetGrid();
    this.p5js.noLoop();
  };

  public draw = (): void => {
    // NO LOOP
  };

  public resetGrid = (): void => {
    this.gameStatus = GameStatus.Initial;
    this.engine.resetEngine();
    this.engine.startGame();

    this.drawAllShips(
      this.engine.playerBoard,
      ShipVisibility.ALL,
      PLAYER_MARGIN
    );
  };

  public setGameStatus = (status: GameStatus): void => {
    this.gameStatus = status;
    if (status === GameStatus.Failure) {
      this.drawAllShips(
        this.engine.opponentBoard,
        ShipVisibility.ALL,
        OPPONENT_MARGIN
      );
    }
  };

  public drawPlayerCell = (cell: Cell): void => {
    this.drawCell(cell, ShipVisibility.ALL, PLAYER_MARGIN);
  };

  public drawOpponentCell = (cell: Cell): void => {
    this.drawCell(cell, ShipVisibility.ONLY_SUNK, OPPONENT_MARGIN);
  };

  public mousePressed = (): void => {
    const playerCell = this.getCellCords(PLAYER_MARGIN);
    const opponentCell = this.getCellCords(OPPONENT_MARGIN);

    if (playerCell !== null && opponentCell !== null) {
      throw new Error("BattleshipSketch.mousePressed: clicking on both boards");
    } else if (playerCell !== null) {
      // TODO PRE GAME
    } else if (opponentCell !== null) {
      this.engine.fireOnOpponent(opponentCell.i, opponentCell.j);
    }
  };

  public keyPressed(): void {
    if (getKeyFromCode(this.p5js.keyCode) === KeyBoard.R) {
      this.resetGrid();
    }
  }

  private drawCell = (
    cell: Cell,
    showShips: ShipVisibility,
    margin: Margin
  ): void => {
    const y = margin.top + cell.i * SQUARE_SIDE;
    const x = margin.left + cell.j * SQUARE_SIDE;
    this.p5js.stroke(0);
    this.p5js.strokeWeight(1);
    this.p5js.fill(this.p5js.color(0, 105, 217));
    this.p5js.rect(x, y, SQUARE_SIDE, SQUARE_SIDE);

    if (cell.ship) {
      this.drawShip(cell.ship, showShips, margin);
    }

    this.drawShot(cell, margin);
  };

  private drawAllShips(
    board: Board,
    showShips: ShipVisibility,
    margin: Margin
  ): void {
    for (const ship of board.ships) {
      this.drawShip(ship, showShips, margin);
    }
  }

  private drawShip(
    ship: Ship,
    showShips: ShipVisibility,
    margin: Margin
  ): void {
    if (
      showShips === ShipVisibility.NONE ||
      (showShips === ShipVisibility.ONLY_SUNK &&
        ship.status !== ShipStatus.Sunk)
    ) {
      return;
    }

    this.p5js.stroke(0);
    this.p5js.strokeWeight(1);
    this.p5js.fill(
      ship.status === ShipStatus.Sunk
        ? this.p5js.color(255, 0, 0) // red;
        : this.p5js.color(200) // dark gray;
    );

    const start = ship.cells[0];
    const end = ship.cells[ship.cells.length - 1];
    const isHorizontal = start.i === end.i;
    const x0 = margin.left + start.j * SQUARE_SIDE;
    const y0 = margin.top + start.i * SQUARE_SIDE;
    const x1 = margin.left + end.j * SQUARE_SIDE;
    const y1 = margin.top + end.i * SQUARE_SIDE;

    this.p5js.beginShape();

    if (isHorizontal) {
      this.p5js.vertex(x0 + SQUARE_SIDE / 2, y0 + SQUARE_SIDE / 3);
      this.p5js.vertex(x0 + SQUARE_SIDE / 3, y0 + SQUARE_SIDE / 2);
      this.p5js.vertex(x0 + SQUARE_SIDE / 2, y0 + (2 * SQUARE_SIDE) / 3);

      this.p5js.vertex(x1 + SQUARE_SIDE / 2, y1 + (2 * SQUARE_SIDE) / 3);
      this.p5js.vertex(x1 + (2 * SQUARE_SIDE) / 3, y1 + SQUARE_SIDE / 2);
      this.p5js.vertex(x1 + SQUARE_SIDE / 2, y1 + SQUARE_SIDE / 3);
    } else {
      this.p5js.vertex(x0 + SQUARE_SIDE / 3, y0 + SQUARE_SIDE / 2);
      this.p5js.vertex(x0 + SQUARE_SIDE / 2, y0 + SQUARE_SIDE / 3);
      this.p5js.vertex(x0 + (2 * SQUARE_SIDE) / 3, y0 + SQUARE_SIDE / 2);

      this.p5js.vertex(x1 + (2 * SQUARE_SIDE) / 3, y1 + SQUARE_SIDE / 2);
      this.p5js.vertex(x1 + SQUARE_SIDE / 2, y1 + (2 * SQUARE_SIDE) / 3);
      this.p5js.vertex(x1 + SQUARE_SIDE / 3, y1 + SQUARE_SIDE / 2);
    }

    this.p5js.endShape(this.p5js.CLOSE);

    for (const cell of ship.cells) {
      this.drawShot(cell, margin);
    }
  }

  private drawShot(cell: Cell, margin: Margin): void {
    if (cell.status === CellStatus.Unknown || cell.status === CellStatus.Sunk) {
      return;
    }

    const y = margin.top + cell.i * SQUARE_SIDE;
    const x = margin.left + cell.j * SQUARE_SIDE;
    this.p5js.stroke(0);
    this.p5js.strokeWeight(1);
    this.p5js.fill(
      cell.status === CellStatus.Water
        ? this.p5js.color(255) // white;
        : this.p5js.color(255, 0, 0) // red;
    );
    this.p5js.circle(x + SQUARE_SIDE / 2, y + SQUARE_SIDE / 2, SQUARE_SIDE / 3);
  }

  private getCellCords = (margin: Margin): Move | null => {
    return getCellCoordinate(
      this.p5js.mouseX,
      this.p5js.mouseY,
      NB_COLS,
      NB_ROWS,
      SQUARE_SIDE,
      margin.left,
      margin.top
    );
  };
}
