import * as p5 from "p5";

import { Color, COLORS } from "../../../utils/color";
import { createDefaultList } from "../../../utils/list-helpers";
import { WaveFunctionCollapseProps } from "../wave-function-collapse-models";

export function getBasicTilesProps(
    p5js: p5,
    isHexaGrid: boolean,
  ): WaveFunctionCollapseProps {
    const nbNeighbours = isHexaGrid ? 6 : 4;
    const COMPATIBLE_LIST = ["W", "S", "G", "T"];
    const areCompatibleSockets = (s1: string, s2: string) => {
      return Math.abs(COMPATIBLE_LIST.indexOf(s1) - COMPATIBLE_LIST.indexOf(s2)) < 2;
    }
    const createTile = (color: Color, socket: string) => ({
      color, sockets: createDefaultList(nbNeighbours, () => socket),
    });
    return {
      isHexaGrid,
      tiles: [
        createTile(COLORS.Blue, "W"), // Water
        createTile(COLORS.Yellow, "S"), // SAND
        createTile(COLORS.LightGreen, "G"), // GRASS
        createTile(COLORS.DarkGreen, "T"), // TREE
      ],
      areCompatibleSockets,
    };
}
