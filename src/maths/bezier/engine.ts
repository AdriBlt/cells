import { lerp } from "../../utils/numbers";
import { Point } from "../../utils/points";

export class Engine {

    // Point [layer][points][time]
    public points: Point[][][] = [];

    public anchorPoints: Point[] = [];
    private deltaTime: number;

    constructor(private listLength: number) {
        this.deltaTime = 1.0 / (listLength - 1);
    }

    public setPoints(initialPoints: Point[]): void {
        this.anchorPoints = initialPoints;
        this.computePoints();
    }

    public getCurve(): Point[] {
        return this.points.length > 0
            ? this.points[this.points.length - 1][0]
            : [];
    }

    public computePoints(): void {
        this.points = [];

        for (let layer = 0; layer < this.anchorPoints.length - 1; layer++) {
            const newLayer: Point[][] = [];
            if (layer === 0) {
                for (let p = 0; p < this.anchorPoints.length - 1; p++) {
                    newLayer.push(this.computeFirstLayer(this.anchorPoints[p], this.anchorPoints[p + 1]));
                }
            } else {
                const previousLayer = this.points[layer - 1];
                for (let p = 0; p < previousLayer.length - 1; p++) {
                    newLayer.push(this.computeLayer(previousLayer[p], previousLayer[p + 1]));
                }
            }
            this.points.push(newLayer);
        }
    }

    private computeFirstLayer(pointA: Point, pointB: Point): Point[] {
        const points: Point[] = [];
        let p = 0;
        for (let t = 0; t < this.listLength; t++) {
            points.push(lerpPoint(pointA, pointB, p))
            p += this.deltaTime;
        }
        return points;
    }

    private computeLayer(pointsA: Point[], pointsB: Point[]): Point[] {
        if (pointsA.length !== this.listLength || pointsB.length !== this.listLength) {
            throw new Error("Not valid length");
        }
        const points: Point[] = [];
        let p = 0;
        for (let t = 0; t < this.listLength; t++) {
            points.push(lerpPoint(pointsA[t], pointsB[t], p))
            p += this.deltaTime;
        }
        return points;
    }
}

function lerpPoint(pointA: Point, pointB: Point, p: number): Point {
    return {
        x: lerp(pointA.x, pointB.x, p),
        y: lerp(pointA.y, pointB.y, p),
    };
}
