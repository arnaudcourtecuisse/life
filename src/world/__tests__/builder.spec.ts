import { World, createEmptyWorld } from "..";
import { Genitals, Mouth, Producer } from "../../life/cells";
import Organism from "../../life/organism";
import { Cell, IOrganism } from "../../life/types";
import { Coordinates, Frame } from "../../utils/frame";
import WorldOrganismBuilder from "../builder";
import { LivingType } from "../types";

describe("Builder", () => {
  let world: World;
  let adam: IOrganism;
  let adamBuilder: WorldOrganismBuilder;

  beforeEach(() => {
    world = createEmptyWorld(10, 10);
    adam = new Organism();
    const adamFrame: Frame = [5, 5, 0];
    adamBuilder = WorldOrganismBuilder.getBuilder(world, adamFrame).init(adam);
  });

  it("should add organism to the world", () => {
    expect(world.organisms.has(adam)).toBe(true);
  });

  describe("addCell", () => {
    it("should add cells both to the world and the organism", () => {
      const cell = adamBuilder.addCell(LivingType.genitals, [0, 0]);
      expect(cell).toBeInstanceOf(Genitals);
      expect(adam.size).toBe(1);
      expect(world.grid.get([5, 5])).toBe(cell);
    });

    it("should replace cell if there is already one", () => {
      const genitals = adamBuilder.addCell(LivingType.genitals, [0, 0]);
      const mouth = adamBuilder.addCell(LivingType.mouth, [0, 0]);
      expect(mouth).toBeInstanceOf(Mouth);
      expect(adam.size).toBe(1);
      expect(adam.hasCell(genitals as Cell)).toBe(false);
      expect(adam.hasCell(mouth as Cell)).toBe(true);
      expect(world.grid.get([5, 5])).toBe(mouth);
    });

    it("should handle cell organism collision in the same frame", () => {
      const adamMouth = adamBuilder.addCell(LivingType.mouth, [0, 0])!;
      const adamGenitals = adamBuilder.addCell(LivingType.genitals, [0, 1])!;
      const eve = new Organism();
      const eveFrame: Frame = [5, 5, 0];
      const eveBuilder = WorldOrganismBuilder.getBuilder(world, eveFrame).init(
        eve
      );
      const eveGenitals = eveBuilder.addCell(LivingType.genitals, [1, 0]);
      const eveMouth = eveBuilder.addCell(LivingType.mouth, [0, 1]);
      // Check that side-effects are right
      expect(adam.size).toBe(2);
      expect(adam.hasCell(adamMouth)).toBe(true);
      expect(adam.hasCell(adamGenitals)).toBe(true);
      expect(eveGenitals).toBeInstanceOf(Genitals);
      expect(eveMouth).toBe(null);
      expect(eve.size).toBe(1);
      expect(eve.hasCell(eveGenitals as Cell)).toBe(true);
      const adamMouthPixel = world.grid.get([5, 5]) as Cell;
      const adamGenitalsPixel = world.grid.get([5, 6]) as Cell;
      const eveGenitalsPixel = world.grid.get([6, 5]) as Cell;
      expect(adamMouthPixel).toBe(adamMouth);
      expect(adamMouthPixel.owner).toBe(adam);
      expect(adamGenitalsPixel).toBe(adamGenitals);
      expect(adamGenitalsPixel.owner).toBe(adam);
      expect(eveGenitalsPixel).toBe(eveGenitals);
      expect(eveGenitalsPixel.owner).toBe(eve);
    });
  });
  describe("withAnatomy", () => {
    let m: Cell, g: Cell, p: Cell;
    beforeEach(() => {
      adamBuilder.withAnatomy(
        new Map<LivingType, Coordinates>([
          [LivingType.mouth, [0, 0]],
          [LivingType.genitals, [1, 0]],
          [LivingType.producer, [1, 1]],
        ])
      );
      m = adam.getCell([0, 0])!;
      g = adam.getCell([1, 0])!;
      p = adam.getCell([1, 1])!;
    });

    it("should add all anatomy cells to the organism", () => {
      expect(adam.size).toBe(3);
      expect(m).toBeInstanceOf(Mouth);
      expect(g).toBeInstanceOf(Genitals);
      expect(p).toBeInstanceOf(Producer);
      expect(adam.hasCell(m)).toBe(true);
      expect(adam.getPosition(m)).toEqual([0, 0]);
      expect(adam.hasCell(g)).toBe(true);
      expect(adam.getPosition(g)).toEqual([1, 0]);
      expect(adam.hasCell(p)).toBe(true);
      expect(adam.getPosition(p)).toEqual([1, 1]);
    });
  });
});
