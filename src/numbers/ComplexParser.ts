import { Complex } from "./Complex";

export function parseComplex(value: string): Complex {
  const strs: string[] = value
    .replace("i", " i ")
    .replace("j", " j ")
    .replace("\\+", " \\+ ")
    .replace("-", " - ")
    .replace("\\*", " \\* ")
    .replace("/", " / ")
    .replace("\\(", " \\( ")
    .replace("\\)", " \\) ")
    .replace(",", ".")
    .split(" ");
  return parse(strs, 0, strs.length);
}

function parse(strs: string[], start: number, end: number): Complex {
  const adds: Complex[] = [];
  let open = -1;
  let count = 0;
  let c: Complex | null = null;
  let lastOp = "+";
  for (let i = start; i < end; i++) {
    const value = strs[i].trim();
    if (value === "") {
      continue;
    }

    if (value === "(") {
      if (open < 0) {
        open = i + 1;
      }
      count++;
    } else if (value === ")") {
      count--;
      if (count < 0) {
        throw new Error("NumberFormatException");
      }
    }

    if (count > 0) {
      continue;
    }

    if (value === "+" || value === "-") {
      if (c != null) {
        adds.push(c);
        c = null;
      }

      lastOp = value;
      continue;
    } else if (value === "*" || value === "/") {
      lastOp = value;
      continue;
    }

    let cc: Complex;
    if (value === "i") {
      cc = Complex.I;
    } else if (value === "j") {
      cc = Complex.J;
    } else if (value === ")" && count === 0) {
      cc = parse(strs, open, i);
      open = -1;
    } else {
      const d = +value;
      cc = new Complex(d);
    }

    if (c === null) {
      if (lastOp === "+") {
        c = cc;
      } else if (lastOp === "-") {
        c = cc.multiplyByReal(-1);
      } else {
        throw new Error("NumberFormatException");
      }
    } else if (lastOp === "+") {
      c = c.add(cc);
    } else if (lastOp === "-") {
      c = c.minus(cc);
    } else if (lastOp === "*") {
      c = c.multiply(cc);
    } else if (lastOp === "/") {
      c = c.divide(cc);
    }

    lastOp = "*";
  }

  if (count > 0) {
    throw new Error("NumberFormatException");
  }

  if (c == null) {
    return Complex.ZERO;
  }

  for (const cc of adds) {
    c = c.add(cc);
  }

  return c;
}
