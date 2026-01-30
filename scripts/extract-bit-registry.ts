#!/usr/bin/env tsx
/**
 * Extract bit registry entries from metadata in example files
 *
 * Scans docs/src/bits/examples/ for .tsx files containing metadata.registry
 * and extracts them for inclusion in jsrepo.config.ts
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = join(__dirname, "..");
const examplesDir = join(projectRoot, "docs/src/bits/examples");
const outputFile = join(projectRoot, "extracted-bits.json");

interface RegistryItem {
  name: string;
  title: string;
  description: string;
  type: "bit" | "component" | "util" | "hook";
  add: "when-needed" | "when-added";
  registryDependencies?: string[];
  dependencies?: string[];
  files: Array<{ path: string }>;
}

async function findTsxFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  async function scan(currentDir: string): Promise<void> {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
        files.push(fullPath);
      }
    }
  }

  await scan(dir);
  return files;
}

function extractMetadata(content: string): RegistryItem | null {
  // Look for metadata export with registry field
  const metadataMatch = content.match(/export\s+const\s+metadata\s*=\s*({[\s\S]*?^};)/m);
  if (!metadataMatch) return null;

  const metadataStr = metadataMatch[1];

  // Check if registry field exists
  if (!metadataStr.includes("registry:")) return null;

  // Extract the registry object - find the opening brace after registry:
  // and match until the corresponding closing brace
  const registryStart = metadataStr.indexOf("registry:");
  const afterRegistry = metadataStr.substring(registryStart + "registry:".length).trim();

  // Find the opening brace
  if (!afterRegistry.startsWith("{")) return null;

  // Count braces to find the matching closing brace
  let braceCount = 0;
  let endIndex = -1;

  for (let i = 0; i < afterRegistry.length; i++) {
    if (afterRegistry[i] === "{") braceCount++;
    if (afterRegistry[i] === "}") {
      braceCount--;
      if (braceCount === 0) {
        endIndex = i + 1;
        break;
      }
    }
  }

  if (endIndex === -1) return null;

  const registryStr = afterRegistry.substring(0, endIndex);

  try {
    // Remove TypeScript-specific syntax that JavaScript eval can't handle
    const cleanedStr = registryStr.replace(/\s+as\s+const/g, "");

    // biome-ignore lint: eval used for controlled object parsing
    const registry = eval(`(${cleanedStr})`) as RegistryItem;

    // Validate required fields
    const required = ["name", "title", "description", "type", "add", "files"];
    for (const field of required) {
      if (!(field in registry)) {
        console.warn(`Missing required field "${field}" in registry`);
        return null;
      }
    }

    return registry;
  } catch (error) {
    console.error("Failed to parse registry metadata:", error);
    return null;
  }
}

async function main() {
  console.log("Scanning for bit examples with registry metadata...");

  const tsxFiles = await findTsxFiles(examplesDir);
  console.log(`Found ${tsxFiles.length} .tsx files`);

  const registryItems: RegistryItem[] = [];

  for (const filePath of tsxFiles) {
    const relativePath = relative(projectRoot, filePath);
    const content = await readFile(filePath, "utf-8");
    const registry = extractMetadata(content);

    if (registry) {
      console.log(`✓ Extracted: ${registry.name} from ${relativePath}`);
      registryItems.push(registry);
    }
  }

  console.log(`\nExtracted ${registryItems.length} bit(s)`);

  // Write to JSON file for manual integration or automated processing
  await writeFile(outputFile, JSON.stringify(registryItems, null, 2));
  console.log(`\nWrote extracted bits to: ${relative(projectRoot, outputFile)}`);
  console.log("\nTo integrate into jsrepo.config.ts, add these items to the items array.");
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
