import { Coordinates, Frame, Orientation, translate } from "../frame";

describe("translate", () => {
  it("should translate a frame by a vector", () => {
    const frame: Frame = [1, 2, Orientation.right];
    const vector: Coordinates = [3, 4];
    const expected: Frame = [4, 6, Orientation.right];
    expect(translate(frame, vector)).toEqual(expected);
  });

  it("should translate a position by a vector", () => {
    const position: Coordinates = [1, 2];
    const vector: Coordinates = [3, 4];
    const expected: Coordinates = [4, 6];
    expect(translate(position, vector)).toEqual(expected);
  });
});
