import * as p5 from "p5";

import { ProcessingSketch } from "../../services/processing.service";
import {
  color,
  Color,
  COLORS,
  setBackground,
  setFillColor,
  setStrokeColor,
} from "../../utils/color";
import { getKeyFromCode, KeyBoard } from "../../utils/keyboard";
import { clamp } from "../../utils/numbers";
import { Point } from "../../utils/points";
import { ProjectionToPlan, ViewPoint } from "../../utils/projection";
import {
  Constellation,
  KnownConstellationsFamilies,
  loadConstellationListFamilies,
} from "./models/constellation";
import { DisplayOptions } from "./models/display-options";
import { loadStarsList, Star } from "./models/stars";

export interface StarsProps {
  selectedConstellation: string;
}

interface SketchProps {
  onSelectedConstellation: (p: StarsProps) => void;
}

const WIDTH = 1300;
const HEIGHT = 800;
const HALF_WIDTH = WIDTH / 2;
const HALF_HEIGHT = HEIGHT / 2;

const DELTA_ANGLE = Math.PI / 10;
// const DELTA_MOVEMENT = 10;

export class StarsSketch implements ProcessingSketch {
  private displayOptions: DisplayOptions;
  private p5js: p5;
  private camera: ViewPoint;
  private stars: Star[];
  private starPositions: Map<string, Point>;
  private readonly projector: ProjectionToPlan;

  private starsLayer: p5.Graphics;
  private starNamesLayer: p5.Graphics;
  private constellationsLayer: p5.Graphics;
  private constellationNamesLayer: p5.Graphics;
  private constellationsFamilies: Constellation[][];
  private constellationIndex: number;

  constructor(private ui: SketchProps) {
    this.camera = getDefaultCamera();
    this.projector = new ProjectionToPlan(HALF_WIDTH, HALF_HEIGHT);
    this.stars = [];
    this.constellationsFamilies = [];
    this.constellationIndex = 0;
    this.starPositions = new Map<string, Point>();

    this.displayOptions = {
      showStars: true,
      showStarNames: false,
      showConstellations: true,
      showConstellationNames: true,
    };

    this.loadData().then(() => {
      if (this.p5js) {
        this.computeLayers();
        this.draw();
        this.updateSelectedConstellations();
      }
    });
  }

  public setup(p: p5): void {
    this.p5js = p;
    this.p5js.createCanvas(WIDTH, HEIGHT);
    this.p5js.noLoop();

    this.starsLayer = this.p5js.createGraphics(WIDTH, HEIGHT);
    this.starNamesLayer = this.p5js.createGraphics(WIDTH, HEIGHT);
    this.constellationsLayer = this.p5js.createGraphics(WIDTH, HEIGHT);
    this.constellationNamesLayer = this.p5js.createGraphics(WIDTH, HEIGHT);
  }

  public keyPressed(): void {
    const key = this.p5js && getKeyFromCode(this.p5js.keyCode);

    let needsToComputeStars = true;
    if (key === KeyBoard.LEFT) {
      this.camera.phi -= DELTA_ANGLE;
    } else if (key === KeyBoard.RIGHT) {
      this.camera.phi += DELTA_ANGLE;
    } else if (key === KeyBoard.UP) {
      this.camera.thetaAlt -= DELTA_ANGLE;
    } else if (key === KeyBoard.DOWN) {
      this.camera.thetaAlt += DELTA_ANGLE;
      // } else if (key === KeyBoard.P) {
      //   this.moveCamera(DELTA_MOVEMENT);
      // } else if (key === KeyBoard.M) {
      //   this.moveCamera(-DELTA_MOVEMENT);
    } else if (key === KeyBoard.R) {
      this.camera = getDefaultCamera();
    } else {
      needsToComputeStars = false;
    }

    let needsToComputeConstellations = true;
    const nbFamilies = this.constellationsFamilies.length;
    if (key === KeyBoard.P) {
      this.constellationIndex = (this.constellationIndex + 1) % nbFamilies;
      this.updateSelectedConstellations();
    } else if (key === KeyBoard.M) {
      this.constellationIndex =
        (this.constellationIndex + nbFamilies - 1) % nbFamilies;
      this.updateSelectedConstellations();
    } else {
      needsToComputeConstellations = false;
    }

    let haveSettingsChanged = true;
    if (key === KeyBoard.C) {
      this.displayOptions.showConstellations = !this.displayOptions
        .showConstellations;
      this.displayOptions.showConstellationNames = !this.displayOptions
        .showConstellationNames;
    } else if (key === KeyBoard.N) {
      this.displayOptions.showStarNames = !this.displayOptions.showStarNames;
    } else if (key === KeyBoard.S) {
      this.displayOptions.showStars = !this.displayOptions.showStars;
    } else {
      haveSettingsChanged = false;
    }

    if (needsToComputeStars) {
      this.computeLayers();
    } else if (needsToComputeConstellations) {
      this.computeConstellationLayers();
    }

    if (
      needsToComputeStars ||
      needsToComputeConstellations ||
      haveSettingsChanged
    ) {
      this.draw();
    }
  }

  public draw(): void {
    setBackground(this.p5js, COLORS.Black);

    if (this.displayOptions.showStars) {
      this.p5js.image(this.starsLayer, 0, 0);
    }

    if (this.displayOptions.showConstellations) {
      this.p5js.image(this.constellationsLayer, 0, 0);
    }

    if (this.displayOptions.showStarNames) {
      this.p5js.image(this.starNamesLayer, 0, 0);
    }

    if (this.displayOptions.showConstellationNames) {
      this.p5js.image(this.constellationNamesLayer, 0, 0);
    }
  }

