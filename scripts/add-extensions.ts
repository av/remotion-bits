import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "../dist");

/**
 * Add .js extensions to relative imports in ESM modules
 * This is required for strict ESM mode (when package.json has "type": "module")
 */
function addExtensionsToFile(filePath: string): void {
  let content = fs.readFileSync(filePath, "utf-8");
  const originalContent = content;
  const fileDir = path.dirname(filePath);

  // Match import/export statements with relative paths
  // Matches: from "./foo" or from './foo' (but not "./foo.js" or "./foo/bar.js")
  content = content.replace(
    /from\s+["'](\.[^"']*?)["']/g,
    (match, importPath) => {
      // Skip if already has an extension
      if (/\.(js|ts|jsx|tsx|json)['"]$/.test(match)) {
        return match;
      }
      // Skip if it's a package name (doesn't start with .)
      if (!importPath.startsWith(".")) {
        return match;
      }

      // Check if this is a directory import (no file extension and likely a directory)
      const resolvedPath = path.resolve(fileDir, importPath);
      const stats = fs.existsSync(resolvedPath)
        ? fs.statSync(resolvedPath)
        : null;

      if (stats?.isDirectory()) {
        // Directory import - use /index.js
        return `from "${importPath}/index.js"`;
      } else {
        // File import - add .js extension
        return `from "${importPath}.js"`;
      }
    }
  );

  // Only write if content changed
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`✓ Updated: ${path.relative(distDir, filePath)}`);
  }
}

function processDirectory(dir: string): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.name.endsWith(".js") && !entry.name.endsWith(".d.ts")) {
      addExtensionsToFile(fullPath);
    }
  }
}

// Process the dist directory
if (fs.existsSync(distDir)) {
  console.log("Adding .js extensions to ESM imports...");
  processDirectory(distDir);
  console.log("Done!");
} else {
  console.error(`dist directory not found at ${distDir}`);
  process.exit(1);
}
