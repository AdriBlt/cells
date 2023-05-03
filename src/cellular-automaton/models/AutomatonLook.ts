import { Color } from "../../utils/color";
import { AutomatonOrientation } from "./AutomatonOrientation";

export class AutomatonLook {
  public background: Color;
  public orientation: AutomatonOrientation;
  public color: Color | null;

  constructor(
    bckg: Color,
    orient: AutomatonOrientation = AutomatonOrientation.NONE,
    col: Color | null = null
  ) {
    this.background = bckg;
    this.orientation = orient;
    this.color = col;
  }

  public equals(look: AutomatonLook): boolean {
    return (
      this.background === look.background &&
      this.orientation === look.orientation &&
      this.color === look.color
    );
  }

  public set(look: AutomatonLook): void {
    this.background = look.background;
    this.orientation = look.orientation;
    this.color = look.color;
  }
}
