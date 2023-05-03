import Organism from "../life/organism";
import { Cell, IOrganism } from "../life/types";
import { Frame, Orientation } from "../utils/frame";
import Grid from "../utils/grid";
import WorldOrganismBuilder from "./builder";
import Interaction from "./interaction";
import { WorldPixel, WorldType } from "./types";

export type Pixel = Cell | WorldPixel;
type WorldGrid = Grid<Pixel>;
export interface World {
  // Access data by pixels
  grid: WorldGrid;
  organisms: Map<IOrganism, Frame>;
  iteration: number;
}

const createWorldGrid = (width: number, height: number) =>
  new Grid<Pixel>(width, height);

export function createEmptyWorld(width: number, height: number): World {
  const world: World = {
    grid: createWorldGrid(width, height),
    organisms: new Map(),
    iteration: 0,
  };
  world.grid.fillWith(() => ({ type: WorldType.empty }));
  return world;
}

export function create(width: number, height: number): World {
  const world = createEmptyWorld(width, height);

  const center: Frame = [
    Math.floor(width / 2),
    Math.floor(height / 2),
    Orientation.right,
  ];
  const builder = WorldOrganismBuilder.getBuilder(world, center);
  Organism.originOfLife(builder);
  return world;
}

export function tick(world: World): void {
  for (const [org, frame] of world.organisms.entries()) {
    const interaction = new Interaction(frame, world);
    org.tick(interaction);
  }
  ++world.iteration;
}
