import { randomChance, randomInt, shuffle } from "../../utils/random";
import Genome, { Chromosome } from "./Genome";
import ReplicationEngine, { ReplicationConfig } from "./ReplicationEngine";

interface ReproductionConfig extends ReplicationConfig {
  multiRecombinationChance: number;
}

type ChromosomePair = [Chromosome, Chromosome];
type Gamete = Chromosome[];
type MeiosisResult = [Gamete, Gamete, Gamete, Gamete];

class PairedGenome extends Genome {
  constructor(public readonly pairs: ChromosomePair[]) {
    super(pairs.flat());
  }
  copy() {
    return new PairedGenome(this.pairs);
  }
}

export class ReproductionEngine extends ReplicationEngine<ReproductionConfig> {
  constructor(params: ReproductionConfig) {
    super(params);
  }
  public parthogenesis(dna: PairedGenome): PairedGenome {
    // Discard 2 random gametes
    const gametes = this.meiosis(dna).slice(0, 2);
    gametes.forEach((g) => this.mutateSequence(g));
    return new PairedGenome(gametes[0].map((ch, i) => [ch, gametes[1][i]]));
  }
  /**
   * @returns 4 gametes after recombination
   */
  protected meiosis(dna: PairedGenome): MeiosisResult {
    return dna.copy().pairs.reduce<MeiosisResult>(
      (gametes, [left, right]) => {
        const [leftRec, leftRight] = this.recombine(left.copy(), right.copy());
        shuffle([left, right, leftRec, leftRight]).forEach((ch, i) => {
          gametes[i].push(ch);
        });
        return gametes;
      },
      [[], [], [], []]
    );
  }

  /**
   * @param left left chromosome
   * @param right right chromosome
   * @returns provided chromosomes, recombined in-place
   */
  protected recombine(left: Chromosome, right: Chromosome): ChromosomePair {
    if (left.length < right.length) {
      return this.recombine(right, left);
    }
    const cut = randomInt(right.length);
    const leftPart = left.sequence.slice(cut, right.length);
    left.swap(cut + 1, right.sequence.subarray(cut));
    right.swap(cut + 1, leftPart);
    if (randomChance(this.params.multiRecombinationChance)) {
      this.recombine(left, right);
    }
    return [left, right];
  }
}
