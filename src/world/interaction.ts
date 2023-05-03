import { World } from ".";
import Organism from "../life/organism";
import { Anatomy, IOrganism } from "../life/types";
import {
  Coordinates,
  Frame,
  FrameIndex,
  basisChangeFactory,
} from "../utils/frame";
import WorldOrganismBuilder from "./builder";
import { WorldPixel, WorldType } from "./types";

export default class Interaction {
  private changeBasis: (relativePos: Coordinates) => Coordinates;

  constructor(private frame: Frame, private world: World) {
    this.changeBasis = basisChangeFactory(this.frame);
  }

  dropFood(pixel: WorldPixel): boolean {
    return this.setWorldPixelAt(pixel, WorldType.food);
  }

  eatFood(pixel: WorldPixel): boolean {
    return this.setWorldPixelAt(pixel, WorldType.empty);
  }

  private setWorldPixelAt(pixel: WorldPixel, newType: WorldType): boolean {
    this.world.grid.replace(pixel, { type: newType });
    return true;
  }

  pixelAt(position: Coordinates) {
    const absolutePosition = this.changeBasis(position);
    return this.world.grid.get(absolutePosition);
  }

  spawn(anatomy: Anatomy, position: Coordinates): IOrganism | null {
    const frame = [
      ...this.changeBasis(position),
      this.frame[FrameIndex.orientation],
    ] as Frame;
    const builder = WorldOrganismBuilder.getBuilder(this.world, frame).init(
      new Organism()
    );
    return builder.withAnatomy(anatomy) ? builder.get() : null;
  }
}
