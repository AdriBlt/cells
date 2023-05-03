import * as p5 from "p5";

import { Asset, getAssetPath } from "../../assets";
import { Color } from "../../utils/color";
import { reverseString } from "../../utils/string";
import { formatString } from "../../utils/string-formating-utilities";

export interface Tile {
    color?: Color;
    image?: { id: string; rotate?: number; isFlipped?: boolean; };
    // color scheme in each direction (UP then clockwise)
    sockets: string[];
    weight?: number;
}

export interface WaveFunctionCollapseProps {
    isHexaGrid: boolean;
    tiles: Tile[];
    areCompatibleSockets: (socket1: string, socket2: string) => boolean;
    supportsWeights?: boolean;
}

const tilesMap = [
    { category: 'castle', tiles: ['bridge', 'ground', 'river', 'riverturn', 'road', 'roadturn', 't', 'tower', 'wall', 'wallriver', 'wallroad'] },
    { category: 'circles', tiles: ['b_half', 'b_i', 'b_quarter', 'b', 'w_half', 'w_i', 'w_quarter', 'w'] },
    { category: 'circuit', tiles: ['bridge', 'component', 'connection', 'corner', 'dskew', 'skew', 'substrate', 't', 'track', 'transition', 'turn', 'viad', 'vias', 'wire'] },
    { category: 'floorPlan', tiles: ['div', 'divt', 'divturn', 'door', 'empty', 'floor', 'glass', 'halfglass', 'in', 'out', 'stairs', 'table', 'vent', 'w', 'wall', 'walldiv', 'window'] },
    { category: 'knots', tiles: ['corner', 'cross', 'empty', 'line', 't'] },
    { category: 'rooms', tiles: ['bend', 'corner', 'corridor', 'door', 'empty', 'side', 't', 'turn', 'wall'] },
    { category: 'summer', tiles: ['cliff 0', 'cliff 1', 'cliff 2', 'cliff 3', 'cliffcorner 0', 'cliffcorner 1', 'cliffcorner 2', 'cliffcorner 3', 'cliffturn 0', 'cliffturn 1', 'cliffturn 2', 'cliffturn 3', 'grass 0', 'grasscorner 0', 'grasscorner 1', 'grasscorner 2', 'grasscorner 3', 'road 0', 'road 1', 'road 2', 'road 3', 'roadturn 0', 'roadturn 1', 'roadturn 2', 'roadturn 3', 'water_a 0', 'water_b 0', 'water_c 0', 'watercorner 0', 'watercorner 1', 'watercorner 2', 'watercorner 3', 'waterside 0', 'waterside 1', 'waterside 2', 'waterside 3', 'waterturn 0', 'waterturn 1', 'waterturn 2', 'waterturn 3'] },
];
export function loadTiles(p5js: p5): { [key: string]: p5.Image } {
    const images: { [key: string]: p5.Image } = {};
    const pathFormat = getAssetPath(Asset.WaveFunctionCollapseFormat);
    tilesMap.forEach(template => {
        template.tiles.forEach(tile => {
            images[`${template.category}/${tile}`] = p5js.loadImage(formatString(pathFormat, template.category, tile));
        });
    });
    return images;
}

export function rotateTile(tile: Tile): Tile {
    const sockets: string[] = [tile.sockets[tile.sockets.length - 1]];
    for (let i = 0; i < tile.sockets.length - 1; i++) {
        sockets.push(tile.sockets[i]);
    }

    if (!tile.image) {
        return { color: tile.color, sockets };
    }

    return {
        ...tile,
        image: {
            ...tile.image,
            rotate: 1 + (tile.image.rotate || 0),
        },
        sockets,
    };
}

export function flipTile(tile: Tile): Tile {
    const sockets: string[] = [reverseString(tile.sockets[0])];
    for (let i = tile.sockets.length - 1; i > 0; i--) {
        sockets.push(reverseString(tile.sockets[i]));
    }

    if (!tile.image) {
        return { color: tile.color, sockets };
    }

    return {
        ...tile,
        image: {
            ...tile.image,
            isFlipped: !tile.image.isFlipped,
        },
        sockets,
    };
}

export function rotateImage(p5js: p5, image: p5.Image, rotateQuarter: number = 0): p5.Graphics {
    const graphics = p5js.createGraphics(image.width, image.height);
    graphics.imageMode(p5js.CENTER);
    graphics.translate(image.width / 2, image.height / 2);
    graphics.rotate((rotateQuarter) * p5js.HALF_PI);
    graphics.image(image, 0, 0);
    return graphics;
}

export function TileSetBuilder() {
    const list: Tile[] = [];
    const addTile = (
        id: string,
        sockets: string[],
        nbRotation: number,
        weight: number = 1,
        addFlipVariants: boolean = false,
    ) => {
        let tile: Tile = { image: { id }, sockets, weight};
        list.push(tile);

        if (addFlipVariants) {
            list.push(flipTile(tile));
        }

        for (let i = 1; i < nbRotation; i++) {
            tile = rotateTile(tile);
            list.push(tile);

            if (addFlipVariants) {
                list.push(flipTile(tile));
            }
        }
    }

    return {
        addTile,
        // TODO: Reverse string for corners?
        // addTileX: (id: string, s: string, w: number = 1) => addTile(id, [s, s, s, s], 1, w),
        // addTileI: (id: string, s1: string, s2: string, w: number = 1) => addTile(id, [s1, s2, s1, s2], 2, w),
        // addTileL: (id: string, s1: string, s2: string, w: number = 1) => addTile(id, [s1, s1, s2, s2], 4, w),
        // addTileT: (id: string, s1: string, s2: string, w: number = 1) => addTile(id, [s1, s2, s2, s2], 4, w),
        getTiles: () => list
    };

}