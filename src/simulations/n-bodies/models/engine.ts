import { LinkedList } from "../../../utils/linked-list";
import { random } from "../../../utils/random";
import { createVector, Vector } from "../../../utils/vector";
import { Body, BodyInfo } from "../models/models";

const G = 6.6742e-11;

const DELTA_T = 0.1;
const TAIL_LENGTH = 1000000;

export class NBodiesEngine {
    public bodies: Body[] = [];
    public barycenterList: LinkedList<Vector> = new LinkedList<Vector>();

    public setInputs = (inputBodies: BodyInfo[]) => {
        this.bodies = createBodies(inputBodies);
    }

    public reset(): void {
      this.setInputs(this.bodies.map(b => b.info));
    }

    public computeOneStep(): void {
        if (this.bodies.length === 0) {
            return;
        }

        // Reset acceleration
        this.bodies.forEach(p => p.acceleration = createVector());

        // Update acceleration
        for (let i = 0; i < this.bodies.length; i++) {
          for (let j = i + 1; j < this.bodies.length; j++) {
            const distance = this.bodies[i].position.copy().sub(this.bodies[j].position);
            const squareDist = distance.copy().magSq();
            const direction = distance.copy().normalize();
            const deltaAcc = direction.copy().mult(G / squareDist);
            this.bodies[j].acceleration.add(deltaAcc.copy().mult(this.bodies[i].info.mass));
            this.bodies[i].acceleration.sub(deltaAcc.copy().mult(this.bodies[j].info.mass));
          }
        }

        const barycenter = createVector();
        let totalMass = 0;

        // Update Speed and Position + tail + compute barycenter
        this.bodies.forEach(p => {
            p.speed.add(p.acceleration.copy().mult(DELTA_T));
            p.position.add(p.speed.copy().mult(DELTA_T));

            p.tail.insertTail(p.position.copy());
            if (p.tail.count > TAIL_LENGTH) {
                p.tail.popHead();
            }

            barycenter.add(p.position.copy().mult(p.info.mass));
            totalMass += p.info.mass;
        });

        barycenter.mult(1 / totalMass);
        this.barycenterList.insertTail(barycenter);
        if (this.barycenterList.count > TAIL_LENGTH) {
            this.barycenterList.popHead();
        }
    }
}

function createBodies(inputBodies: BodyInfo[]): Body[] {
    const bodies: Body[] = [];
    for (const data of inputBodies) {
        const parent = bodies.find(b => b.info.name === data.parent);
        bodies.push(createBody(data, parent));
    }

    return bodies;
}

function createBody(info: BodyInfo, parent: Body | undefined): Body {
    let position = createVector(0, 0, 0);
    let speed = createVector(0, 0, 0);
    if (parent) {
        // TODO: random place in ellipse
        const ellipseOrientation = random(0, 2 * Math.PI);
        const ra = info.semiMajorAxis * (1 + info.eccentricity);
        const v = Math.sqrt(G * parent.info.mass * (2 / ra - 1 / info.semiMajorAxis));

        position = createVector(
                ra * Math.cos(ellipseOrientation),
                ra * Math.sin(ellipseOrientation),
            ).add(parent.position);
        speed = createVector(
                v * Math.sin(ellipseOrientation),
                -v * Math.cos(ellipseOrientation),
            ).add(parent.speed);
    }
    return {
        info,
        position,
        speed,
        acceleration: createVector(0, 0, 0),
        tail: new LinkedList<Vector>(),
    };
}
