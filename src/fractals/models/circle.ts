import { Complex } from "../../numbers/Complex";

export class Circle {
    constructor(
        public center: Complex,
        public bend: number,
    ) {}

    public get radius(): number {
        return Math.abs(1 / this.bend);
    }
}