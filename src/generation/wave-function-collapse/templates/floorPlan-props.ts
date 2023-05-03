import { reverseString } from "../../../utils/string";
import { TileSetBuilder, WaveFunctionCollapseProps } from "../wave-function-collapse-models";

export function getFloorPlanTilesProps(): WaveFunctionCollapseProps {
  const tileSet = TileSetBuilder();
  // WHITE, BLACK, SABLE, GRAY
  tileSet.addTile('floorPlan/div', [ 'S', 'SBS', 'S', 'SBS' ], 2);
  tileSet.addTile('floorPlan/divt', [ 'S', 'SBS', 'SBS', 'SBS' ], 4);
  tileSet.addTile('floorPlan/divturn', [ 'SBS', 'SBS', 'S', 'S' ], 4);
  tileSet.addTile('floorPlan/door', [ 'S', 'SBS', 'S', 'SBS' ], 4, 0.5);
  tileSet.addTile('floorPlan/empty', [ 'W', 'W', 'W', 'W' ], 1, 0.1);
  tileSet.addTile('floorPlan/floor', [ 'S', 'S', 'S', 'S' ], 1);
  tileSet.addTile('floorPlan/glass', [ 'S', 'SGBGW', 'W', 'WGBGS' ], 4);
  tileSet.addTile('floorPlan/halfglass', [ 'S', 'SGBGW', 'W', 'WBBBS'], 4, undefined, /* addFlip */ true);
  tileSet.addTile('floorPlan/in', [ 'S', 'S', 'SBBBW', 'WBBBS' ], 4);
  tileSet.addTile('floorPlan/out', [ 'WBBBS', 'SBBBW', 'W', 'W' ], 4);
  tileSet.addTile('floorPlan/stairs', [ 'S', 'SBS', 'KKKKK', 'SBS' ], 4);
  tileSet.addTile('floorPlan/table', [ 'S', 'S', 'S', 'S' ], 1, 0.8);
  tileSet.addTile('floorPlan/vent', [ 'S', 'S', 'S', 'S' ], 1, 0.5);
  tileSet.addTile('floorPlan/w', [ 'S', 'SBBBW', 'W', 'WBBBS' ], 4);
  tileSet.addTile('floorPlan/wall', [ 'S', 'SBBBW', 'W', 'WBBBS' ], 4);
  tileSet.addTile('floorPlan/walldiv', [ 'SBS', 'SBBBW', 'W', 'WBBBS' ], 4);
  tileSet.addTile('floorPlan/window', [ 'S', 'SBBBW', 'W', 'WBBBS' ], 4);
  return {
    isHexaGrid: false,
    areCompatibleSockets: (s1, s2) => s1 === reverseString(s2),
    tiles: tileSet.getTiles(),
  };
}