import * as p5 from "p5";

import { Complex } from "../numbers/Complex";
import { PlayableSketch } from "../services/playable-sketch";
import { COLORS, setFillColor, setStrokeColor } from "../utils/color";
import { LinkedList } from "../utils/linked-list";
import { CircleTriplet, generateNextCircles, getCircleHash, isValidCircle } from "./models/apollonian-gasket-utils";
import { Circle } from "./models/circle";

const SIDE = 600;
const CROSS_LENGTH = 5;
const OUTER_CIRCLE = new Circle(new Complex(SIDE / 2, SIDE / 2), - 2 / SIDE);

enum State {
    Paused= 'Paused',
    Computing= 'Computing',
    MovinfLeft= 'MovinfLeft',
    MovingRight= 'MovingRight',
    Over= 'Over',
}
/**
 * TODO:
 * - Set a "Setup" step where the user can place a point within the outer circle
 * - The placement of that step sets possible position for the second circle
 * - The center of that second circle is on a circle with
 *      C = (z0+z1)/2
 *      R² = (r0+r1)²/2 - |z0|² - |z1|² + (x0+x1)²/4  + (y0+y1)²/4
 * - Have the second dragged point projected on the circle
 */

export class ApollonianGasketSketch extends PlayableSketch {
    private circlesToCompute: LinkedList<CircleTriplet> = new LinkedList<CircleTriplet>();
    private circles = new Set<string>();
    private leftCircle = new Circle(new Complex(1 * SIDE / 3, SIDE / 2), 3 / SIDE);
    private rightCircle = new Circle(new Complex(5 * SIDE / 6, SIDE / 2), 6 / SIDE);
    private state = State.Paused;
    private offsetX = 0;
    private offsetY = 0;

    constructor() {
        super();
    }

    public setup(p: p5): void {
        this.p5js = p;
        this.p5js.createCanvas(SIDE, SIDE);
        this.resetGrid();
    }

     public pause =  () => {
        switch (this.state) {
            case State.Paused:
                this.state = State.Computing;
                break;
            case State.Computing:
                this.state = State.Paused;
                break;
            case State.MovinfLeft:
            case State.MovingRight:
                // Should not happen
                this.state = State.Paused;
                break;
            case State.Over:
            default:
                // Nothing
        }
    }

    public resetAll = () => {
        this.leftCircle = new Circle(new Complex(1 * SIDE / 3, SIDE / 2), 3 / SIDE);
        this.rightCircle = new Circle(new Complex(5 * SIDE / 6, SIDE / 2), 6 / SIDE);
        this.resetGrid();
    }

    public resetGrid = (): void => {
        this.drawBackground();
        this.setupStartingCircles();
    }

    public draw(): void {
        this.setMouseCursor();

        switch (this.state) {
            case State.Computing:
                this.generateNewCircle();
                break;
            case State.MovinfLeft:
            case State.MovingRight:
                this.drawBackground();
                this.drawPlacingCircle();
                this.setupStartingCircles();
                break;
            case State.Paused:
            case State.Over:
            default:
                // Nothing
        }
    }

    public drawOneStep = (): void => {
        this.setMouseCursor();
        this.generateNewCircle();
    }

    public mousePressed = () => {
        const { mouseX, mouseY } = this.p5js;
        if (this.isHoverCircle(mouseX, mouseY, this.leftCircle)) {
            this.state = State.MovinfLeft;
            this.offsetX = mouseX - this.leftCircle.center.x;
            this.offsetY = mouseY - this.leftCircle.center.y;
        }
        else if (this.isHoverCircle(mouseX, mouseY, this.rightCircle)) {
            this.state = State.MovingRight;
            this.offsetX = mouseX - this.rightCircle.center.x;
            this.offsetY = mouseY - this.rightCircle.center.y;
        }
    }

