# TextTransition API Design v2

## Overview

This document outlines the redesigned API for the `TextTransition` component, moving from an array-based cycling approach to a more declarative, property-based animation system.

## Complete Type System

```typescript
// ============================================================================
// Core Animation Types
// ============================================================================

/**
 * Represents an animation value that can be:
 * - A static value
 * - An array of keyframe values [from, to] or [from, mid, to, ...]
 */
export type AnimationValue<T> = T | T[];

/**
 * Standard easing function names
 */
export type EasingFunction =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInQuint'
  | 'easeOutQuint'
  | 'easeInOutQuint'
  | 'easeInExpo'
  | 'easeOutExpo'
  | 'easeInOutExpo'
  | 'easeInCirc'
  | 'easeOutCirc'
  | 'easeInOutCirc'
  | 'easeInBack'
  | 'easeOutBack'
  | 'easeInOutBack'
  | 'easeInElastic'
  | 'easeOutElastic'
  | 'easeInOutElastic'
  | 'easeInBounce'
  | 'easeOutBounce'
  | 'easeInOutBounce';

/**
 * Custom interpolation function
 * @param progress - Value from 0 to 1 representing animation progress
 * @returns Interpolated value
 */
export type CustomInterpolator<T> = (progress: number) => T;

/**
 * Split mode for text animation
 */
export type SplitMode = 'none' | 'word' | 'character' | 'line';

/**
 * Frame range specification
 */
export type FrameRange = [start: number, end: number];

// ============================================================================
// Animatable Properties
// ============================================================================

/**
 * Transform properties that can be animated
 */
export interface TransformProperties {
  x?: AnimationValue<number>;
  y?: AnimationValue<number>;
  z?: AnimationValue<number>;
  scale?: AnimationValue<number>;
  scaleX?: AnimationValue<number>;
  scaleY?: AnimationValue<number>;
  scaleZ?: AnimationValue<number>;
  rotate?: AnimationValue<number>;
  rotateX?: AnimationValue<number>;
  rotateY?: AnimationValue<number>;
  rotateZ?: AnimationValue<number>;
  skewX?: AnimationValue<number>;
  skewY?: AnimationValue<number>;
}

/**
 * Visual style properties that can be animated
 */
export interface VisualProperties {
  opacity?: AnimationValue<number>;
  color?: AnimationValue<string>;
  backgroundColor?: AnimationValue<string>;
  blur?: AnimationValue<number>;
  brightness?: AnimationValue<number>;
  contrast?: AnimationValue<number>;
  saturate?: AnimationValue<number>;
  hueRotate?: AnimationValue<number>;
  grayscale?: AnimationValue<number>;
  sepia?: AnimationValue<number>;
}

/**
 * All animatable properties combined
 */
export type AnimatableProperties = TransformProperties & VisualProperties;

// ============================================================================
// Timing Configuration
// ============================================================================

/**
 * Timing configuration for animations
 */
export interface TimingConfig {
  /**
   * Frame range for the animation [start, end]
   * If not specified, uses the full composition duration
   */
  frames?: FrameRange;

  /**
   * Duration in frames
   * Alternative to frames range
   */
  duration?: number;

  /**
   * Start frame (delay)
   * Default: 0
   */
  delay?: number;

  /**
   * Stagger delay between split items in frames
   * Only applies when split is not 'none'
   * Default: 0
   */
  splitStagger?: number;
}

// ============================================================================
// Transition Configuration
// ============================================================================

/**
 * Complete transition configuration
 */
export interface TransitionConfig extends AnimatableProperties, TimingConfig {
  /**
   * How to split the text for animation
   * Default: 'none'
   */
  split?: SplitMode;

  /**
   * Easing function to use
   * Default: 'easeInOut'
   */
  easing?: EasingFunction | CustomInterpolator<number>;

  /**
   * Custom interpolation function for fine-grained control
   */
  interpolate?: CustomInterpolator<AnimatableProperties>;

  /**
   * Preserve whitespace in split text
   * Default: true
   */
  preserveWhitespace?: boolean;
}

// ============================================================================
// Text Cycling Support
// ============================================================================

/**
 * Configuration for cycling through multiple texts
 */
export interface TextCycleConfig {
  /**
   * Array of texts to cycle through
   */
  texts: string[];

  /**
   * Duration each text is displayed (in frames)
   */
  itemDuration: number;

  /**
   * Transition for entering text
   */
  enter?: TransitionConfig;

  /**
   * Transition for exiting text
   */
  exit?: TransitionConfig;

  /**
   * Whether to loop the cycle
   * Default: true
   */
  loop?: boolean;
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * Props for single text animation
 */
export interface SingleTextProps {
  /**
   * Text content to animate
   */
  children: React.ReactNode;

  /**
   * Transition configuration
   */
  transition?: TransitionConfig;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Additional inline styles (applied after animation)
   */
  style?: React.CSSProperties;

  /**
   * Wrapper element type
   * Default: 'span'
   */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Props for text cycling
 */
export interface CycleTextProps {
  /**
   * Text cycling configuration
   */
  cycle: TextCycleConfig;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Additional inline styles (applied after animation)
   */
  style?: React.CSSProperties;

  /**
   * Wrapper element type
   * Default: 'span'
   */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Complete TextTransition component props
 */
export type TextTransitionProps = SingleTextProps | CycleTextProps;

// ============================================================================
// Type Guards
// ============================================================================

export function isCycleTextProps(props: TextTransitionProps): props is CycleTextProps {
  return 'cycle' in props;
}

export function isAnimationValueArray<T>(value: AnimationValue<T>): value is T[] {
  return Array.isArray(value);
}
```

