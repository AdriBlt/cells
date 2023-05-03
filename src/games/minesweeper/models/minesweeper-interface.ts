import { Cell } from './cell';
import { GameStatus } from './game-status';

export interface MinesweeperInterface {
    setGameStatus(status: GameStatus): void;
    drawCell(cell: Cell): void;
    drawMinesCount(): void;
    drawMine(cell: Cell): void;
}
