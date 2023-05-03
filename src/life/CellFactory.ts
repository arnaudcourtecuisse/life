import { LivingType } from "../world/types";
import { Genitals, Mouth, Producer } from "./cells";
import { Cell, IOrganism } from "./types";

export default class CellFactory {
  static create(type: LivingType, owner: IOrganism): Cell {
    switch (type) {
      case LivingType.mouth:
        return new Mouth(owner);
      case LivingType.producer:
        return new Producer(owner);
      case LivingType.genitals:
        return new Genitals(owner);
    }
  }
}