## Usage Examples

### 1. Basic Fade In

```typescript
<TextTransition transition={{ opacity: [0, 1] }}>
  Hello World
</TextTransition>
```

### 2. Slide In from Left

```typescript
<TextTransition
  transition={{
    opacity: [0, 1],
    x: [-400, 0],
    easing: 'easeInOut',
    duration: 60
  }}
>
  Sliding text
</TextTransition>
```

### 3. Word-by-Word Animation

```typescript
<TextTransition
  transition={{
    scale: [0, 1.2, 1],
    opacity: [0, 1],
    x: [-50, 0],
    split: 'word',
    splitStagger: 5,
    easing: 'easeOutBack'
  }}
>
  This appears word by word
</TextTransition>
```

### 4. Character Color Transition

```typescript
<TextTransition
  transition={{
    color: ['white', 'yellow', 'red'],
    split: 'character',
    splitStagger: 2,
    frames: [0, 60],
    easing: 'linear'
  }}
>
  Rainbow text effect
</TextTransition>
```

### 5. Complex Multi-Property Animation

```typescript
<TextTransition
  transition={{
    opacity: [0, 1, 1, 0],
    scale: [0.5, 1.1, 1, 0.8],
    y: [-100, 0, 0, 50],
    rotate: [-90, 0, 0, 90],
    blur: [10, 0, 0, 5],
    split: 'character',
    splitStagger: 3,
    frames: [30, 150],
    easing: 'easeInOutCubic'
  }}
>
  Dramatic entrance
</TextTransition>
```

### 6. Text Cycling (Backward Compatible)

```typescript
<TextTransition
  cycle={{
    texts: ['Create', 'Animate', 'Export', 'Share'],
    itemDuration: 45,
    enter: {
      opacity: [0, 1],
      y: [30, 0],
      duration: 15,
      easing: 'easeOut'
    },
    exit: {
      opacity: [1, 0],
      y: [0, -30],
      duration: 15,
      easing: 'easeIn'
    }
  }}
/>
```

### 7. Custom Interpolation

