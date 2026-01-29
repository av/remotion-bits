/**
 * Unified Bit Metadata Configuration
 * Single source of truth for all bit definitions, metadata, and examples
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ControlOption {
  label: string;
  value: any;
}

export interface Control {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'color' | 'select';
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: ControlOption[];
}

export interface BitExample {
  id: string;
  name: string;
  description: string;
  tags: string[];
  duration: number;
  width?: number;
  height?: number;
  props?: Record<string, any>;
  controls?: Control[];
  sourceFile: string; // Path relative to docs/src/bits/
}

export interface BitMetadata {
  // Identity
  id: string; // kebab-case identifier
  name: string; // Display name
  description: string; // Brief description
  category: BitCategory; // Category for organization
  tags: string[]; // Searchable tags

  // Component info
  componentName: string; // TypeScript component name (e.g., AnimatedText)
  componentPath: string; // Relative path to component (e.g., src/components/AnimatedText.tsx)

  // Installation metadata
  registryName: string; // Registry identifier (kebab-case)
  registryDependencies: string[]; // Dependencies on other registry items
  npmDependencies?: string[]; // NPM package dependencies

  // Examples
  examples?: BitExample[]; // Associated example bits

  // Documentation
  apiReference?: string; // Path to API reference doc
}

export type BitCategory =
  | 'text-animation'
  | 'motion-animation'
  | 'background-effects'
  | 'particle-effects'
  | '3d-scenes'
  | 'hooks'
  | 'utilities';

// ============================================================================
// COMPONENTS
// ============================================================================

export const animated_text: BitMetadata = {
  id: 'animated-text',
  name: 'Animated Text',
  description: 'Character-by-character, word-by-word, or full text animations with staggering, easing, and transform controls.',
  category: 'text-animation',
  tags: ['text', 'animation', 'stagger', 'fade', 'transform', 'character', 'word'],

  componentName: 'AnimatedText',
  componentPath: 'src/components/AnimatedText.tsx',

  registryName: 'animated-text',
  registryDependencies: ['interpolate', 'color'],

  examples: [
    {
      id: 'fade-in',
      name: 'Fade In',
      description: 'Simple fade-in text animation from transparent to opaque',
      tags: ['text', 'fade', 'basic'],
      duration: 90,
      width: 1920,
      height: 1080,
      sourceFile: 'examples/animated-text/FadeIn.tsx',
    },
    {
      id: 'word-by-word',
      name: 'Word By Word',
      description: 'Animate text word by word with customizable timing',
      tags: ['text', 'word', 'stagger'],
      duration: 120,
      width: 1920,
      height: 1080,
      sourceFile: 'examples/animated-text/WordByWord.tsx',
    },
    {
      id: 'char-by-char',
      name: 'Char By Char',
      description: 'Animate text character by character with timing control',
      tags: ['text', 'character', 'stagger'],
      duration: 150,
      width: 1920,
      height: 1080,
      sourceFile: 'examples/animated-text/CharByChar.tsx',
    },
    {
      id: 'blur-slide-word',
      name: 'Blur Slide Word',
      description: 'Blur and slide word animation for text transitions',
      tags: ['text', 'blur', 'slide', 'word'],
      duration: 100,
      width: 1920,
      height: 1080,
      sourceFile: 'examples/animated-text/BlurSlideWord.tsx',
    },
  ],

  apiReference: 'docs/src/content/docs/reference/animated-text.mdx',
};

export const staggered_motion: BitMetadata = {
  id: 'staggered-motion',
  name: 'Staggered Motion',
  description: 'Advanced motion and transform animations for child elements with stagger effects, directional timing, and easing control.',
  category: 'motion-animation',
  tags: ['motion', 'stagger', 'transform', 'children', 'animation', 'timing'],

  componentName: 'StaggeredMotion',
  componentPath: 'src/components/StaggeredMotion.tsx',

  registryName: 'staggered-motion',
  registryDependencies: ['interpolate', 'motion'],

  examples: [
    {
      id: 'staggered-fade-in',
      name: 'Staggered Fade In',
      description: 'Fade in child elements with staggered timing',
      tags: ['fade', 'stagger', 'children'],
      duration: 120,
      width: 1920,
      height: 1080,
      sourceFile: 'examples/staggered-motion/StaggeredFadeIn.tsx',
    },
    {
      id: 'slide-from-left',
      name: 'Slide From Left',
      description: 'Slide child elements from left with staggered animation',
      tags: ['slide', 'transform', 'stagger'],
      duration: 100,
      width: 1920,
      height: 1080,
      sourceFile: 'examples/staggered-motion/SlideFromLeft.tsx',
    },
  ],

  apiReference: 'docs/src/content/docs/reference/staggered-motion.mdx',
};

export const gradient_transition: BitMetadata = {
  id: 'gradient-transition',
  name: 'Gradient Transition',
  description: 'Smooth CSS gradient transitions with intelligent interpolation (linear, radial, conic).',
  category: 'background-effects',
  tags: ['gradient', 'background', 'color', 'transition', 'interpolation', 'css'],

  componentName: 'GradientTransition',
  componentPath: 'src/components/GradientTransition.tsx',

  registryName: 'gradient-transition',
  registryDependencies: ['interpolate', 'gradient'],
  npmDependencies: ['culori'],

  examples: [
    {
      id: 'linear-gradient',
      name: 'Linear Gradient',
      description: 'Linear gradient animation with smooth color transitions',
      tags: ['gradient', 'linear', 'color'],
      duration: 120,
      width: 1920,
      height: 1080,
      sourceFile: 'examples/gradient-transition/LinearGradient.tsx',
    },
    {
      id: 'radial-gradient',
      name: 'Radial Gradient',
      description: 'Radial gradient animation from center outward',
      tags: ['gradient', 'radial', 'color'],
      duration: 120,
      width: 1920,
      height: 1080,
      sourceFile: 'examples/gradient-transition/RadialGradient.tsx',
    },
    {
      id: 'conic-gradient',
      name: 'Conic Gradient',
      description: 'Conic gradient animation for rotating color effects',
      tags: ['gradient', 'conic', 'color'],
      duration: 120,
      width: 1920,
      height: 1080,
      sourceFile: 'examples/gradient-transition/ConicGradient.tsx',
    },
  ],

  apiReference: 'docs/src/content/docs/reference/gradient-transition.mdx',
};

export const particle_system: BitMetadata = {
  id: 'particle-system',
  name: 'Particle System',
  description: 'Complete particle effect system with spawners, behaviors (gravity, drag, wiggle, scale, opacity), and deterministic simulation.',
  category: 'particle-effects',
  tags: ['particles', 'effects', 'physics', 'animation', 'spawner', 'simulation'],

  componentName: 'ParticleSystem',
  componentPath: 'src/components/ParticleSystem/index.ts',

  registryName: 'particle-system',
  registryDependencies: ['random', 'particles-utilities'],

  examples: [
    {
      id: 'particles-snow',
      name: 'Snow Effect',
      description: 'Falling snow particle animation',
      tags: ['particles', 'snow', 'effects'],
      duration: 300,
      width: 1920,
      height: 1080,
      sourceFile: 'examples/particle-system/ParticlesSnow.tsx',
    },
    {
      id: 'particles-fountain',
      name: 'Fountain Effect',
      description: 'Particle fountain with gravity physics',
      tags: ['particles', 'fountain', 'physics'],
      duration: 240,
      width: 1920,
      height: 1080,
      sourceFile: 'examples/particle-system/ParticlesFountain.tsx',
    },
    {
      id: 'particles-grid',
      name: 'Grid Pattern',
      description: 'Grid-aligned particle animation',
      tags: ['particles', 'grid', 'pattern'],
      duration: 180,
      width: 1920,
      height: 1080,
      sourceFile: 'examples/particle-system/ParticlesGrid.tsx',
    },
  ],

  apiReference: 'docs/src/content/docs/reference/particle-system.mdx',
};

export const scene_3d: BitMetadata = {
  id: 'scene-3d',
  name: '3D Scene',
  description: '3D presentation scenes with camera controls, steps, elements, transforms, and transitions (impress.js-style).',
  category: '3d-scenes',
  tags: ['3d', 'camera', 'presentation', 'transform', 'scene', 'animation'],

  componentName: 'Scene3D',
  componentPath: 'src/components/Scene3D/index.ts',

  registryName: 'scene-3d',
  registryDependencies: ['interpolate'],

  examples: [
    {
      id: '3d-basic',
      name: '3D Basic',
      description: 'Basic 3D camera transitions between steps',
      tags: ['3d', 'camera', 'basic'],
      duration: 150,
      width: 1920,
      height: 1080,
      sourceFile: 'examples/scene-3d/3DBasic.tsx',
    },
    {
      id: 'flying-through-words',
      name: 'Flying Through Words',
      description: 'Fly through 3D text elements with camera',
      tags: ['3d', 'text', 'camera'],
      duration: 180,
      width: 1920,
      height: 1080,
      sourceFile: 'examples/scene-3d/FlyingThroughWords.tsx',
    },
    {
      id: '3d-elements',
      name: '3D Elements',
      description: 'Multiple 3D elements with camera transitions',
      tags: ['3d', 'elements', 'camera'],
      duration: 200,
      width: 1920,
      height: 1080,
      sourceFile: 'examples/scene-3d/3DElements.tsx',
    },
  ],

  apiReference: 'docs/src/content/docs/reference/scene-3d.mdx',
};

// ============================================================================
// HOOKS
// ============================================================================

export const use_viewport_rect: BitMetadata = {
  id: 'use-viewport-rect',
  name: 'useViewportRect Hook',
  description: 'Hook to get the current video composition\'s viewport rectangle with responsive sizing utilities.',
  category: 'hooks',
  tags: ['hook', 'viewport', 'responsive', 'utility'],

  componentName: 'useViewportRect',
  componentPath: 'src/hooks/useViewportRect.ts',

  registryName: 'use-viewport-rect',
  registryDependencies: ['geometry'],

  apiReference: 'docs/src/content/docs/reference/use-viewport-rect.mdx',
};

// ============================================================================
// UTILITIES
// ============================================================================

export const interpolate: BitMetadata = {
  id: 'interpolate',
  name: 'Interpolate',
  description: 'Custom interpolate function with easing support and non-monotonic input ranges.',
  category: 'utilities',
  tags: ['utility', 'interpolation', 'easing', 'animation'],

  componentName: 'interpolate',
  componentPath: 'src/utils/interpolate.ts',

  registryName: 'interpolate',
  registryDependencies: [],

  apiReference: 'docs/src/content/docs/reference/interpolate.mdx',
};

export const color: BitMetadata = {
  id: 'color',
  name: 'Color Interpolation',
  description: 'Perceptually uniform color interpolation using Oklch color space via culori.',
  category: 'utilities',
  tags: ['utility', 'color', 'interpolation'],

  componentName: 'color',
  componentPath: 'src/utils/color.ts',

  registryName: 'color',
  registryDependencies: [],
  npmDependencies: ['culori'],

  apiReference: 'docs/src/content/docs/reference/color.mdx',
};

export const gradient: BitMetadata = {
  id: 'gradient',
  name: 'Gradient Interpolation',
  description: 'CSS gradient parser and interpolation with Granim.js-inspired mathematics.',
  category: 'utilities',
  tags: ['utility', 'gradient', 'interpolation', 'css'],

  componentName: 'gradient',
  componentPath: 'src/utils/gradient.ts',

  registryName: 'gradient',
  registryDependencies: ['interpolate', 'color'],
  npmDependencies: ['culori'],

  apiReference: 'docs/src/content/docs/reference/gradient.mdx',
};

export const motion: BitMetadata = {
  id: 'motion',
  name: 'Motion Utilities',
  description: 'Utilities for keyframe interpolation, easing, transform and style building, and motion timing calculations.',
  category: 'utilities',
  tags: ['utility', 'motion', 'transform', 'easing'],

  componentName: 'motion',
  componentPath: 'src/utils/motion/index.ts',

  registryName: 'motion',
  registryDependencies: ['interpolate'],

  apiReference: 'docs/src/content/docs/reference/motion.mdx',
};

export const geometry: BitMetadata = {
  id: 'geometry',
  name: 'Geometry Utilities',
  description: 'Utilities for geometric calculations: Rect class with viewport units (vh, vw, vmin, vmax), point/size handling, and relative value parsing.',
  category: 'utilities',
  tags: ['utility', 'geometry', 'viewport', 'calculations'],

  componentName: 'geometry',
  componentPath: 'src/utils/geometry.ts',

  registryName: 'geometry',
  registryDependencies: [],

  apiReference: 'docs/src/content/docs/reference/geometry.mdx',
};

export const random: BitMetadata = {
  id: 'random',
  name: 'Random Utilities',
  description: 'Utility functions for generating random floats, integers, and selecting random array elements.',
  category: 'utilities',
  tags: ['utility', 'random', 'math'],

  componentName: 'random',
  componentPath: 'src/utils/random.ts',

  registryName: 'random',
  registryDependencies: [],

  apiReference: 'docs/src/content/docs/reference/random.mdx',
};

export const particles_utilities: BitMetadata = {
  id: 'particles-utilities',
  name: 'Particles Utilities',
  description: 'Core utilities for particle systems: types, behaviors (gravity, drag, wiggle, scale, opacity), and deterministic simulation.',
  category: 'utilities',
  tags: ['utility', 'particles', 'physics', 'simulation'],

  componentName: 'particles',
  componentPath: 'src/utils/particles/index.ts',

  registryName: 'particles-utilities',
  registryDependencies: ['random'],

  apiReference: 'docs/src/content/docs/reference/particles-utilities.mdx',
};

// ============================================================================
// REGISTRY
// ============================================================================

export const bits = {
  'animated-text': animated_text,
  'staggered-motion': staggered_motion,
  'gradient-transition': gradient_transition,
  'particle-system': particle_system,
  'scene-3d': scene_3d,
  'use-viewport-rect': use_viewport_rect,
  'interpolate': interpolate,
  'color': color,
  'gradient': gradient,
  'motion': motion,
  'geometry': geometry,
  'random': random,
  'particles-utilities': particles_utilities,
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a bit by its ID
 */
