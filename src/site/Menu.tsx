import * as React from "react";

import { AntGame } from "../cellular-automaton/ant-game";
import { ElementaryRulesGame } from "../cellular-automaton/elementary-rules-game";
import { GameOfLifeGame } from "../cellular-automaton/game-of-life-game";
import { TurmiteGame } from "../cellular-automaton/turmite-game";
import { BransleyFernGame, SierpinskiChaosGame } from "../fractals/bransley-chaos-game";
import { BurningShipFractalGame } from "../fractals/burning-ship-fractal-game";
import { JuliaSetFractalGame } from "../fractals/julia-set-fractal-game";
import { MandelbrotFractalGame } from "../fractals/mandelbrot-fractal-game";
import { NewtonFractalGame } from "../fractals/newton-fractal-game";
import { SandpileGame } from "../fractals/sandpile-game";
import { BattleshipGame } from "../games/battleship/battleship-game";
import { MinesweeperGame } from "../games/minesweeper/minesweeper-game";
import { SnakeGame } from "../games/snake/snake-game";
import { DiffusionLimitedAggregationGame } from "../generation/diffusion-limited-aggregation/diffusion-limited-aggregation-game";
import { WaveFunctionCollapseGame } from "../generation/wave-function-collapse/wave-function-collapse-game";
import { BezierGame } from "../maths/bezier/bezier-game";
import { CurvedPolygonGame } from "../maths/curved-polygon/curved-polygon-game";
import { EuclidianRythmsGame } from "../maths/euclidian-rythms/euclidian-rythms-game";
import { FourierDrawingGame } from "../maths/fourier-drawing/fourier-drawing-game";
import { FourierSignalGame } from "../maths/fourier-signal/fourier-signal-game";
import { MultiplicationCircleGame } from "../maths/multiplication-circle/multiplication-circle-game";
import { PercolationGame } from "../maths/percolation/percolation-game";
import { RosesGame } from "../maths/roses/roses-game";
import { VoronoiGame } from "../maths/voronoi/voronoi-game";
import { MazeGenerationGame } from "../mazes/maze-generation/maze-generation-game";
import { AlixMazeGame } from "../mazes/ray-casting/alix-maze-game";
import { GeneratedMazeGame } from "../mazes/ray-casting/generated-maze-game";
import { WolfensteinGame } from "../mazes/ray-casting/wolfenstein-game";
import { SecretSantaGame } from "../misc/secret-santa-game";
import { ContradeOfSienna } from "../misc/sienna/contrade-of-sienna";
import { FlockGame } from "../simulations/flock/flock-game";
import { NBodiesGame } from "../simulations/n-bodies/n-bodies-game";
import { StarsGame } from "../simulations/stars/stars-game";
import { getStrings, LocalizedStrings } from "../strings";

export interface Page {
  name: string;
  route: string;
  component: React.ReactNode;
  description?: string;
  hideMenu?: boolean;
}

export interface Category {
  name: string;
  route: string;
  pages: Page[];
  description?: string;
}

export interface Menu {
  name: string;
  route: string;
  categories: Category[];
}

