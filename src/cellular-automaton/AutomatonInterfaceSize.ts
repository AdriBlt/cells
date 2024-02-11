export class AutomatonInterfaceSize {
  private sizeX: number;
  private sizeY: number;
  private delay: number;
  private cellSize: number;
  private border: boolean;

  constructor(x: number, y: number, d: number, c: number, b: boolean) {
    this.sizeX = x;
    this.sizeY = y;
    this.delay = d;
    this.cellSize = c;
    this.border = b;
  }

  public getSizeX(): number {
    return this.sizeX;
  }

  public getSizeY(): number {
    return this.sizeY;
  }

  public getDelay(): number {
    return this.delay;
  }

  public getCellSize(): number {
    return this.cellSize;
  }

  public hasBorder(): boolean {
    return this.border;
  }

  public setSizeX(sizeX: number): void {
    this.sizeX = sizeX;
  }

  public setSizeY(sizeY: number): void {
    this.sizeY = sizeY;
  }

  public setDelay(speed: number): void {
    this.delay = speed;
  }

  public setCellSize(size: number): void {
    this.cellSize = size;
  }

  public setBorder(border: boolean): void {
    this.border = border;
  }
}

export const GameModes = {
  GAME_OF_LIFE: new AutomatonInterfaceSize(61, 51, 100, 15, true),
  ELEMENTARY_RULES: new AutomatonInterfaceSize(61, 51, 200, 15, true),
  LANGTONS_ANT: new AutomatonInterfaceSize(61, 51, 100, 15, true),
  TURMITE: new AutomatonInterfaceSize(51, 22, 100, 25, true),
  PREDATOR_PREY: new AutomatonInterfaceSize(61, 51, 500, 15, true),
};
