import { Color, COLORS } from "../../../utils/color";
import { AutomatonType } from "../AutomatonType";

export enum TurmiteState {
  DEAD,
  ALIVE,
}

export class TurmiteType implements AutomatonType {
  constructor(private state: TurmiteState) {}

  public getBackground(): Color {
    switch (this.state) {
      case TurmiteState.DEAD:
        return COLORS.LightGray;
      case TurmiteState.ALIVE:
        return COLORS.DarkGray;
      default:
        throw new Error("TurmiteType.getBackground");
    }
  }
}

export function getTurmiteType(isAlive: boolean): TurmiteType {
  return new TurmiteType(isAlive ? TurmiteState.ALIVE : TurmiteState.DEAD);
}
