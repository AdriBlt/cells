// TODO LOCALIZATION
export class GameOfLifeMode {
  constructor(
    public name: string,
    public borns: number[],
    public stays: number[],
    public burns: boolean,
    public isHexa: boolean = false
  ) {}

  public getDescription(): string {
    if (this.name === "Custom") {
      return "";
    }

    let description = "(B";
    for (const b of this.borns) {
      description += `${b}`;
    }

    description += "/S";

    for (const s of this.stays) {
      description += `${s}`;
    }

    if (this.burns) {
      description += ",Burns";
    }

    description += ")";

    return description;
  }

  public isMode(
    born: boolean[],
    stay: boolean[],
    burnState: boolean,
    isHex: boolean
  ): boolean {
    if (this.burns !== burnState || this.isHexa !== isHex) {
      return false;
    }

    const count = isHex ? 7 : 9;
    for (let i = 0; i < count; i++) {
      if (born[i] !== this.isBorn(i) || stay[i] !== this.isStay(i)) {
        return false;
      }
    }
    return true;
  }

  public isBorn(value: number): boolean {
    return this.borns.includes(value);
  }

  public isStay(value: number): boolean {
    return this.stays.includes(value);
  }
}

const QuadLife = new GameOfLifeMode("QuadLife", [3], [2, 3], false);
const HighLife = new GameOfLifeMode("HighLife", [3, 6], [2, 3], false);
const DayNight = new GameOfLifeMode(
  "DayNight",
  [3, 6, 7, 8],
  [3, 4, 6, 7, 8],
  false
);
const Seeds = new GameOfLifeMode("Seeds", [2], [], false);
const Replicator = new GameOfLifeMode(
  "Replicator",
  [1, 3, 5, 7],
  [1, 3, 5, 7],
  false
);
const Glider = new GameOfLifeMode("Glider", [2, 5], [4], false);
const LifeWithoutDeath = new GameOfLifeMode(
  "LifeWithoutDeath",
  [3],
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  false
);
const LifeWithDeath = new GameOfLifeMode(
  "LifeWithDeath",
  [3],
  [0, 1, 2, 3, 6, 7, 8],
  false
);
const Life34 = new GameOfLifeMode("Life34", [3, 4], [3, 4], false);
const Diamoeba = new GameOfLifeMode(
  "Diamoeba",
  [3, 5, 6, 7, 8],
  [5, 6, 7, 8],
  false
);
const TwoTwo = new GameOfLifeMode("TwoTwo", [3, 6], [1, 2, 5], false);
const Morley = new GameOfLifeMode("Morley", [3, 6, 8], [2, 4, 5], false);
const Sierpinski = new GameOfLifeMode("Sierpinski", [1], [1, 2], false);
const BriansBrain = new GameOfLifeMode("BriansBrain", [2], [], true);
const Mandala = new GameOfLifeMode(
  "Mandala",
  [3, 4, 5, 6, 7],
  [1, 3, 4, 5, 6, 7],
  false
);
const HexLife = new GameOfLifeMode("HexLife", [2], [3, 4], false, true);
const Custom = new GameOfLifeMode("Custom", [], [], false);
export const GameOfLifeModesList: GameOfLifeMode[] = [
  QuadLife,
  HighLife,
  DayNight,
  Seeds,
  Replicator,
  Glider,
  LifeWithoutDeath,
  LifeWithDeath,
  Life34,
  Diamoeba,
  TwoTwo,
  Morley,
  Sierpinski,
  BriansBrain,
  Mandala,
  HexLife,
  Custom,
];

export const GameOfLifeModes = {
  QuadLife,
  HighLife,
  DayNight,
  Seeds,
  Replicator,
  Glider,
  LifeWithoutDeath,
  LifeWithDeath,
  Life34,
  Diamoeba,
  TwoTwo,
  Morley,
  Sierpinski,
  BriansBrain,
  Mandala,
  HexLife,
  Custom,
};

export function getModes(): string[] {
  return GameOfLifeModesList.map(
    (mode) => `${mode.name} ${mode.getDescription()}`
  );
}

export function getMode(
  born: boolean[],
  stay: boolean[],
  burnState: boolean,
  isHex: boolean
): GameOfLifeMode {
  for (const mode of GameOfLifeModesList) {
    if (mode.isMode(born, stay, burnState, isHex)) {
      return mode;
    }
  }

  return new GameOfLifeMode(
    "Custom",
    mapToIntegers(born),
    mapToIntegers(stay),
    burnState
  );
}

function mapToIntegers(bools: boolean[]): number[] {
  const integers: number[] = [];
  bools.forEach((v, i) => {
    if (v) {
      integers.push(i);
    }
  });
  return integers;
}
