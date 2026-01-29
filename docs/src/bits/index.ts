import * as FadeInModule from './examples/animated-text/FadeIn';
import FadeInSource from './examples/animated-text/FadeIn.tsx?raw';
import * as WordByWordModule from './examples/animated-text/WordByWord';
import WordByWordSource from './examples/animated-text/WordByWord.tsx?raw';
import * as CharByCharModule from './examples/animated-text/CharByChar';
import CharByCharSource from './examples/animated-text/CharByChar.tsx?raw';
import * as BlurSlideWordModule from './examples/animated-text/BlurSlideWord';
import BlurSlideWordSource from './examples/animated-text/BlurSlideWord.tsx?raw';
import * as StaggeredFadeInModule from './examples/staggered-motion/StaggeredFadeIn';
import StaggeredFadeInSource from './examples/staggered-motion/StaggeredFadeIn.tsx?raw';
import * as SlideFromLeftModule from './examples/staggered-motion/SlideFromLeft';
import SlideFromLeftSource from './examples/staggered-motion/SlideFromLeft.tsx?raw';
import * as LinearGradientModule from './examples/gradient-transition/LinearGradient';
import LinearGradientSource from './examples/gradient-transition/LinearGradient.tsx?raw';
import * as RadialGradientModule from './examples/gradient-transition/RadialGradient';
import RadialGradientSource from './examples/gradient-transition/RadialGradient.tsx?raw';
import * as ConicGradientModule from './examples/gradient-transition/ConicGradient';
import ConicGradientSource from './examples/gradient-transition/ConicGradient.tsx?raw';
import * as ParticlesSnowModule from './examples/particle-system/ParticlesSnow';
import ParticlesSnowSource from './examples/particle-system/ParticlesSnow.tsx?raw';
import * as ParticlesFountainModule from './examples/particle-system/ParticlesFountain';
import ParticlesFountainSource from './examples/particle-system/ParticlesFountain.tsx?raw';
import * as ParticlesGridModule from './examples/particle-system/ParticlesGrid';
import ParticlesGridSource from './examples/particle-system/ParticlesGrid.tsx?raw';
import * as ScrollingColumnsModule from './examples/particle-system/ScrollingColumns';
import ScrollingColumnsSource from './examples/particle-system/ScrollingColumns.tsx?raw';
import * as Scene3DBasicModule from './examples/scene-3d/3DBasic';
import Scene3DBasicSource from './examples/scene-3d/3DBasic.tsx?raw';
import * as FlyingThroughWordsModule from './examples/scene-3d/FlyingThroughWords';
import FlyingThroughWordsSource from './examples/scene-3d/FlyingThroughWords.tsx?raw';
import * as Elements3DModule from './examples/scene-3d/3DElements';
import Elements3DSource from './examples/scene-3d/3DElements.tsx?raw';

export interface BitMetadata {
  name: string;
  description: string;
  tags: string[];
  duration: number;
  width?: number;
  height?: number;
}

export type ControlType = 'string' | 'number' | 'boolean' | 'color' | 'select';

export interface Control {
  key: string;
  type: ControlType;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: any }[];
}

export interface Bit {
  metadata: BitMetadata;
  Component: React.FC;
  sourceCode: string;
  props?: Record<string, any>;
  controls?: Control[];
}

const extractSource = (raw: string): string => {
  // 1. Match explicit block body: export const Component: React.FC = () => { ... }
  const blockStart = "export const Component: React.FC = () => {";
  const startIdx = raw.indexOf(blockStart);
  if (startIdx !== -1) {
    let body = raw.substring(startIdx + blockStart.length);
    body = body.trim();
    // Remove trailing }; or }
    if (body.endsWith("};")) {
      body = body.substring(0, body.length - 2);
    } else if (body.endsWith("}")) {
      body = body.substring(0, body.length - 1);
    }
    return body.trim();
  }

  // 2. Match implicit return: export const Component: React.FC = () => ( ... );
  const matchImplicit = raw.match(/export const Component: React\.FC = \(\) => \(([\s\S]*?)\);/);
  if (matchImplicit && matchImplicit[1]) {
    return matchImplicit[1].trim();
  }

  return raw;
};

export const bits = {
  FadeIn: { ...FadeInModule, sourceCode: extractSource(FadeInSource) },
  WordByWord: { ...WordByWordModule, sourceCode: extractSource(WordByWordSource) },
  CharByChar: { ...CharByCharModule, sourceCode: extractSource(CharByCharSource) },
  BlurSlideWord: { ...BlurSlideWordModule, sourceCode: extractSource(BlurSlideWordSource) },
  StaggeredFadeIn: { ...StaggeredFadeInModule, sourceCode: extractSource(StaggeredFadeInSource) },
  SlideFromLeft: { ...SlideFromLeftModule, sourceCode: extractSource(SlideFromLeftSource) },
  LinearGradient: { ...LinearGradientModule, sourceCode: extractSource(LinearGradientSource) },
  RadialGradient: { ...RadialGradientModule, sourceCode: extractSource(RadialGradientSource) },
  ConicGradient: { ...ConicGradientModule, sourceCode: extractSource(ConicGradientSource) },
  ParticlesSnow: { ...ParticlesSnowModule, sourceCode: extractSource(ParticlesSnowSource) },
  ParticlesFountain: { ...ParticlesFountainModule, sourceCode: extractSource(ParticlesFountainSource) },
  ParticlesGrid: { ...ParticlesGridModule, sourceCode: extractSource(ParticlesGridSource) },
  ScrollingColumns: { ...ScrollingColumnsModule, sourceCode: extractSource(ScrollingColumnsSource) },
  Scene3DPresentation: { ...Scene3DBasicModule, sourceCode: extractSource(Scene3DBasicSource) },
  FlyingThroughWords: { ...FlyingThroughWordsModule, sourceCode: extractSource(FlyingThroughWordsSource) },
  Elements3D: { ...Elements3DModule, sourceCode: extractSource(Elements3DSource) },
} as const;

export type BitName = keyof typeof bits;

export const getBit = (name: BitName): Bit => bits[name];

export const getAllBits = (): Bit[] => Object.values(bits);

export const getBitsByTag = (tag: string): Bit[] =>
  getAllBits().filter(bit => bit.metadata.tags.includes(tag));

// Export individual bits for MDX imports
export const FadeIn = bits.FadeIn;
export const WordByWord = bits.WordByWord;
export const CharByChar = bits.CharByChar;
export const BlurSlideWord = bits.BlurSlideWord;
export const StaggeredFadeIn = bits.StaggeredFadeIn;
export const SlideFromLeft = bits.SlideFromLeft;
export const LinearGradient = bits.LinearGradient;
export const RadialGradient = bits.RadialGradient;
export const ConicGradient = bits.ConicGradient;
export const ParticlesSnow = bits.ParticlesSnow;
export const ParticlesFountain = bits.ParticlesFountain;
export const ParticlesGrid = bits.ParticlesGrid;
export const Scene3DPresentation = bits.Scene3DPresentation;
export const FlyingThroughWords = bits.FlyingThroughWords;
export const Elements3D = bits.Elements3D;
