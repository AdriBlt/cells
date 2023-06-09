import { random, randomBool } from "../../utils/random";

export interface Particule {
    i: number;
    j: number;
    radius: number;
}

export function areColliding(particule: Particule, other: Particule): boolean {
    const di = particule.i - other.i;
    const dj = particule.j - other.j;
    const threshold = particule.radius + other.radius;
    return di * di + dj * dj < threshold * threshold;
}

export function createParticuleOnBorder(
    radius: number,
    width: number,
    height: number,
): Particule {
    const side = randomBool();
    const p = random(0, width + height);
    let i: number;
    let j: number;
    if (p < width) {
        i = side ? 0 : height - 1;
        j = p;
    } else {
        i = p - width;
        j = side ? 0 : width - 1;
    }

    return { i, j, radius };
}