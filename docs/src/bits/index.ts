import type { SharedBitInventoryEntry } from '../../../src/catalog/contracts';
import { sharedBitInventory } from '../../../src/catalog/inventory.generated';

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

type BitModule = {
  metadata: BitMetadata;
  Component: React.FC;
  props?: Record<string, any>;
  controls?: Control[];
};

const extractSource = (raw: string): string => {
  const blockStart = 'export const Component: React.FC = () => {';
  const startIdx = raw.indexOf(blockStart);
  if (startIdx !== -1) {
    let body = raw.substring(startIdx + blockStart.length);
    body = body.trim();
    if (body.endsWith('};')) {
      body = body.substring(0, body.length - 2);
    } else if (body.endsWith('}')) {
      body = body.substring(0, body.length - 1);
    }
    return body.trim();
  }

  const matchImplicit = raw.match(/export const Component: React\.FC = \(\) => \(([\s\S]*?)\);/);
  if (matchImplicit && matchImplicit[1]) {
    return matchImplicit[1].trim();
  }

  return raw;
};

const bitModules = import.meta.glob<BitModule>('./examples/**/*.tsx', { eager: true });
const bitSources = import.meta.glob<string>('./examples/**/*.tsx', {
  eager: true,
  import: 'default',
  query: '?raw',
});

const toDocsModulePath = (sourcePath: string): string => {
  const docsPrefix = 'docs/src/bits/';

  if (!sourcePath.startsWith(docsPrefix)) {
    throw new Error(`Shared bit sourcePath is outside docs/src/bits: ${sourcePath}`);
  }

  return `./${sourcePath.slice(docsPrefix.length)}`;
};

const buildBits = (): Record<BitName, Bit> => {
  const entries = sharedBitInventory.map((entry) => {
    const modulePath = toDocsModulePath(entry.sourcePath);
    const bitModule = bitModules[modulePath];
    const bitSource = bitSources[modulePath];

    if (!bitModule) {
      throw new Error(`Missing docs bit module for ${entry.sourcePath}`);
    }

    if (!bitSource) {
      throw new Error(`Missing docs bit source for ${entry.sourcePath}`);
    }

    return [
      entry.exportName,
      {
        ...bitModule,
        sourceCode: extractSource(bitSource),
      },
    ] as const;
  });

  return Object.fromEntries(entries) as Record<BitName, Bit>;
};

export type BitName = (typeof sharedBitInventory)[number]['exportName'];

export const bits = buildBits();

export const getBit = (name: BitName): Bit => bits[name];

export const getAllBits = (): Bit[] => Object.values(bits);

export const getBitsByTag = (tag: string): Bit[] =>
  getAllBits().filter(bit => bit.metadata.tags.includes(tag));

