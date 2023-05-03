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

export function randomUniform(probability: number) {
  return Math.random() < probability;
}
