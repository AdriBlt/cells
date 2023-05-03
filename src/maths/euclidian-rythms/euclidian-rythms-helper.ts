import { findMaxElement } from "../../utils/list-helpers";

export function getEuclidianRythm(k: number, n: number): boolean[] {
    let rythm: string[] = getDefaultRythm(k, n);

    while (true) {
        const tailLength = getTailLength(rythm);
        if (tailLength === 1 || tailLength === rythm.length) {
            break;
        }

        rythm = getCollapsedRythm(rythm, tailLength);
    }

    const boolRythm = rythm.join('').split('').map(c => c === '1');

    const startingIndex = getStartingIndex(boolRythm);
    if (startingIndex === 0) {
        return boolRythm;
    }

    return [...boolRythm.slice(startingIndex), ...boolRythm.slice(0, startingIndex)];
}

function getStartingIndex(rythm: boolean[]): number {
    const rythmLength: Array<{ start: number; length: number }> = [];
    let startIndex = -1;
    let streak = 0;
    for (let i = 0; i < rythm.length; i++) {
        if (rythm[i]) {
            if (streak === 0) {
                startIndex = i;
            }
            streak++;
        } else if (streak > 0) {
            rythmLength.push({
                start: startIndex,
                length: streak
            });
            streak = 0;
        }
    }
    if (streak > 0) {
        rythmLength.push({
            start: startIndex,
            length: streak
        });
    }

    let max = findMaxElement(rythmLength, r => r.length);
    if (rythm[rythm.length - 1]
        && rythmLength.length > 1
        && rythmLength[0].length + rythmLength[rythmLength.length - 1].length > max.length)
    {
        // Loops around
        max = rythmLength[rythmLength.length - 1];
    }

    return max.start;
}

function getCollapsedRythm(rythm: string[], tailLength: number): string[] {
    let left = rythm.length - tailLength;
    let right = tailLength;

    if (right > left) {
        left = tailLength;
        right = rythm.length - tailLength;
    }

    const nextRythm = rythm.slice(0, left);
    for (let i = 0; i < right; i++) {
        nextRythm[i] += rythm[left + i];
    }

    return nextRythm;
}

function getTailLength(rythm: string[]): number {
    let tailLength = 1;
    const length = rythm.length;
    for (let i = length - 2; i >= 0; i--) {
        if (rythm[i] === rythm[length - 1]) {
            tailLength++;
        } else {
            break;
        }
    }
    return tailLength;
}

function getDefaultRythm(k: number, n: number): string[] {
    const rythm: string[] = [];
    let index = 0;
    for (; index < k; index++) {
        rythm.push('1');
    }
    for (; index < n; index++) {
        rythm.push('0');
    }
    return rythm;
}
