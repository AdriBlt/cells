const lower = 0.05;
const upper = 1 - lower;

export function getCellCoordinate(
  mouseX: number,
  mouseY: number,
  nbCols: number,
  nbRows: number,
  squareSide: number,
  leftMagin: number = 0,
  topMargin: number = 0,
  isHexaGrid: boolean = false
): { i: number; j: number } | null {
  const getCoordinate = isHexaGrid
    ? getCellCoordinateOnHexGrid
    : getCellCoordinateOnSquareGrid;
  return getCoordinate(
    mouseX,
    mouseY,
    nbCols,
    nbRows,
    squareSide,
    leftMagin,
    topMargin
  );
}

function getCellCoordinateOnSquareGrid(
  mouseX: number,
  mouseY: number,
  nbCols: number,
  nbRows: number,
  squareSide: number,
  leftMagin: number = 0,
  topMargin: number = 0
): { i: number; j: number } | null {
  const indexI = (mouseY - topMargin) / squareSide;
  const indexJ = (mouseX - leftMagin) / squareSide;
  const floorI = Math.floor(indexI);
  const floorJ = Math.floor(indexJ);
  const deltaI = indexI - floorI;
  const deltaJ = indexJ - floorJ;
  if (
    deltaI < lower ||
    deltaJ < lower ||
    deltaI > upper ||
    deltaJ > upper ||
    floorI < 0 ||
    floorJ < 0 ||
    floorI >= nbRows ||
    floorJ >= nbCols
  ) {
    return null;
  }

  return { i: floorI, j: floorJ };
}

function getCellCoordinateOnHexGrid(
  mouseX: number,
  mouseY: number,
  nbCols: number,
  nbRows: number,
  squareSide: number,
  leftMagin: number = 0,
  topMargin: number = 0
): { i: number; j: number } | null {
  const side = squareSide / Math.sqrt(3);
  const delta = squareSide / Math.sqrt(12);

  const indexJ = (mouseX - leftMagin) / (side + delta);
  const floorJ = Math.floor(indexJ);
  const deltaJ = indexJ - floorJ;
  if (
    // on the left side of the square
    deltaJ * (side + delta) < delta ||
    floorJ < 0 ||
    floorJ >= nbCols
  ) {
    return null;
  }

  let margin = topMargin;
  if (indexJ % 2 === 1) {
    margin += squareSide / 2;
  }

  const indexI = (mouseY - margin) / squareSide;
  const floorI = Math.floor(indexI);
  const deltaI = indexI - floorI;
  if (deltaI < lower || deltaI > upper || floorI < 0 || floorI >= nbRows) {
    return null;
  }

  return { i: floorI, j: floorJ };
}
