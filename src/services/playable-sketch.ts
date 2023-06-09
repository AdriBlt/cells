import * as p5 from "p5";

import { ProcessingSketch } from "./processing.service";

export abstract class PlayableSketch implements ProcessingSketch {
    protected p5js: p5;
    protected isPaused: boolean = false;

    public abstract setup(p: p5): void;
    public abstract draw(): void;

    public pause = (): void => {
        if (this.isPaused) {
            this.p5js.loop();
        } else {
            this.p5js.noLoop();
        }

        this.isPaused = !this.isPaused;
    };

    public playOneStep = (): void => {
        if (!this.isPaused) {
            this.pause();
        }

        this.draw();
    };

    public stop = (): void => {
        if (!this.isPaused) {
            this.pause();
        }
    };

    public play = (): void => {
        if (this.isPaused) {
            this.pause();
        }
    };
}