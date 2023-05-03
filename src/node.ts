import render from "./renderers/console";
import { create, tick } from "./world";

const world = create(21, 21);

render(world);

for (let it = 0; it < 10; ++it) {
  tick(world);
  render(world);
}
