import { TileSetBuilder, WaveFunctionCollapseProps } from "../wave-function-collapse-models";

export function getCastleTilesProps(): WaveFunctionCollapseProps {
  const tileSet = TileSetBuilder();
  // WATER, ROAD, GRASS, STONE, TOWER
  tileSet.addTile('castle/bridge', [ 'W', 'R', 'W', 'R' ], 2);
  tileSet.addTile('castle/ground', [ 'G', 'G', 'G', 'G' ], 1);
  tileSet.addTile('castle/river', [ 'W', 'G', 'W', 'G' ], 2);
  tileSet.addTile('castle/riverturn', [ 'W', 'W', 'G', 'G' ], 4);
  tileSet.addTile('castle/road', [ 'R', 'G', 'R', 'G' ], 2);
  tileSet.addTile('castle/roadturn', [ 'R', 'R', 'G', 'G' ], 4);
  tileSet.addTile('castle/t', [ 'G', 'R', 'R', 'R' ], 4);
  tileSet.addTile('castle/tower', [ 'T', 'T', 'T', 'T' ], 1);
  tileSet.addTile('castle/wall', [ 'S', 'G', 'S', 'G' ], 2);
  tileSet.addTile('castle/wallriver', [ 'S', 'W', 'S', 'W' ], 2);
  tileSet.addTile('castle/wallroad', [ 'S', 'R', 'S', 'R' ], 2);
  return {
    isHexaGrid: false,
    areCompatibleSockets: (s1, s2) => s1 === s2
      || (s1 === "T" && (s2 === "S" || s2 === "G")
      || (s2 === "T" && (s1 === "S" || s1 === "G"))
    ),
    tiles: tileSet.getTiles(),
  };
}