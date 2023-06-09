import { getStrings } from "../strings";
import { Extremum, Point } from "../utils/points";
import { random, randomBool } from "../utils/random";
import { BransleyChaosGameProps } from "./bransley-choas-game-sketch";

export class SirpienskiChaosGameProps implements BransleyChaosGameProps {
    public title = getStrings().bransleyChaosGame.sirpienskiTitle;
    public description = getStrings().bransleyChaosGame.sirpienskiDescription;

    public pointTop: Point = { x: 0, y: Math.sqrt(3) };
    public pointLeft: Point = { x: -1, y: 0 };
    public pointRight: Point = { x: 1, y: 0 };
    public startingPoint: Point = this.pickRandomPoint();

    public dimensions: Extremum = {
        min: { x: -1, y: 0 },
        max: { x: 1, y: Math.sqrt(3) },
    }

    public getNextPoint(point: Point): Point {
        const r = random(3);
        if (r < 1) {
            return this.getMiddlePoint(point, this.pointTop);
        } else if (r < 2) {
            return this.getMiddlePoint(point, this.pointLeft);
        } else {
            return this.getMiddlePoint(point, this.pointRight);
        }
    }

    private getMiddlePoint(pA: Point, pB: Point): Point {
        return {
            x: (pA.x + pB.x) / 2,
            y: (pA.y + pB.y) / 2,
        };
    }

    private pickRandomPoint(): Point {
        while (true) {
            const x = random(0, 1);
            const y = random(0, Math.sqrt(3));
            if (y < Math.sqrt(3) * (1 - x)) {
                return {
                    x: randomBool() ? x : -x,
                    y,
                };
            }
        }
    }
}
