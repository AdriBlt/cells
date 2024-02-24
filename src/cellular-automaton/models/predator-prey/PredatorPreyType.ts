import { Color, COLORS } from "../../../utils/color";
import { AutomatonType } from "../AutomatonType";

export enum PredatorPreyState {
    FOX = 1,
    HEN = 2,
    SNAKE = 3,
    EAGLE = 4,
    SHARK = 5,
}

export class PredatorPreyType implements AutomatonType {
    constructor(private cellState: PredatorPreyState) {}

    public getBackground(): Color {
      switch (this.cellState) {
        case PredatorPreyState.FOX:
          return COLORS.Orange;
        case PredatorPreyState.HEN:
          return COLORS.Yellow;
        case PredatorPreyState.SNAKE:
          return COLORS.Green;
        case PredatorPreyState.EAGLE:
            return COLORS.Brown;
        case PredatorPreyState.SHARK:
            return COLORS.Blue;
        default:
          throw new Error("PredatorPreyType.getBackground: unknown state");
      }
    }
  }

  /**
   * HEN > SNAKE
   * SNAKE > FOX
   * FOX > HEN
   *
   * HEN > SNAKE,SHARK < FOX,EAGLE
   * SNAKE > FOX,EAGLE < SHARK,HEN
   * FOX > HEN,EAGLE < SHARK,SNAKE
   * SHARK > FOX,SNAKE < HEN,EAGLE
   * EAGLE > HEN,SHARK < SNAKE,FOX
   */