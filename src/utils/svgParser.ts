import { Point } from "./points";

export function parseSvg(filePath: string): Promise<Point[][]> {
    return fetch(filePath)
    .then((response) => response.text())
    .then((data) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "image/svg+xml");

        const shapes: Point[][] = [];

        const polygons = doc.getElementsByTagName("polygon")
        for (let i = 0; i < polygons.length; i++) {
            const points = polygons[i].getAttribute("points");
            if (points) {
                const polygon = parsePolygon(points)
                if (polygon.length > 0) {
                    shapes.push(polygon);
                }
            }
        }

        const paths = doc.getElementsByTagName("path");
        for (let i = 0; i < paths.length; i++) {
            const points = paths[i].getAttribute("d");
            if (points) {
                const path = parsePath(points)
                path.forEach(p => {
                    shapes.push(p);
                });
            }
        }

        return shapes;
    });
}

const KnownSvgNodes = ['Z', 'z', 'M', 'm', 'L', 'l', 'C', 'c', 'H', 'h', 'V', 'v', 'S', 's', 'Q', 'q', 'T', 't', 'A', 'a'];
export function parsePath(d: string): Point[][] {
    const shapes: Point[][] = [];
    const parts = d
        .replace(/M/g, " M ")
        .replace(/m/g, " m ")
        .replace(/L/g, " L ")
        .replace(/l/g, " l ")
        .replace(/H/g, " H ")
        .replace(/h/g, " h ")
        .replace(/V/g, " V ")
        .replace(/v/g, " v ")
        .replace(/C/g, " C ")
        .replace(/c/g, " c ")
        .replace(/Z/g, " Z ")
        .replace(/z/g, " z ")
        .replace(/S/g, " S ")
        .replace(/s/g, " s ")
        .replace(/Q/g, " Q ")
        .replace(/q/g, " q ")
        .replace(/T/g, " T ")
        .replace(/t/g, " t ")
        .replace(/A/g, " A ")
        .replace(/a/g, " a ")
        .replace(/-/g, " -")
        .replace(/,/g, " ")
        .split(" ")
        .map(value => value.trim())
        .filter(value => !!value);

    let currentShape: Point[] = [];
    let lastPoint: Point = { x: 0, y: 0 };
    let lastNode = '';
    for (let i = 0; i < parts.length; i++) {
        let node = parts[i];
        if (node === 'Z' || node === 'z') {
            if (currentShape.length > 0) {
                currentShape.push(currentShape[0]);
                shapes.push(currentShape);
            }

            currentShape = [];
            lastNode = '';
            continue;
        }

        let newPoint: Point;
        if (!KnownSvgNodes.includes(node)) {
            if (lastNode === 'M') {
                node = 'L';
            } else if (lastNode === 'm') {
                node = 'l';
            } else {
                node = lastNode;
            }
            i--;
        }

        if (node === 'M') {
            currentShape = [];
            const x = +parts[++i];
            const y = +parts[++i];
            newPoint = { x, y };
        }
        else if (node === 'm') {
            currentShape = [];
            const x = +parts[++i];
            const y = +parts[++i];
            newPoint = { x: x + lastPoint.x, y: y + lastPoint.y };
        }
        else if (node === 'L') {
            const x = +parts[++i];
            const y = +parts[++i];
            newPoint = { x, y };
        }
        else if (node === 'l') {
            const x = +parts[++i];
            const y = +parts[++i];
            newPoint = { x: x + lastPoint.x, y: y + lastPoint.y };
        }
        else if (node === 'C') {
            i += 4;
            const x = +parts[++i];
            const y = +parts[++i];
            newPoint = { x, y };
        }
        else if (node === 'c') {
            i += 4;
            const x = +parts[++i];
            const y = +parts[++i];
            newPoint = { x: x + lastPoint.x, y: y + lastPoint.y };
        }
        else if (node === 'H') {
            const x = +parts[++i];
            newPoint = { x, y: lastPoint.y };
        }
        else if (node === 'h') {
            const x = +parts[++i];
            newPoint = { x: x + lastPoint.x, y: lastPoint.y };
        }
        else if (node === 'V') {
            const y = +parts[++i];
            newPoint = { x: lastPoint.x, y };
        }
        else if (node === 'v') {
            const y = +parts[++i];
            newPoint = { x: lastPoint.x, y: y + lastPoint.y };
        }
        else {
            // TODO, not supported S Q T A
            // https://developer.mozilla.org/fr/docs/Web/SVG/Tutorial/Paths
            throw new Error(`Path parsing error: ${node}`);
        }

        currentShape.push(newPoint);
        lastPoint = newPoint;
        lastNode = node;
    }

    if (currentShape.length > 0) {
        shapes.push(currentShape);
    }

    return shapes;
}

function parsePolygon(pointsTxt: string): Point[] {
    return pointsTxt
        .split(" ")
        .map(value => value.trim())
        .filter(value => !!value)
        .map(pairTxt => {
            const points = pairTxt.split(",");
            if (points.length !== 2) {
                throw new Error(`Polygon parsing error: ${pairTxt}`);
            }
            return {
                x: +points[0].trim(),
                y: +points[1].trim(),
            }
        });
}