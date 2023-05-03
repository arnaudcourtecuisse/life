import { Pixel, World } from ".";
import CellFactory from "../life/CellFactory";
import Organism from "../life/organism";
import {
  Anatomy,
  Cell,
  EmptyBuilder,
  IOrganism,
  OrganismBuilder,
} from "../life/types";
import {
  BasisChangeFunction,
  Coordinates,
  Frame,
  basisChangeFactory,
} from "../utils/frame";
import { LivingType, WorldType } from "./types";

interface IEmpty extends EmptyBuilder {
  init(org: IOrganism): WorldOrganismBuilder;
}
export default class WorldOrganismBuilder implements OrganismBuilder {
  static getBuilder(world: World, frame: Frame): IEmpty {
    return new WorldOrganismBuilder(world, frame) as IEmpty;
  }

  private changeBasis: BasisChangeFunction;
  private organism = new Organism();
  private constructor(private world: World, private frame: Frame) {
    this.changeBasis = basisChangeFactory(frame);
  }

  init(organism: Organism): WorldOrganismBuilder {
    this.world.organisms.set(organism, this.frame);
    this.organism = organism;
    this.organism.energy = 1;
    return this;
  }

  addCell(type: LivingType, position: Coordinates): Cell | null {
    return this.addCellToOrg(type, position);
  }

  withAnatomy(anatomy: Anatomy): boolean {
    const initialState = new Map<Coordinates, Pixel>();
    for (const [cellType, anatomyPos] of anatomy.entries()) {
      // Compute grid position of the cell
      const gridPos = this.changeBasis(anatomyPos);
      const pixel = this.world.grid.get(gridPos);
      // Check the current state of the grid
      if (!this.checkAndPrepareSpot(pixel)) {
        this.restore(initialState);
        return false;
      }
      initialState.set(gridPos, pixel);
      // Add the cell
      const cell = CellFactory.create(cellType, this.organism);
      this.registerCell(cell, gridPos, anatomyPos);
    }
    return true;
  }

  private restore(initialState: Map<Coordinates, Pixel>) {
    for (const [position, pixel] of initialState.entries()) {
      this.world.grid.set(position, pixel);
    }
  }

  private addCellToOrg(
    type: LivingType,
    cellPosition: Coordinates
  ): Cell | null {
    const worldPosition = this.changeBasis(cellPosition);
    const pixel = this.world.grid.get(worldPosition);
    if (this.checkAndPrepareSpot(pixel)) {
      const cell = CellFactory.create(type, this.organism);
      this.registerCell(cell, worldPosition, cellPosition);
      return cell;
    }
    return null;
  }

  private checkAndPrepareSpot(pixel: Pixel | null): pixel is Pixel {
    if (!pixel) return false;
    if (pixel.type === WorldType.empty) return true;
    if ("owner" in pixel) {
      if (pixel.owner === this.organism) {
        this.removeCell(pixel);
        return true;
      }
    }
    return false;
  }

  private removeCell(cell: Cell) {
    this.world.grid.replace(cell, { type: WorldType.empty });
    this.organism.removeCell(cell);
  }

  private registerCell(
    cell: Cell,
    absolutePosition: Coordinates,
    anatomyPosition: Coordinates
  ) {
    const ownedCell = this.organism.addCell(cell, anatomyPosition);
    this.world.grid.set(absolutePosition, ownedCell);
  }

  get() {
    return this.organism;
  }
}
