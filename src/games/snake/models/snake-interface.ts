import { Cell } from './cell';

export interface SnakeInterface {
    displayStartingScreen(): void;
    displayEndGameScreen(): void;
    updateCell(cell: Cell): void;
}
