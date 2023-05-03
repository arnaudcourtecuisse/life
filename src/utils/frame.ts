import memoize from "fast-memoize";
import { Matrix, multiply } from "mathjs";

// Position in grid
export type Coordinates = [number, number];
// Position & orientation

export enum Orientation {
  right = 0,
  up = Math.PI / 2,
  left = Math.PI,
  down = -Math.PI / 2,
}

export type Frame = [number, number, Orientation];

export enum FrameIndex {
  column,
  row,
  orientation,
}

export function getCoordinates(frame: Frame): Coordinates {
  return [frame[FrameIndex.column], frame[FrameIndex.row]];
}

export function translate(position: Frame, translation: Coordinates): Frame;
export function translate(
  coordinates: Coordinates,
  vector: Coordinates
): Coordinates;
export function translate<T extends Frame | Coordinates>(
  from: T,
  vector: Coordinates
): T {
  return from.map((val, i) => val + (vector[i] ?? 0)) as T;
}

type Vector = [[number], [number]];
type RotationMatrix = [[number, number], [number, number]];

function getMatrix(angle: Orientation): RotationMatrix {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    [cos, sin],
    [-sin, cos],
  ];
}
const rotationMatrix: Record<Orientation, RotationMatrix> = {
  [Orientation.right]: getMatrix(Orientation.right),
  [Orientation.down]: getMatrix(Orientation.down),
  [Orientation.left]: getMatrix(Orientation.left),
  [Orientation.up]: getMatrix(Orientation.right),
};

export type BasisChangeFunction = (position: Coordinates) => Coordinates;

export const basisChangeFactory = memoize((frame: Frame) => {
  const translation = [frame[0], frame[1]] as Coordinates;
  const M = rotationMatrix[frame[2]];
  const changeBasis = (position: Coordinates) => {
    const X = c2v(position);
    const p = v2c(multiply(M, X) as Matrix);
    return translate(p, translation);
  };
  return changeBasis;
});

export function changeBasis(frame: Frame, position: Coordinates) {
  const translation = [frame[0], frame[1]] as Coordinates;
  const M = rotationMatrix[frame[2]];
  const X = c2v(position);
  const p = v2c(multiply(M, X) as Vector);
  return translate(p, translation);
}

function v2c(v: Vector | Matrix): Coordinates {
  return v.map(([x]) => x) as Coordinates;
}

function c2v(c: Coordinates): Vector {
  return c.map((x) => [x]) as Vector;
}