  private updateSelectedConstellations() {
    this.ui.onSelectedConstellation({
      selectedConstellation: KnownConstellationsFamilies[this.constellationIndex]
    });
  }

  private computeLayers(): void {
    this.computeStarsLayers();
    this.computeConstellationLayers();
  }

  private computeStarsLayers(): void {
    this.starPositions.clear();

    this.starsLayer.clear();
    this.starsLayer.strokeWeight(2);
    this.starNamesLayer.clear();
    this.starNamesLayer.noStroke();
    setFillColor(this.starNamesLayer, COLORS.White);
    this.starNamesLayer.textAlign(this.p5js.CENTER, this.p5js.CENTER);

    this.stars.forEach((star) => {
      const coords = this.getPointOnScreen(star);
      if (coords) {
        this.starPositions.set(star.id, coords);
        const starColor = getStarColor(star);
        setStrokeColor(this.starsLayer, starColor);
        this.starsLayer.point(coords.x, coords.y);

        if (star.name) {
          this.starNamesLayer.text(star.name, coords.x, coords.y);
        }
      }
    });
  }

  private computeConstellationLayers(): void {
    this.constellationsLayer.clear();
    this.constellationsLayer.noFill();
    this.constellationsLayer.strokeWeight(0.1);
    setStrokeColor(this.constellationsLayer, COLORS.LightSkyBlue);
    this.constellationNamesLayer.clear();
    this.constellationNamesLayer.noStroke();
    setFillColor(this.constellationNamesLayer, COLORS.LightSkyBlue);
    this.constellationNamesLayer.textAlign(this.p5js.CENTER, this.p5js.CENTER);

    this.constellationsFamilies[this.constellationIndex].forEach(
      (constellation) => {
        const center: Point = { x: 0, y: 0 };
        let count = 0;
        constellation.edges.forEach((edge) => {
          const start = this.starPositions.get(edge.start);
          const end = this.starPositions.get(edge.end);
          if (start && end) {
            this.constellationsLayer.line(start.x, start.y, end.x, end.y);
            center.x += start.x + end.x;
            center.y += start.y + end.y;
            count += 2;
          }
        });
        if (count > 0) {
          center.x /= count;
          center.y /= count;
          this.constellationNamesLayer.text(
            constellation.name,
            center.x,
            center.y
          );
        }
      }
    );
  }

  private loadData(): Promise<unknown> {
    return Promise.all([this.loadStars(), this.loadConstellations()]);
  }

  private loadStars(): Promise<void> {
    return loadStarsList().then((data) => {
      this.stars = data;
      this.stars.sort((a, b) => a.mag - b.mag);
    });
  }

  private loadConstellations(): Promise<void> {
    return loadConstellationListFamilies(KnownConstellationsFamilies).then(
      (data) => {
        this.constellationsFamilies = data;
      }
    );
  }

  // private moveCamera(dist: number): void {
  //   this.camera.x +=
  //     dist * Math.cos(this.camera.phi) * Math.cos(this.camera.thetaAlt);
  //   this.camera.y +=
  //     dist * Math.sin(this.camera.phi) * Math.cos(this.camera.thetaAlt);
  //   this.camera.z += dist * Math.sin(this.camera.thetaAlt);
  // }

  private getPointOnScreen(star: Star): Point | undefined {
    return this.projector.getPointOnScreen(star, this.camera);
  }
}

function getStarColor(star: Star): Color {
  const starColor =
    star.ci !== undefined ? bvColorIndexToColor(star.ci) : COLORS.White;
  const magCoef = 1 - (star.mag + 1.44) / 8;
  return color(
    magCoef * starColor.r,
    magCoef * starColor.g,
    magCoef * starColor.b
  );
}

function bvColorIndexToColor(ci: number): Color {
  let r: number;
  let g: number;
  let b: number;
  const bv = clamp(ci, -0.4, 2.0);
  if (bv >= -0.4 && bv < 0.0) {
    const t = (bv + 0.4) / (0.0 + 0.4);
    r = 0.61 + 0.11 * t + 0.1 * t * t;
    g = 0.7 + 0.07 * t + 0.1 * t * t;
    b = 1.0;
  } else if (bv >= 0.0 && bv < 0.4) {
    const t = (bv - 0.0) / (0.4 - 0.0);
    r = 0.83 + 0.17 * t;
    g = 0.87 + 0.11 * t;
    b = 1.0;
  } else if (bv >= 0.4 && bv < 1.6) {
    const t = (bv - 0.4) / (1.6 - 0.4);
    r = 1.0;
    g = 0.98 - 0.16 * t;
  } else {
    const t = (bv - 1.6) / (2.0 - 1.6);
    r = 1.0;
    g = 0.82 - 0.5 * t * t;
  }

  if (bv >= 0.4 && bv < 1.5) {
    const t = (bv - 0.4) / (1.5 - 0.4);
    b = 1.0 - 0.47 * t + 0.1 * t * t;
  } else if (bv >= 1.5 && bv < 1.951) {
    const t = (bv - 1.5) / (1.94 - 1.5);
    b = 0.63 - 0.6 * t * t;
  } else {
    b = 0.0;
  }

  return color(255 * r, 255 * g, 255 * b);
}

function getDefaultCamera(): ViewPoint {
  return {
    x: 0.000005,
    y: 0,
    z: 0,
    phi: 0,
    thetaAlt: 0,
  };
}
