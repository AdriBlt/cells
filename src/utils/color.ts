import * as p5 from "p5";

import { clamp, lerp } from "./numbers";

export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export function setBackground(p: p5, c: Color): void {
  p.background(getColor(p, c));
}

export function setFillColor(p: p5, c: Color): void {
  p.fill(getColor(p, c));
}

export function setStrokeColor(p: p5, c: Color): void {
  p.stroke(getColor(p, c));
}

export function getColor(p: p5, c: Color): p5.Color {
  return p.color(c.r, c.g, c.b, c.a);
}

export function color(r: number, g: number, b: number, a?: number): Color {
  return { r, g, b, a };
}

export function colorWithAlpha(c: Color, a: number): Color {
  return { ...c, a };
}

export function lerpColor(
  colorA: Color,
  colorB: Color,
  ratio: number = 0.5
): Color {
  const p = clamp(ratio, 0, 1);
  return color(
    lerp(colorA.r, colorB.r, p),
    lerp(colorA.g, colorB.g, p),
    lerp(colorA.b, colorB.b, p),
    colorA.a && colorB.a && lerp(colorA.a, colorB.a, p)
  );
}

export const COLORS = {
  Maroon: color(128, 0, 0),
  DarkRed: color(139, 0, 0),
  Brown: color(165, 42, 42),
  Firebrick: color(178, 34, 34),
  Crimson: color(220, 20, 60),
  Red: color(255, 0, 0),
  Tomato: color(255, 99, 71),
  Coral: color(255, 127, 80),
  IndianRed: color(205, 92, 92),
  LightCoral: color(240, 128, 128),
  DarkSalmon: color(233, 150, 122),
  Salmon: color(250, 128, 114),
  LightSalmon: color(255, 160, 122),
  OrangeRed: color(255, 69, 0),
  DarkOrange: color(255, 140, 0),
  Orange: color(255, 165, 0),
  Gold: color(255, 215, 0),
  DarkGoldenRod: color(184, 134, 11),
  GoldenRod: color(218, 165, 32),
  PaleGoldenRod: color(238, 232, 170),
  DarkKhaki: color(189, 183, 107),
  Khaki: color(240, 230, 140),
  Olive: color(128, 128, 0),
  Yellow: color(255, 255, 0),
  YellowGreen: color(154, 205, 50),
  DarkOliveGreen: color(85, 107, 47),
  OliveDrab: color(107, 142, 35),
  LawnGreen: color(124, 252, 0),
  ChartReuse: color(127, 255, 0),
  GreenYellow: color(173, 255, 47),
  DarkGreen: color(0, 100, 0),
  Green: color(0, 128, 0),
  ForestGreen: color(34, 139, 34),
  Lime: color(0, 255, 0),
  LimeGreen: color(50, 205, 50),
  LightGreen: color(144, 238, 144),
  PaleGreen: color(152, 251, 152),
  DarkSeaGreen: color(143, 188, 143),
  MediumSpringGreen: color(0, 250, 154),
  SpringGreen: color(0, 255, 127),
  SeaGreen: color(46, 139, 87),
  MediumAquaMarine: color(102, 205, 170),
  MediumSeaGreen: color(60, 179, 113),
  LightSeaGreen: color(32, 178, 170),
  DarkSlateGray: color(47, 79, 79),
  Teal: color(0, 128, 128),
  DarkCyan: color(0, 139, 139),
  Aqua: color(0, 255, 255),
  Cyan: color(0, 255, 255),
  LightCyan: color(224, 255, 255),
  DarkTurquoise: color(0, 206, 209),
  Turquoise: color(64, 224, 208),
  MediumTurquoise: color(72, 209, 204),
  PaleTurquoise: color(175, 238, 238),
  AquaMarine: color(127, 255, 212),
  PowderBlue: color(176, 224, 230),
  CadetBlue: color(95, 158, 160),
  SteelBlue: color(70, 130, 180),
  CornFlowerBlue: color(100, 149, 237),
  DeepSkyBlue: color(0, 191, 255),
  DodgerBlue: color(30, 144, 255),
  LightBlue: color(173, 216, 230),
  SkyBlue: color(135, 206, 235),
  LightSkyBlue: color(135, 206, 250),
  MidnightBlue: color(25, 25, 112),
  Navy: color(0, 0, 128),
  DarkBlue: color(0, 0, 139),
  MediumBlue: color(0, 0, 205),
  Blue: color(0, 0, 255),
  RoyalBlue: color(65, 105, 225),
  BlueViolet: color(138, 43, 226),
  Indigo: color(75, 0, 130),
  DarkSlateBlue: color(72, 61, 139),
  SlateBlue: color(106, 90, 205),
  MediumSlateBlue: color(123, 104, 238),
  MediumPurple: color(147, 112, 219),
  DarkMagenta: color(139, 0, 139),
  DarkViolet: color(148, 0, 211),
  DarkOrchid: color(153, 50, 204),
  MediumOrchid: color(186, 85, 211),
  Purple: color(128, 0, 128),
  Thistle: color(216, 191, 216),
  Plum: color(221, 160, 221),
  Violet: color(238, 130, 238),
  Magenta: color(255, 0, 255),
  Orchid: color(218, 112, 214),
  MediumVioletRed: color(199, 21, 133),
  PaleVioletRed: color(219, 112, 147),
  DeepPink: color(255, 20, 147),
  HotPink: color(255, 105, 180),
  LightPink: color(255, 182, 193),
  Pink: color(255, 192, 203),
  AntiqueWhite: color(250, 235, 215),
  Beige: color(245, 245, 220),
  Bisque: color(255, 228, 196),
  BlanchedAlmond: color(255, 235, 205),
  Wheat: color(245, 222, 179),
  CornSilk: color(255, 248, 220),
  LemonChiffon: color(255, 250, 205),
  LightGoldenRodYellow: color(250, 250, 210),
  LightYellow: color(255, 255, 224),
  SaddleBrown: color(139, 69, 19),
  Sienna: color(160, 82, 45),
  Chocolate: color(210, 105, 30),
  Peru: color(205, 133, 63),
  SandyBrown: color(244, 164, 96),
  BurlyWood: color(222, 184, 135),
  Tan: color(210, 180, 140),
  RosyBrown: color(188, 143, 143),
  Moccasin: color(255, 228, 181),
  NavajoWhite: color(255, 222, 173),
  PeachPuff: color(255, 218, 185),
  MistyRose: color(255, 228, 225),
  LavenderBlush: color(255, 240, 245),
  Linen: color(250, 240, 230),
  OldLace: color(253, 245, 230),
  PapayaWhip: color(255, 239, 213),
  SeaShell: color(255, 245, 238),
  MintCream: color(245, 255, 250),
  SlateGray: color(112, 128, 144),
  LightSlateGray: color(119, 136, 153),
  LightSteelBlue: color(176, 196, 222),
  Lavender: color(230, 230, 250),
  FloralWhite: color(255, 250, 240),
  AliceBlue: color(240, 248, 255),
  GhostWhite: color(248, 248, 255),
  Honeydew: color(240, 255, 240),
  Ivory: color(255, 255, 240),
  Azure: color(240, 255, 255),
  Snow: color(255, 250, 250),
  Black: color(0, 0, 0),
  DimGray: color(105, 105, 105),
  Gray: color(128, 128, 128),
  DarkGray: color(169, 169, 169),
  Silver: color(192, 192, 192),
  LightGray: color(211, 211, 211),
  Gainsboro: color(220, 220, 220),
  WhiteSmoke: color(245, 245, 245),
  White: color(255, 255, 255),
};
