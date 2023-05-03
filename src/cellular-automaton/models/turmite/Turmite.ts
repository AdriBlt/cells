import { Color, COLORS } from "../../../utils/color";
import { Ant } from "../ant/Ant";

export class Turmite extends Ant {
  private status: number;

  constructor(xDep: number, yDep: number) {
    super(xDep, yDep);
    this.status = 0;
  }

  public getStatus(): number {
    return this.status;
  }

  public setStatus(state: number): void {
    this.status = state;
  }

  public isIn(x: number, y: number): boolean {
    return this.getX() === x && this.getY() === y;
  }

  public getColor(): Color {
    return getTurmiteColor(this.getStatus());
  }
}

export function getTurmiteColor(status: number): Color {
  switch (status) {
    case 0:
      return COLORS.Red;
    case 1:
      return COLORS.Green;
    case 2:
      return COLORS.Blue;
    default:
      throw new Error("Turmite.getTurmiteColor");
  }
}
