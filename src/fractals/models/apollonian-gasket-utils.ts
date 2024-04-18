import { getSum } from "../../numbers/Complex";
import { Circle } from "./circle";

export type CircleTriplet = {
    c1: Circle;
    c2: Circle;
    c3: Circle;
}

export function isValidCircle(c: Circle, { c1, c2, c3 }: CircleTriplet): boolean {
    const t1 = areTangent(c, c1);
    const t2 = areTangent(c, c2);
    const t3 = areTangent(c, c3);
    return c.radius >= 1 && t1 && t2 && t3;
}

export function areTangent(c1: Circle, c2: Circle): boolean {
    const epsilon = 0.1;
    const d2 = c1.center.getSquareDistanceFrom(c2.center);
    if (c1.bend * c2.bend > 0) {
        const rSum = c1.radius + c2.radius;
        return Math.abs(d2 - rSum * rSum) < epsilon;
    } else {
        const rDif = Math.abs(c1.radius - c2.radius);
        return Math.abs(d2 - rDif * rDif) < epsilon;
    }
}

export function generateNextCircles({ c1, c2, c3 }: CircleTriplet) {
    const k1 = c1.bend;
    const k2 = c2.bend;
    const k3 = c3.bend;
    const kSum = k1 + k2 + k3;
    const kRoot = 2 * Math.sqrt(k1 * k2 + k2 * k3 + k3 * k1);
    const k4Minus = kSum - kRoot;
    const k4Plus = kSum + kRoot;

    const zk1 = c1.center.multiplyByReal(k1);
    const zk2 = c2.center.multiplyByReal(k2);
    const zk3 = c3.center.multiplyByReal(k3);
    const zkSum = getSum(0, zk1, zk2, zk3);
    const zkRoot = getSum(0, zk1.multiply(zk2), zk2.multiply(zk3), zk3.multiply(zk1)).getSquareRoot().multiplyByReal(2);
    const zk4Minus = zkSum.minus(zkRoot);
    const zk4Plus = zkSum.add(zkRoot);

    return [
        new Circle(zk4Minus.divideByReal(k4Minus), k4Minus),
        new Circle(zk4Minus.divideByReal(k4Plus), k4Plus),
        new Circle(zk4Plus.divideByReal(k4Minus), k4Minus),
        new Circle(zk4Plus.divideByReal(k4Plus), k4Plus),
    ];
}

export function getCircleHash(c: Circle) {
    return `${Math.floor(c.center.x)}/${Math.floor(c.center.y)}/${Math.floor(c.radius)}`;
}
