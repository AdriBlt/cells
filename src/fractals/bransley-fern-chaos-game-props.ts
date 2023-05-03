import { getStrings } from "../strings";
import { Extremum, Point } from "../utils/points";
import { random } from "../utils/random";
import { BransleyChaosGameProps } from "./bransley-choas-game-sketch";

export class BransleyFernChaosGameProps implements BransleyChaosGameProps {
    public title = getStrings().bransleyChaosGame.fernTitle;
    public description = getStrings().bransleyChaosGame.fernDescription;

    public startingPoint: Point = { x: 0, y: 0 };

    // −2.1820 < x < 2.6558 and 0 ≤ y < 9.9983.
    public dimensions: Extremum = {
        min: { x: -2.2, y: 0 },
        max: { x: 2.7, y: 10 },
    }

    public getNextPoint(point: Point): Point {
        const r = random();
        if (r < 0.01) {
            return this.getPointF1(point);
        } else if (r < 0.86) {
            return this.getPointF2(point);
        } else if (r < 0.93) {
            return this.getPointF3(point);
        } else {
            return this.getPointF4(point);
        }
    }

    // ƒ1	0	0	0	0.16	0	0	0.01	Stem
    private getPointF1({ x, y }: Point): Point {
        return {
            x: 0,
            y: 0.16 * y,
        };
    }

    // ƒ2	0.85	0.04	−0.04	0.85	0	1.60	0.85	Successively smaller leaflets
    private getPointF2({ x, y }: Point): Point {
        return {
            x: 0.85 * x + 0.04 * y,
            y: -0.04 * x + 0.85 * y + 1.6,
        };
    }

    // ƒ3	0.20	−0.26	0.23	0.22	0	1.60	0.07	Largest left-hand leaflet
    private getPointF3({ x, y }: Point): Point {
        return {
            x: 0.2 * x - 0.26 * y,
            y: 0.23 * x + 0.22 * y + 1.6,
        };
    }

    // ƒ4	−0.15	0.28	0.26	0.24	0	0.44	0.07	Largest right-hand leaflet
    private getPointF4({ x, y }: Point): Point {
        return {
            x: -0.15 * x + 0.28 * y,
            y: 0.26 * x + 0.24 * y + 0.44,
        };
    }
}
