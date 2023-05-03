import { flipTile, rotateTile, Tile, TileSetBuilder } from "./wave-function-collapse-models";

describe('wave-function-collapse-models', () => {
    const tile: Tile = {
        image: { id: 'id' },
        sockets: [ 'A', 'B', 'C', 'D' ],
    };

    test('rotateTile', () => {
        const rotated = rotateTile(tile);
        expect(rotated.sockets).toHaveLength(4);
        expect(rotated.sockets[0]).toBe("D");
        expect(rotated.sockets[1]).toBe("A");
        expect(rotated.sockets[2]).toBe("B");
        expect(rotated.sockets[3]).toBe("C");
    });

    test('flipTile', () => {
        const rotated = flipTile(tile);
        expect(rotated.sockets).toHaveLength(4);
        expect(rotated.sockets[0]).toBe("A");
        expect(rotated.sockets[1]).toBe("D");
        expect(rotated.sockets[2]).toBe("C");
        expect(rotated.sockets[3]).toBe("B");
    });

    test("TileSetBuilder", () => { // TODO test with reverse strings
        const tileSet = TileSetBuilder();
        tileSet.addTile('id', tile.sockets, 4, undefined, true);
        const tiles = tileSet.getTiles();
        expect(tiles).toHaveLength(8);
        expect(tiles[0].sockets.join("-")).toBe('A-B-C-D');
        expect(tiles[1].sockets.join("-")).toBe('A-D-C-B'); // Flipped
        expect(tiles[2].sockets.join("-")).toBe('D-A-B-C'); // Rotated
        expect(tiles[3].sockets.join("-")).toBe('D-C-B-A'); // Rotated+Flipped
        expect(tiles[4].sockets.join("-")).toBe('C-D-A-B'); // Rotated*2
        expect(tiles[5].sockets.join("-")).toBe('C-B-A-D'); // Rotated*2+Flipped
        expect(tiles[6].sockets.join("-")).toBe('B-C-D-A'); // Rotated*3
        expect(tiles[7].sockets.join("-")).toBe('B-A-D-C'); // Rotated*3+Flipped
    })
});
