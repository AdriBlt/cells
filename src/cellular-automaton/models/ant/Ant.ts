import { Color, COLORS } from "../../../utils/color";
import { AutomatonOrientation } from "../AutomatonOrientation";

export class Ant {
  private orientation: AutomatonOrientation;
  private x: number;
  private y: number;
  private color: Color;

  constructor(
    xDep: number,
    yDep: number,
    col: Color = COLORS.Red,
    way: AutomatonOrientation = AutomatonOrientation.SOUTH
  ) {
    this.setX(xDep);
    this.setY(yDep);
    this.setColor(col);
    this.setOrientation(way);
  }

  public getOrientation(): AutomatonOrientation {
    return this.orientation;
  }

  public setOrientation(orientation: AutomatonOrientation): void {
    this.orientation = orientation;
  }

  public getX(): number {
    return this.x;
  }

  public setX(x: number): void {
    this.x = x;
  }

  public getY(): number {
    return this.y;
  }

  public setY(y: number): void {
    this.y = y;
  }

  public getColor(): Color {
    return this.color;
  }

  public setColor(color: Color): void {
    this.color = color;
  }
}
