export class Cell {
    public hasFood = false;
    public isWall = false;
    public isSnake = false;

    constructor(
        public i: number,
        public j: number) {
    }

    public isEmpty(): boolean {
        return !this.hasFood
            && !this.isSnake
            && !this.isWall;
    }
}
