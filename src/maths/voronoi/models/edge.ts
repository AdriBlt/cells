import { compare, Point } from "./point";

export class Edge
    {
        public constructor(public readonly point1: Point, public readonly point2: Point) {}

        public equals(edge: Edge): boolean
        {
            const samePoints = this.point1.equals(edge.point1) && this.point2.equals(edge.point2);
            const samePointsReversed = this.point1.equals(edge.point2) && this.point2.equals(edge.point1);
            return samePoints || samePointsReversed;
        }

        public get id(): string {
            let min: Point;
            let max: Point;
            if (compare(this.point1, this.point2) < 0) {
                min = this.point1;
                max = this.point2;
            } else {
                min = this.point2;
                max = this.point1;
            }
            return `Edge [${min.id}]<>[${max.id}]`;
        }
    }