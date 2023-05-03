import { Point } from "./points";

export interface Point3D {
    x: number;
    y: number;
    z: number;
}

export interface ViewPoint extends Point3D {
    phi: number;
    thetaAlt: number; // from -pi/2 to +pi/2
}

export class ProjectionToPlan {

    constructor(
        private halfWidth: number,
        private halfHeight: number,
    ) {}

    public getPointOnScreen(
        point: Point3D,
        viewPoint: ViewPoint,
    ): Point | undefined {
        const { x, y, z, phi, thetaAlt } = viewPoint;

        // translation
        const x0 = point.x - x;
        const y0 = point.y - y;
        const z0 = point.z - z;

        // rotation
        const x1 = x0 * Math.cos(phi) + y0 * Math.sin(phi);
        const y1 = y0 * Math.cos(phi) - x0 * Math.sin(phi);
        const z1 = z0;

        // inclinaison
        const x2 = x1 * Math.cos(thetaAlt) + z1 * Math.sin(thetaAlt);
        const y2 = y1;
        const z2 = z1 * Math.cos(thetaAlt) - x1 * Math.sin(thetaAlt);

        // on screen
        if (x2 <= 0) {
            return undefined;
        }

        const x3 = this.halfWidth + this.halfWidth * Math.atan2(y2, x2);
        const y3 = this.halfHeight + this.halfHeight * Math.atan2(z2, x2);
        return { x: x3, y: y3 };
    }
}