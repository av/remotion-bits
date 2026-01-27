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
  // This assumes a specific formatting:
  // export const Component: React.FC = () => (
  //   <JSX>
  // );
  const match = raw.match(/export const Component: React\.FC = \(\) => \(([\s\S]*?)\);/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return '// Could not extract source code. Please check formatting in docs/src/bits/*.tsx';
};

export const bits = {
  FadeIn: { ...FadeInModule, sourceCode: extractSource(FadeInSource) },
  WordByWord: { ...WordByWordModule, sourceCode: extractSource(WordByWordSource) },
  LinearGradient: { ...LinearGradientModule, sourceCode: extractSource(LinearGradientSource) },
  SlideFromLeft: { ...SlideFromLeftModule, sourceCode: extractSource(SlideFromLeftSource) },
  RadialGradient: { ...RadialGradientModule, sourceCode: extractSource(RadialGradientSource) },
  CharByChar: { ...CharByCharModule, sourceCode: extractSource(CharByCharSource) },
} as const;

export type BitName = keyof typeof bits;

export const getBit = (name: BitName): Bit => bits[name];

export const getAllBits = (): Bit[] => Object.values(bits);

export const getBitsByTag = (tag: string): Bit[] =>
  getAllBits().filter(bit => bit.metadata.tags.includes(tag));
