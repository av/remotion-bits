#!/usr/bin/env tsx

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateSharedBitInventory } from './generate-shared-bit-inventory';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const outputFile = path.join(projectRoot, 'extracted-bits.json');

const main = async (): Promise<void> => {
  const entries = await generateSharedBitInventory();
  const registryItems = entries.map((entry) => entry.registry);

  await writeFile(outputFile, `${JSON.stringify(registryItems, null, 2)}\n`);
  console.log(`Wrote ${registryItems.length} extracted bit(s) to ${path.relative(projectRoot, outputFile)}`);
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
