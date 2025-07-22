import * as p5 from "p5";

import { PlayableSketch } from "../../services/playable-sketch";
import { COLORS, setBackground, setFillColor, setStrokeColor } from "../../utils/color";
import { drawHexagon, drawSquare, drawTextOnHexagon, drawTextOnSquare } from "../../utils/shape-drawer-helpers";
import { getBasicTilesProps } from "./templates/basic-props";
import { getCarcasonneTilesProps } from "./templates/carcasonne-props";
import { getCastleTilesProps } from "./templates/castle-props";
import { getCirclesTilesProps } from "./templates/circles-props";
import { getCircuitTilesProps } from "./templates/circuit-props";
import { getFloorPlanTilesProps } from "./templates/floorPlan-props";
import { getKnotsTilesProps } from "./templates/knots-props";
import { getRoomsTilesProps } from "./templates/rooms-props";
import { getSummerTilesProps } from "./templates/summer-props";
import { GenerationState, WaveFunctionCollapseEngine, WaveFunctionCollapseInterface } from "./wave-function-collapse-engine";
import { loadTiles, rotateImage, Tile, WaveFunctionCollapseProps } from "./wave-function-collapse-models";

export enum TileTemplate {
  PlainSquareTiles = 'Simple squares',
  PlainHexagonTiles = 'Simple hexagons',
  KnotsTiles = 'Knots',
  CastleTiles = 'Castle',
  CirclesTiles = 'Circles',
  CircuitTiles = 'Circuit',
  FloorPlanTiles = 'Floor plan',
  RoomsTiles = 'Rooms',
  SummerTiles = 'Summer',
  Carcasonne = 'Carcasonne',
}

export const DEFAULT_TILE_TEMPLATE = TileTemplate.Carcasonne;

const W = 900;
const H = 500;
const MARGIN = 10;
const MARGIN_LEFT = MARGIN;
const MARGIN_TOP = MARGIN;
const STROKE_WEIGHT = 1;
const STROKE_COLOR = COLORS.Black;
const BACKGROUND_COLOR = COLORS.White;

const DEFAULT_CELL_SIZE = 15;
// const CELL_SIZE = 15;
// const NB_COLS = Math.floor((W - 2 * MARGIN) / CELL_SIZE);
// const NB_ROWS = Math.floor((H - 2 * MARGIN) / CELL_SIZE);

