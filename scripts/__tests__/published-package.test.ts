// @vitest-environment node

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

type FindResult = {
  results: Array<{
    id: string;
    exportName: string;
    sourcePath: string;
  }>;
};

type FetchResult = {
  bit: {
    id: string;
    exportName: string;
    name: string;
    sourcePath: string;
    sourceCode: string;
  };
};

const repositoryRoot = fileURLToPath(new URL('../..', import.meta.url));
const examplesRoot = path.join(repositoryRoot, 'docs', 'src', 'bits', 'examples');

const normalizePath = (value: string): string => value.split(path.sep).join('/');

const listExampleSourcePaths = (dirPath: string): string[] => {
  return readdirSync(dirPath, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        return listExampleSourcePaths(fullPath);
      }

      if (entry.isFile() && entry.name.endsWith('.tsx')) {
        return [normalizePath(path.relative(repositoryRoot, fullPath))];
      }

      return [] as string[];
    })
    .sort((left, right) => left.localeCompare(right));
};

const parseJsonOutput = (output: string): unknown => {
  const trimmedOutput = output.trim();
  const candidateIndices = Array.from(
    new Set(
      trimmedOutput
        .split('')
        .map((character, index) => ({ character, index }))
        .filter(({ character }) => character === '{' || character === '[')
        .map(({ index }) => index)
    )
  );

  for (const candidateIndex of candidateIndices) {
    const candidate = trimmedOutput.slice(candidateIndex);

    try {
      return JSON.parse(candidate);
    } catch {
      continue;
    }
  }

  throw new Error(`No JSON payload found in command output:\n${output}`);
};

const runRepositoryJsonCommand = (args: string[]): unknown => {
  const output = execFileSync('npm', args, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  return parseJsonOutput(output);
};

const runTarballBackedCliJson = (tarballName: string, args: string[]): unknown => {
  const output = execFileSync(
    'npm',
    ['exec', '--yes', '--package', `./${tarballName}`, '--', 'remotion-bits', ...args],
    {
      cwd: repositoryRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  );

  return parseJsonOutput(output);
};

describe('published package integration', () => {
  it(
    'uses the packed CLI as the authoritative single-source-of-truth gate',
    () => {
      const expectedExamplePaths = listExampleSourcePaths(examplesRoot);
      const packResult = runRepositoryJsonCommand(['pack', '--json']) as Array<{ filename: string }>;
      const tarballName = packResult[0]?.filename;

      if (!tarballName) {
        throw new Error('npm pack did not produce a tarball filename.');
      }

      const tarballPath = path.join(repositoryRoot, tarballName);
      const extractRoot = mkdtempSync(path.join(tmpdir(), 'remotion-bits-pack-'));
      const packageDir = path.join(extractRoot, 'package');

      try {
        const tarEntries = execFileSync('tar', ['-tf', tarballPath], {
          cwd: repositoryRoot,
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'pipe'],
        })
          .trim()
          .split('\n')
          .filter(Boolean);

        expect(tarEntries).toContain('package/dist/bin/remotion-bits.js');

        const packagedExamplePaths = tarEntries
          .filter((entry) => entry.startsWith('package/docs/src/bits/examples/') && entry.endsWith('.tsx'))
          .map((entry) => entry.slice('package/'.length))
          .sort((left, right) => left.localeCompare(right));

        expect(packagedExamplePaths).toEqual(expectedExamplePaths);

        execFileSync('tar', ['-xf', tarballPath, '-C', extractRoot], {
          cwd: repositoryRoot,
          stdio: ['ignore', 'pipe', 'pipe'],
        });

        const findResult = runTarballBackedCliJson(tarballName, ['find', '--json']) as FindResult;
        const foundSourcePaths = findResult.results
          .map((entry) => entry.sourcePath)
          .sort((left, right) => left.localeCompare(right));

        expect(findResult.results).toHaveLength(expectedExamplePaths.length);
        expect(foundSourcePaths).toEqual(expectedExamplePaths);
        expect(new Set(findResult.results.map((entry) => entry.id)).size).toBe(findResult.results.length);

        const stepTimingSummary = findResult.results.find(
          (entry) => entry.id === 'bit-3d-step-timing-context'
        );
        expect(stepTimingSummary).toEqual(
          expect.objectContaining({
            id: 'bit-3d-step-timing-context',
            exportName: 'StepTimingContext',
            sourcePath: 'docs/src/bits/examples/scene-3d/StepTimingContext.tsx',
          })
        );

        const stepTimingDiscovery = runTarballBackedCliJson(tarballName, [
          'find',
          '--query',
          'Step-Aware Motion Timing',
          '--limit',
          '1',
          '--json',
        ]) as FindResult;

        expect(stepTimingDiscovery.results).toEqual([
          expect.objectContaining({
            id: 'bit-3d-step-timing-context',
            exportName: 'StepTimingContext',
            sourcePath: 'docs/src/bits/examples/scene-3d/StepTimingContext.tsx',
          }),
        ]);

        for (const expectedBit of [
          {
            id: 'bit-fade-in',
            exportName: 'FadeIn',
            sourcePath: 'docs/src/bits/examples/animated-text/FadeIn.tsx',
          },
          {
            id: 'bit-3d-step-timing-context',
            exportName: 'StepTimingContext',
            sourcePath: 'docs/src/bits/examples/scene-3d/StepTimingContext.tsx',
          },
          {
            id: 'bit-carousel-3d',
            exportName: 'Carousel',
            sourcePath: 'docs/src/bits/examples/scene-3d/Carousel.tsx',
          },
        ]) {
          const fetched = runTarballBackedCliJson(tarballName, [
            'fetch',
            expectedBit.id,
            '--json',
          ]) as FetchResult;
          const packagedSource = readFileSync(path.join(packageDir, expectedBit.sourcePath), 'utf8');

          expect(fetched.bit).toEqual(
            expect.objectContaining({
              id: expectedBit.id,
              exportName: expectedBit.exportName,
              sourcePath: expectedBit.sourcePath,
            })
          );
          expect(fetched.bit.sourceCode).toBe(packagedSource);
          expect(fetched.bit.sourceCode).toContain('export const metadata = {');
          expect(fetched.bit.sourceCode).toContain('export const Component');
        }

        const stepTimingFetch = runTarballBackedCliJson(tarballName, [
          'fetch',
          'bit-3d-step-timing-context',
          '--json',
        ]) as FetchResult;

        expect(stepTimingFetch.bit).toMatchObject({
          id: 'bit-3d-step-timing-context',
          exportName: 'StepTimingContext',
          name: 'Step-Aware Motion Timing',
          sourcePath: 'docs/src/bits/examples/scene-3d/StepTimingContext.tsx',
        });
      } finally {
        rmSync(extractRoot, { force: true, recursive: true });
        unlinkSync(tarballPath);
      }
    },
    120000
  );
});