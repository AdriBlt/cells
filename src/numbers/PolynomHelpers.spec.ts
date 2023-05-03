import { Complex } from "./Complex";
import { Polynom } from "./Polynom";
import { getUnityRootsPolynom } from "./PolynomHelpers";

describe('PolynomHelpers', () => {
    it ('computes unity polynom 2', () => {
        const pp = new Polynom(new Complex(1), new Complex(0), new Complex(-1));
        const roots = pp.getRoots()!;
        expect(roots.length).toBe(2);
        // expect(roots).toBe({});

        const  p = getUnityRootsPolynom(2);
        expect(p.getRoots()!.length).toBe(2);
        expectComplexToBe(p.getCoef(0), -1);
        expectComplexToBe(p.getCoef(1), 0);
        expectComplexToBe(p.getCoef(2), 1);
    });
});

function expectComplexToBe(recieved: Complex, expected: number) {
    expect(recieved.getRe()).toBe(expected);
    expect(recieved.getIm()).toBe(0);
}