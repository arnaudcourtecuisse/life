class TwoWayMap<Left, Right> extends Map<Left, Right> {
  private rev: Map<Right, Left>;
  constructor() {
    super();
    this.rev = new Map();
  }

  revGet(right: Right): Left | undefined {
    return this.rev.get(right);
  }

  set(left: Left, right: Right) {
    this.rev.set(right, left);
    return super.set(left, right);
  }
}