    public mouseDragged = () => {
        const { mouseX, mouseY } = this.p5js;
        if (this.state === State.MovinfLeft) {
            this.leftCircle.center = new Complex(
                mouseX - this.offsetX,
                mouseY - this.offsetY,
            );
        }
        else if (this.state === State.MovingRight) {
            this.rightCircle.center = new Complex(
                mouseX - this.offsetX,
                mouseY - this.offsetY,
            );
        }
    }

    public mouseReleased = () => {
        if (this.state === State.MovinfLeft || this.state === State.MovingRight) {
            this.state = State.Paused;
            this.resetGrid();
        }
    }

    private generateNewCircle = () => {
        const circleTriplet = this.circlesToCompute.popHead();
        if (circleTriplet) {
            this.generateAndDraw(circleTriplet);
        } else {
            this.state = State.Over;
        }
    }

    private setMouseCursor = () => {
        const { mouseX, mouseY } = this.p5js;
        const cursor = this.state === State.MovinfLeft || this.state === State.MovingRight
            ? "grabbing"
            : this.isHoverCircle(mouseX, mouseY, this.leftCircle) || this.isHoverCircle(mouseX, mouseY, this.rightCircle)
            ? "grab"
            : "default";
        this.p5js.cursor(cursor);
    }

    private generateAndDraw(triplet: CircleTriplet) {
        const nextCircles = generateNextCircles(triplet);
        nextCircles.forEach((c) => {
            const hash = getCircleHash(c);
            const isValid = isValidCircle(c, triplet);
            const isDuplicate = this.circles.has(hash);
            if (!isValid || isDuplicate) {
                return;
            }

            this.circles.add(hash);
            this.drawAndQueueChildren(c, triplet);
        });
    }

    private drawAndQueueChildren(c: Circle, triplet: CircleTriplet) {
        const { c1, c2, c3 } = triplet;
        this.drawNewCircle(c, triplet);
        this.insertTriplet({ c1, c2, c3: c});
        this.insertTriplet({ c1, c2: c, c3});
        this.insertTriplet({ c1: c, c2, c3});
    }

    private insertTriplet(triplet: CircleTriplet) {
        // this.circlesToCompute.insertTail(triplet);

        const fitness = triplet.c1.radius + triplet.c2.radius + triplet.c3.radius;
        const insertBeforeCallback = (t: CircleTriplet) => {
            const f = t.c1.radius + t.c2.radius + t.c3.radius;
            return fitness >= f;
        }
        this.circlesToCompute.insertBeforeElement(triplet, insertBeforeCallback);
    }

    private drawBackground() {
        setFillColor(this.p5js, COLORS.White);
        this.p5js.noStroke();
        this.p5js.rect(0, 0, SIDE, SIDE);
    }

    private setupStartingCircles(): void {
        this.circlesToCompute.clear();
        this.circlesToCompute.insertTail({
            c1: OUTER_CIRCLE,
            c2: this.leftCircle,
            c3: this.rightCircle,
        });

        this.circles.clear();
        this.circles.add(getCircleHash(OUTER_CIRCLE));
        this.circles.add(getCircleHash(this.leftCircle));
        this.circles.add(getCircleHash(this.rightCircle));

        this.drawCircle(OUTER_CIRCLE);
        this.drawCircle(this.leftCircle);
        this.drawCircle(this.rightCircle);

        this.drawCircleCenter(this.leftCircle);
        this.drawCircleCenter(this.rightCircle);
    }

    private drawCircle = (circle: Circle, color = COLORS.Black): void => {
        setStrokeColor(this.p5js, color);
        this.p5js.strokeWeight(1);
        this.p5js.noFill();
        this.p5js.circle(circle.center.x, circle.center.y, 2 * circle.radius);
    }

    private drawNewCircle = (circle: Circle, triplet: CircleTriplet): void => {
        // const isValid = isValidCircle(circle, triplet);
        // if (isValid) {
        this.drawCircle(circle);
        // } else {
        //     this.drawCircle(circle, COLORS.Red);
        //     this.drawCircle(triplet.c1, COLORS.Orange);
        //     this.drawCircle(triplet.c2, COLORS.Orange);
        //     this.drawCircle(triplet.c3, COLORS.Orange);
        // }
    }

