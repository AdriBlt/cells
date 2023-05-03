import { Color, COLORS } from "../../../utils/color";
import { AutomatonType } from "../AutomatonType";

export enum AntTypeState {
  TYPE00,
  TYPE01,
  TYPE02,
  TYPE03,
  TYPE04,
  TYPE05,
  TYPE06,
  TYPE07,
  TYPE08,
  TYPE09,
  TYPE10,
  TYPE11,
}

export class AntType implements AutomatonType {
  constructor(private state: AntTypeState) {}

  public getBackground(): Color {
    switch (this.state) {
      case AntTypeState.TYPE00:
        return COLORS.LightGray;
      case AntTypeState.TYPE01:
        return COLORS.DarkGray;
      case AntTypeState.TYPE02:
        return COLORS.Blue;
      case AntTypeState.TYPE03:
        return COLORS.Lime;
      case AntTypeState.TYPE04:
        return COLORS.Orange;
      case AntTypeState.TYPE05:
        return COLORS.Purple;
      case AntTypeState.TYPE06:
        return COLORS.Brown;
      case AntTypeState.TYPE07:
        return COLORS.Yellow;
      case AntTypeState.TYPE08:
        return COLORS.Navy;
      case AntTypeState.TYPE09:
        return COLORS.Cyan;
      case AntTypeState.TYPE10:
        return COLORS.Green;
      case AntTypeState.TYPE11:
        return COLORS.White;

      default:
        throw new Error("AntType.getBackground(): unknown state");
    }
  }
}

export function getAntType(type: number): AntType {
  return new AntType(type as AntTypeState);
}
