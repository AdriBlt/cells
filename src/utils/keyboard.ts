export enum KeyBoard {
  SPACE,
  UP,
  DOWN,
  LEFT,
  RIGHT,
  ENTER,
  Z,
  D,
  M,
  N,
  P,
  Q,
  R,
  S,
  C,
  N0,
  N1,
  N2,
  N3,
  N4,
  N5,
  N6,
  N7,
  N8,
  N9,
}

export function getKeyFromCode(keyCode: number): KeyBoard | null {
  switch (keyCode) {
    case 37:
      return KeyBoard.LEFT;
    case 38:
      return KeyBoard.UP;
    case 39:
      return KeyBoard.RIGHT;
    case 40:
      return KeyBoard.DOWN;
    case 67:
      return KeyBoard.C;
    case 68:
      return KeyBoard.D;
    case 77:
      return KeyBoard.M;
    case 78:
      return KeyBoard.N;
    case 80:
      return KeyBoard.P;
    case 81:
      return KeyBoard.Q;
    case 82:
      return KeyBoard.R;
    case 83:
      return KeyBoard.S;
    case 90:
      return KeyBoard.Z;
    case 32:
      return KeyBoard.SPACE;
    case 13:
      return KeyBoard.ENTER;
    case 48:
      return KeyBoard.N0;
    case 49:
      return KeyBoard.N1;
    case 50:
      return KeyBoard.N2;
    case 51:
      return KeyBoard.N3;
    case 52:
      return KeyBoard.N4;
    case 53:
      return KeyBoard.N5;
    case 54:
      return KeyBoard.N6;
    case 55:
      return KeyBoard.N7;
    case 56:
      return KeyBoard.N8;
    case 57:
      return KeyBoard.N9;
    default:
      return null;
  }
}
