import { UniqueSet } from "../../../utils/set";
import { Triangle } from "./triangle";

let _counter = 0;

export class Point {
    public AdjacentTriangles = new UniqueSet<Triangle>();
    public readonly uniqueId = ++_counter;

    constructor(public X: number, public Y: number) { }

    public equals(point: Point): boolean {
        return this.X === point.X && this.Y === point.Y;
    }

    public get id(): string {
        return `Point ${this.uniqueId}`;
    }
}

export function compare(point1: Point, point2: Point) {
    return point1.uniqueId - point2.uniqueId;
}
