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
        registryDependencies: ["interpolate", "color"],
        files: [
          {
            path: "src/components/TextTransition.tsx",
          },
        ],
      },
      {
        name: "background-transition",
        title: "Background Transition",
        description: "Smooth CSS gradient transitions with intelligent interpolation (linear, radial, conic).",
        type: "component",
        add: "when-added",
        dependencyResolution: "manual",
        registryDependencies: ["interpolate", "gradient"],
        dependencies: ["culori"],
        files: [
          {
            path: "src/components/BackgroundTransition.tsx",
          },
        ],
      },
      {
        name: "motion-transition",
        title: "Motion Transition",
        description: "Advanced motion and transform animations with stagger effects and easing control.",
        type: "component",
        add: "when-added",
        dependencyResolution: "manual",
        registryDependencies: ["interpolate", "motion"],
        files: [
          {
            path: "src/components/MotionTransition.tsx",
          },
        ],
      },
      {
        name: "particles",
        title: "Particles System",
        description: "Particle effect system with spawners, behaviors (gravity, drag, wiggle, scale, opacity), and deterministic simulation.",
        type: "component",
        add: "when-added",
        dependencyResolution: "manual",
        registryDependencies: ["random", "particles-utilities"],
        files: [
          {
            path: "src/components/Particles/Particles.tsx",
          },
          {
            path: "src/components/Particles/Spawner.tsx",
          },
          {
            path: "src/components/Particles/Behavior.tsx",
          },
          {
            path: "src/components/Particles/index.ts",
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
        registryDependencies: ["interpolate"],
        files: [
          {
            path: "src/utils/motion/index.ts",
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
    ],
  },
});
