import { LivingType, PixelType, WorldType } from "../world/types";
import { Renderer } from "./types";

const chars: Record<PixelType, string> = {
  [WorldType.empty]: " ",
  [WorldType.food]: ".",
  [LivingType.mouth]: "o",
  [LivingType.producer]: "0",
  [LivingType.genitals]: "u",
};

const render: Renderer = (world) => {
  console.log(`>>>>>${`#${world.iteration}`.padStart(8)} <<<<<`);

  const hFrame = `+${new Array(world.grid.width).fill("-").join("")}+`;
  console.log(hFrame);
  for (const row of world.grid.toArray()) {
    const pixels = row.map((px) => chars[px.type] ?? "#");
    console.log(`|${pixels.join("")}|`);
  }
  console.log(hFrame);

  for (const [org, frame] of world.organisms) {
    console.log(
      `(${frame.map((val) => `${val}`.padStart(4)).join(",")}) energy=${
        org.energy
      }`
    );
  }
};

export default render;
