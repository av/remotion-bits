import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'remotion-bits': path.resolve(__dirname, 'src/index.ts'),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
      "scripts/**/*.test.ts",
      "docs/src/**/*.test.ts",
      "docs/src/**/*.test.tsx"
    ],
    globals: true,
    coverage: {
      reporter: ["text", "html"],
      exclude: ["templates/**"],
    },
  },
});
