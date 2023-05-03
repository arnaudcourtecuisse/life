import Grid from "../grid";

interface Test {
  a: number;
  b?: number;
}

describe("Grid", () => {
  it("should return null in uninitialized points", () => {
    const grid = new Grid<Test>(1, 1);
    expect(grid.get([0, 0])).toBe(null);
  });

  it("should have consistent width and height", () => {
    const grid = new Grid<Test>(2, 3);
    expect(grid.width).toBe(2);
    expect(grid.height).toBe(3);
    const array = grid.toArray();
    expect(array[0].length).toBe(2);
    expect(array.length).toBe(3);
  });
});

describe("Grid.set", () => {
  it("should store data and position", () => {
    const grid = new Grid<Test>(2, 3);
    const data: Test = { a: 12 };
    grid.set([1, 2], data);
    const value = grid.get([1, 2]);
    expect(value).toBe(data);
    const pos = grid.getPosition(data);
    expect(pos).toEqual([1, 2]);
  });
});

describe("Grid.replace", () => {
  it("should store data and position", () => {
    const grid = new Grid<Test>(2, 3);
    const first: Test = { a: 12 };
    const second: Test = { a: 13 };
    grid.set([1, 2], first);
    grid.replace(first, second);
    const value = grid.get([1, 2]);
    expect(value).toBe(second);
    const posFirst = grid.getPosition(first);
    expect(posFirst).toBe(null);
    const posSec = grid.getPosition(second);
    expect(posSec).toEqual([1, 2]);
  });
});

describe("Grid.fillWith", () => {
  it("should fill grid with values provided by the filler", () => {
    const filler = (col: number, row: number): Test => ({ a: col, b: row });
    const grid = new Grid<Test>(2, 3);
    grid.fillWith(filler);
    const array = grid.toArray();
    expect(array).toEqual([
      [
        { a: 0, b: 0 },
        { a: 1, b: 0 },
      ],
      [
        { a: 0, b: 1 },
        { a: 1, b: 1 },
      ],
      [
        { a: 0, b: 2 },
        { a: 1, b: 2 },
      ],
    ]);
  });
});
