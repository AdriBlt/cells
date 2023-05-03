import * as p5 from "p5";

import { ProcessingSketch } from "../../services/processing.service";
import { Color, COLORS, setFillColor } from "../../utils/color";
import { RayCastingGameProps } from "./ray-casting-sketch";

export interface MiniMapInfo {
    nbRows: number;
    nbCols: number;
    mapCellSide?: number
}

const MAP_CELL_SIDE = 5;

export class MiniMapSketch implements ProcessingSketch {
    private p5js: p5;
    private mapColor: Color[][] = [];

    constructor(
        private properties: RayCastingGameProps,
        private miniMapInfo: MiniMapInfo,
    ) {}

    public setup(p: p5): void {
        this.p5js = p;
        this.p5js.createCanvas(
            this.mapCellSide * this.miniMapInfo.nbCols,
            this.mapCellSide * this.miniMapInfo.nbRows,
        );
    }

    public draw(): void {
        this.drawMap();
    }

    private drawMap(): void {
        if (this.mapColor.length === 0) {
            this.mapColor = this.getMap();

            for (let i = 0; i < this.mapColor.length; i++) {
                for (let j = 0; j < this.mapColor[i].length; j++) {
                    this.drawCellFromMap(i, j);
                }
            }
        } else if (this.properties.previousPosition) {
            const { i, j } = this.properties.previousPosition;
            this.mapColor[i][j] = this.getCellColor(i, j);
            this.drawCellFromMap(i, j);

            const playerI = Math.floor(this.properties.playerPosition.x);
            const playerJ = Math.floor(this.properties.playerPosition.y);
            this.mapColor[playerI][playerJ] = COLORS.Red;
            this.drawCellFromMap(playerI, playerJ);
        }
    }

    private drawCellFromMap(i: number, j: number): void {
        this.p5js.noStroke();
        setFillColor(this.p5js, this.mapColor[i][j]);
        this.p5js.rect(
            j * this.mapCellSide,
            i * this.mapCellSide,
            this.mapCellSide,
            this.mapCellSide
        );
    }

    private getMap(): Color[][] {
        const map: Color[][] = [];
        for (let i = 0; i < this.miniMapInfo.nbRows; i++) {
            const line: Color[] = [];
            for (let j = 0; j < this.miniMapInfo.nbCols; j++) {
                line.push(this.getCellColor(i, j));
            }
            map.push(line);
        }

        const playerI = Math.floor(this.properties.playerPosition.x);
        const playerJ = Math.floor(this.properties.playerPosition.y);
        map[playerI][playerJ] = COLORS.Red;

        return map;
    }

    private getCellColor(i: number, j: number): Color {
        const cellProps = this.properties.getCellProperties(i, j);
        return cellProps && cellProps.color || this.properties.floorColor;
    }

    private get mapCellSide(): number {
        return this.miniMapInfo.mapCellSide || MAP_CELL_SIDE;
    }
}