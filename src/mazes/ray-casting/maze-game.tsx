import * as React from "react";

import { COLORS } from "../../utils/color";
import { isOutOfBounds } from "../../utils/numbers";
import { Vector } from "../../utils/vector";
import { CellProperties } from "./ray-casting-sketch";
import { RayCastingWalkerGame, RayCastingWalkerGameProps } from "./ray-casting-walker";

export interface MazeGameData {
    matrix: boolean[][];
    playerInitialPosition: Vector;
    playerInitialDirection: Vector;
    mapCellSide?: number;
}

export interface MazeGameProps {
    fetchMazeData: () => Promise<MazeGameData>;
}

interface MazeGameState {
    rayCastingWalkerProps: RayCastingWalkerGameProps | null;
}

export class MazeGame extends React.Component<MazeGameProps, MazeGameState> {
    public state: MazeGameState = { rayCastingWalkerProps: null };
    private matrix: boolean[][] | null = null;

    public componentDidMount() {
        this.props.fetchMazeData()
            .then((data: MazeGameData) => this.readData(data));
    }

    public render() {
        return this.state.rayCastingWalkerProps && (
            <RayCastingWalkerGame {...this.state.rayCastingWalkerProps} />
        );
    }

    private readData = (data: MazeGameData): void => {
        this.matrix = data.matrix;

        this.setState({
            rayCastingWalkerProps: {
                rayCastingProps: {
                    playerPosition: data.playerInitialPosition,
                    playerDirection: data.playerInitialDirection,
                    getCellProperties: (i: number, j: number) => this.getCellProperties(i, j),
                    ceilingColor: COLORS.Cyan,
                    floorColor: COLORS.Maroon,
                },
                miniMapInfo: {
                    nbRows: this.matrix.length,
                    nbCols: this.matrix[0].length,
                    mapCellSide: data.mapCellSide,
                },
            }
        });
    };

    private getCellProperties = (i: number, j: number): CellProperties => {
        if (!this.matrix
            || isOutOfBounds(i, 0, this.matrix.length)
            || isOutOfBounds(j, 0, this.matrix[0].length)) {
            return { isOutOfBound: true };
        }

        return { color: this.matrix[i][j] ? COLORS.DarkOliveGreen : undefined };
    }
}
