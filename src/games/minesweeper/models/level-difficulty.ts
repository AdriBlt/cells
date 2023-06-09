export interface LevelDifficulty {
    name: string;
    numberRows: number;
    numberCols: number;
    numberMines: number;
}

function createLevel(name: string, numberRows: number, numberCols: number, numberMines: number): LevelDifficulty {
    return { name, numberRows, numberCols, numberMines };
}

const Beginner = createLevel('Beginner', 8, 8, 10);
const Intermediate = createLevel('Intermediate', 16, 16, 40);
const Expert = createLevel('Expert', 24, 24, 99);
const Custom = createLevel('Custom', 0, 0, 0);

export const LevelDifficultyConst = {
    minSide: 2,
    maxSide: 30,
    minMines: 1,
    maxMines: 900,
    values: [ Beginner, Intermediate, Expert, Custom ],
    Beginner,
    Intermediate,
    Expert,
    Custom
}