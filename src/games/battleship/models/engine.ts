import { AiOpponent, Move, SeekAndDestroyOpponent } from "./ai-opponent";
import { BattleshipInterface } from "./battleship-interface";
import { Board } from "./board";
import { GameStatus } from "./game-status";

export class Engine {
  public playerBoard: Board;
  public opponentBoard: Board;
  private gameStatus: GameStatus;
  private isCalculatingMove: boolean = false;
  private aiOpponent: AiOpponent;

  constructor(private ui: BattleshipInterface) {
    this.playerBoard = new Board(this.ui.drawPlayerCell);
    this.opponentBoard = new Board(this.ui.drawOpponentCell);
    this.aiOpponent = new SeekAndDestroyOpponent();
  }

  public resetEngine(): void {
    this.playerBoard.resetBoard();
    this.opponentBoard.resetBoard();
    this.gameStatus = GameStatus.Initial;
    this.isCalculatingMove = false;
  }

  public startGame() {
    this.playerBoard.setShips();
    this.opponentBoard.setShips();
    this.gameStatus = GameStatus.Ongoing;
  }

  public fireOnOpponent(i: number, j: number) {
    if (this.gameStatus === GameStatus.Initial) {
      // TODO INIT
    }

    if (this.gameStatus !== GameStatus.Ongoing || this.isCalculatingMove) {
      return;
    }

    this.isCalculatingMove = true;

    this.runBothMoves(i, j);

    this.isCalculatingMove = false;
  }

  private runBothMoves(i: number, j: number): void {
    const isValidMove = this.opponentBoard.fire(i, j);
    if (!isValidMove) {
      return;
    }

    if (this.opponentBoard.areAllShipsSunk()) {
      this.setVictory();
      return;
    }

    const move = this.getAiNextMove();
    this.playerBoard.fire(move.i, move.j);
    if (this.playerBoard.areAllShipsSunk()) {
      this.setDefeat();
    }
  }

  private setVictory(): void {
    this.gameStatus = GameStatus.Victory;
    this.ui.setGameStatus(GameStatus.Victory);
  }

  private setDefeat(): void {
    this.gameStatus = GameStatus.Failure;
    this.ui.setGameStatus(GameStatus.Failure);
  }

  private getAiNextMove(): Move {
    return this.aiOpponent.getNextMove(this.playerBoard);
  }
}
