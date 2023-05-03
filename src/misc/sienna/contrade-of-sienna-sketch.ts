import * as p5 from "p5";

import { ProcessingSketch } from "../../services/processing.service";
import { Color, COLORS, lerpColor, setBackground, setFillColor, setStrokeColor } from "../../utils/color";
import { findMinElement } from "../../utils/list-helpers";
import { Extremum, findExtremum, isBetweenExtremumIncluded, Point, squaredDistance } from "../../utils/points";
import { parsePath } from "../../utils/svgParser";
import { siena } from "./siena";

const WIDTH = 600;
const HEIGHT = 600;
const MARGIN = 10;

export interface SelectedRegion {
  id: string;
  isTerzo: boolean;
}

export interface RegionInfoDisplay {
  selectRegion(region: SelectedRegion | null): void;
}

interface Region {
  id: string;
  isTerzo: boolean;
  shape: Point[];
  color: Color;
  box: Extremum;
  center: Point;
  isHovered: boolean;
  isSelected: boolean;
}

export class ContradeOfSiennaSketch implements ProcessingSketch {
  private p5js: p5;

  private regions: Region[];
  private borders: Point[][];
  private tooltipText: string | undefined;

  constructor(private regionInfoDisplay: RegionInfoDisplay) {
  }

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(1200, 1000);
    this.loadData();
    this.draw();
  }

  public draw(): void {
    this.updateHover();
    this.drawMap();
  }

  public mouseClicked = (): void => {
    const clickedRegion = this.getMouseRegion();
    this.regions.forEach(c => {
      c.isSelected = !!clickedRegion && clickedRegion.id === c.id;
    });

    this.regionInfoDisplay.selectRegion(
      clickedRegion
      ? { id: clickedRegion.id, isTerzo: clickedRegion.isTerzo }
      : null
    );
  }

  private updateHover(): void {
    const hoveredRegion = this.getMouseRegion();
    this.regions.forEach(c => {
      c.isHovered = !!hoveredRegion && hoveredRegion.id === c.id;
    });
    if (!hoveredRegion) {
      this.p5js.cursor('default');
      this.tooltipText = undefined;
    } else {
      this.p5js.cursor('pointer');
      this.tooltipText = hoveredRegion.id;
    }
  }

  private drawMap(): void {
    setBackground(this.p5js, COLORS.White);
    setStrokeColor(this.p5js, COLORS.Black);

    this.regions.forEach(c => {
      this.p5js.strokeWeight(c.isTerzo ? 1.2 : 0.5);
      setFillColor(this.p5js, lerpColor(c.color, COLORS.White, c.isSelected ? 0 : c.isHovered ? 0.3 : 0.6));
      this.p5js.beginShape();
      c.shape.forEach(point => this.p5js.vertex(point.x, point.y));
      this.p5js.endShape();
    });

    this.p5js.noFill()
    this.p5js.strokeWeight(1.2);
    this.borders.forEach(border => {
      this.p5js.beginShape();
      border.forEach(point => this.p5js.vertex(point.x, point.y));
      this.p5js.endShape();
    });

    if (this.tooltipText) {
      this.p5js.textStyle(this.p5js.ITALIC);
      this.p5js.text(this.tooltipText, WIDTH * 3 / 4, HEIGHT - MARGIN);
    }
  }

  private loadData(): void {
    const paths: Point[][] = siena.contrade.map(c => parsePath(c.path)[0]);
    const flatten: Point[] = paths.reduce((acc: Point[], value: Point[]) => acc.concat(value), []);
    const extremum = findExtremum(flatten);
    this.regions = paths.map((p, i) => {
      const contrada = siena.contrade[i];
      return createRegion(
        contrada.id,
        this.getContradaColor(contrada.id),
        movePathToCenter(p, extremum),
        false,
      );
    });

    const rectWidth = 30;
    const rectHeight = 20;
    const rectLeft = WIDTH * 4 / 5;
    siena.terzi.forEach((t, i) => {
      setFillColor(this.p5js, this.getTerzoColor(t.id));
      const rectTop = MARGIN + rectHeight + rectHeight * (2 * i + 1);
      this.p5js.rect(rectLeft, rectTop, rectWidth, rectHeight);
      const rect: Point[] = [
        { x: rectLeft, y: rectTop },
        { x: rectLeft + rectWidth, y: rectTop },
        { x: rectLeft + rectWidth, y: rectTop + rectHeight },
        { x: rectLeft, y: rectTop + rectHeight },
        { x: rectLeft, y: rectTop },
      ];
      const region = createRegion(
        t.id,
        this.getTerzoColor(t.id),
        rect,
        true,
      );
      this.regions.push(region);
    });

    this.borders = siena.bounderies.map(path => movePathToCenter(parsePath(path)[0], extremum));
  }

  private getContradaColor(contradaId: string): Color {
    for (const terzo of siena.terzi) {
      if (terzo.ids.includes(contradaId)) {
        return this.getTerzoColor(terzo.id);
      }
    }
    return this.getTerzoColor("");
  }

  private getTerzoColor(terzoId: string): Color {
    switch (terzoId) {
      case siena.terzi[0].id:
        // Citta
        return COLORS.Red;
      case siena.terzi[1].id:
        // Camollia
        return COLORS.Blue;
      case siena.terzi[2].id:
        // San Martino
        return COLORS.Green;
      default:
        return COLORS.Gray;
    }
  }

  private getMouseRegion(): Region | null {
    const mouse = { x: this.p5js.mouseX, y: this.p5js.mouseY };
    const inBox = this.regions.filter(c => isBetweenExtremumIncluded(mouse, c.box));

    if (inBox.length === 0) {
      return null;
    }

    if (inBox.length === 1) {
      return inBox[0];
    }

    return findMinElement(inBox, c => squaredDistance(mouse, c.center));
  }
}

function movePathToCenter(path: Point[], extremum: Extremum): Point[] {
  const xRatio = (WIDTH - 2 * MARGIN) / (extremum.max.x - extremum.min.x);
  const yRatio = (HEIGHT - 2 * MARGIN) / (extremum.max.y - extremum.min.y);
  const ratio = Math.min(xRatio, yRatio);
  const xOffset = WIDTH / 2 - (ratio * (extremum.max.x + extremum.min.x)) / 2;
  const yOffset = HEIGHT / 2 - (ratio * (extremum.max.y + extremum.min.y)) / 2;
  const points: Point[] = path.map((p) => ({
    x: ratio * p.x + xOffset,
    y: ratio * p.y + yOffset,
  }));
  return points;
}

function getMiddlePoint(points: Point[]): Point {
  const sum: Point = points.reduce((s: Point, point: Point) => ({
    x: s.x + point.x,
    y: s.y + point.y,
  }), { x: 0, y: 0 });
  return { x: sum.x / points.length, y: sum.y / points.length };
}

function createRegion(
  id: string,
  color: Color,
  shape: Point[],
  isTerzo: boolean,
): Region {
  return {
    id,
    isTerzo,
    color,
    shape,
    box: findExtremum(shape),
    center: getMiddlePoint(shape),
    isHovered: false,
    isSelected: false,
  };
}
