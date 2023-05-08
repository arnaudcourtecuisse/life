import { randomChance, randomInt, weightedRandomInt } from "../../utils/random";
import Genome, { Chromosome } from "./Genome";

export interface ReplicationConfig {
  // Overall mutation rate
  mutationRate: number;
  // Mutation type weights, length shoud match enum above
  mutationTypeWeights: [number, number, number];
  deletionAverageLength: number;
  duplicationAverageLength: number;
}

enum MutationType {
  Deletion,
  Duplication,
  Swap,
}

export default class ReplicationEngine<
  Config extends ReplicationConfig = ReplicationConfig
> {
  constructor(protected params: Config) {}
  public replicate(dna: Readonly<Genome>) {
    const replicated = dna.copy();
    this.mutate(replicated);
    return replicated;
  }

  /**
   * In-place mutation of provided genome
   */
  protected mutate(dna: Genome): void {
    this.applyMutations(dna.chromosomes, dna.size);
  }

  protected mutateSequence(chromosomes: Chromosome[]): void {
    const size = chromosomes.reduce((s, ch) => s + ch.length, 0);
    this.applyMutations(chromosomes, size);
  }

  private applyMutations(chromosomes: Chromosome[], size: number): void {
    let mutationCount = this.determineMutationCount(size);
    if (mutationCount === 0) return;
    const weights = chromosomes.map((c) => c.length);
    const selectedIndices: number[] = [];
    // Pick all chromosome before mutation to avoid size mutation bias
    while (mutationCount > 0) {
      selectedIndices.push(weightedRandomInt(weights));
      mutationCount--;
    }
    // Apply mutations
    for (const chIdx of selectedIndices) {
      this.mutateChromosome(chromosomes[chIdx]);
    }
  }

  /**
   * In-place mutation of provided chromosome
   */
  protected mutateChromosome(chromosome: Chromosome) {
    const { mutationTypeWeights } = this.params;
    const mutationType = weightedRandomInt(mutationTypeWeights) as MutationType;
    const mutIdx = randomInt(chromosome.length);
    if (mutationType === MutationType.Swap) {
      chromosome.swap(mutIdx, new Uint8Array([randomInt(0xff)]));
      return;
    }
    if (mutationType === MutationType.Deletion) {
      const length =
        randomInt(this.params.deletionAverageLength) +
        randomInt(this.params.deletionAverageLength);
      chromosome.delete(mutIdx, length);
      return;
    }
    const length =
      randomInt(this.params.duplicationAverageLength) +
      randomInt(this.params.duplicationAverageLength);
    chromosome.duplicate(mutIdx, length);
  }

  /**
   *
   * @param mutationRate the probability for each codon to be changed
   * @returns
   */
  private determineMutationCount(genomeSize: number): number {
    const expectedMutationCount = genomeSize * this.params.mutationRate;
    // Throwing a 0-N dice twice has an expected value of N.
    const dice = Math.floor(expectedMutationCount);
    const mutationCount = randomInt(dice) + randomInt(dice);
    // Accounting for below-one expected count
    return mutationCount + (randomChance(expectedMutationCount - dice) ? 1 : 0);
  }
}
