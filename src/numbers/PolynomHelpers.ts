import { Complex, getProduct, getSum } from "./Complex";
import { Polynom } from "./Polynom";

export function getRoots1(c1: Complex, c0: Complex): Complex[] {
  const roots: Complex[] = [];
  if (c1.isNul()) {
    return roots;
  }

  roots.push(c0.multiplyByReal(-1).divide(c1));
  return roots;
}

export function getRoots2(c2: Complex, c1: Complex, c0: Complex): Complex[] {
  if (c2.isNul()) {
    return getRoots1(c1, c0);
  }

  const roots: Complex[] = [];
  const delta = getSum(0, c1.getSquare(), getProduct(-4, c2, c0));
  roots.push(
    c1
      .add(delta.getSquareRoot())
      .divide(c2)
      .multiplyByReal(-1.0 / 2)
  );
  roots.push(
    c1
      .minus(delta.getSquareRoot())
      .divide(c2)
      .multiplyByReal(-1.0 / 2)
  );
  return roots;
}

export function getRoots3(
  c3: Complex,
  c2: Complex,
  c1: Complex,
  c0: Complex
): Complex[] {
  if (c3.isNul()) {
    return getRoots2(c2, c1, c0);
  }

  const roots: Complex[] = [];
  const p = getSum(
    0,
    c1.divide(c3),
    c2
      .getSquare()
      .divide(c3.getSquare())
      .multiplyByReal(-1.0 / 3.0)
  );
  const q = getSum(
    0,
    c0.divide(c3),
    c2
      .multiply(c1)
      .divide(c3.getSquare())
      .multiplyByReal(-1.0 / 3.0),
    c2
      .getCube()
      .divide(c3.getCube())
      .multiplyByReal(2.0 / 27.0)
  );

  const cardan: Complex[] = getRoots2(
    new Complex(1),
    q,
    p.getCube().multiplyByReal(-1.0 / 27.0)
  );
  const chVar = c2.divide(c3).multiplyByReal(-1.0 / 3.0);
  const u = cardan[0].getCubeRoot();
  const v = cardan[1].getCubeRoot();
  const root = getSum(0, chVar, u, v);
  roots.push(root);
  //  r2 = getSum(0, chVar, u.multiply(Complex.J), v.multiply(Complex.J2));
  //  r3 = getSum(0, chVar, u.multiply(Complex.J2), v.multiply(Complex.J));
  // roots.push(r2);
  // roots.push(r3);
  const bb = c2.add(c3.multiply(root));
  const cc = c1.add(bb.multiply(root));
  roots.push(...getRoots2(c3, bb, cc));
  return roots;
}

export function getRoots4(
  c4: Complex,
  c3: Complex,
  c2: Complex,
  c1: Complex,
  c0: Complex
): Complex[] {
  if (c4.isNul()) {
    return getRoots3(c3, c2, c1, c0);
  }

  const roots: Complex[] = [];
  const p = getSum(
    0,
    c2.divide(c4),
    c3.getSquare().divide(c4.getSquare()).multiplyByReal(-0.375)
  );
  const q = getSum(
    0,
    c1.divide(c4),
    c3.multiply(c2).divide(c4.getSquare()).multiplyByReal(-0.5),
    c3.getCube().divide(c4.getCube()).multiplyByReal(0.125)
  );
  const r = getSum(
    0,
    c0.divide(c4),
    c3.multiply(c1).divide(c4.getSquare()).multiplyByReal(-0.25),
    c3.getSquare().multiply(c2).divide(c4.getCube()).multiplyByReal(0.0625),
    c3
      .divide(c4)
      .getPow(4)
      .multiplyByReal(-3.0 / 256)
  );
  const ferrari = getRoots3(
    new Complex(8),
    p.multiplyByReal(-4),
    r.multiplyByReal(-8),
    r.multiply(p).multiplyByReal(4).minus(q.getSquare())
  );

  const root = ferrari[0];
  const aa = root.multiplyByReal(2).minus(p).getSquareRoot();
  const bb = aa.isNul()
    ? root.getSquare().minus(r).getSquareRoot()
    : q.divide(aa).multiplyByReal(-0.5);

  roots.push(...getRoots2(new Complex(1), aa, root.add(bb)));
  roots.push(
    ...getRoots2(new Complex(1), aa.multiplyByReal(-1), root.minus(bb))
  );

  const chVar = c3.divide(c4).multiplyByReal(-0.25);
  return roots.map((complex) => complex.add(chVar));
}

export function getUnityRootsPolynom(n: number): Polynom {
  if (n <= 0) {
    throw new Error("Invalud parameter");
  }

  const p = new Polynom();
  p.addRoot(new Complex(1));

  if (n === 1) {
    return p;
  }

  if (n === 2) {
    p.addRoot(new Complex(-1));
    return p;
  }

  if (n === 3) {
    p.addRoot(Complex.J);
    p.addRoot(Complex.J2);
    return p;
  }

  if (n === 4) {
    p.addRoot(new Complex(-1));
    p.addRoot(Complex.I);
    p.addRoot(new Complex(0, -1));
    return p;
  }

  for (let k = 1; k < n; k++) {
    const theta = 2 * Math.PI * k / n;
    const re = Math.cos(theta);
    const im = Math.sin(theta);
    p.addRoot(new Complex(re, im));
  }

  return p;
}
