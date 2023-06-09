import * as p5 from "p5";

import { PlayableSketch } from "../services/playable-sketch";
import { COLORS, setBackground, setStrokeColor } from "../utils/color";
import { Extremum, Point } from "../utils/points";

const w = 800;
const h = 600;

export interface BransleyChaosGameProps {
    startingPoint: Point;
    dimensions: Extremum;
    getNextPoint: (point: Point) => Point;
    title: string;
    description: string;
}

export class BransleyChoasGameSketch extends PlayableSketch {
    private currentPoint: Point = { x: 0, y: 0 };

    constructor(
        private gameProps: BransleyChaosGameProps
    ) {
        super();
    }

    public setup(p: p5): void {
        this.p5js = p;
        this.p5js.createCanvas(w, h);
        setBackground(this.p5js, COLORS.Black);

        this.currentPoint = this.gameProps.startingPoint;
    }

    public draw(): void {
        for (let i = 0; i < 100; i++) {
            this.drawPoint(this.currentPoint);
            this.currentPoint = this.gameProps.getNextPoint(this.currentPoint);
        }
    }

    private drawPoint({ x, y }: Point): void {
        const { min, max } = this.gameProps.dimensions;
        const px = this.p5js.map(x, min.x, max.x, 0, w);
        const py = this.p5js.map(y, min.y, max.y, h, 0);

        setStrokeColor(this.p5js, COLORS.Green);
        this.p5js.point(px, py);
    }
}
