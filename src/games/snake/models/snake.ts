import { LinkedList } from '../../../utils/linked-list';
import { Cell } from './cell';
import { Direction } from './direction';

export class Snake {
    public body = new LinkedList<Cell>();
    public direction: Direction;
    public isAlive = true;

    public moveTo(cell: Cell): Cell {
        this.growTo(cell);

        const oldTail = this.body.popTail();

        if (!oldTail) {
            throw new Error('oldTail should not be null');
        }

        oldTail.isSnake = false;
        return oldTail;
    }

    public growTo(cell: Cell): void {
        this.body.insertHead(cell);
        cell.isSnake = true;
    }
}
