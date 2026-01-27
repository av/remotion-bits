import * as FadeIn from './FadeIn';
import * as WordByWord from './WordByWord';
import * as LinearGradient from './LinearGradient';
import * as SlideFromLeft from './SlideFromLeft';
import * as RadialGradient from './RadialGradient';
import * as CharByChar from './CharByChar';

export interface BitMetadata {
  name: string;
  description: string;
  tags: string[];
  duration: number;
  width?: number;
  height?: number;
}

export interface Bit {
  metadata: BitMetadata;
  Component: React.FC;
  sourceCode: string;
}

export const bits = {
  FadeIn,
  WordByWord,
  LinearGradient,
  SlideFromLeft,
  RadialGradient,
  CharByChar,
} as const;

export type BitName = keyof typeof bits;

export const getBit = (name: BitName): Bit => bits[name];

export const getAllBits = (): Bit[] => Object.values(bits);

export const getBitsByTag = (tag: string): Bit[] =>
  getAllBits().filter(bit => bit.metadata.tags.includes(tag));
