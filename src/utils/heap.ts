export class Heap<T> {
    private list: T[] = [];

    constructor(private scoreFunction: (value: T) => number) {}

    public push(value: T): void {
        this.list.push(value);
        const valueScore = this.scoreFunction(value);
        for (let i = this.length - 2; i >= 0; i--) {
            if (valueScore < this.scoreFunction(this.list[i])) {
                this.list[i + 1] = this.list[i];
                this.list[i] = value;
            } else {
                break;
            }
        }
    }

    public pop(): T | undefined {
        return this.list.pop();
    }

    public clear(): void {
        this.list = [];
    }

    public get length(): number {
        return this.list.length;
    }
}