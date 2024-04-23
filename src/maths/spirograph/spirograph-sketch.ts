import * as p5 from "p5";

import { PlayableSketch } from "../../services/playable-sketch";
import { COLORS, setBackground } from "../../utils/color";

const WIDTH = 800;
const HEIGHT = 500;

const TIMEFRAMES = 10;

export class SpirographSketch extends PlayableSketch {
  private slider: p5.Element;

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(WIDTH, HEIGHT);

    setBackground(this.p5js, COLORS.White);
    this.p5js.noStroke();

    this.slider = this.p5js.createSlider(0, TIMEFRAMES, TIMEFRAMES / 2, 1);
    this.slider.position(10, 10);
    this.slider.style('width', '80px');

    this.initialize();
  }

  public reset = () => {
    // TODO
  }

  public draw(): void {
    this.show();
  }

  private show(): void {
    // TODO
  }

  private initialize() {
    // TODO
  }

}
