import { Complex } from "../../../numbers/Complex";

export interface JuliaComplex {
  complex: Complex;
  name: string;
}

function makeJuliaComplex(x: number, y: number, n?: string): JuliaComplex {
  const complex = new Complex(x, y);
  return { complex, name: n || complex.toString() };
}

export const JuliaSetComplexes = {
  A: makeJuliaComplex(0.3, 0.5),
  B: makeJuliaComplex(0.285, 0.013),
  C: makeJuliaComplex(-1.417022285618, 0.0099534),
  D: makeJuliaComplex(-0.038088, 0.9754633),
  E: makeJuliaComplex(-0.75, 0.11),
  F: makeJuliaComplex(-0.726895347709114071439, 0.188887129043845954792),
  G: makeJuliaComplex(-0.74543, 0.11301),
  H: makeJuliaComplex(-0.1, 0.651),
  I: makeJuliaComplex(-0.123, 0.745, "Douady Rabbit (-0.123+i0.745)"),
  J: makeJuliaComplex(0.25, 0),
  K: makeJuliaComplex(0, 1),
  L: makeJuliaComplex(-1, 0),
};

export const JuliaSetValues: JuliaComplex[] =
  Object.keys(JuliaSetComplexes)
    .map(key => JuliaSetComplexes[key]);
