import { Complex } from "../../numbers/Complex";
import { clamp } from "../../utils/numbers";

export function getModuleLogRatio(c: Complex, maxSquareMod: number): number {
    if (c == null) {
        return 0;
    }

    const delta =
        Math.log(
            Math.log(c.getSquareModule()) / Math.log(maxSquareMod)
        ) / Math.log(2);

    return clamp(delta, 0, 1);
}