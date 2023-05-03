import { v4 as uuid } from "uuid";
import { Coordinates } from "../utils/frame";
import Interaction from "../world/interaction";
import { LivingType } from "../world/types";
import { Cell, EmptyBuilder, IOrganism } from "./types";

export default class Organism implements IOrganism {
  static originOfLife(builder: EmptyBuilder) {
    const adam = new Organism();
    const originBuilder = builder.init(adam);
    originBuilder.addCell(LivingType.mouth, [0, 0]);
    originBuilder.addCell(LivingType.producer, [1, 1]);
    originBuilder.addCell(LivingType.mouth, [1, -1]);
  }

  private cells = new TwoWayMap<Cell, Coordinates>();
  public readonly id: string;

  constructor() {
    this.id = uuid();
  }

  addCell(cell: Cell, position: Coordinates): Cell {
    this.cells.set(cell, position);
    return cell;
  }

  getCell(position: Coordinates): Cell | null {
    return this.cells.revGet(position) ?? null;
  }

  hasCell(cell: Cell) {
    return this.cells.has(cell);
  }

  getPosition(cell: Cell) {
    return this.cells.get(cell) ?? null;
  }

  removeCell(cell: Cell) {
    this.cells.delete(cell);
  }

  get anatomy() {
    const anatomy = new Map();
    for (const [cell, pos] of this.cells.entries()) {
      anatomy.set({ ...cell }, pos);
    }
    return anatomy;
  }

  get size() {
    return this.cells.size;
  }

  private internalEnergy = 0;

  get energy() {
    return this.internalEnergy;
  }

  set energy(value: number) {
    this.internalEnergy = Math.max(0, value);
  }

  tick(worldInterface: Interaction) {
    for (const [cell, position] of this.cells.entries()) {
      if (!cell.activate(position, worldInterface)) break;
    }
  }
}
