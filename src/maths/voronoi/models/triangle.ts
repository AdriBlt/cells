import { Point } from "./point";

export class Triangle
{
    public Vertices: Point[];
    public Circumcenter: Point;
    public RadiusSquared: number;

    public constructor(point1: Point, point2: Point, point3: Point)
    {
        // In theory this shouldn't happen, but it was at one point so this at least makes sure we're getting a
        // relatively easily-recognised error message, and provides a handy breakpoint for debugging.
        if (point1 === point2 || point1 === point3 || point2 === point3)
        {
            throw new Error("Must be 3 distinct points");
        }

        if (!this.IsCounterClockwise(point1, point2, point3))
        {
            this.Vertices = [ point1, point3, point2 ];
        }
        else
        {
            this.Vertices = [ point1, point2, point3 ];
        }

        this.Vertices[0].AdjacentTriangles.add(this);
        this.Vertices[1].AdjacentTriangles.add(this);
        this.Vertices[2].AdjacentTriangles.add(this);
        this.UpdateCircumcircle();
    }

    public get TrianglesWithSharedEdge(): Triangle[] {
        const neighbors: Triangle[] = [];
        this.Vertices.forEach(vertex => {
            const trianglesWithSharedEdge = vertex.AdjacentTriangles.filter(o =>
            {
                return o !== this && this.SharesEdgeWith(o);
            });
            trianglesWithSharedEdge.forEach(e => {
                if (!neighbors.includes(e)) {
                    neighbors.push(e);
                }
            })
        });
        return neighbors;
    }

    public UpdateCircumcircle(): void
    {
        // https://codefound.wordpress.com/2013/02/21/how-to-compute-a-circumcircle/#more-58
        // https://en.wikipedia.org/wiki/Circumscribed_circle
        const p0 = this.Vertices[0];
        const p1 = this.Vertices[1];
        const p2 = this.Vertices[2];
        const dA = p0.X * p0.X + p0.Y * p0.Y;
        const dB = p1.X * p1.X + p1.Y * p1.Y;
        const dC = p2.X * p2.X + p2.Y * p2.Y;

        const aux1 = (dA * (p2.Y - p1.Y) + dB * (p0.Y - p2.Y) + dC * (p1.Y - p0.Y));
        const aux2 = -(dA * (p2.X - p1.X) + dB * (p0.X - p2.X) + dC * (p1.X - p0.X));
        const div = (2 * (p0.X * (p2.Y - p1.Y) + p1.X * (p0.Y - p2.Y) + p2.X * (p1.Y - p0.Y)));

        if (div === 0)
        {
            throw new Error();
        }

        const center = new Point(aux1 / div, aux2 / div);
        this.Circumcenter = center;
        this.RadiusSquared = (center.X - p0.X) * (center.X - p0.X) + (center.Y - p0.Y) * (center.Y - p0.Y);
    }

    public IsCounterClockwise(point1: Point, point2: Point, point3: Point): boolean
    {
        const result = (point2.X - point1.X) * (point3.Y - point1.Y) -
            (point3.X - point1.X) * (point2.Y - point1.Y);
        return result > 0;
    }

    public SharesEdgeWith(triangle: Triangle): boolean
    {
        const sharedVertices = this.Vertices.filter(o => triangle.Vertices.includes(o)).length;
        return sharedVertices === 2;
    }

    public IsPointInsideCircumcircle(point: Point): boolean
    {
        const dX = point.X - this.Circumcenter.X;
        const dY = point.Y - this.Circumcenter.Y;
        const dSquared = dX * dX + dY * dY;
        return dSquared < this.RadiusSquared;
    }

    public equals(triangle: Triangle): boolean {
        // TODO ?
        return this === triangle;
    }
}