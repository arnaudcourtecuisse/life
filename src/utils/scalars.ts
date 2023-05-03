import { Coordinates } from "./frame";

type NeighborEnum = Readonly<Record<string, Readonly<Coordinates[]>>>;

const adjacent: Coordinates[] = [
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, 0],
];
const corners: Coordinates[] = [
  [-1, -1],
  [-1, 1],
  [1, 1],
  [1, -1],
];
export const Neighbors: NeighborEnum = {
  adjacent,
  corners,
  all: [...adjacent, ...corners],
};
