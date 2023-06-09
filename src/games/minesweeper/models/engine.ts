import { shuffleList } from '../../../utils/list-helpers';
import { Cell } from './cell';
import { CellStatus } from './cell-status';
import { GameStatus } from './game-status';
import { MinesweeperInterface } from './minesweeper-interface';

export class Engine {

    public nbRows: number;
    public nbCols: number;
    public minesCount: number;
    public isAutoResolve: boolean;
    private cells: Cell[][];
    private hasGameBegun: boolean;
    private isGameOn: boolean;

    constructor(private ui: MinesweeperInterface) { }

    public resetEngine(
        rows: number, cols: number, mines: number, autoresolve: boolean
    ): void {
        this.nbRows = rows;
        this.nbCols = cols;
        this.minesCount = mines;
        this.isAutoResolve = autoresolve;

        const nbCells = this.nbRows * this.nbCols - 1;
        if (this.minesCount > nbCells) {
            this.minesCount = nbCells;
        }

        this.cells = [];
        for (let i = 0; i < this.nbRows; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.nbCols; j++) {
                this.cells[i][j] = new Cell(i, j);
            }
        }

        this.hasGameBegun = false;
        this.isGameOn = true;
    }

    public leftClick(cell: Cell): void {
        if (!this.isGameOn) {
            return;
        }

        if (!this.hasGameBegun) {
            this.initMines(cell);
            this.hasGameBegun = true;
        }

        if (cell.state !== CellStatus.Hidden) {
            return;
        }

        cell.state = CellStatus.Opened;
        this.ui.drawCell(cell);

        if (cell.isMine) {
            this.setDefeat();
        } else if (cell.minesAround === 0) {
            const cellsAround = this.getCellsAround(cell);
            for (const c of cellsAround) {
                this.leftClick(c);
            }
        } else if (this.hasWon()) {
            this.setVictory();
        } else if (this.isAutoResolve) {
            this.tryAutosolve(cell);
            const cellsAround = this.getCellsAround(cell);
            for (const c of cellsAround) {
                this.tryAutosolve(c);
            }
        }
    }

    public rightClick(cell: Cell): void {
        if (!this.isGameOn) {
            return;
        }

        if (cell.state === CellStatus.Hidden) {
            cell.state = CellStatus.Flagged;
            this.minesCount--;
            this.ui.drawMinesCount();

            if (this.hasWon()) {
                this.setVictory();
            } else if (this.isAutoResolve) {
                const cellsAround = this.getCellsAround(cell);
                for (const c of cellsAround) {
                    this.tryAutosolve(c);
                }
            }
        } else if (cell.state === CellStatus.Flagged) {
            cell.state = CellStatus.Suspected;
            this.minesCount++;
            this.ui.drawMinesCount();
        } else if (cell.state === CellStatus.Suspected) {
            cell.state = CellStatus.Hidden;
        } else {
            this.tryAutosolve(cell);
        }

        this.ui.drawCell(cell);
    }

    public getCell(i: number, j: number): Cell {
        return this.cells[i][j];
    }

    private initMines(firstCell: Cell): void {
        // Adding mines
        const mines = [];
        for (let i = 0; i < this.nbRows; i++) {
            for (let j = 0; j < this.nbCols; j++) {
                if (i === firstCell.i && j === firstCell.j) {
                    continue;
                }

                mines.push(this.cells[i][j]);
            }
        }

        shuffleList<Cell>(mines);
        for (let n = 0; n < this.minesCount; n++) {
            const nextMine = mines[n];
            const cell = this.cells[nextMine.i][nextMine.j];
            cell.isMine = true;

            const cellsAround = this.getCellsAround(cell);
            for (const c of cellsAround) {
                c.minesAround++;
            }
        }
    }

    private getCellsAround(cell: Cell): Cell[] {
        const iDeltaAround = [0];
        if (cell.i > 0) {
            iDeltaAround.push(-1);
        }
        if (cell.i < this.nbRows - 1) {
            iDeltaAround.push(1);
        }

        const jDeltaAround = [0];
        if (cell.j > 0) {
            jDeltaAround.push(-1);
        }
        if (cell.j < this.nbCols - 1) {
            jDeltaAround.push(1);
        }

        const cellsAround = [];
        for (const di of iDeltaAround) {
            for (const dj of jDeltaAround) {
                if (di === 0 && dj === 0) {
                    continue;
                }

                cellsAround.push(this.cells[cell.i + di][cell.j + dj]);
            }
        }

        return cellsAround;
    }

    private tryAutosolve(cell: Cell): void {
        if (this.isGameOn
            && cell.state === CellStatus.Opened
            && !cell.isMine) {
            let flagged = 0;
            let hidden = 0;

            const cellsAround = this.getCellsAround(cell);

            for (const c of cellsAround) {
                if (c.state === CellStatus.Flagged) {
                    flagged++;
                } else if (c.state === CellStatus.Hidden
                    || c.state === CellStatus.Suspected) {
                    hidden++;
                }
            }

            if (flagged === cell.minesAround && hidden > 0) {
                for (const c of cellsAround) {
                    if (c.state === CellStatus.Hidden
                        || c.state === CellStatus.Suspected) {
                        c.state = CellStatus.Hidden;
                        this.leftClick(c);
                    }
                }
            } else if (hidden + flagged === cell.minesAround) {
                for (const c of cellsAround) {
                    if (c.state === CellStatus.Hidden
                        || c.state === CellStatus.Suspected) {
                        c.state = CellStatus.Hidden;
                        this.rightClick(c);
                    }
                }
            }
        }
    }

    private hasWon(): boolean {
        for (const row of this.cells) {
            for (const cell of row) {
                if (cell.state === CellStatus.Hidden
                    || cell.state === CellStatus.Suspected
                    || cell.state === CellStatus.Flagged && !cell.isMine) {
                    return false;
                }
            }
        }

        return true;
    }

    private setVictory(): void {
        this.isGameOn = false;
        this.ui.setGameStatus(GameStatus.Victory);
    }

    private setDefeat(): void {
        this.isGameOn = false;
        this.ui.setGameStatus(GameStatus.Failure);

        for (const row of this.cells) {
            for (const cell of row) {
                if (cell.isMine) {
                    this.ui.drawMine(cell);
                }
            }
        }
    }
}