const strings: LocalizedStrings = getStrings();
const cellularAutomatonPages: Page[] = [
  {
    name: strings.menu.gameOfLife,
    route: "game-of-life",
    component: <GameOfLifeGame />,
  },
  {
    name: strings.menu.elementaryRules,
    route: "elementary-rules",
    component: <ElementaryRulesGame />,
  },
  {
    name: strings.menu.langtonAnt,
    route: "langton-ant",
    component: <AntGame />,
  },
  {
    name: strings.menu.turmite,
    route: "turmite",
    component: <TurmiteGame />,
  },
];
const gamesPages: Page[] = [
  {
    name: strings.menu.minesweeper,
    route: "minesweeper",
    component: <MinesweeperGame />,
  },
  {
    name: strings.menu.snake,
    route: "snake",
    component: <SnakeGame />,
  },
  {
    name: strings.menu.battleship,
    route: "battleship",
    component: <BattleshipGame />,
  },
];
const simulationsPages: Page[] = [
  {
    name: strings.menu.flock,
    route: "flock",
    component: <FlockGame />,
  },
  {
    name: strings.menu.stars,
    route: "stars",
    component: <StarsGame />,
  },
  {
    name: strings.menu.nBodiesSimulation,
    route: "n-bodies",
    component: <NBodiesGame />,
  },
];
const fractalesPages: Page[] = [
  {
    name: strings.menu.mandelbrot,
    route: "mandelbrot",
    component: <MandelbrotFractalGame />,
  },
  {
    name: strings.menu.juliaSet,
    route: "julia-set",
    component: <JuliaSetFractalGame />,
  },
  {
    name:  strings.menu.newton,
    route: "newton",
    component: <NewtonFractalGame />,
  },
  {
    name: strings.menu.burningShip,
    route: "burning-ship",
    component: <BurningShipFractalGame />,
    hideMenu: true,
  },
  {
    name: strings.menu.sirpienskiChaosGame,
    route: "sierpinski",
    component: <SierpinskiChaosGame />
  },
  {
    name: strings.menu.bransleyFern,
    route: "bransley-fern",
    component: <BransleyFernGame />
  },
  {
    name: 'Sand piles',
    route: 'sandpile',
    component: <SandpileGame />
  }
  // TODO: MANDELBROT PATH
  // TODO: BUDDAHBROT
];
const mathsPages: Page[] = [
  {
    name: strings.menu.fourierSignal,
    route: "fourier-signal",
    component: <FourierSignalGame />,
  },
  {
    name: strings.menu.fourierDrawing,
    route: "fourier-drawing",
    component: <FourierDrawingGame />,
  },
  {
    name: strings.menu.multiplicationCircle,
    route: "multiplication-circle",
    component: <MultiplicationCircleGame />,
  },
  {
    name: strings.menu.roses,
    route: "roses",
    component: <RosesGame />,
  },
  {
    name: strings.menu.voronoi,
    route: 'voronoi',
    component: <VoronoiGame />,
  },
  {
    name: strings.menu.bezier,
    route: 'bezier',
    component: <BezierGame />,
  },
  {
    name: strings.menu.curvedPolygon,
    route: 'curved-polygon',
    component: <CurvedPolygonGame />,
  },
  {
    name: strings.menu.euclidianRythms,
    route: 'euclidian-rythms',
    component: <EuclidianRythmsGame />,
  },
  {
    name: "Percolation",
    route: 'percolation',
    component: <PercolationGame />,
    hideMenu: true,
  },
  // TODO: SPACE FILLING CURVE (HILBERT)
  // TODO: CIRCLE AND ELIPSE?
];
const mazesPages: Page[] = [
  {
    name: strings.menu.wolfenstein,
    route: "wolfenstein",
    component: <WolfensteinGame />
  },
  {
    name: strings.menu.alixMaze,
    route: "alix-maze",
    component: <AlixMazeGame />
  },
  {
    name: strings.menu.mazeGeneration,
    route: 'maze-generation',
    component: <MazeGenerationGame />,
  },
  {
    name: strings.menu.generatedMaze,
    route: "generated-maze",
    component: <GeneratedMazeGame />,
  },
];
const generationPages: Page[] = [
  {
    name: strings.menu.waveFunctionCollapse,
    route: "wave-function-collapse",
    component: <WaveFunctionCollapseGame />,
  },
  {
    name: strings.menu.diffusionLimitedAggregation,
    route: "diffusion-limited-aggregation",
    component: <DiffusionLimitedAggregationGame />,
  },
];
const miscPages: Page[] = [
  {
    name: strings.menu.secretSanta,
    route: "secret-santa",
    component: <SecretSantaGame />,
    hideMenu: true,
  },
  {
    name: "Contrade of Sienna",
    route: "contrade-sienna",
    component: <ContradeOfSienna />,
    hideMenu: true,
  }
];

export const appMenu: Menu = {
  name: strings.menu.cells,
  route: "home",
  categories: [
    {
      name: strings.menu.cellularAutomaton,
      route: "cellular-automaton",
      pages: cellularAutomatonPages,
    },
    {
      name: strings.menu.games,
      route: "classic-games",
      pages: gamesPages,
    },
    {
      name: strings.menu.simulations,
      route: "simulations",
      pages: simulationsPages,
    },
    {
      name: strings.menu.fractals,
      route: "fractals",
      pages: fractalesPages,
    },
    {
      name: strings.menu.maths,
      route: "maths",
      pages: mathsPages,
    },
    {
      name: strings.menu.mazes,
      route: "mazes",
      pages: mazesPages,
    },
    {
      name: strings.menu.generation,
      route: "generation",
      pages: generationPages,
    },
    {
      name: strings.menu.misc,
      route: "miscellaneous",
      pages: miscPages,
    },
  ],
};

/*
TODO

=> REFACTO RIGHT PANEL

- artillery game
- math: points on lines: https://www.youtube.com/watch?v=snHKEpCv0Hk

- Ants & Slime: https://www.youtube.com/watch?v=X-iSQQgOd1A

MATH TODO
- Math Flower
- Mandelbrot line
- Buddahbrot
- Julia sets
- space filling curve
- triangle

- MATH ELIPSE IN CIRCLE

Games
- Tetris
- Space invader
- Pac man
- Pong

spirograph

Circle perlin noise
agar.io
looping gif https://www.youtube.com/watch?v=c6K-wJQ77yQ
perlin flow field https://www.youtube.com/watch?v=BjoM9oKOAKY

NOTES

// Elementary rules
Rule 90 (Exclusive OR)
Rule 184  (Traffic Flow)
Rule 30 (Conus Textile)

// Turing Machine
* Multiple Ants
(Paterson's Worms)
(Busy Beaver)

// Predator Prey
Hare / Fox / Eagle
Hen / Fox / Viper
Wator (1&2)
CroMagnon

// Others
Turing
Unicolor
Mandala
Sellmen
Daisy World
Lezards

// Balls
Simple
Attraction
Grippe

// Fractal
Mandelbrot
Julia
Bifurcation
Newton

*/
