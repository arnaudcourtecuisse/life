import { Coordinates } from "./frame";

export default class Grid<T> {
  private map = new Map<T, Coordinates>();
  private table: T[][] = [];
  constructor(public readonly width: number, public readonly height: number) {
    for (let r = 0; r < height; ++r)
      this.table.push(new Array(width).fill(null));
  }

  toArray(): readonly T[][] {
    return this.table.map((row) => row.slice(0));
  }

  get([col, row]: Coordinates): T | null {
    return this.table[row][col];
  }

  set(pos: Coordinates, newVal: T) {
    const [col, row] = pos;
    const val = this.table[row][col];
    this.map.delete(val);
    this.map.set(newVal, pos);
    this.table[row][col] = newVal;
  }

  getPosition(val: T): Coordinates | null {
    return this.map.get(val) ?? null;
  }

  replace(val: T, newVal: T) {
    const pos = this.map.get(val)!;
    this.map.delete(val);
    this.map.set(newVal, pos);
    const [col, row] = pos;
    this.table[row][col] = newVal;
  }

  fillWith(filler: (col: number, row: number) => T): void {
    for (let c = 0; c < this.width; ++c) {
      for (let r = 0; r < this.height; ++r) {
        const val = filler(c, r);
        this.table[r][c] = val;
        this.map.set(val, [c, r]);
      }
    }
  }
}
