import { Color, COLORS } from "../../utils/color";

const COLOR_SET: Color[] = [
  COLORS.Blue,
  COLORS.Green,
  COLORS.Red,
  COLORS.Yellow,
  COLORS.Cyan,
  COLORS.Gray,
  COLORS.Magenta,
  COLORS.Orange,
  COLORS.LightGray,
  COLORS.Pink,
  COLORS.DarkGray
];

export const ColorSet = {
  getDifferentColors(size: number): Color[] {
    const colors: Color[] = [];
    for (let k = 0; k < size; k++) {
      colors[k] = COLOR_SET[k % COLOR_SET.length];
    }

    return colors;
  }
};
