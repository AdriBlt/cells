import { randomInt } from "../../../utils/random";
import { Board, NB_COLS, NB_ROWS } from "./board";
import { CellStatus } from "./cell-status";

export interface Move {
  i: number;
  j: number;
}

// tslint:disable:max-classes-per-file
export abstract class AiOpponent {
  public abstract getNextMove(board: Board): Move;
}

export class RandomOpponent extends AiOpponent {
  public getNextMove(board: Board): Move {
    return getRandomMove(board);
  }
}

export class SeekAndDestroyOpponent extends AiOpponent {
  private lastKnownPosition: Move | undefined;
  private lastMove: Move | undefined;

  public getNextMove(board: Board): Move {
    if (
      this.lastMove &&
      board.getCell(this.lastMove.i, this.lastMove.j).status === CellStatus.Hit
    ) {
      // Last shot was a hit, search around
      this.lastKnownPosition = this.lastMove;
      this.lastMove = getSearchAroundMove(board, this.lastMove);
    } else if (
      this.lastKnownPosition &&
      board.getCell(this.lastKnownPosition.i, this.lastKnownPosition.j)
        .status === CellStatus.Hit
    ) {
      // Last shot was Water / Sunk, search around unsunk
      this.lastMove = getSearchAroundMove(board, this.lastKnownPosition);
    } else {
      // Check for "Hit" cell on the board
      const unsunkMove = getUnsunkHitShip(board);
      if (unsunkMove) {
        this.lastMove = getSearchAroundMove(board, unsunkMove);
      } else {
        // No unsunk ship found => random
        this.lastMove = getEvenRandomMove(board);
      }
    }

    return this.lastMove;
  }
}

// TODO Heatmap Opponent

function getRandomMove(board: Board): Move {
  let move: Move;
  do {
    move = {
      i: randomInt(0, NB_ROWS),
      j: randomInt(0, NB_COLS)
    };
  } while (board.getCell(move.i, move.j).status !== CellStatus.Unknown);
  return move;
}

function getEvenRandomMove(board: Board): Move {
  let move: Move;
  do {
    move = {
      i: randomInt(0, NB_ROWS),
      j: randomInt(0, NB_COLS)
    };
  } while (
    board.getCell(move.i, move.j).status !== CellStatus.Unknown ||
    (move.i + move.j) % 2 === 1
  );
  return move;
}

function getSearchAroundMove(board: Board, lastHit: Move): Move {
  const { i, j } = lastHit;
  const minusI = i > 0 ? board.getCell(i - 1, j).status : undefined;
  const minusJ = j > 0 ? board.getCell(i, j - 1).status : undefined;
  const plusI = i < NB_ROWS - 1 ? board.getCell(i + 1, j).status : undefined;
  const plusJ = j < NB_COLS - 1 ? board.getCell(i, j + 1).status : undefined;

  const freeCells: Move[] = [];

  if (minusI === CellStatus.Hit || plusI === CellStatus.Hit) {
    // Horizontal
    if (minusI === CellStatus.Unknown) {
      freeCells.push({ i: i - 1, j });
    } else if (minusI === CellStatus.Hit) {
      for (let ii = i - 2; ii >= 0; ii--) {
        const s = board.getCell(ii, j).status;
        if (s === CellStatus.Hit) {
          continue;
        }
        if (s === CellStatus.Unknown) {
          freeCells.push({ i: ii, j });
        }
        break;
      }
    }

    if (plusI === CellStatus.Unknown) {
      freeCells.push({ i: i + 1, j });
    } else if (plusI === CellStatus.Hit) {
      for (let ii = i + 2; ii < NB_ROWS; ii++) {
        const s = board.getCell(ii, j).status;
        if (s === CellStatus.Hit) {
          continue;
        }
        if (s === CellStatus.Unknown) {
          freeCells.push({ i: ii, j });
        }
        break;
      }
    }
  }

  if (minusJ === CellStatus.Hit || plusJ === CellStatus.Hit) {
    // Vertical
    if (minusJ === CellStatus.Unknown) {
      freeCells.push({ i, j: j - 1 });
    } else if (minusJ === CellStatus.Hit) {
      for (let jj = j - 2; jj >= 0; jj--) {
        const s = board.getCell(i, jj).status;
        if (s === CellStatus.Hit) {
          continue;
        }
        if (s === CellStatus.Unknown) {
          freeCells.push({ i, j: jj });
        }
        break;
      }
    }

    if (plusJ === CellStatus.Unknown) {
      freeCells.push({ i, j: j + 1 });
    } else if (plusJ === CellStatus.Hit) {
      for (let jj = j + 2; jj < NB_COLS; jj++) {
        const s = board.getCell(i, jj).status;
        if (s === CellStatus.Hit) {
          continue;
        }
        if (s === CellStatus.Unknown) {
          freeCells.push({ i, j: jj });
        }
        break;
      }
    }
  }

  // Only one hit on the ship
  if (freeCells.length === 0) {
    if (minusI === CellStatus.Unknown) {
      freeCells.push({ i: i - 1, j });
    }
    if (minusJ === CellStatus.Unknown) {
      freeCells.push({ i, j: j - 1 });
    }
    if (plusI === CellStatus.Unknown) {
      freeCells.push({ i: i + 1, j });
    }
    if (plusJ === CellStatus.Unknown) {
      freeCells.push({ i, j: j + 1 });
    }
    if (freeCells.length === 0) {
      throw new Error("AiOpponent.getSearchAroundMove: no positions");
    }
  }

  const index = randomInt(0, freeCells.length);
  return freeCells[index];
}

function getUnsunkHitShip(board: Board): Move | undefined {
  for (const row of board.cells) {
    for (const cell of row) {
      if (cell.status === CellStatus.Hit) {
        return cell;
      }
    }
  }
  return undefined;
}
