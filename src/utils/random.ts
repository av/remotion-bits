import { random } from "remotion";

export const randomFloat = (
  seed: number | string,
  min: number,
  max: number
): number => {
  return random(seed) * (max - min) + min;
};

export const randomInt = (
  seed: number | string,
  min: number,
  max: number
): number => {
  return Math.floor(random(seed) * (max - min + 1) + min);
};

export const anyElement = <T>(seed: number | string, array: T[]): T => {
  const index = randomInt(seed, 0, array.length - 1);
  return array[index];
}