    private drawCircleCenter = (circle: Circle): void => {
        const x = circle.center.x;
        const y = circle.center.y;
        setStrokeColor(this.p5js, COLORS.Red);
        this.p5js.strokeWeight(5);
        this.p5js.line(x - CROSS_LENGTH, y, x + CROSS_LENGTH, y);
        this.p5js.line(x, y - CROSS_LENGTH, x, y + CROSS_LENGTH);
    }

    private isHoverCircle(mouseX: number, mouseY: number, circle: Circle): boolean {
        const x = circle.center.x;
        const y = circle.center.y;
        return mouseX >= x - CROSS_LENGTH && mouseX <= x + CROSS_LENGTH
            && mouseY >= y - CROSS_LENGTH && mouseY <= y + CROSS_LENGTH;
    }

    private drawPlacingCircle() {
        let circle: Circle;
        let otherCircle: Circle;
        if (this.state === State.MovinfLeft) {
            circle = this.leftCircle;
            otherCircle = this.rightCircle;
        }
        else if (this.state === State.MovingRight) {
            circle = this.rightCircle;
            otherCircle = this.leftCircle;
        }
        else {
            return;
        }

        // C = (z0+z1)/2
        // R² = (r0+r1)²/2 - |z0|² - |z1|² + (x0+x1)²/4  + (y0+y1)²/4
        /**
         * r1+r2 = |z1-z2|
         * r0-r2 = |z0-z2|
         *
         * (r1+r2)² = (x2-x1)²+(y2-y1)²
         * (r0-r2)² = (x2-x0)²+(y2-y0)²
         *
         * r0+r1 = sqrt[(x2-x1)²+(y2-y1)²] + sqrt[(x2-x0)²+(y2-y0)²]
         *
         * r1² + r2² + 2 r1 r2 = x2² + y2² + x1² + y1² - 2 x2 x1 - 2 y2 y1 (A)
         * r0² + r2² - 2 r0 r2 = x2² + y2² + x0² + y0² - 2 x2 x0 - 2 y2 y0 (B)
         *
         * (A-B)
         * r1² - r0² + 2 r2 (r0 + r1) = x1² + y1² - x0² - y0² - 2 x2 (x1 - x0) - 2 y2 (y1 - y0)
         *
         * C = (x1² + y1² - x0² - y0² + r0² - r1²)  / 2
         * x2 (x1 - x0) + y2 (y1 - y0) + r2 (r0 + r1) = C
         *
         * (A+B)
         * r0² + r1² + 2 r2² + 2 (r1 - r0) r2 = 2 x2² + 2 y2² + x1² + y1² + x0² + y0² - 2 x2 (x0 + x1) - 2 y2 (y0 + y1)
         *
         * xm = (x0 + x1) / 2
         *
         * ... = 2 (x2 - xm)² - 2 xm² + x0² + x1²
         *     = 2 (x2 - xm)² - (x0 + x1)² / 2 + x0² + x1²
         *     = 2 (x2 - xm)² - x0²/2 - x1²/2 - x0 x1 + x0² + x1²
         *     = 2 (x2 - xm)² + x0²/2 + x1²/2 - x0 x1
         *     = 2 (x2 - xm)² + (x0 - x1)² / 2
         *
         * dr = (r0 - r1) / 2
         * r2² + dr² - (r0 - r1)²/4 + r0²/2 + r1²/2 - 2 dr r2
         *  ... = (r2 - dr)² + r0²/2 + r1²/2 - r0²/4 - r1²/4 + r0 r1 / 2
         *  ... = (r2 - dr)² + r0²/4 + r1²/4 + 2 r0 r1 / 4
         *  ... = (r2 - dr)² + (r0 + r1)² / 4
         *
         *
         * (x2 - xm)² + (y2 - ym)² = (r2 - dr)² + (r0 + r1)² / 4 - (x0 - x1)² / 2 - (y0 - y1)² / 2
         *
         */
        /**
         * OUTER = (0,0) R
         * left = (theta1, p1) r1
         * => R = p1 + r1
         *
         * R = p2 + r2
         * r1² + r2² + 2 r1 r2 = x2² + y2² + x1² + y1² - 2 x2 x1 - 2 y2 y1
         * xi = pi cos(thetai)
         * yi = pi sin(thetai)
         *
         * r2 = R - p2
         * r1² + r2² + 2 r1 r2 = p1² + p2² - 2 p1 p2 (cos1 cos2 + sin1 sin2)
         *
         * r1² + (R - p2)² + 2 r1 (R - p2) = p1² + p2² - 2 p1 p2 cos( theta1 - theta2)
         *
         * r1² + R² + p2² - 2 p2 R + 2 r1 R - 2 r1 p2 - p1² - p2² + 2 p1 p2 cos( theta1 - theta2) = 0
         *
         * p2 (-2R - 2 r1 + 2 p1 cos(theta1-theta2)) + (r1² + R² + 2 r1 R - p1²) = 0
         *
         * p2 = (r1² + R² + 2 r1 R - p1²) / 2 (R + r1 - p1 cos(theta1-theta2))
         *
         * p2 = C / (1 - e cos(theta1-theta2))
         * e = p1 / (R + r1) = (R - r1) / (R + r1)
         * k = (r1² + R² + 2 r1 R - p1²) / 2(R + r1)
         *   = (r1² + R² + 2 r1 R - R² - r1² + 2 R r1) / 2(R + r1)
         *   = 2 R r1 / (R + r1)
         *
         * e = sqrt(1 - b²/a²)
         * e = c / a          (c=dist center to foyer)
         * k = a (1 - e²) = b²/a
         *
         * 1 - e² = 1 - (R - r1)² / (R + r1)²
         *        = 4 R r1 / (R + r1)²
         *
         * a = k / (1 - e²)
         * a = 2 R r1 / (R + r1) / [4 R r1 / (R + r1)²]
         * a = 2 R r1 (R + r1) / 4 R r1
         * a = (R + r1) / 2
         *
         * c = a e = (R - r1) / 2 = p1 / 2
         *
         * sqrt(1-e²) = 2 sqrt(R r1) / (R + r1)
         *
         * b² = a² (1 - e²)
         * b = (R + r1) / 2 * 2 sqrt(R r1) / (R + r1)
         *   = sqrt(R r1)
         */
        const { center: z0, radius: r0 } = OUTER_CIRCLE;
        const { center: z1, radius: r1 } = otherCircle;
        const theta1 = Math.atan2(z1.y - z0.y, z1.x - z0.x);
        const e = (r0 - r1) / (r0 + r1);
        const k = 2 * r0 * r1 / (r0 + r1);

        setStrokeColor(this.p5js, COLORS.Red);
        this.p5js.strokeWeight(1);
        this.p5js.noFill();

        // Draw ellipse
        const center = z0.add(z1).divideByReal(2);
        const a = (r0 + r1) / 2;
        const b = Math.sqrt(r0 * r1);
        this.p5js.push();
        this.p5js.translate(center.x, center.y);
        this.p5js.rotate(theta1);
        this.p5js.ellipse(0, 0, 2 * a, 2 * b);
        this.p5js.pop();

        // Update circle
        const dx = circle.center.x - z0.x;
        const dy = circle.center.y - z0.y;
        const theta2 = Math.atan2(dy, dx);
        const denum = 1 - e * Math.cos(theta2 - theta1);
        const p2 = denum === 0 ? 0 : k / denum;
        const x2 = z0.x + p2 * Math.cos(theta2);
        const y2 = z0.y + p2 * Math.sin(theta2);
        const r2 = r0 - p2;
        circle.center.setRe(x2);
        circle.center.setIm(y2);
        circle.bend = 1 / r2;

        this.p5js.line(center.x, center.y, x2, y2);
    }
}
