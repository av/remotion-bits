import type {
  BitCatalogResolution,
  DocsBitCatalogData,
  FindBitsOptions,
  RemotionBitCatalogEntry,
  RemotionBitCatalogSummary,
} from './contracts';
import {
  findBits,
  getBitCatalogSummaries,
  getBitCatalogTags,
  getDocsBitCatalogData,
  listBitCatalog,
  resolveBitCatalogIdentifier,
} from '../../../src/catalog/shared';

export const fetchBit = async (
  identifier: string
): Promise<RemotionBitCatalogEntry | null> => {
  const resolution = resolveBitCatalogIdentifier(identifier);

  if (!resolution.entry) {
    return null;
  }

  if (typeof window !== 'undefined') {
    throw new Error('Bit source hydration is only available in Node runtimes.');
  }

  const { loadBitSource } = await import('./source-resolution');
  const sourceCode = await loadBitSource(resolution.entry.sourcePath);

  return {
    ...resolution.entry,
    sourceCode,
  };
};

export const hydrateBitCatalogEntry = async (
  identifier: string
): Promise<RemotionBitCatalogEntry | null> => fetchBit(identifier);

export {
  findBits,
  getBitCatalogSummaries,
  getBitCatalogTags,
  getDocsBitCatalogData,
  listBitCatalog,
  resolveBitCatalogIdentifier,
};