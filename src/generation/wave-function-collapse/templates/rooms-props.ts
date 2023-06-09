import { reverseString } from "../../../utils/string";
import { TileSetBuilder, WaveFunctionCollapseProps } from "../wave-function-collapse-models";

export function getRoomsTilesProps(): WaveFunctionCollapseProps {
  const tileSet = TileSetBuilder();
  // WHITE, BLACK
  tileSet.addTile('rooms/bend', [ 'WBB', 'BBW', 'W', 'W' ], 4, 0.5);
  tileSet.addTile('rooms/corner', [ 'BBW', 'WBB', 'B', 'B' ], 4, 0.5);
  tileSet.addTile('rooms/corridor', [ 'BWB', 'B', 'BWB', 'B' ], 2, 1);
  tileSet.addTile('rooms/door', [ 'W', 'WBB', 'BWB', 'BBW' ], 4, 0.5);
  tileSet.addTile('rooms/empty', [ 'W', 'W', 'W', 'W' ], 1, 1);
  tileSet.addTile('rooms/side', [ 'B', 'BBW', 'W', 'WBB' ], 4, 2);
  tileSet.addTile('rooms/t', [ 'B', 'BWB', 'BWB', 'BWB' ], 4, 0.5);
  tileSet.addTile('rooms/turn', [ 'BWB', 'BWB', 'B', 'B' ], 4, 0.25);
  tileSet.addTile('rooms/wall', [ 'B', 'B', 'B', 'B' ], 1, 1);
  return {
    isHexaGrid: false,
    areCompatibleSockets: (s1, s2) => s1 === reverseString(s2),
    tiles: tileSet.getTiles(),
  };
}