import { CellStatus } from './cell-status';

export class Cell {
    public state = CellStatus.Hidden;
    public isMine = false;
    public minesAround = 0;

    constructor(
        public i: number,
        public j: number) {
    }
}
