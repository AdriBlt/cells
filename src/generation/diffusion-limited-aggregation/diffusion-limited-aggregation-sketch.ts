import * as p5 from "p5";

import { PlayableSketch } from "../../services/playable-sketch";
import { COLORS, setFillColor, setStrokeColor } from "../../utils/color";
import { createDefaultList } from "../../utils/list-helpers";
import { random } from "../../utils/random";
import { DiffusionLimitedAggregationConfig, DiffusionLimitedAggregationEngine } from "./diffusion-limited-aggregation-engine";
import { createParticuleOnBorder, Particule } from "./particule-helpers";

export enum GenerationMode {
  InnerPoint = 'Inner Point',
  OutterCircle = 'Outter Circle',
  FromGround = 'From Ground',
}

export const DEFAULT_MODE = GenerationMode.InnerPoint;

const W = 500;
const H = 500;
const NB_PARTICULES = 300;
const STARTING_RADIUS = 5;
const NB_ITERATION_PER_DRAW = 100;

export class DiffusionLimitedAggregationSketch extends PlayableSketch
{
  private engine: DiffusionLimitedAggregationEngine;
  private mode: GenerationMode;

  constructor() {
    super();
    const config = getConfig(DEFAULT_MODE);
    this.engine = new DiffusionLimitedAggregationEngine(W, H, config);
  }

  public setConfig = (mode: GenerationMode): void => {
    this.mode = mode;
    this.engine.config = getConfig(mode);
    this.resetGrid();
    this.play();
  }

  public resetGrid = (): void => {
    this.engine.reset();
    this.drawParticules();
  }

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(W, H);
  }

  public draw = (): void => {
    for (let i = 0; i < NB_ITERATION_PER_DRAW; i++) {
      this.engine.walkOneStep();
    }

    this.drawParticules();

    if (this.engine.freeParticules.length === 0) {
      this.stop();
    }
  }

  public generate = (): void => {
      this.stop();
      while (this.engine.freeParticules.length > 0 && this.isPaused) {
          this.engine.walkOneStep();
      }

      this.drawParticules();
  }

  private drawParticules(): void {
    setStrokeColor(this.p5js, COLORS.Black);
    setFillColor(this.p5js, COLORS.White);
    this.p5js.rect(0, 0, W, H);

    this.p5js.noStroke();

    setFillColor(this.p5js, COLORS.Red);
    switch (this.mode) {
      case GenerationMode.InnerPoint:
        this.p5js.ellipse(H / 2, W / 2, 2 * STARTING_RADIUS);
        break;
      case GenerationMode.OutterCircle:
        this.p5js.push();
        this.p5js.noFill();
        setStrokeColor(this.p5js, COLORS.Red);
        this.p5js.ellipse(H / 2, W / 2, Math.min(H, W));
        this.p5js.pop();
        break;
      case GenerationMode.FromGround:
        this.p5js.rect(0, H - 1, W, 1);
        break;
      default:
    }

    this.engine.treeParticules.forEach(p => this.p5js.ellipse(p.j, p.i, 2 * p.radius));

    setFillColor(this.p5js, COLORS.Black);
    this.engine.freeParticules.forEach(p => this.p5js.ellipse(p.j, p.i, 2 * p.radius));
  }
}

function getConfig(mode: GenerationMode): DiffusionLimitedAggregationConfig {
  switch (mode) {
    case GenerationMode.InnerPoint:
      return createConfig(
        (radius) => createParticuleOnBorder(radius, W, H),
        p => (p.i - H / 2) * (p.i - H / 2) + (p.j - W / 2) * (p.j - W / 2) < p.radius * p.radius,
      );
    case GenerationMode.OutterCircle:
      const circleRadius = Math.min(H, W) / 2;
      return createConfig(
        (radius) => ({ i: H / 2, j: W / 2, radius }),
        p => (p.i - H / 2) * (p.i - H / 2) + (p.j - W / 2) * (p.j - W / 2) > circleRadius * circleRadius,
      );
    case GenerationMode.FromGround:
      return createConfig(
        (radius) => ({ i: 0, j: random(0, W), radius }),
        p => p.i >= H - 1,
      );
    default:
      const never: never = mode;
      throw new Error(`Unknown mode: ${never}`);
  }
}

function createConfig(
  createRandomParticule: (radius: number) => Particule,
  collidesWithBorder: (p: Particule) => boolean,
): DiffusionLimitedAggregationConfig {
  return {
    createFreeParticulesAtStart: () => createDefaultList<Particule>(NB_PARTICULES, () => createRandomParticule(STARTING_RADIUS)),
    createFreeParticuleOnCollide: (radius) => radius > 1
      // ? createDefaultList<Particule>(2, () => createRandomParticule(radius / 2))
      ? [ createRandomParticule(radius - 1) ]
      : [],
    collidesWithBorder,
  };

}