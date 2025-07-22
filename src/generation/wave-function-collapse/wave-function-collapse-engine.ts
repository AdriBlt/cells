
import { getDirectNeighboursInOrder } from "../../utils/grid-helper";
import { createDefaultFlatMatrix, createDefaultList, findMin, peekRandomElement, peekRandomElementWithWeight } from "../../utils/list-helpers";
import { isInGrid } from "../../utils/numbers";
import { Tile, WaveFunctionCollapseProps } from "./wave-function-collapse-models";

export interface WaveFunctionCollapseInterface {
  drawCell: (i: number, j: number, tile: Tile | null) => void
}

export enum GenerationState {
    NotStarted,
    Generating,
    Done,
    Error,
}

interface Cell {
  i: number;
  j: number;
  isCollapsed: boolean;
  possibleTiles: number[];
}

export class WaveFunctionCollapseEngine {
  public generationState = GenerationState.NotStarted;
  private props: WaveFunctionCollapseProps;
  private cells: Cell[];

  constructor(
    private sketch: WaveFunctionCollapseInterface,
    private nbRows: number,
    private nbCols: number
  ) {}

  public resetGrid = (
    props: WaveFunctionCollapseProps,
    nbRows: number,
    nbCols: number
  ): void => {
    this.props = props;
    this.nbRows = nbRows;
    this.nbCols = nbCols;
    this.generationState = GenerationState.NotStarted;
    const nbTiles = this.props.tiles.length;
    this.cells = createDefaultFlatMatrix<Cell>(this.nbRows, this.nbCols, (i, j) => ({
        i,
        j,
        isCollapsed: false,
        possibleTiles: createDefaultList(nbTiles, k => k),
      }));
    this.redrawGrid();
  }

  public collapseOneTile(disableDraw: boolean = false) {
    if (this.generationState === GenerationState.NotStarted) {
      this.generationState = GenerationState.Generating;
    }

    const cellToCollapse = this.findCellToCollapse();
    if (!cellToCollapse) {
      this.generationState = GenerationState.Done;
      return;
    }

    if (cellToCollapse.possibleTiles.length === 0) {
      this.generationState = GenerationState.Error;
      return;
    }

    // TODO impl backtrack
    const collapsedTile = this.props.supportsWeights
      ? peekRandomElementWithWeight(
        cellToCollapse.possibleTiles,
        cellToCollapse.possibleTiles.map(i => this.props.tiles[i].weight || 1)
      )
      : peekRandomElement(cellToCollapse.possibleTiles);
    cellToCollapse.possibleTiles = [collapsedTile];
    cellToCollapse.isCollapsed = true;
    if (!disableDraw) {
      this.drawCell(cellToCollapse);
    }

    const cellsToUpdate = this.getNeighboursToUpdate(cellToCollapse.i, cellToCollapse.j);
    for (let k = 0; k < cellsToUpdate.length; k++) {
      const cell = cellsToUpdate[k];
      if (cell.isCollapsed) {
        continue;
      }

      const oldThumbprint = cell.possibleTiles.sort().join("");
      cell.possibleTiles = this.computePossibleTiles(cell.i, cell.j);
      if (oldThumbprint !== cell.possibleTiles.sort().join("")) {
        if (!disableDraw) {
          this.drawCell(cell);
        }
        cellsToUpdate.push(...this.getNeighboursToUpdate(cell.i, cell.j));
      }
    }
  }

  public redrawGrid(): void {
      this.cells.forEach(cell => this.drawCell(cell));
  }

  public getCell(i: number, j: number): Cell | null {
    if (!isInGrid(i, j, this.nbRows, this.nbCols)) {
      return null;
    }

    return this.cells[i * this.nbCols + j]
  }

  private drawCell(cell: Cell): void {
    const tile = cell.isCollapsed
      ? this.props.tiles[cell.possibleTiles[0]]
      : null;
    this.sketch.drawCell(cell.i, cell.j, tile);
  }

  private computePossibleTiles(i: number, j: number): number[] {
    const nbNeighbours = this.props.isHexaGrid ? 6 : 4;
    const constraints: Array<string[]|null> = getDirectNeighboursInOrder(i, j, this.props.isHexaGrid)
      .map((point, index) => {
        const neighbour = this.getCell(point.i, point.j);
        if (!neighbour) {
          return null;
        }

        const neighbourDirectionIndex = (index + nbNeighbours / 2) % nbNeighbours;
        const validNeighbourSockets = neighbour.possibleTiles.map(tileIndex => this.props.tiles[tileIndex].sockets[neighbourDirectionIndex]);
        return Array.from(new Set(validNeighbourSockets));
      });

    const possibleTiles: number[] = [];
    this.props.tiles.forEach((tile, index) => {
      let isValidTile = true;
      for (let d = 0; d < nbNeighbours; d++) { // directions
        const validSockets = constraints[d];
        if (validSockets === null) {
          continue;
        }

        isValidTile = validSockets.some(s => this.props.areCompatibleSockets(tile.sockets[d], s));
        if (!isValidTile) {
          break;
        }
      }

      if (isValidTile) {
        possibleTiles.push(index);
      }
    });

    return possibleTiles;
  }

  private getNeighboursToUpdate(i: number, j: number): Cell[] {
    return getDirectNeighboursInOrder(i, j, this.props.isHexaGrid)
      .filter(p => isInGrid(p.i, p.j, this.nbRows, this.nbCols))
      .map(p => this.getCell(p.i, p.j))
      .filter(c => c !== null && !c.isCollapsed)
      .map(c => c as Cell);
  }

  private findCellToCollapse(): Cell | undefined {
    const notCollapsedCells = this.cells.filter(c => !c.isCollapsed);
    const minEntropie = findMin(
      notCollapsedCells.map(c => c.possibleTiles.length)
    );
    const cellsWithMinEntropie = notCollapsedCells
      .filter(c => c.possibleTiles.length === minEntropie)
    return cellsWithMinEntropie.length === 0
      ? undefined
      : peekRandomElement(cellsWithMinEntropie);
  }
}
