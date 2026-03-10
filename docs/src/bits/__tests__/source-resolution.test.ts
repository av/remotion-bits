// @vitest-environment node

import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { hydrateBitCatalogEntry, getBitCatalogSummaries } from '../catalog';
import { getRepositoryRoot, loadBitSource, resolveBitSourcePath } from '../source-resolution';

describe('bit source resolution', () => {
  it('resolves repo-relative source paths inside the repository', () => {
    const fadeIn = getBitCatalogSummaries().find((entry) => entry.id === 'bit-3d-step-timing-context');

    expect(fadeIn).toBeDefined();
    expect(resolveBitSourcePath(fadeIn!.sourcePath)).toBe(
      path.join(getRepositoryRoot(), 'docs/src/bits/examples/scene-3d/StepTimingContext.tsx')
    );
  });

  it('loads live source directly from the example file path', async () => {
    const source = await loadBitSource('docs/src/bits/examples/scene-3d/StepTimingContext.tsx');

    expect(source).toContain('export const metadata = {');
    expect(source).toContain('name: "Step-Aware Motion Timing"');
    expect(source).toContain('export const Component: React.FC');
  });

  it('hydrates a live catalog entry with node-side source code', async () => {
    const bit = await hydrateBitCatalogEntry('bit-3d-step-timing-context');

    expect(bit).toMatchObject({
      id: 'bit-3d-step-timing-context',
      exportName: 'StepTimingContext',
      sourcePath: 'docs/src/bits/examples/scene-3d/StepTimingContext.tsx',
    });
    expect(bit?.sourceCode).toContain('registryDependencies: ["scene-3d", "animated-text", "staggered-motion"]');
  });
});