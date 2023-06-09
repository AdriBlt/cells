import { Color, COLORS } from "../../../utils/color";
import { AutomatonType } from "../AutomatonType";

export enum ElementaryRulesState {
  DEAD,
  ALIVE,
}
export class ElementaryRulesType implements AutomatonType {
  constructor(private state: ElementaryRulesState) {}

  public getBackground(): Color {
    switch (this.state) {
      case ElementaryRulesState.DEAD:
        return COLORS.Yellow;
      case ElementaryRulesState.ALIVE:
        return COLORS.Blue;
      default:
        throw new Error("ElementaryRulesType.getColor");
    }
  }
}

export function getElementaryRulesType(alive: boolean): ElementaryRulesType {
  return new ElementaryRulesType(
    alive ? ElementaryRulesState.ALIVE : ElementaryRulesState.DEAD
  );
}
