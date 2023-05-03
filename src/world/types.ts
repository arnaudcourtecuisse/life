// EnvType and LivingType values must not collide

export enum WorldType {
  empty = 0,
  food = 1,
}

export enum LivingType {
  mouth = 2,
  producer = 3,
  genitals = 4,
}

export type PixelType = LivingType | WorldType;

export interface WorldPixel {
  type: WorldType;
}
