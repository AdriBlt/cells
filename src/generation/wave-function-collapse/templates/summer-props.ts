import { reverseString } from "../../../utils/string";
import { TileSetBuilder, WaveFunctionCollapseProps } from "../wave-function-collapse-models";

export function getSummerTilesProps(): WaveFunctionCollapseProps {
  const tileSet = TileSetBuilder();
  // GRASS, SAND, ROCK, WATER
  tileSet.addTile('summer/cliff 0', [ 'G', 'GRG', 'G', 'GRG' ], 1);
  tileSet.addTile('summer/cliff 1', [ 'GRG', 'G', 'GRG', 'G' ], 1);
  tileSet.addTile('summer/cliff 2', [ 'G', 'GRGG', 'G', 'GGRG' ], 1);
  tileSet.addTile('summer/cliff 3', [ 'GRG', 'G', 'GRG', 'G' ], 1);
  tileSet.addTile('summer/cliffcorner 0', [ 'GRG', 'GRGG', 'G', 'G' ], 1);
  tileSet.addTile('summer/cliffcorner 1', [ 'GRG', 'G', 'G', 'GGRG' ], 1);
  tileSet.addTile('summer/cliffcorner 2', [ 'G', 'G', 'GRG', 'GRG' ], 1);
  tileSet.addTile('summer/cliffcorner 3', [ 'G', 'GRG', 'GRG', 'G' ], 1);
  tileSet.addTile('summer/cliffturn 0', [ 'GRG', 'GRG', 'G', 'G' ], 1);
  tileSet.addTile('summer/cliffturn 1', [ 'GRG', 'G', 'G', 'GRG' ], 1);
  tileSet.addTile('summer/cliffturn 2', [ 'G', 'G', 'GRG', 'GGRG' ], 1);
  tileSet.addTile('summer/cliffturn 3', [ 'G', 'GRGG', 'GRG', 'G' ], 1);
  tileSet.addTile('summer/grass 0', [ 'G', 'G', 'G', 'G' ], 1);
  tileSet.addTile('summer/grasscorner 0', [ 'SSG', 'GSS', 'S', 'S' ], 1, 0.0001);
  tileSet.addTile('summer/grasscorner 1', [ 'GSS', 'S', 'S', 'SSG' ], 1, 0.0001);
  tileSet.addTile('summer/grasscorner 2', [ 'S', 'S', 'SSG', 'GSS' ], 1, 0.0001);
  tileSet.addTile('summer/grasscorner 3', [ 'S', 'SSG', 'GSS', 'S' ], 1, 0.0001);
  tileSet.addTile('summer/road 0', [ 'S', 'SSG', 'G', 'GSS' ], 1, 0.1);
  tileSet.addTile('summer/road 1', [ 'SSG', 'G', 'GSS', 'S' ], 1, 0.1);
  tileSet.addTile('summer/road 2', [ 'G', 'GSS', 'S', 'SSG' ], 1, 0.1);
  tileSet.addTile('summer/road 3', [ 'GSS', 'S', 'SSG', 'G' ], 1, 0.1);
  tileSet.addTile('summer/roadturn 0', [ 'GSS', 'SSG', 'G', 'G' ], 1, 0.1);
  tileSet.addTile('summer/roadturn 1', [ 'SSG', 'G', 'G', 'GSS' ], 1, 0.1);
  tileSet.addTile('summer/roadturn 2', [ 'G', 'G', 'GSS', 'SSG' ], 1, 0.1);
  tileSet.addTile('summer/roadturn 3', [ 'G', 'GSS', 'SSG', 'G' ], 1, 0.1);
  tileSet.addTile('summer/water_a 0', [ 'W', 'W', 'W', 'W' ], 1);
  tileSet.addTile('summer/water_b 0', [ 'W', 'W', 'W', 'W' ], 1);
  tileSet.addTile('summer/water_c 0', [ 'W', 'W', 'W', 'W' ], 1);
  tileSet.addTile('summer/watercorner 0', [ 'SRW', 'WRGG', 'G', 'G' ], 1);
  tileSet.addTile('summer/watercorner 1', [ 'WRG', 'G', 'G', 'GGRW' ], 1);
  tileSet.addTile('summer/watercorner 2', [ 'G', 'G', 'GRW', 'WRG' ], 1);
  tileSet.addTile('summer/watercorner 3', [ 'G', 'GRW', 'WRG', 'G' ], 1);
  tileSet.addTile('summer/waterside 0', [ 'W', 'WRGG', 'G', 'GGRW' ], 1);
  tileSet.addTile('summer/waterside 1', [ 'WRG', 'G', 'GRW', 'W' ], 1);
  tileSet.addTile('summer/waterside 2', [ 'G', 'GRW', 'W', 'WRG' ], 1);
  tileSet.addTile('summer/waterside 3', [ 'GRW', 'W', 'WRG', 'G' ], 1);
  tileSet.addTile('summer/waterturn 0', [ 'W', 'W', 'WRG', 'GGRW' ], 1);
  tileSet.addTile('summer/waterturn 1', [ 'W', 'WRGG', 'GRW', 'W' ], 1);
  tileSet.addTile('summer/waterturn 2', [ 'WRG', 'GRW', 'W', 'W' ], 1);
  tileSet.addTile('summer/waterturn 3', [ 'GRW', 'W', 'W', 'WRG' ], 1);
  return {
    isHexaGrid: false,
    areCompatibleSockets: (s1, s2) => s1 === reverseString(s2),
    tiles: tileSet.getTiles(),
  };
}