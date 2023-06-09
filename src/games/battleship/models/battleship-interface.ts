import { Cell } from "./cell";
import { GameStatus } from "./game-status";

export interface BattleshipInterface {
  setGameStatus(status: GameStatus): void;
  drawPlayerCell(cell: Cell): void;
  drawOpponentCell(cell: Cell): void;
}
