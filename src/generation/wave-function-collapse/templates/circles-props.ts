import { TileSetBuilder, WaveFunctionCollapseProps } from "../wave-function-collapse-models";

export function getCirclesTilesProps(): WaveFunctionCollapseProps {
  const tileSet = TileSetBuilder();
  // Black, White
  tileSet.addTile('circles/b_half', [ 'B', 'W', 'W', 'W' ], 4);
  tileSet.addTile('circles/b_i', [ 'B', 'W', 'B', 'W' ], 2);
  tileSet.addTile('circles/b_quarter', [ 'B', 'B', 'W', 'W' ], 4);
  tileSet.addTile('circles/b', [ 'B', 'B', 'B', 'B' ], 1);
  tileSet.addTile('circles/w_half', [ 'W', 'B', 'B', 'B' ], 4);
  tileSet.addTile('circles/w_i', [ 'W', 'B', 'W', 'B' ], 2);
  tileSet.addTile('circles/w_quarter', [ 'W', 'W', 'B', 'B' ], 4);
  tileSet.addTile('circles/w', [ 'W', 'W', 'W', 'W' ], 1);
  return {
    isHexaGrid: false,
    areCompatibleSockets: (s1, s2) => s1 === s2,
    tiles: tileSet.getTiles(),
  };
}