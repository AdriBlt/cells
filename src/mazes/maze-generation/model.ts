export interface Cell {
    row: number;
    column: number;
    status: Status;
}

export enum Direction {
    Right,
    Bottom,
}

export enum Status {
    Filled = 'Filled',
    Focused = 'Focused',
    Empty = 'Empty',
}

export interface MazePath {
    cell: Cell;
    direction: Direction;
    status: Status;
}

export interface CellPaths {
    cell: Cell;
    right: MazePath | null;
    bottom: MazePath | null;
};

export enum GenerationStatus {
    Uninitialized,
    Ongoing,
    Completed,
    Error,
}

export interface MazeGenerationAlgorithm {
    paths: CellPaths[][];
    isStartingEmpty?: boolean;
    getGenerationStatus(): GenerationStatus;
    initialize(): void;
    computeOneGenerationIteration(): void;
}
