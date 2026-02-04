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
import * as EasingsVisualizerModule from './examples/staggered-motion/EasingsVisualizer';
import EasingsVisualizerSource from './examples/staggered-motion/EasingsVisualizer.tsx?raw';
import * as GridStaggerModule from './examples/staggered-motion/GridStagger';
import GridStaggerSource from './examples/staggered-motion/GridStagger.tsx?raw';
import * as CardStackModule from './examples/staggered-motion/CardStack';
import CardStackSource from './examples/staggered-motion/CardStack.tsx?raw';
import * as ListRevealModule from './examples/staggered-motion/ListReveal';
import ListRevealSource from './examples/staggered-motion/ListReveal.tsx?raw';
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
import * as Transform3DShowcaseModule from './examples/scene-3d/Transform3DShowcase';
import Transform3DShowcaseSource from './examples/scene-3d/Transform3DShowcase.tsx?raw';
import * as FeatureShowcaseModule from './examples/showcase/FeatureShowcase';
import FeatureShowcaseSource from './examples/showcase/FeatureShowcase.tsx?raw';
import * as MatrixRainModule from './examples/animated-text/MatrixRain';
import MatrixRainSource from './examples/animated-text/MatrixRain.tsx?raw';
import * as GlitchInModule from './examples/animated-text/GlitchIn';
import GlitchInSource from './examples/animated-text/GlitchIn.tsx?raw';
import * as GlitchCycleModule from './examples/animated-text/GlitchCycle';
import GlitchCycleSource from './examples/animated-text/GlitchCycle.tsx?raw';
import * as BasicCounterModule from './examples/animated-counter/BasicCounter';
import BasicCounterSource from './examples/animated-counter/BasicCounter.tsx?raw';
import * as BasicTypewriterModule from './examples/typewriter/BasicTypewriter';
import BasicTypewriterSource from './examples/typewriter/BasicTypewriter.tsx?raw';
import * as MultiTextTypewriterModule from './examples/typewriter/MultiTextTypewriter';
import MultiTextTypewriterSource from './examples/typewriter/MultiTextTypewriter.tsx?raw';
import * as VariableSpeedTypewriterModule from './examples/typewriter/VariableSpeedTypewriter';
import VariableSpeedTypewriterSource from './examples/typewriter/VariableSpeedTypewriter.tsx?raw';
import * as CLISimulationModule from './examples/typewriter/CLISimulation';
import CLISimulationSource from './examples/typewriter/CLISimulation.tsx?raw';
import * as BasicCodeBlockModule from './examples/code-block/BasicCodeBlock';
import BasicCodeBlockSource from './examples/code-block/BasicCodeBlock.tsx?raw';

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
  EasingsVisualizer: { ...EasingsVisualizerModule, sourceCode: extractSource(EasingsVisualizerSource) },
  GridStagger: { ...GridStaggerModule, sourceCode: extractSource(GridStaggerSource) },
  CardStack: { ...CardStackModule, sourceCode: extractSource(CardStackSource) },
  ListReveal: { ...ListRevealModule, sourceCode: extractSource(ListRevealSource) },
  LinearGradient: { ...LinearGradientModule, sourceCode: extractSource(LinearGradientSource) },
  RadialGradient: { ...RadialGradientModule, sourceCode: extractSource(RadialGradientSource) },
  ConicGradient: { ...ConicGradientModule, sourceCode: extractSource(ConicGradientSource) },
  ParticlesSnow: { ...ParticlesSnowModule, sourceCode: extractSource(ParticlesSnowSource) },
  ParticlesFountain: { ...ParticlesFountainModule, sourceCode: extractSource(ParticlesFountainSource) },
  ParticlesGrid: { ...ParticlesGridModule, sourceCode: extractSource(ParticlesGridSource) },
  ScrollingColumns: { ...ScrollingColumnsModule, sourceCode: extractSource(ScrollingColumnsSource) },
  Scene3DPresentation: { ...Scene3DBasicModule, sourceCode: extractSource(Scene3DBasicSource) },
  FlyingThroughWords: { ...FlyingThroughWordsModule, sourceCode: extractSource(FlyingThroughWordsSource) },
  GlitchIn: { ...GlitchInModule, sourceCode: extractSource(GlitchInSource) },
  GlitchCycle: { ...GlitchCycleModule, sourceCode: extractSource(GlitchCycleSource) },
  Elements3D: { ...Elements3DModule, sourceCode: extractSource(Elements3DSource) },
  Transform3DShowcase: { ...Transform3DShowcaseModule, sourceCode: extractSource(Transform3DShowcaseSource) },
  FeatureShowcase: { ...FeatureShowcaseModule, sourceCode: extractSource(FeatureShowcaseSource) },
  MatrixRain: { ...MatrixRainModule, sourceCode: extractSource(MatrixRainSource) },
  BasicCounter: { ...BasicCounterModule, sourceCode: extractSource(BasicCounterSource) },
  BasicTypewriter: { ...BasicTypewriterModule, sourceCode: extractSource(BasicTypewriterSource) },
  MultiTextTypewriter: { ...MultiTextTypewriterModule, sourceCode: extractSource(MultiTextTypewriterSource) },
  VariableSpeedTypewriter: { ...VariableSpeedTypewriterModule, sourceCode: extractSource(VariableSpeedTypewriterSource) },
  CLISimulation: { ...CLISimulationModule, sourceCode: extractSource(CLISimulationSource) },
  BasicCodeBlock: { ...BasicCodeBlockModule, sourceCode: extractSource(BasicCodeBlockSource) },
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
export const EasingsVisualizer = bits.EasingsVisualizer;
export const GridStagger = bits.GridStagger;
export const CardStack = bits.CardStack;
export const ListReveal = bits.ListReveal;
export const LinearGradient = bits.LinearGradient;
export const RadialGradient = bits.RadialGradient;
export const ConicGradient = bits.ConicGradient;
export const ParticlesSnow = bits.ParticlesSnow;
export const ParticlesFountain = bits.ParticlesFountain;
export const ParticlesGrid = bits.ParticlesGrid;
export const Scene3DPresentation = bits.Scene3DPresentation;
export const FlyingThroughWords = bits.FlyingThroughWords;
export const ScrollingColumns = bits.ScrollingColumns;
export const Elements3D = bits.Elements3D;
export const Transform3DShowcase = bits.Transform3DShowcase;
export const GlitchIn = bits.GlitchIn;
export const GlitchCycle = bits.GlitchCycle;
export const FeatureShowcase = bits.FeatureShowcase;
export const MatrixRain = bits.MatrixRain;
export const BasicCounter = bits.BasicCounter;
export const BasicTypewriter = bits.BasicTypewriter;
export const MultiTextTypewriter = bits.MultiTextTypewriter;
export const VariableSpeedTypewriter = bits.VariableSpeedTypewriter;
export const CLISimulation = bits.CLISimulation;
export const BasicCodeBlock = bits.BasicCodeBlock;