export function getBitById(id: keyof typeof bits): BitMetadata | undefined {
  return bits[id];
}

/**
 * Get a bit by its registry name
 */
export function getBitByRegistryName(name: string): BitMetadata | undefined {
  return Object.values(bits).find(bit => bit.registryName === name);
}

/**
 * Get all bits in a category
 */
export function getBitsByCategory(category: BitCategory): BitMetadata[] {
  return Object.values(bits).filter(bit => bit.category === category);
}

/**
 * Get all components (non-utility, non-hook bits)
 */
export function getAllComponents(): BitMetadata[] {
  return Object.values(bits).filter(
    bit => bit.category !== 'utilities' && bit.category !== 'hooks'
  );
}

/**
 * Get all utilities
 */
export function getAllUtilities(): BitMetadata[] {
  return getBitsByCategory('utilities');
}

/**
 * Get all hooks
 */
export function getAllHooks(): BitMetadata[] {
  return getBitsByCategory('hooks');
}

/**
 * Get all bits with examples
 */
export function getAllExamples(): BitExample[] {
  const examples: BitExample[] = [];
  Object.values(bits).forEach(bit => {
    if (bit.examples) {
      examples.push(...bit.examples);
    }
  });
  return examples;
}

/**
 * Get an example by its ID
 */
export function getExampleById(id: string): BitExample | undefined {
  return getAllExamples().find(ex => ex.id === id);
}

/**
 * Get examples for a specific bit
 */
export function getBitExamples(bitId: keyof typeof bits): BitExample[] {
  const bit = bits[bitId];
  return bit?.examples ?? [];
}

/**
 * Get bits by tag
 */
export function getBitsByTag(tag: string): BitMetadata[] {
  return Object.values(bits).filter(bit => bit.tags.includes(tag));
}
