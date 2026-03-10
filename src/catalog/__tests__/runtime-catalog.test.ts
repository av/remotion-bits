// @vitest-environment node

import { describe, expect, it } from 'vitest';

import { fetchBit, findBits, listBitCatalog, resolveBitCatalogIdentifier } from '../runtime';
import { sharedBitInventory } from '../inventory.generated';

describe('published runtime catalog', () => {
  it('finds fade in deterministically from the published registry and source files', () => {
    const results = findBits({ query: 'fade in', limit: 1 });

    expect(results).toEqual([
      expect.objectContaining({
        id: 'bit-fade-in',
        exportName: 'FadeIn',
        name: 'Fade In',
        sourcePath: 'docs/src/bits/examples/animated-text/FadeIn.tsx',
      }),
    ]);
  });

  it('supports 3d card-oriented discovery through runtime-safe data', () => {
    const ids = findBits({ query: '3d cards', limit: 3 }).map((entry) => entry.id);

    expect(ids).toContain('bit-carousel-3d');
  });

  it('includes the previously missing StepTimingContext bit in the shared runtime inventory', () => {
    expect(listBitCatalog()).toContainEqual(
      expect.objectContaining({
        id: 'bit-3d-step-timing-context',
        exportName: 'StepTimingContext',
        sourcePath: 'docs/src/bits/examples/scene-3d/StepTimingContext.tsx',
      })
    );
  });

  it('resolves identifiers by id and exact name', () => {
    expect(resolveBitCatalogIdentifier('bit-fade-in')).toMatchObject({
      reason: 'id',
      entry: expect.objectContaining({ id: 'bit-fade-in' }),
    });

    expect(resolveBitCatalogIdentifier('Fade In')).toMatchObject({
      reason: 'name',
      entry: expect.objectContaining({ id: 'bit-fade-in' }),
    });
  });

  it('fetches published source content for a bit', async () => {
    const bit = await fetchBit('bit-fade-in');

    expect(bit).toMatchObject({
      id: 'bit-fade-in',
      exportName: 'FadeIn',
      name: 'Fade In',
    });
    expect(bit?.sourceCode).toContain('export const metadata = {');
    expect(bit?.sourceCode).toContain('AnimatedText');
  });

  it('lists a non-empty catalog from the published runtime surface', () => {
    expect(listBitCatalog()).toHaveLength(sharedBitInventory.length);
  });
});