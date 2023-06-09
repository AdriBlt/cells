import { Complex, getProduct } from "./Complex";
import { getRoots4 } from "./PolynomHelpers";

export class Polynom {
  private degre: number;

  private coefs: { [index: number]: Complex };

  private roots: Complex[] | null;

  constructor(...coefficents: Complex[]) {
    this.coefs = {};
    this.degre = -1;
    this.roots = null;
    const lenght = coefficents.length;
    for (let i = 0; i < lenght; i++) {
      this.add(lenght - 1 - i, coefficents[i]);
    }
  }

  public addRoot(root: Complex): void {
    if (this.roots === null) {
      this.roots = this.getRoots();
    }

    if (this.degre < 0) {
      this.addCoef(1, new Complex(1));
      this.addCoef(0, getProduct(-1, root));
    } else {
      const oldCoef = this.coefs;
      const oldDegre = this.degre;
      this.coefs = {};
      this.degre = -1;
      for (let degree = 0; degree <= oldDegre; degree++) {
        const value = oldCoef[degree];
        if (value) {
          this.addCoef(degree + 1, value);
          this.addCoef(degree, getProduct(-1, value, root));
        }
      }
    }

    if (this.roots != null) {
      this.roots.push(root);
    }
  }

  public add(index: number, coef: Complex): void {
    this.addCoef(index, coef);
    this.roots = null;
  }

  public set(index: number, coef: Complex): void {
    if (coef === null || coef === this.coefs[index]) {
      return;
    }

    this.coefs[index] = coef;
    if (index > this.degre && !coef.isNul()) {
      this.degre = index;
    } else if (index === this.degre && coef.isNul()) {
      this.updateDegre();
    }

    this.roots = null;
  }

  public getCoef(deg: number): Complex {
    const c = this.coefs[deg];
    if (c != null) {
      return c;
    }
    return Complex.ZERO;
  }

  public derive(): Polynom {
    const deriv = new Polynom();

    for (let index = 1; index <= this.degre; index++) {
      const value = this.coefs[index];
      if (value) {
        const coef = value.multiplyByReal(index);
        deriv.add(index - 1, coef);
      }
    }

    return deriv;
  }

  public integre(valeur0: Complex): Polynom {
    const prim = new Polynom(valeur0);
    for (let index = 0; index <= this.degre; index++) {
      const value = this.coefs[index];
      if (value) {
        const coef = value.divideByReal(index + 1);
        prim.add(index + 1, coef);
      }
    }

    return prim;
  }

  public getValue(z: Complex): Complex {
    let output = Complex.ZERO;

    // Complex zPow = new Complex(1);
    // for (int i = 0; i <= this.degre; i++) {
    // if (!this.getCoef(i).isNul()) {
    // sortie = sortie.add(this.getCoef(i).multiply(zPow));
    // }
    // zPow = zPow.multiply(z);
    // }

    // HORNER METHOD
    for (let i = this.degre; i >= 0; i--) {
      if (!this.getCoef(i).isNul()) {
        output = output.add(this.getCoef(i));
      }

      if (i > 0) {
        output = output.multiply(z);
      }
    }

    return output;
  }

  public toString(): string {
    if (this.degre < 0) {
      return "0";
    }
    let str = "";
    let empty = true;
    const one = new Complex(1);
    for (let i = this.degre; i >= 0; i--) {
      const coef = this.getCoef(i);
      if (!coef.isNul()) {
        if (empty) {
          empty = false;
        } else {
          str += " + ";
        }
        if (i === 0) {
          str += coef.toString();
        } else {
          if (!coef.isReal && !coef.isPureImaginary) {
            str += "(" + coef.toString() + ") ";
          } else if (one !== coef) {
            str += coef.toString() + " ";
          }

          str += "z";
          if (i > 1) {
            str += i;
          }
        }
      }
    }

    return str;
  }

  public getRoots(): Complex[] | null {
    if (this.roots === null) {
      this.roots = this.computeRoots();
    }

    return this.roots;
  }

  private addCoef(index: number, coef: Complex): void {
    if (coef.isNul()) {
      return;
    }

    const value = this.coefs[index];
    if (value) {
      const newCoef = value.add(coef);
      this.coefs[index] = newCoef;
    } else {
      this.coefs[index] = coef;
    }
    if (index > this.degre) {
      this.degre = index;
    } else if (index === this.degre) {
      this.updateDegre();
    }
  }

  private updateDegre(): void {
    while (this.degre >= 0) {
      if (!this.getCoef(this.degre).isNul()) {
        return;
      }
      this.degre--;
    }
  }

  private computeRoots(): Complex[] | null {
    const MAX_DEGREE = 4;
    if (this.degre > MAX_DEGREE) {
      return null;
    }

    const c0 = this.getCoef(0);
    const c1 = this.getCoef(1);
    const c2 = this.getCoef(2);
    const c3 = this.getCoef(3);
    const c4 = this.getCoef(4);
    return getRoots4(c4, c3, c2, c1, c0);
  }
}
