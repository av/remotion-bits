import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));

const assertSafeSourcePath = (sourcePath: string): string => {
  const absolutePath = path.resolve(repoRoot, sourcePath);
  const relativePath = path.relative(repoRoot, absolutePath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new Error(`Bit source path resolves outside the repository: ${sourcePath}`);
  }

  return absolutePath;
};

export const getRepositoryRoot = (): string => repoRoot;

export const resolveBitSourcePath = (sourcePath: string): string =>
  assertSafeSourcePath(sourcePath);

export const loadBitSource = async (sourcePath: string): Promise<string> => {
  const absolutePath = resolveBitSourcePath(sourcePath);
  return readFile(absolutePath, 'utf8');
};