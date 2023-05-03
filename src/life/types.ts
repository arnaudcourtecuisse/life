import { Coordinates } from "../utils/frame";
import Interaction from "../world/interaction";
import { LivingType } from "../world/types";

export interface Cell {
  readonly type: LivingType;
  readonly owner: IOrganism;
  activate(position: Coordinates, interaction: Interaction): boolean;
}

export type Anatomy = Map<LivingType, Coordinates>;

export interface IOrganism {
  readonly id: string;
  // anatomy-related properties & methods
  readonly size: number;
  readonly anatomy: Anatomy;
  addCell(cell: Cell, position: Coordinates): Cell;
  getCell(position: Coordinates): Cell | null;
  getPosition(cell: Cell): Coordinates | null;
  hasCell(cell: Cell): boolean;
  removeCell(cell: Cell): void;
  // behaviour-related properties & methods
  tick(worldInterface: Interaction): void;
  energy: number;
}

export interface EmptyBuilder {
  init(organism: IOrganism): OrganismBuilder;
}

export interface OrganismBuilder {
  get(): IOrganism;
  addCell(type: LivingType, position: Coordinates): Cell | null;
  withAnatomy(cells: Anatomy): boolean;
}
