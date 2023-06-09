import { TileSetBuilder, WaveFunctionCollapseProps } from "../wave-function-collapse-models";

export function getKnotsTilesProps(): WaveFunctionCollapseProps {
  const tileSet = TileSetBuilder();
  tileSet.addTile('knots/corner', [ '2', '2', '0', '0' ], 4);
  tileSet.addTile('knots/cross', [ '2', '2', '2', '2'] , 2);
  tileSet.addTile('knots/empty', [ '0', '0', '0', '0'] , 1);
  tileSet.addTile('knots/line', [ '0', '2', '0', '2'] , 2);
  tileSet.addTile('knots/t', [ '0', '2', '2', '2'] , 4);
  return {
    isHexaGrid: false,
    areCompatibleSockets: (s1, s2) => s1 === s2,
    tiles: tileSet.getTiles(),
  };
}