import { defineConfig } from "jsrepo";
import { repository } from "jsrepo/outputs";
import type { Transform } from "jsrepo";
import { InvalidImportWarning } from "jsrepo/warnings";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// Load extracted bits if available
function loadExtractedBits() {
  const extractedBitsPath = join(process.cwd(), "extracted-bits.json");
  if (existsSync(extractedBitsPath)) {
    try {
      const content = readFileSync(extractedBitsPath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.warn("Failed to load extracted bits:", error);
      return [];
    }
  }
  return [];
}

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
      bit: "src/compositions",
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
        name: "animated-text",
        title: "Animated Text",
        description: "Character-by-character, word-by-word, or full text animations with staggering, easing, and transform controls.",
        type: "component",
        add: "when-added",
        dependencyResolution: "manual",
        registryDependencies: ["interpolate", "color"],
        files: [
          {
            path: "src/components/AnimatedText.tsx",
          },
        ],
      },
      {
        name: "gradient-transition",
        title: "Gradient Transition",
        description: "Smooth CSS gradient transitions with intelligent interpolation (linear, radial, conic).",
        type: "component",
        add: "when-added",
        dependencyResolution: "manual",
        registryDependencies: ["interpolate", "gradient"],
        dependencies: ["culori"],
        files: [
          {
            path: "src/components/GradientTransition.tsx",
          },
        ],
      },
      {
        name: "staggered-motion",
        title: "Staggered Motion",
        description: "Advanced motion and transform animations for child elements with stagger effects, directional timing, and easing control.",
        type: "component",
        add: "when-added",
        dependencyResolution: "manual",
        registryDependencies: ["interpolate", "motion"],
        files: [
          {
            path: "src/components/StaggeredMotion.tsx",
          },
        ],
      },
      {
        name: "particle-system",
        title: "Particle System",
        description: "Complete particle effect system with spawners, behaviors (gravity, drag, wiggle, scale, opacity), and deterministic simulation.",
        type: "component",
        add: "when-added",
        dependencyResolution: "manual",
        registryDependencies: ["random", "particles-utilities"],
        files: [
          {
            path: "src/components/ParticleSystem/Particles.tsx",
          },
          {
            path: "src/components/ParticleSystem/Spawner.tsx",
          },
          {
            path: "src/components/ParticleSystem/Behavior.tsx",
          },
          {
            path: "src/components/ParticleSystem/index.ts",
          },
        ],
      },
      {
        name: "scene-3d",
        title: "3D Scene System",
        description: "3D scene rendering with camera controls, steps, elements, transforms, and transitions.",
        type: "component",
        add: "when-added",
        dependencyResolution: "manual",
        registryDependencies: ["interpolate"],
        files: [
          {
            path: "src/components/Scene3D/Scene3D.tsx",
          },
          {
            path: "src/components/Scene3D/Step.tsx",
          },
          {
            path: "src/components/Scene3D/Element3D.tsx",
          },
          {
            path: "src/components/Scene3D/context.ts",
          },
          {
            path: "src/components/Scene3D/types.ts",
          },
          {
            path: "src/components/Scene3D/index.ts",
          },
        ],
      },
      {
        name: "use-viewport-rect",
        title: "useViewportRect Hook",
        description: "Hook to get the current video composition's viewport rectangle with responsive sizing utilities.",
        type: "hook",
        add: "when-needed",
        registryDependencies: ["geometry"],
        files: [
          {
            path: "src/hooks/useViewportRect.ts",
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
      {
        name: "color",
        title: "Color Interpolation",
        description:
          "Perceptually uniform color interpolation using Oklch color space via culori.",
        type: "util",
        add: "when-needed",
        dependencies: ["culori"],
        files: [
          {
            path: "src/utils/color.ts",
          },
          {
            path: "src/culori.d.ts",
          },
        ],
      },
      {
        name: "gradient",
        title: "Gradient Interpolation",
        description:
          "CSS gradient parser and interpolation with Granim.js-inspired mathematics.",
        type: "util",
        add: "when-needed",
        dependencyResolution: "manual",
        registryDependencies: ["interpolate", "color"],
        dependencies: ["culori"],
        files: [
          {
            path: "src/utils/gradient.ts",
          },
        ],
      },
      {
        name: "motion",
        title: "Motion Utilities",
        description:
          "Utilities for keyframe interpolation, easing, transform and style building, and motion timing calculations.",
        type: "util",
        add: "when-needed",
        registryDependencies: ["interpolate", "step-context"],
        files: [
          {
            path: "src/utils/motion/index.ts",
          },
        ],
      },
      {
        name: "step-context",
        title: "Step Context Utilities",
        description:
          "Context and hooks for accessing Scene3D Step timing information in nested components.",
        type: "util",
        add: "when-needed",
        files: [
          {
            path: "src/utils/StepContext.ts",
          },
        ],
      },
      {
        name: "geometry",
        title: "Geometry Utilities",
        description:
          "Utilities for geometric calculations: Rect class with viewport units (vh, vw, vmin, vmax), point/size handling, and relative value parsing.",
        type: "util",
        add: "when-needed",
        files: [
          {
            path: "src/utils/geometry.ts",
          },
        ],
      },
      {
        name: "random",
        title: "Random Utilities",
        description:
          "Utility functions for generating random floats, integers, and selecting random array elements.",
        type: "util",
        add: "when-needed",
        files: [
          {
            path: "src/utils/random.ts",
          },
        ],
      },
      {
        name: "particles-utilities",
        title: "Particles Utilities",
        description:
          "Core utilities for particle systems: types, behaviors (gravity, drag, wiggle, scale, opacity), and deterministic simulation.",
        type: "util",
        add: "when-needed",
        registryDependencies: ["random"],
        files: [
          {
            path: "src/utils/particles/types.ts",
          },
          {
            path: "src/utils/particles/behaviors.ts",
          },
          {
            path: "src/utils/particles/simulator.ts",
          },
          {
            path: "src/utils/particles/index.ts",
          },
        ],
      },
      // Dynamically loaded bits from extracted-bits.json
      ...loadExtractedBits(),
    ],
  },
});
