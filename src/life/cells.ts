import { Coordinates, translate } from "../utils/frame";
import { randomPick, shuffle } from "../utils/random";
import { Neighbors } from "../utils/scalars";
import Interaction from "../world/interaction";
import { LivingType, WorldType } from "../world/types";
import { Cell, IOrganism } from "./types";

export class Mouth implements Cell {
  readonly type = LivingType.mouth;
  constructor(readonly owner: IOrganism) {}
  activate(position: Coordinates, interaction: Interaction): boolean {
    for (const scalar of shuffle(Neighbors.adjacent)) {
      const pos = translate(position, scalar);
      const pixel = interaction.pixelAt(pos);
      if (pixel?.type === WorldType.food) {
        const success = interaction.eatFood(pixel);
        if (success) {
          ++this.owner.energy;
          break;
        }
      }
    }
    return true;
  }
}

export class Producer implements Cell {
  readonly type = LivingType.producer;
  constructor(readonly owner: IOrganism) {}
  activate(position: Coordinates, interaction: Interaction): boolean {
    for (const scalar of shuffle(Neighbors.adjacent)) {
      const pos = translate(position, scalar);
      const pixel = interaction.pixelAt(pos);
      if (pixel?.type === WorldType.empty) {
        interaction.dropFood(pixel);
        break;
      }
    }
    return true;
  }
}

export class Genitals implements Cell {
  readonly type = LivingType.genitals;
  constructor(readonly owner: IOrganism) {}
  activate(position: Coordinates, interaction: Interaction): boolean {
    const parent = this.owner;
    const required = 1 + parent.size;
    if (parent.energy < required) return true;

    const distance = 3;
    const birthPosition = randomPick(Neighbors.adjacent).map(
      (x) => distance * x
    ) as Coordinates;
    const child = interaction.spawn(parent.anatomy, birthPosition);
    if (child) {
      child.energy = 1;
      parent.energy -= required;
    }
    return !!child;
  }
}
