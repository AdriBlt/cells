export class Complex {
  public static ZERO = new Complex();
  public static I = new Complex(0, 1);
  public static J = new Complex(-0.5, Math.sqrt(3) / 2);
  public static J2 = new Complex(-0.5, -Math.sqrt(3) / 2);

  private re: number;
  private im: number;

  public static fromAngle(angle: number, magnitude: number = 1): Complex {
    return new Complex(
      magnitude * Math.cos(angle),
      magnitude * Math.sin(angle)
    );
  }

  constructor(re: number = 0, im: number = 0) {
    this.setRe(re);
    this.setIm(im);
  }

  public get x(): number { return this.re; }
  public get y(): number { return this.im; }

  public get isNull(): boolean {
    return this.re === 0.0 && this.im === 0.0;
  }

  public get isReal(): boolean {
    return this.im === 0.0;
  }

  public get isPureImaginary(): boolean {
    return this.re === 0.0;
  }

  public getRe(): number {
    return this.re;
  }

  public setRe(re: number): void {
    this.re = re;
  }

  public getIm(): number {
    return this.im;
  }

  public setIm(im: number): void {
    this.im = im;
  }

  public getSquareModule(): number {
    return this.re * this.re + this.im * this.im;
  }

  public getModule(): number {
    return Math.sqrt(this.getSquareModule());
  }

  public addRe(d: number): Complex {
    return new Complex(this.re + d, this.im);
  }

  public addIm(d: number): Complex {
    return new Complex(this.re, this.im + d);
  }

  public add(c: Complex): Complex {
    return new Complex(this.re + c.getRe(), this.im + c.getIm());
  }

  public minus(c: Complex): Complex {
    return new Complex(this.re - c.getRe(), this.im - c.getIm());
  }

  public multiply(c: Complex): Complex {
    return new Complex(
      this.re * c.getRe() - this.im * c.getIm(),
      this.im * c.getRe() + this.re * c.getIm()
    );
  }

  public getSquare(): Complex {
    return new Complex(
      this.re * this.re - this.im * this.im,
      2 * this.im * this.re
    );
  }

  public getSquareRoot(): Complex {
    const module = this.getModule();
    return new Complex(
      Math.sqrt((module + this.re) / 2),
      Math.sqrt((module - this.re) / 2)
    );
  }

  public getCube(): Complex {
    return new Complex(
      this.re * this.re * this.re - 3 * this.re * this.im * this.im,
      3 * this.re * this.re * this.im - this.im * this.im * this.im
    );
  }

  public getCubeRoot(): Complex {
    if (this.isReal) {
      return new Complex(Math.cbrt(this.re));
    }

    if (this.isPureImaginary) {
      return new Complex(0, -Math.cbrt(this.im));
    }

    const module = this.getModule();
    const theta = this.getAngle();
    const re = Math.cbrt(module) * Math.cos(theta / 3);
    const im = Math.cbrt(module) * Math.sin(theta / 3);
    return new Complex(re, im);
  }

  public getPow(puiss: number): Complex {
    const module = this.getModule();
    const theta = this.getAngle();
    const re = Math.pow(module, puiss) * Math.cos(theta * puiss);
    const im = Math.pow(module, puiss) * Math.sin(theta * puiss);
    return new Complex(re, im);
  }

  public getAngle(): number {
    return Math.atan2(this.im, this.re);
  }

  public getAngleCosinus(): number {
    return this.isNull ? 0 : this.re / this.getModule();
  }

  public getAngleSinus(): number {
    return this.isNull ? 0 : this.im / this.getModule();
  }

  public divide(c: Complex): Complex {
    const denum = c.getSquareModule();
    if (denum === 0.0) {
      throw new Error("Division by zero");
    }

    return new Complex(
      (this.re * c.getRe() + this.im * c.getIm()) / denum,
      (-this.re * c.getIm() + this.im * c.getRe()) / denum
    );
  }

  public getSquareDistanceFrom(c: Complex): number {
    return (
      (this.re - c.getRe()) * (this.re - c.getRe()) +
      (this.im - c.getIm()) * (this.im - c.getIm())
    );
  }

  public isNul(): boolean {
    return this.isReal && this.isPureImaginary;
  }

  public isEqual(c: Complex): boolean {
    return this.re === c.getRe() && this.im === c.getIm();
  }

  public multiplyByReal(d: number): Complex {
    return new Complex(d * this.re, d * this.im);
  }

  public divideByReal(d: number): Complex {
    if (d === 0.0) {
      throw new Error("Division by zero");
    }

    return new Complex(this.re / d, this.im / d);
  }

  public toString(): string {
    const re = this.re.toString();
    const im = this.im.toString();

    if (this.isReal) {
      return re;
    }

    if (this.isPureImaginary) {
      if (this.im === 1) {
        return "i";
      }

      return im + "i";
    }

    if (this.im < 0) {
      return re + im + "i";
    }

    if (this.im === 1) {
      return re + "+i";
    }

    return re + "+" + im + "i";
  }

  public clone(): Complex {
    return new Complex(this.re, this.im);
  }
}

export function getSum(coef: number, ...complexes: Complex[]): Complex {
  let sum = new Complex(coef);
  for (const c of complexes) {
    sum = sum.add(c);
  }

  return sum;
}

export function getProduct(coef: number, ...complexes: Complex[]): Complex {
  let product = new Complex(coef);
  for (const c of complexes) {
    product = product.multiply(c);
  }

  return product;
}