```typescript
<TextTransition
  transition={{
    split: 'character',
    splitStagger: 2,
    interpolate: (progress) => ({
      opacity: Math.sin(progress * Math.PI),
      scale: 1 + Math.sin(progress * Math.PI * 2) * 0.2,
      rotate: progress * 360,
      y: Math.sin(progress * Math.PI * 4) * 20
    })
  }}
>
  Custom wave effect
</TextTransition>
```

### 8. Line-by-Line Reveal

```typescript
<TextTransition
  transition={{
    opacity: [0, 1],
    x: [-100, 0],
    split: 'line',
    splitStagger: 10,
    easing: 'easeOut',
    frames: [20, 100]
  }}
>
  First line
  Second line
  Third line
</TextTransition>
```

### 9. Composition with Multiple Transitions

```typescript
// Using Remotion's Sequence for composition
<Sequence from={0} durationInFrames={60}>
  <TextTransition transition={{ opacity: [0, 1], y: [-50, 0] }}>
    First text
  </TextTransition>
</Sequence>

<Sequence from={60} durationInFrames={60}>
  <TextTransition transition={{ opacity: [0, 1], scale: [0, 1] }}>
    Second text
  </TextTransition>
</Sequence>
```

### 10. Conditional Animation

```typescript
function DynamicText({ show }: { show: boolean }) {
  return (
    <TextTransition
      transition={show ? {
        opacity: [0, 1],
        y: [-20, 0]
      } : {
        opacity: [1, 0],
        y: [0, 20]
      }}
    >
      Toggle text
    </TextTransition>
  );
}
```

## Edge Case Handling

### 1. Empty or Undefined Children

```typescript
// Renders nothing gracefully
<TextTransition transition={{ opacity: [0, 1] }}>
  {undefined}
</TextTransition>

// Empty string
<TextTransition transition={{ opacity: [0, 1] }}>
  {""}
</TextTransition>
```

### 2. Arrays of Children

```typescript
// Treats as single block
<TextTransition transition={{ opacity: [0, 1], split: 'word' }}>
  {['Hello', ' ', 'World']}
</TextTransition>

// Use React.Children utilities to normalize
```

### 3. Complex React Nodes

```typescript
// Non-string children - applies animation to wrapper
<TextTransition transition={{ opacity: [0, 1], scale: [0, 1] }}>
  <strong>Bold text</strong> with <em>emphasis</em>
</TextTransition>

// Split only works with plain text
// For complex nodes, split is ignored and animation applies to wrapper
```

### 4. Invalid Animation Values

```typescript
// Type system prevents most errors, but runtime validation:
// - Clamps opacity to [0, 1]
// - Validates color strings
// - Handles NaN/Infinity gracefully
<TextTransition transition={{ opacity: [-1, 2] }}> // Clamped to [0, 1]
  Text
</TextTransition>
```

### 5. Mismatched Keyframe Lengths

```typescript
// All property arrays should have same length
// If not, interpolation uses shortest length
<TextTransition
  transition={{
    opacity: [0, 1],        // 2 keyframes
    x: [-100, 0, 50, 0]     // 4 keyframes - will use 2
  }}
>
  Text
</TextTransition>
```

### 6. Split with Very Long Text

```typescript
// Performance consideration - warn/limit for large character counts
<TextTransition
  transition={{
    opacity: [0, 1],
    split: 'character',  // Monitors performance
    splitStagger: 1
  }}
>
  {veryLongText} {/* Warns if > 500 characters */}
</TextTransition>
```

## Comparison with Current API

### Current API (v1)

```typescript
<TextTransition
  texts={['Create', 'Animate', 'Export']}
  itemDurationInFrames={45}
  startAt={0}
  direction="up"
  offset={24}
  className="my-text"
  style={{ fontSize: '4rem' }}
/>
```

**Limitations:**
- Only supports text cycling
- Limited to 4 directions
- Single offset value
- No per-character/word animation
- No custom easing
- No complex multi-property animations
- Opacity curve is hardcoded

### New API (v2)

