import { clamp } from "../../utils/numbers";
import { random } from "../../utils/random";
import { areColliding, Particule } from "./particule-helpers";

export interface DiffusionLimitedAggregationConfig {
    createFreeParticulesAtStart: () => Particule[];
    createFreeParticuleOnCollide: (collidedParticuleRadius: number) => Particule[];
    collidesWithBorder: (p: Particule) => boolean;
}

const VELOCITY = 5;

export class DiffusionLimitedAggregationEngine {
    public treeParticules: Particule[];
    public freeParticules: Particule[];

    constructor(
        private width: number,
        private height: number,
        public config: DiffusionLimitedAggregationConfig,
    ) {
        this.reset();
    }

    public reset(): void {
        this.treeParticules = [];
        this.freeParticules = this.config.createFreeParticulesAtStart();
    }

    public walkOneStep = () => {
        const nextFreeParticules: Particule[] = [];
        const tree = [...this.treeParticules];
        this.freeParticules.forEach(freeParticule => {
            // UPDATE POSITION
            freeParticule.i = clamp(freeParticule.i + random(-VELOCITY, VELOCITY), 0, this.height);
            freeParticule.j = clamp(freeParticule.j + random(-VELOCITY, VELOCITY), 0, this.width);

            // CHECK IS COLLIDING
            if (
                this.config.collidesWithBorder(freeParticule)
                || tree.some(p => areColliding(freeParticule, p))
            ) {
                this.treeParticules.push(freeParticule);
                nextFreeParticules.push(
                    ...this.config.createFreeParticuleOnCollide(freeParticule.radius)
                );
            } else {
                nextFreeParticules.push(freeParticule);
            }
        });

        this.freeParticules = nextFreeParticules;
    }
}