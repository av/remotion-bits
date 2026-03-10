import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type {
  BitCatalogResolution,
  RemotionBitCatalogEntry,
} from './contracts';
import {
  findBits,
  getBitCatalogSummaries,
  getBitCatalogTags,
  getDocsBitCatalogData,
  listBitCatalog,
  resolveBitCatalogIdentifier,
} from './shared';

const packageRoot = fileURLToPath(new URL('../../', import.meta.url));

const assertSafeSourcePath = (sourcePath: string): string => {
  const absolutePath = path.resolve(packageRoot, sourcePath);
  const relativePath = path.relative(packageRoot, absolutePath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new Error(`Bit source path resolves outside the package: ${sourcePath}`);
  }

  return absolutePath;
};

const readBitSource = (sourcePath: string): string =>
  fs.readFileSync(assertSafeSourcePath(sourcePath), 'utf8');

export const fetchBit = async (identifier: string): Promise<RemotionBitCatalogEntry | null> => {
  const resolution = resolveBitCatalogIdentifier(identifier);

  if (!resolution.entry) {
    return null;
  }

  return {
    ...resolution.entry,
    sourceCode: readBitSource(resolution.entry.sourcePath),
  };
};

export {
  findBits,
  getBitCatalogSummaries,
  getBitCatalogTags,
  getDocsBitCatalogData,
  listBitCatalog,
  resolveBitCatalogIdentifier,
};