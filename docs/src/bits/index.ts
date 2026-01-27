import * as FadeInModule from './FadeIn';
import FadeInSource from './FadeIn.tsx?raw';
import * as WordByWordModule from './WordByWord';
import WordByWordSource from './WordByWord.tsx?raw';
import * as LinearGradientModule from './LinearGradient';
import LinearGradientSource from './LinearGradient.tsx?raw';
import * as SlideFromLeftModule from './SlideFromLeft';
import SlideFromLeftSource from './SlideFromLeft.tsx?raw';
import * as RadialGradientModule from './RadialGradient';
import RadialGradientSource from './RadialGradient.tsx?raw';
import * as CharByCharModule from './CharByChar';
import CharByCharSource from './CharByChar.tsx?raw';
import * as ConicGradientModule from './ConicGradient';
import ConicGradientSource from './ConicGradient.tsx?raw';
import * as ParticlesSnowModule from './ParticlesSnow';
import ParticlesSnowSource from './ParticlesSnow.tsx?raw';
import * as ParticlesFountainModule from './ParticlesFountain';
import ParticlesFountainSource from './ParticlesFountain.tsx?raw';
import * as ParticlesGridModule from './ParticlesGrid';
import ParticlesGridSource from './ParticlesGrid.tsx?raw';
import * as StaggeredFadeInModule from './StaggeredFadeIn';
import StaggeredFadeInSource from './StaggeredFadeIn.tsx?raw';

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

const extractSource = (raw: string): string => {
  // Regex to match the component body inside `export const Component: React.FC = () => (` ... `);`
  const match = raw.match(/export const Component: React\.FC = \(\) => \(([\s\S]*?)\);/);
  if (match && match[1]) {
    return match[1].trim();
  }
  // Try to match return statement inside block
  const returnMatch = raw.match(/return \(([\s\S]*?)\);/);
  if (returnMatch && returnMatch[1]) {
    return returnMatch[1].trim();
  }

  return raw;
};

export const bits = {
  FadeIn: { ...FadeInModule, sourceCode: extractSource(FadeInSource) },
  WordByWord: { ...WordByWordModule, sourceCode: extractSource(WordByWordSource) },
  LinearGradient: { ...LinearGradientModule, sourceCode: extractSource(LinearGradientSource) },
  SlideFromLeft: { ...SlideFromLeftModule, sourceCode: extractSource(SlideFromLeftSource) },
  RadialGradient: { ...RadialGradientModule, sourceCode: extractSource(RadialGradientSource) },
  CharByChar: { ...CharByCharModule, sourceCode: extractSource(CharByCharSource) },
  ConicGradient: { ...ConicGradientModule, sourceCode: extractSource(ConicGradientSource) },
  ParticlesSnow: { ...ParticlesSnowModule, sourceCode: extractSource(ParticlesSnowSource) },
  ParticlesFountain: { ...ParticlesFountainModule, sourceCode: extractSource(ParticlesFountainSource) },
  ParticlesGrid: { ...ParticlesGridModule, sourceCode: extractSource(ParticlesGridSource) },
  StaggeredFadeIn: { ...StaggeredFadeInModule, sourceCode: extractSource(StaggeredFadeInSource) },
} as const;

export type BitName = keyof typeof bits;

export const getBit = (name: BitName): Bit => bits[name];

export const getAllBits = (): Bit[] => Object.values(bits);

export const getBitsByTag = (tag: string): Bit[] =>
  getAllBits().filter(bit => bit.metadata.tags.includes(tag));
