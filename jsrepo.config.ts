import { defineConfig } from "jsrepo";
import { repository } from "jsrepo/outputs";
import type { Transform } from "jsrepo";
import { InvalidImportWarning } from "jsrepo/warnings";

// Transform to rewrite barrel imports to direct file imports
function rewriteUtilsImports(): Transform {
  return {
    transform: async (code, fileName) => {
      // Only transform component files
      if (!fileName.endsWith(".tsx") && !fileName.endsWith(".ts")) {
        return {};
      }

      // Rewrite imports from "../utils" or "../utils/index" to "../utils/interpolate"
      let modifiedCode = code
        .replace(
          /from\s+["']\.\.\/utils["']/g,
          'from "../utils/interpolate"'
        )
        .replace(
          /from\s+["']\.\.\/utils\/index["']/g,
          'from "../utils/interpolate"'
        );

      // Return modified code if changes were made
      if (modifiedCode !== code) {
        return { code: modifiedCode };
      }

      return {};
    },
  };
}

export default defineConfig({
  registry: {
    name: "remotion-bits",
    outputs: [repository({ inline: true })],
    excludeDeps: ["react", "react-dom", "remotion"],
    transforms: [rewriteUtilsImports()],
    defaultPaths: {
      component: "src/components",
      util: "src/utils",
    },
    onwarn: (warning, handler) => {
      // Suppress warnings for barrel imports that will be transformed
      if (warning instanceof InvalidImportWarning) {
        if (warning.specifier === "../utils" || warning.specifier === "../utils/index") {
          return; // Don't log this warning
        }
      }
      // Log all other warnings
      handler(warning);
    },
    items: [
      {
        name: "text-transition",
        title: "Text Transition",
        description: "Animated text transitions for Remotion compositions.",
        type: "component",
        add: "when-added",
        dependencyResolution: "manual",
        registryDependencies: ["interpolate"],
        files: [
          {
            path: "src/components/TextTransition.tsx",
          },
        ],
      },
      {
        name: "backgrounds",
        title: "Backgrounds",
        description:
          "Gradient and solid background layers for Remotion scenes.",
        type: "component",
        add: "when-added",
        dependencyResolution: "manual",
        registryDependencies: ["interpolate"],
        files: [
          {
            path: "src/components/Backgrounds.tsx",
          },
        ],
      },
      {
        name: "hero-title",
        title: "Hero Title",
        description:
          "Hero-style heading with animated entrance and accent line.",
        type: "component",
        add: "when-added",
        dependencyResolution: "manual",
        registryDependencies: ["interpolate"],
        files: [
          {
            path: "src/components/HeroTitle.tsx",
          },
        ],
      },
      {
        name: "interpolate",
        title: "Interpolate",
        description:
          "Custom interpolate function with easing support and non-monotonic input ranges.",
        type: "util",
        add: "when-needed",
        files: [
          {
            path: "src/utils/interpolate.ts",
          },
        ],
      },
    ],
  },
});
