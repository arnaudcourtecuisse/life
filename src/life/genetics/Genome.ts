export class Chromosome {
  private data: Uint8Array;
  constructor(sequence: Uint8Array) {
    this.data = sequence;
  }
  get length() {
    return this.data.length;
  }
  get sequence() {
    return this.data.slice();
  }
  duplicate(index: number, length: number) {
    const sequence = this.data.subarray(index, index + length);
    this.insert(index, sequence);
  }
  insert(index: number, sequence: Uint8Array) {
    const mutated = new Uint8Array(this.data.length + sequence.length);
    mutated.set(this.data.subarray(0, index), 0);
    mutated.set(sequence, index);
    mutated.set(this.data.subarray(index), index + sequence.length);
    this.data = mutated;
  }
  delete(index: number, length: number) {
    const mutated = new Uint8Array(this.data.length - length);
    mutated.set(this.data.subarray(0, index), 0);
    mutated.set(this.data.subarray(index + length), index);
    this.data = mutated;
  }
  swap(index: number, sequence: Uint8Array) {
    this.data.set(sequence, index);
  }
  copy() {
    return new Chromosome(this.data.slice());
  }
}

export default class Genome {
  constructor(public readonly chromosomes: Chromosome[]) {}
  get size() {
    return this.chromosomes.reduce((size, ch) => size + ch.length, 0);
  }
  copy() {
    return new Genome(this.chromosomes.map((c) => c.copy()));
  }
}
