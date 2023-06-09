import * as p5 from "p5";

import { Point, squaredDistance } from "../../utils/points";
import { Engine } from "../bezier/engine";

export function drawPolygon(p5js: p5, points: Point[], radius: number, nbOfPoints: number = 100): void {
    const last = points.length - 1;
    for (let i = 0; i < points.length; i++) {
        const pCorner = points[i];
        const pAfter = i < last ? points[i + 1] : points[0];
        const pBefore = i > 0 ? points[i - 1] : points[last];

        // Draw line between Corner and After
        const pCornerToAfter = getPointOnLineAtDistance(pCorner, pAfter, radius);
        const pAfterToCorner = getPointOnLineAtDistance(pAfter, pCorner, radius);
        p5js.line(pCornerToAfter.x, pCornerToAfter.y, pAfterToCorner.x, pAfterToCorner.y);

        // Draw curve at Corner
        const pCornerToBefore = getPointOnLineAtDistance(pCorner, pBefore, radius);
        drawCurve(p5js, [pCornerToBefore, pCorner, pCornerToAfter], nbOfPoints);
    }
}

function drawCurve(p5js: p5, cornerPoints: Point[], nbOfPoints: number): void {
    const engine = new Engine(nbOfPoints);
    engine.setPoints(cornerPoints);
    p5js.beginShape();
    engine.getCurve().forEach(p => p5js.vertex(p.x, p.y));
    p5js.endShape();
}

function getPointOnLineAtDistance(pFrom: Point, pTo: Point, radius: number): Point {
    const pointsDistance = Math.sqrt(squaredDistance(pFrom, pTo));
    if (pointsDistance === 0) {
      return pFrom;
    }

    const d = 2 * radius < pointsDistance
      ? radius
      : pointsDistance / 2;

    const dx = pTo.x - pFrom.x;
    const dy = pTo.y - pFrom.y;
    return {
      x: pFrom.x + dx * d / pointsDistance,
      y: pFrom.y + dy * d / pointsDistance,
    };
}
