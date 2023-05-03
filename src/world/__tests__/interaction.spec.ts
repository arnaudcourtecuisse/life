import { World, createEmptyWorld } from "..";
import Organism from "../../life/organism";
import { Cell, IOrganism } from "../../life/types";
import { Frame } from "../../utils/frame";
import WorldOrganismBuilder from "../builder";
import Interaction from "../interaction";
import { LivingType } from "../types";

describe("Interaction", () => {
  let world: World;
  let oneCellOrg: IOrganism;
  let frame: Frame;
  let builder: WorldOrganismBuilder;
  beforeEach(() => {
    world = createEmptyWorld(10, 10);
    frame = [5, 5, 0];
    oneCellOrg = new Organism();
    builder = WorldOrganismBuilder.getBuilder(world, frame).init(oneCellOrg);
    builder.addCell(LivingType.mouth, [0, 0]);
  });

  describe("Interaction.spawn", () => {
    it("should spawn the provided anatomy if the destination is empty", () => {
      const interaction = new Interaction(frame, world);
      const valid = interaction.spawn(oneCellOrg.anatomy, [1, 1]);
      expect(valid).not.toBe(null);
      const px = world.grid.get([6, 6]);
      expect(px?.type).toBe(LivingType.mouth);
      expect((px as Cell).owner).toBe(valid);
    });
    it("should not spawn if the destination is occupied by parent", () => {
      const interaction = new Interaction(frame, world);
      const invalid = interaction.spawn(oneCellOrg.anatomy, [0, 0]);
      expect(invalid).toBe(null);
      const px = world.grid.get([5, 5]);
      expect(px?.type).toBe(LivingType.mouth);
      expect((px as Cell).owner).toBe(oneCellOrg);
    });
    it("should not spawn if the destination is occupied by other org", () => {
      const interaction = new Interaction(frame, world);
      const valid = interaction.spawn(oneCellOrg.anatomy, [1, 1]);
      let px = world.grid.get([6, 6]);
      expect(valid).not.toBe(null);
      expect(px?.type).toBe(LivingType.mouth);
      expect((px as Cell).owner).toBe(valid);

      const invalid = interaction.spawn(oneCellOrg.anatomy, [1, 1]);
      px = world.grid.get([6, 6]);
      expect(invalid).toBe(null);
      expect(valid).not.toBe(null);
      expect(px?.type).toBe(LivingType.mouth);
      expect((px as Cell).owner).toBe(valid);
    });
  });
});