export class WaveFunctionCollapseSketch
  extends PlayableSketch
  implements WaveFunctionCollapseInterface
{
  public  debug: boolean = false;

  private engine: WaveFunctionCollapseEngine;
  private props: WaveFunctionCollapseProps;
  private images: { [key: string]: p5.Image };

  public setIsDebug(debug: boolean): void {
    this.debug = debug;
    // this.engine.redrawGrid();
  }

  constructor() {
    super();
    this.engine = new WaveFunctionCollapseEngine(this, this.nbRows, this.nbCols);
  }

  private get cellSize() {
    return !!this.props && this.props.customCellSize ? this.props.customCellSize : DEFAULT_CELL_SIZE ;
  }

  private get nbCols() {
    return Math.floor((W - 2 * MARGIN) / this.cellSize);
  }

  private get nbRows() {
    return Math.floor((H - 2 * MARGIN) / this.cellSize);
  }

  public setTemplate(template: TileTemplate): void {
    this.props = this.getWaveFunctionCollapseProps(template);
    this.resetGrid();
    this.play();
  }

  public preload(p: p5): void {
    this.p5js = p;
    this.images = loadTiles(this.p5js);
  }

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(W, H + 4 * this.cellSize);

    this.setTemplate(DEFAULT_TILE_TEMPLATE);
  }

  public resetGrid = (): void => {
    setBackground(this.p5js, BACKGROUND_COLOR);
    setStrokeColor(this.p5js, STROKE_COLOR);

    if (!this.props.isHexaGrid) {
      this.p5js.strokeWeight(STROKE_WEIGHT + 1);
      this.p5js.noFill();
      this.p5js.rect(MARGIN_LEFT - 1, MARGIN_TOP - 1, this.cellSize * this.nbCols + 2, this.cellSize * this.nbRows + 2);
    }

    this.p5js.strokeWeight(STROKE_WEIGHT);
    this.engine.resetGrid(this.props, this.nbRows, this.nbCols);
    this.p5js.strokeWeight(0);

    this.drawTilesLegend();
  }

  public draw(): void {
    this.engine.collapseOneTile();
    if (this.engine.generationState === GenerationState.Done) {
      this.stop();
    } else if (this.engine.generationState === GenerationState.Error) {
      this.handleError();
    }
  }

  public generate = (): void => {
      this.stop();
      while (this.engine.generationState !== GenerationState.Done && this.isPaused) {
          this.engine.collapseOneTile(/* disableDraw */ true);
          if (this.engine.generationState === GenerationState.Error) {
            this.handleError();
          }
      }

      this.engine.redrawGrid();
  }

  public drawCell = (i: number, j: number, tile: Tile | null): void => {
    if (tile && tile.image) {
      const image = this.images[tile.image.id];
      const graphics = rotateImage(this.p5js, image, tile.image.rotate || 0);

      if (tile.image.isFlipped) {
        this.p5js.push()
        this.p5js.translate(
          MARGIN_LEFT + j * this.cellSize,
          MARGIN_TOP + i * this.cellSize,
        );
        this.p5js.scale(-1, 1);
        this.p5js.image(
          graphics,
          0,
          0,
          -this.cellSize,
          this.cellSize,
        );
        this.p5js.pop();
      }
      else {
        this.p5js.image(
          graphics,
          MARGIN_LEFT + j * this.cellSize,
          MARGIN_TOP + i * this.cellSize,
          this.cellSize,
          this.cellSize
          );
        }
    } else if (tile && tile.color) {
      setFillColor(this.p5js, tile.color);
      setStrokeColor(this.p5js, STROKE_COLOR);
      this.p5js.strokeWeight(STROKE_WEIGHT);

      if (this.props.isHexaGrid) {
        drawHexagon(this.p5js, j, i, this.cellSize, MARGIN_LEFT, MARGIN_TOP);
      } else {
        drawSquare(this.p5js, j, i, this.cellSize, MARGIN_LEFT, MARGIN_TOP);
      }
    } else if (this.debug) {
      setFillColor(this.p5js, BACKGROUND_COLOR);

      if (this.props.isHexaGrid) {
        drawHexagon(this.p5js, j, i, this.cellSize, MARGIN_LEFT, MARGIN_TOP);
      } else {
        drawSquare(this.p5js, j, i, this.cellSize, MARGIN_LEFT, MARGIN_TOP);
      }

      setFillColor(this.p5js, COLORS.Black);
      setStrokeColor(this.p5js, COLORS.Black);

      const cell = this.engine.getCell(i, j);
      if (!cell) {
        return;
      }

      if (this.props.isHexaGrid) {
        drawTextOnHexagon(this.p5js, j, i, cell.possibleTiles.length + '', this.cellSize, MARGIN_LEFT, MARGIN_TOP);
      } else {
        drawTextOnSquare(this.p5js, j, i, cell.possibleTiles.length + '', this.cellSize, MARGIN_LEFT, MARGIN_TOP);
      }
    }
  }
  private drawTilesLegend() {
    const coef = 1.1;
    const nbOnLine = Math.floor(this.nbCols / coef);
    for (let t = 0; t < Math.min(nbOnLine, this.props.tiles.length); t++) {
      this.drawCell(this.nbRows + 1, coef * t, this.props.tiles[t]);
    }
    for (let t = 0; t < this.props.tiles.length - nbOnLine; t++) {
      this.drawCell(this.nbRows + 2.1, coef * t, this.props.tiles[nbOnLine + t]);
    }
  }

  private handleError = () => {
    if (this.debug) {
      this.stop();
    } else {
      this.resetGrid();
    }
  }

  private getWaveFunctionCollapseProps(template: TileTemplate): WaveFunctionCollapseProps {
    switch (template) {
      case TileTemplate.PlainHexagonTiles:
        return getBasicTilesProps(this.p5js, true);
      case TileTemplate.PlainSquareTiles:
        return getBasicTilesProps(this.p5js, false);
      case TileTemplate.KnotsTiles:
        return getKnotsTilesProps();
      case TileTemplate.CastleTiles:
        return getCastleTilesProps();
      case TileTemplate.CirclesTiles:
        return getCirclesTilesProps();
      case TileTemplate.CircuitTiles:
        return getCircuitTilesProps();
      case TileTemplate.FloorPlanTiles:
        return getFloorPlanTilesProps();
      case TileTemplate.RoomsTiles:
        return getRoomsTilesProps();
      case TileTemplate.SummerTiles:
        return getSummerTilesProps();
      case TileTemplate.Carcasonne:
        return getCarcasonneTilesProps();
      default:
        const never: never = template;
        throw new Error(`Unknown tempalte: ${never}`)
    }
  }
}