```typescript
// Same functionality with more control
<TextTransition
  cycle={{
    texts: ['Create', 'Animate', 'Export'],
    itemDuration: 45,
    enter: {
      opacity: [0, 1],
      y: [24, 0],
      duration: 9,  // 20% of 45
      easing: 'easeOut'
    },
    exit: {
      opacity: [1, 0],
      y: [0, -24],
      delay: 36,  // 80% of 45
      duration: 9,
      easing: 'easeIn'
    }
  }}
  className="my-text"
  style={{ fontSize: '4rem' }}
/>
```

**Advantages:**
- Single text or cycling
- Any direction/property
- Multiple simultaneous properties
- Per-character/word/line animation
- Custom easing and interpolation
- Full control over timing
- Extensible for new properties

## Migration Strategy

### Phase 1: Backward Compatibility Layer

Create a compatibility wrapper that transforms old API to new:

```typescript
/**
 * Backward compatible wrapper for v1 API
 * @deprecated Use new transition prop instead
 */
export interface TextTransitionLegacyProps {
  texts: string[];
  itemDurationInFrames?: number;
  startAt?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  offset?: number;
  className?: string;
  style?: React.CSSProperties;
}

function transformLegacyProps(
  props: TextTransitionLegacyProps
): CycleTextProps {
  const { texts, itemDurationInFrames = 45, startAt = 0, direction = 'up', offset = 24 } = props;

  const enterDuration = Math.round(itemDurationInFrames * 0.2);
  const exitDuration = enterDuration;

  const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
  const enterValue = direction === 'up' || direction === 'left' ? offset : -offset;
  const exitValue = direction === 'up' || direction === 'left' ? -offset : offset;

  return {
    cycle: {
      texts,
      itemDuration: itemDurationInFrames,
      enter: {
        opacity: [0, 1],
        [axis]: [enterValue, 0],
        duration: enterDuration,
        easing: 'easeOut'
      },
      exit: {
        opacity: [1, 0],
        [axis]: [0, exitValue],
        delay: itemDurationInFrames - exitDuration,
        duration: exitDuration,
        easing: 'easeIn'
      }
    },
    className: props.className,
    style: props.style
  };
}
```

### Phase 2: Deprecation Warnings

```typescript
export const TextTransition: React.FC<TextTransitionProps> = (props) => {
  // Detect legacy API usage
  if ('texts' in props) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'TextTransition: The array-based API is deprecated. ' +
        'Please use the new transition prop. See migration guide: https://...'
      );
    }
    return <TextTransitionCycle {...transformLegacyProps(props)} />;
  }

  // New API
  if ('cycle' in props) {
    return <TextTransitionCycle {...props} />;
  }

  return <TextTransitionSingle {...props} />;
};
```

### Phase 3: Codemod for Automated Migration

```typescript
// Codemod to transform legacy usage
// Example transformation:
// Before:
<TextTransition
  texts={['A', 'B']}
  itemDurationInFrames={60}
  direction="up"
  offset={30}
/>

// After:
<TextTransition
  cycle={{
    texts: ['A', 'B'],
    itemDuration: 60,
    enter: { opacity: [0, 1], y: [30, 0], duration: 12 },
    exit: { opacity: [1, 0], y: [0, -30], delay: 48, duration: 12 }
  }}
/>
```

### Phase 4: Documentation & Examples

1. Update README with new examples
2. Create migration guide document
3. Add TypeScript JSDoc with @example tags
4. Create video tutorials
5. Update demo/playground

### Phase 5: Version Roadmap

- **v2.0.0**: Introduce new API, keep legacy support with warnings
- **v2.1.0**: Add advanced features (custom interpolators, more easing)
- **v2.2.0**: Performance optimizations
- **v3.0.0**: Remove legacy API entirely (6+ months after v2.0.0)

## Implementation Considerations

### 1. Performance

- Use `React.memo` for split elements
- Implement windowing for large character counts
- Use `will-change` CSS property judiciously
- Debounce/throttle calculations for complex interpolations
- Cache split results when text doesn't change

