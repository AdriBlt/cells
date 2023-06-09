import { getNeighbourCells } from "./grid-helper";

describe("GameOfLifeMatrix.getNeighbourCells", () => {
  it("compute non Hex neighbours", () => {
    const cells = getNeighbourCells(1, 1, false);
    expect(cells.length).toBe(8);
    expect(cells[0]).toBe({ x: 0, y: 0 });
  });
});
