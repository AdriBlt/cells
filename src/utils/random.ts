import * as p5 from "p5";

export function random(min?: number, max?: number) {
  return p5.prototype.random(min, max);
}

export function randomInt(min?: number, max?: number) {
  const a = min !== undefined ? p5.prototype.ceil(min) : undefined;
  const b = max !== undefined ? p5.prototype.floor(max) : undefined;
  return p5.prototype.int(random(a, b));
}

export function randomBool() {
  return random(0, 1) < 0.5;
}
