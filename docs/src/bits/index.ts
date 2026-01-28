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
import * as BlurSlideWordModule from './BlurSlideWord';
import BlurSlideWordSource from './BlurSlideWord.tsx?raw';
import * as Scene3DPresentationModule from './3DBasic';
import Scene3DPresentationSource from './3DBasic.tsx?raw';
import * as FlyingThroughWordsModule from './FlyingThroughWords';
import FlyingThroughWordsSource from './FlyingThroughWords.tsx?raw';
import * as Elements3DModule from './3DElements';
import Elements3DSource from './3DElements.tsx?raw';

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
  LinearGradient: { ...LinearGradientModule, sourceCode: extractSource(LinearGradientSource) },
  SlideFromLeft: { ...SlideFromLeftModule, sourceCode: extractSource(SlideFromLeftSource) },
  RadialGradient: { ...RadialGradientModule, sourceCode: extractSource(RadialGradientSource) },
  CharByChar: { ...CharByCharModule, sourceCode: extractSource(CharByCharSource) },
  ConicGradient: { ...ConicGradientModule, sourceCode: extractSource(ConicGradientSource) },
  ParticlesSnow: { ...ParticlesSnowModule, sourceCode: extractSource(ParticlesSnowSource) },
  ParticlesFountain: { ...ParticlesFountainModule, sourceCode: extractSource(ParticlesFountainSource) },
  ParticlesGrid: { ...ParticlesGridModule, sourceCode: extractSource(ParticlesGridSource) },
  StaggeredFadeIn: { ...StaggeredFadeInModule, sourceCode: extractSource(StaggeredFadeInSource) },
  BlurSlideWord: { ...BlurSlideWordModule, sourceCode: extractSource(BlurSlideWordSource) },
  Scene3DPresentation: { ...Scene3DPresentationModule, sourceCode: extractSource(Scene3DPresentationSource) },
  FlyingThroughWords: { ...FlyingThroughWordsModule, sourceCode: extractSource(FlyingThroughWordsSource) },
  Elements3D: { ...Elements3DModule, sourceCode: extractSource(Elements3DSource) },
} as const;

export type BitName = keyof typeof bits;

export const getBit = (name: BitName): Bit => bits[name];

export const getAllBits = (): Bit[] => Object.values(bits);

export const getBitsByTag = (tag: string): Bit[] =>
  getAllBits().filter(bit => bit.metadata.tags.includes(tag));
