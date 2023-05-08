/**
 * This function does not actually check that provided arguments are integer.
 * @param max upper integer bound of the range, excluded
 * @param min lower integer bound of the range, included
 * @returns a random integer in the range
 */
export function randomInt(max: number, min = 0) {
  return min + Math.floor(Math.random() * (max - min));
}

export function randomPick<T>(array: readonly T[]): T {
  return array[randomInt(array.length)];
}

export function weightedRandomPick<T>(
  array: readonly T[],
  weights: number[]
): T {
  return array[weightedRandomInt(weights)];
}

export function weightedRandomInt(weights: number[]): number {
  let hit = randomInt(weights.reduce((m, n) => m + n));
  for (let i = 0, L = weights.length; i < L; ++i) {
    const w = weights[i];
    if (hit < w) return i;
    hit -= w;
  }
  throw new Error("Weighted random pick overflowed!");
}

export function shuffle<T>(array: readonly T[]): T[] {
  const result = array.slice(0);
  for (let i = result.length - 1; i > 0; --i) {
    const j = randomInt(i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function flipCoin() {
  return Math.random() < 0.5;
}

export function randomChance(probability: number) {
  return Math.random() < probability;
}

export function randomNormal(mu: number, sigma: number) {
  return (
    mu +
    sigma *
      Math.sqrt(-2 * Math.log(Math.random())) *
      Math.cos(2 * Math.PI * Math.random())
  );
}

export function randomChi(expected: number) {
  const df = 2 * expected ** 2;
  return Math.sqrt(df * randomNormal(0, 1) ** 2);
}
