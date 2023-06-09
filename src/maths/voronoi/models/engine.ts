import { CountingList } from "../../../utils/countingList";
import { random } from "../../../utils/random";
import { UniqueSet } from "../../../utils/set";
import { Edge } from "./edge";
import { Point } from "./point";
import { Triangle } from "./triangle";

export class Engine
{
    public points: Point[] = [];
    public delaunayTriangulation: Triangle[] = [];
    public voronoiEdges: Edge[] = [];
    // public voronoiCells: Map<Point, Point[]> = new Map<Point, Point[]>();

    constructor(
        private maxX: number,
        private maxY: number,
    ) {
        this.resetBaseSquare();
    }

    public addPoint(): void {
        const point = new Point(
            random(0, this.maxX),
            random(0, this.maxY));
        this.points.push(point);

        this.generateDelaunayWithBowyerWatson(point);
    }

    public setPoints(points: Point[]): void {
        this.resetBaseSquare();
        points.forEach(point => {
            point.AdjacentTriangles.clear();
            this.points.push(point);
            this.generateDelaunayWithBowyerWatson(point);
        });
        this.generateVoronoiEdgesFromDelaunay();
    }

    public generateVoronoiEdgesFromDelaunay(): void
    {
        // Removing frame points ?
        // const framePoints = this.points.splice(0, 4);
        // this.delaunayTriangulation = this.delaunayTriangulation.filter(triangle =>
        //     triangle.Vertices.findIndex(p => framePoints.includes(p)) < 0);

        // EDGES
        const edgeSet = new UniqueSet<Edge>();
        this.delaunayTriangulation.forEach(triangle => {
            triangle.TrianglesWithSharedEdge.forEach(neighbor => {
                const edge = new Edge(triangle.Circumcenter, neighbor.Circumcenter);
                edgeSet.add(edge);
            });
        });
        this.voronoiEdges = edgeSet.toList();
    }

    // private generateVoronoiCells(): void {
    //     this.voronoiCells.clear();
    //     this.points.forEach(p => {
    //         const path: Point[] = [];
    //         const triangles = p.AdjacentTriangles.toList();
    //         if (triangles.length === 0) {
    //             return;
    //         }

    //         const firstTriangle = triangles[0];
    //         const firstVertex = triangles[0].Vertices.find(v => v.id !== p.id);
    //         if (!firstVertex) {
    //             return;
    //         }
    //         path.push(triangles[0].Circumcenter);
    //         let lastTriangle: Triangle = firstTriangle;
    //         let lastVertex: Point = firstVertex;
    //         while (true) {
    //             const nextTriangle = triangles.find(t => t !== lastTriangle && t.Vertices.includes(lastVertex));
    //             if (!nextTriangle) {
    //                 return;
    //             }
    //             if (nextTriangle === firstTriangle) {
    //                 break;
    //             }
    //             path.push(nextTriangle.Circumcenter);
    //             const nextVertex = nextTriangle.Vertices.find(v => v.id !== p.id && v.id !== lastVertex.id);
    //             if (!nextVertex) {
    //                 return;
    //             }
    //             lastTriangle = nextTriangle;
    //             lastVertex = nextVertex;
    //         }

    //         this.voronoiCells.set(p, path);
    //     });
    // }

    private generateDelaunayWithBowyerWatson(point: Point): void {
        const badTriangles = this.findBadTriangles(point, this.delaunayTriangulation);
        const polygon = this.findHoleBoundaries(badTriangles);

        badTriangles.forEach((triangle: Triangle) => {
            triangle.Vertices.forEach((vertex: Point) => vertex.AdjacentTriangles.delete(triangle));
        });

        this.delaunayTriangulation = this.delaunayTriangulation.filter(o => !badTriangles.includes(o));

        polygon.filter(possibleEdge => possibleEdge.point1 !== point && possibleEdge.point2 !== point)
            .forEach(edge => this.delaunayTriangulation.push(new Triangle(point, edge.point1, edge.point2)));
    }

    private findHoleBoundaries(badTriangles: Triangle[]): Edge[]
    {
        const edges = new CountingList<Edge>();
        badTriangles.forEach(triangle => {
            edges.add(new Edge(triangle.Vertices[0], triangle.Vertices[1]));
            edges.add(new Edge(triangle.Vertices[1], triangle.Vertices[2]));
            edges.add(new Edge(triangle.Vertices[2], triangle.Vertices[0]));
        });
        return edges.getItemsWhere(count => count === 1);
    }

    private findBadTriangles(point: Point, triangles: Triangle[]): Triangle[]
    {
        return triangles.filter(o => o.IsPointInsideCircumcircle(point));
    }

    private resetBaseSquare(): void {
        // TODO make more beautiful
        const pointTL = new Point(0, 0);
        const pointBL = new Point(0, this.maxY);
        const pointBR = new Point(this.maxX, this.maxY);
        const pointTR = new Point(this.maxX, 0);
        this.points = [ pointTL, pointBL, pointBR, pointTR ];

        const tri1 = new Triangle(pointTL, pointBL, pointBR);
        const tri2 = new Triangle(pointTL, pointBR, pointTR);
        this.delaunayTriangulation = [tri1, tri2];

        this.voronoiEdges = [];
        // this.voronoiCells.clear();
    }
}
