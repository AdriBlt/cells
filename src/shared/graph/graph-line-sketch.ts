import * as p5 from "p5";

import { ProcessingSketch } from "../../services/processing.service";
import { Color, COLORS, setFillColor, setStrokeColor } from "../../utils/color";
import { lerp } from "../../utils/numbers";
import { Extremum, Point } from "../../utils/points";

export interface LineInfo {
    color: Color;
    points: Point[];
}

export interface GraphLineInfo {
    width: number;
    height: number;
    getLines: () => LineInfo[];
    getScale: () => Extremum;
}

export class GraphLineSketch implements ProcessingSketch {
    private p5js: p5;

    constructor(
        private graphLineInfo: GraphLineInfo,
    ) {
    }

    public setup(p: p5): void {
        this.p5js = p;
        this.p5js.createCanvas(
            this.graphLineInfo.width,
            this.graphLineInfo.height,
        );
    }

    public draw(): void {
        this.drawGraph();
    }

    private drawGraph(): void {
        this.p5js.noStroke();
        setFillColor(this.p5js, COLORS.White);
        setStrokeColor(this.p5js, COLORS.Black);
        this.p5js.strokeWeight(1);
        this.p5js.rect(0, 0, this.graphLineInfo.width, this.graphLineInfo.height);

        this.p5js.noFill();
        this.graphLineInfo.getLines().forEach(line => {
            this.p5js.strokeWeight(1);
            setStrokeColor(this.p5js, line.color);
            this.p5js.beginShape();
            line.points.forEach(point => {
                const mappedPoint = this.getMappedPoint(point);
                this.p5js.vertex(mappedPoint.x, mappedPoint.y);
            })
            this.p5js.endShape();
        })
    }

    private getMappedPoint(p: Point): Point {
        const {getScale, height, width} = this.graphLineInfo;
        const scale = getScale();
        return {
            x: getMappedValue(p.x, scale.min.x, scale.max.x, 0, width),
            y: getMappedValue(p.y, scale.min.y, scale.max.y, height, 0),
        };
    }
}

function getMappedValue(value: number, min: number, max: number, targetMin: number, targetMax: number): number {
    if (min >= max){
        throw new Error();
    }

    const p = (value - min) / (max - min);
    return lerp(targetMin, targetMax, p);
}