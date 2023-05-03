import { Cell } from './cell';
import { Direction } from './direction';
import { EngineState } from './engine-state';
import { Snake } from './snake';
import { SnakeInterface } from './snake-interface';
import { Walls } from './walls';

export class SnakeEngine {
    private state = EngineState.Initial;
    private cells: Cell[][];
    private framesPerMove: number;
    private frameCount: number;
    private snake: Snake;

    constructor(
        public width: number,
        public height: number,
        private ui: SnakeInterface) { }

    public initGame(): void {
        this.cells = [];
        for (let i = 0; i < this.height; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.width; j++) {
                const cell = new Cell(i, j);
                this.cells[i][j] = cell;
            }
        }

        const walls = Walls.getRandomWalls(this.width, this.height);
        for (const wall of walls) {
            const cell = this.cells[wall.i][wall.j];
            cell.isWall = true;
        }

        this.framesPerMove = 10;
        this.frameCount = 0;
        const posI = Math.floor(this.height / 2);
        const posJ = Math.floor(this.width / 2);

        this.snake = new Snake();
        // TODO RANDOM BEGIN (IMPOSSIBLE CROSS MAP)
        this.snake.direction = Direction.RIGHT;
        for (let dj = 0; dj < 3; dj++) {
            const cell = this.cells[posI][posJ + dj];
            this.snake.growTo(cell);
        }

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.ui.updateCell(this.cells[i][j]);
            }
        }

        this.addFood();
    }

    public nextFrame(): void {
        if (this.state !== EngineState.Running) {
            return;
        }

        this.frameCount++;
        if (this.frameCount < this.framesPerMove) {
            return;
        }

        this.frameCount = 0;

        this.moveSnake(this.snake, this.snake.direction);
    }

    public start(): void {
        if (this.state === EngineState.Initial) {
            this.initGame();
            this.state = EngineState.Running;
        } else if (this.state === EngineState.Running) {
            this.state = EngineState.Paused;
        } else if (this.state === EngineState.Paused) {
            this.state = EngineState.Running;
        } else if (this.state === EngineState.Ended) {
            this.state = EngineState.Initial;
            this.ui.displayStartingScreen();
        }
    }

    public checkEndGame(): void {
        if (this.state === EngineState.Running
            && !this.snake.isAlive) {
            this.state = EngineState.Ended;
            this.ui.displayEndGameScreen();
        }
    }

    public movePrimary(direction: Direction): void {
        this.moveSnake(this.snake, direction);
    }

    public moveSecondary(direction: Direction): void {
        // TODO
    }

    public moveSnake(snake: Snake, direction: Direction): void {
        if (this.state === EngineState.Running
            && snake.isAlive
            // U-turn impossible
            && Math.abs(direction - snake.direction) !== 2) {

            snake.direction = direction;

            const head = snake.body.peekHead();
            if (!head) {
                throw new Error('head should not be null');
            }

            const next = this.getNextCell(head, direction);

            // TODO HANDLE HEAD TO TAIL
            if (next.isSnake || next.isWall) {
                snake.isAlive = false;
                this.checkEndGame();
            } else {
                if (next.hasFood) {
                    next.hasFood = false;
                    snake.growTo(next);

                    this.addFood();

                    if (snake.body.count % 5 === 0) {
                        this.framesPerMove--;
                    }

                } else {
                    const oldTail = snake.moveTo(next);
                    this.ui.updateCell(oldTail);
                }

                this.ui.updateCell(next);
            }
        }
    }

    public addFood(): void {
        let cell;
        do {
            const i = Math.floor(Math.random() * this.height);
            const j = Math.floor(Math.random() * this.width);
            cell = this.cells[i][j];
        } while (!cell.isEmpty());

        cell.hasFood = true;
        this.ui.updateCell(cell);
    }

    public getNextCell(cell: Cell, direction: Direction): Cell {
        let i = cell.i;
        let j = cell.j;
        if (direction === Direction.LEFT) {
            j--;
            if (j < 0) {
                j = this.width - 1;
            }
        } else if (direction === Direction.UP) {
            i--;
            if (i < 0) {
                i = this.height - 1;
            }
        } else if (direction === Direction.RIGHT) {
            j++;
            if (j === this.width) {
                j = 0;
            }
        } else if (direction === Direction.DOWN) {
            i++;
            if (i === this.height) {
                i = 0;
            }
        }

        return this.cells[i][j];
    }
}