### 2. Accessibility

- Preserve semantic HTML structure
- Maintain screen reader compatibility
- Ensure keyboard navigation isn't affected
- Support `prefers-reduced-motion` media query:

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Skip animations or use simplified versions
}
```

### 3. TypeScript Inference

The type system provides excellent inference:

```typescript
// TypeScript knows these are valid
<TextTransition transition={{ opacity: [0, 1], x: [-50, 0] }}>Text</TextTransition>

// TypeScript catches these errors
<TextTransition transition={{ invalid: [0, 1] }}>Text</TextTransition>
//                              ^^^^^^^ Error: Property 'invalid' does not exist

<TextTransition transition={{ opacity: 'invalid' }}>Text</TextTransition>
//                                      ^^^^^^^^^ Error: Type 'string' is not assignable
```

### 4. Default Values

Sensible defaults for common cases:

```typescript
const DEFAULT_TRANSITION: Required<TransitionConfig> = {
  split: 'none',
  easing: 'easeInOut',
  frames: undefined, // Use full composition
  duration: undefined,
  delay: 0,
  splitStagger: 0,
  preserveWhitespace: true,
  interpolate: undefined,
  // All animatable properties default to undefined (no animation)
};
```

### 5. Testing Strategy

```typescript
describe('TextTransition v2', () => {
  describe('Single text mode', () => {
    it('applies opacity animation', () => {});
    it('applies transform animations', () => {});
    it('handles split=word', () => {});
    it('handles split=character', () => {});
    it('applies stagger delays', () => {});
    it('respects frame ranges', () => {});
  });

  describe('Cycle mode', () => {
    it('cycles through texts', () => {});
    it('applies enter transitions', () => {});
    it('applies exit transitions', () => {});
    it('handles loop option', () => {});
  });

  describe('Edge cases', () => {
    it('handles empty children', () => {});
    it('handles array children', () => {});
    it('handles complex React nodes', () => {});
    it('handles invalid values gracefully', () => {});
  });

  describe('Legacy API', () => {
    it('transforms legacy props correctly', () => {});
    it('shows deprecation warning', () => {});
  });
});
```

## Future Extensions

### 1. Path Animations

```typescript
<TextTransition
  transition={{
    path: 'M 0,0 Q 50,-50 100,0',
    split: 'character',
    splitStagger: 3
  }}
>
  Text follows path
</TextTransition>
```

### 2. 3D Transforms

```typescript
<TextTransition
  transition={{
    perspective: 1000,
    rotateX: [-90, 0],
    z: [-200, 0],
    split: 'word'
  }}
>
  3D flip effect
</TextTransition>
```

### 3. Physics-Based Animations

```typescript
<TextTransition
  transition={{
    physics: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    },
    y: [-100, 0]
  }}
>
  Spring animation
</TextTransition>
```

### 4. Gesture Response

```typescript
<TextTransition
  transition={{
    interactive: true,
    onHover: { scale: [1, 1.1], color: ['white', 'yellow'] },
    onClick: { rotate: [0, 360] }
  }}
>
  Interactive text
</TextTransition>
```

### 5. Particle Effects

```typescript
<TextTransition
  transition={{
    exit: {
      type: 'explode',
      particles: 20,
      spread: 200
    },
    split: 'character'
  }}
>
  Exploding text
</TextTransition>
```

## Conclusion

This new API design provides:

✅ **Flexibility**: Support for any animation property combination
✅ **Simplicity**: Intuitive prop structure
✅ **Power**: Fine-grained control when needed
✅ **Type Safety**: Excellent TypeScript support
✅ **Backward Compatibility**: Clear migration path
✅ **Extensibility**: Easy to add new features
✅ **Performance**: Optimized for Remotion's rendering model
✅ **Developer Experience**: Great autocomplete and error messages

The design balances the simplicity of the original API with the power needed for complex animations, while providing a clear migration path for existing users.
