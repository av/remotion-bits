// @vitest-environment node

import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { bits } from '../index';
import {
  fetchBit,
  findBits,
  getBitCatalogTags,
  getDocsBitCatalogData,
  getBitCatalogSummaries,
  listBitCatalog,
  resolveBitCatalogIdentifier,
} from '../catalog';
import { sharedBitInventory } from '../../../../src/catalog/inventory.generated';

const projectRoot = fileURLToPath(new URL('../../../../', import.meta.url));
const examplesRoot = path.join(projectRoot, 'docs', 'src', 'bits', 'examples');

const countExampleBits = (dirPath: string): number => {
  return readdirSync(dirPath, { withFileTypes: true }).reduce((total, entry) => {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      return total + countExampleBits(fullPath);
    }

    return entry.isFile() && entry.name.endsWith('.tsx') ? total + 1 : total;
  }, 0);
};

describe('bit catalog normalization', () => {
  it('covers every docs example bit with the shared inventory and docs loader', () => {
    const exportNames = Object.keys(bits).sort((left, right) => left.localeCompare(right));
    const inventoryNames = sharedBitInventory
      .map((entry) => entry.exportName)
      .sort((left, right) => left.localeCompare(right));
    const exampleCount = countExampleBits(examplesRoot);

    expect(sharedBitInventory).toHaveLength(exampleCount);
    expect(inventoryNames).toEqual(exportNames);
    expect(getBitCatalogSummaries()).toHaveLength(exportNames.length);
  });

  it('uses the canonical ids and export names from the shared inventory', () => {
    const summaries = getBitCatalogSummaries();
    const fadeIn = summaries.find((entry) => entry.exportName === 'FadeIn');
    const basicScene = summaries.find((entry) => entry.exportName === '3DBasic');
    const stepTimingContext = summaries.find((entry) => entry.exportName === 'StepTimingContext');

    expect(fadeIn?.id).toBe('bit-fade-in');
    expect(fadeIn?.sourcePath).toBe('docs/src/bits/examples/animated-text/FadeIn.tsx');
    expect(basicScene?.id).toBe('bit-3d-basic');
    expect(stepTimingContext?.id).toBe('bit-3d-step-timing-context');
    expect(bits['StepTimingContext']).toBeDefined();
  });

  it('resolves live catalog identifiers by id first, then by exact name', () => {
    const byId = resolveBitCatalogIdentifier('bit-fade-in');
    const byName = resolveBitCatalogIdentifier('Fade In');

    expect(byId.reason).toBe('id');
    expect(byId.entry?.exportName).toBe('FadeIn');
    expect(byName.reason).toBe('name');
    expect(byName.entry?.id).toBe('bit-fade-in');
  });

  it('lists summaries in deterministic shared-inventory order', () => {
    const listedIds = listBitCatalog().map((entry) => entry.id);
    const inventoryIds = sharedBitInventory.map((entry) => entry.id);

    expect(listedIds).toEqual(getBitCatalogSummaries().map((entry) => entry.id));
    expect(listedIds[0]).toBe(inventoryIds[0]);
    expect(listedIds.at(-1)).toBe(inventoryIds.at(-1));
  });

  it('finds bits deterministically across name, description, tags, and registry dependencies', () => {
    expect(findBits({ query: 'fade in', limit: 1 })[0]?.id).toBe('bit-fade-in');
    expect(findBits({ query: '3d cards', limit: 3 }).map((entry) => entry.id)).toContain(
      'bit-carousel-3d'
    );
    expect(findBits({ query: 'timing context' }).map((entry) => entry.id)).toContain(
      'bit-3d-step-timing-context'
    );
  });

  it('applies case-insensitive AND tag filtering before scoring', () => {
    const results = findBits({ query: 'opaque', tags: ['TEXT', 'FADE', 'BASIC'] });

    expect(results.map((entry) => entry.id)).toEqual(['bit-fade-in']);
  });

  it('returns the full filtered catalog when query is omitted', () => {
    const results = findBits({ tags: ['text'] });

    expect(results.length).toBeGreaterThan(1);
    expect(results.every((entry) => entry.tags.includes('text'))).toBe(true);
  });

  it('rejects invalid limits', () => {
    expect(() => findBits({ query: 'fade', limit: 0 })).toThrow(
      'findBits limit must be a positive integer.'
    );
  });

  it('derives docs catalog items and tags from the shared catalog data', () => {
    const docsData = getDocsBitCatalogData();
    const listedEntries = listBitCatalog();
    const fadeInListEntry = listedEntries.find((entry) => entry.id === 'bit-fade-in');
    const fadeInSearchEntry = findBits({ query: 'fade in', limit: 1 })[0];

    expect(docsData.items).toEqual(listedEntries);
    expect(docsData.tags).toEqual(getBitCatalogTags());
    expect(docsData.defaultOrder).toEqual(listedEntries.map((entry) => entry.id));
    expect(docsData.total).toBe(listedEntries.length);
    expect(fadeInSearchEntry).toEqual(fadeInListEntry);
  });

  it('fetches live entries by id and exact name', async () => {
    const byId = await fetchBit('bit-3d-step-timing-context');
    const byName = await fetchBit('Step-Aware Motion Timing');

    expect(byId?.id).toBe('bit-3d-step-timing-context');
    expect(byId?.exportName).toBe('StepTimingContext');
    expect(byName?.id).toBe('bit-3d-step-timing-context');
    expect(byId?.sourceCode).toContain('StaggeredMotion');
  });
});