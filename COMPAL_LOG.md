# Compound Engineering Log

This file tracks architectural patterns, lessons learned, and key insights for the remotion-bits project.

## Core Principles

### Extract Before Duplicating (NEW PATTERN - 2026-01-25)

**When building similar components, extract shared logic into reusable utilities FIRST.**

This principle was applied when implementing MotionTransition alongside TextTransition:

- **Identify duplication**: Both components needed frame-based timing, transform building, keyframe interpolation, and easing
- **Extract early**: Created `src/utils/motion/` framework with `useMotionTiming` hook, `buildTransformString`, and `buildMotionStyles` utilities
- **Refactor existing code**: Updated TextTransition to use the new framework, eliminating ~150 lines of duplicated logic
- **Build new features**: MotionTransition automatically inherits all animation capabilities without reimplementing them
- **Result**: Single source of truth for animation logic, easier testing, consistent behavior across components

**Red flags**: "I'll copy-paste and modify this code", "Both components need slightly different things", "I'll refactor later"

**Green flags**: "What logic is truly shared?", "Can this be a reusable utility?", "How would a third component use this?"

> Code duplication compounds technical debt exponentially. Shared utilities compound knowledge linearly. Choose wisely.

### Research Before Building (CRITICAL)

**Always investigate existing robust solutions before implementing custom code.** This principle saved hours on the BackgroundTransition implementation:

- **Research first**: Found Granim.js (5.3k+ stars), studied their gradient interpolation algorithms
- **Learn from proven patterns**: Extracted angle wraparound logic, position normalization, edge case handling
- **Adapt intelligently**: Used their math but adapted to Remotion's frame-based architecture + culori's Oklch colors
- **Result**: Avoided bugs like wrong angle direction (270° vs 90°), discovered edge cases (180° ambiguity, mismatched stops)

**Red flags**: "I'll figure it out myself", "How hard can it be?", rejecting research as "not invented here"

**Green flags**: "How do established libraries solve this?", "What can I learn from their source code?", "Can I reuse proven algorithms?"

> Standing on the shoulders of giants is engineering wisdom, not laziness. Build on proven foundations, then innovate on top.

---

## Patterns

### Custom CSS Gradient Parser and Interpolation (2026-01-25)

**Context:** BackgroundTransition component needed to smoothly transition between CSS gradients frame-by-frame for Remotion video rendering. This required parsing complex CSS gradient strings and intelligently interpolating between them.

**Problem:**
- CSS gradients have complex syntax (linear, radial, conic)
- Varying numbers of color stops between keyframes
- Missing color stop positions need auto-distribution
- Angle interpolation should take shortest path (350°→10° via 0°, not 180°)
- Gradient type transitions (linear→radial) need smooth handling
- No external CSS gradient parser library was used (per requirements)

**Solution:** Built a custom CSS gradient parser and interpolation system inspired by Granim.js mathematics, using culori's Oklch for color interpolation.

**Implementation:**

1. **Custom Gradient Parser** (`src/utils/gradient.ts`):
```typescript
// Supports linear-gradient, radial-gradient, conic-gradient
export function parseGradient(gradientString: string): ParsedGradient | null
// Handles: angles, directions, shapes, positions, color stops with/without positions
```

2. **Granim.js-Inspired Math**:
```typescript
// Auto-distribute missing color stop positions
export function normalizeColorStops(stops: ColorStop[]): ColorStop[]

// Shortest-path angle interpolation (350°→10° = 20° path, not 340°)
export function interpolateAngle(from: number, to: number, progress: number): number

// Pad or resample stops to match counts
export function matchColorStopCount(stops: ColorStop[], targetCount: number): ColorStop[]
```

3. **Gradient Interpolation**:
```typescript
// Core interpolation between two gradients
export function interpolateGradients(
  from: ParsedGradient,
  to: ParsedGradient,
  progress: number,
  easingFn?: EasingFunction
): ParsedGradient

// Multi-keyframe support (matching color.ts pattern)
export function interpolateGradientKeyframes(
  gradients: string[],
  progress: number,
  easingFn?: EasingFunction
): string
```

4. **Frame-Based Component**:
```typescript
export const BackgroundTransition: React.FC<BackgroundTransitionProps> = ({
  gradient,  // Array of CSS gradient strings
  frames,    // Optional [start, end] range
  duration,  // Or duration in frames
  delay,
  easing,
  ...
}) => {
  const frame = useCurrentFrame();
  const progress = calculateProgress(frame);
  const interpolatedGradient = interpolateGradientKeyframes(gradient, progress, easingFn);
  return <div style={{ background: interpolatedGradient }}>{children}</div>;
};
```

**Key Features:**
- **No external parser dependency**: Pure TypeScript implementation
- **Handles complex syntax**: `radial-gradient(circle at 50% 50%, rgba(255,0,0,0.5), hsl(240, 100%, 50%))`
- **Shortest-path angle interpolation**: 350°→10° goes through 0° (20° path) instead of 180° (340° path)
- **Perceptually uniform colors**: Uses culori's Oklch interpolation from existing `color.ts`
- **Auto-position distribution**: Missing stop positions auto-calculated evenly
- **Mismatched stop counts**: Pads or resamples intelligently
- **Type transitions**: Linear→radial switches at progress 0.5
- **Frame-deterministic**: Each frame independently rendered (no requestAnimationFrame)

**Testing Strategy:**
- 60 comprehensive tests in `gradient.test.ts`
- Parse tests: linear, radial, conic with various syntaxes
- Math tests: angle wraparound, position normalization, stop count matching
- Interpolation tests: easing, type transitions, multi-keyframe
- 9 component tests in `BackgroundTransition.test.tsx`
- All 117 tests passing

**Edge Cases Handled:**
1. **Missing positions**: `"red, blue, green"` → auto-distribute to `0%, 50%, 100%`
2. **Angle wraparound**: `350°→10°` takes 20° path through 0°, not 340° backwards
3. **Mismatched stops**: 2-stop gradient → 5-stop gradient (pads last stop)
4. **Type transitions**: linear→radial switches discretely at 0.5 progress
5. **Invalid gradients**: Parse failures return original string gracefully
6. **Complex colors**: `rgb(255, 0, 0)`, `rgba()`, `hsl()`, `hsla()`, hex, named colors
7. **Nested parentheses**: Comma-splitting respects `rgb(255, 0, 0)` structure

**Architecture Decisions:**
- **Separate utility**: `gradient.ts` is standalone (can be used elsewhere)
- **Dependency on existing patterns**: Reuses `interpolate.ts` (easing) and `color.ts` (Oklch)
- **Registry structure**: `background-transition` component depends on `gradient`, `interpolate`, and `color` utilities
- **Backward compatible**: Follows `TextTransition` API patterns (gradient array, frames, duration, delay, easing)

**Performance Considerations:**
- Parser caches normalized stops within single interpolation call
- Non-asserting assertion operator (`!`) used after normalization guarantees positions exist
- Frame-based (not time-based) allows Remotion to render frames in parallel

**Files Created:**
- `src/utils/gradient.ts` (598 lines) - Parser and interpolation utilities
- `src/utils/__tests__/gradient.test.ts` (60 tests)
- `src/components/BackgroundTransition.tsx` (132 lines)
- `src/components/__tests__/BackgroundTransition.test.tsx` (9 tests)
- `demo/src/showcases/BackgroundTransitionShowcase.tsx` - Demo compositions
- `demo/src/showcases/BackgroundTransitionShowcaseItem.tsx` - 8 showcase examples

**Files Modified:**
- `src/utils/index.ts` - Exported gradient utilities
- `src/components/index.ts` - Exported BackgroundTransition
- `jsrepo.config.ts` - Added background-transition, gradient, and color items to registry
- `demo/src/Root.tsx` - Added 9 BackgroundTransition compositions

**Registry Build:** Successfully builds with 5 items and 5 files from src/

**Usage Examples:**
```typescript
// Simple linear gradient transition
<BackgroundTransition
  gradient={[
    "linear-gradient(0deg, #667eea, #764ba2)",
    "linear-gradient(180deg, #f093fb, #f5576c)",
  ]}
  duration={90}
/>

// Radial to conic transition with easing
<BackgroundTransition
  gradient={[
    "radial-gradient(circle, #ff6b6b, #4ecdc4)",
    "conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00)",
  ]}
  easing="easeInOut"
  frames={[20, 100]}
/>

// Multi-stop complex gradient
<BackgroundTransition
  gradient={[
    "linear-gradient(45deg, #fa709a 0%, #fee140 50%, #30cfd0 100%)",
    "linear-gradient(225deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
  ]}
  duration={120}
  easing="easeInOutCubic"
>
  <h1>Content on top</h1>
</BackgroundTransition>
```

**Research and Learning from Existing Solutions:**

This implementation demonstrates a critical development principle: **research existing robust solutions before building custom implementations**.

**Process Followed:**
1. **Identified the problem domain**: CSS gradient interpolation for smooth animations
2. **Researched existing solutions**: Found Granim.js, a battle-tested gradient animation library with 5.3k+ GitHub stars
3. **Analyzed their approach**: Studied Granim.js source code for:
   - Angle interpolation algorithm (shortest-path wraparound)
   - Color stop position normalization (auto-distribution)
   - Gradient state transition handling
4. **Adapted proven patterns**: Extracted mathematical concepts while adapting to Remotion's frame-based architecture
5. **Enhanced with modern techniques**: Replaced Granim's RGB interpolation with culori's Oklch for perceptually uniform colors

**Why This Matters:**
- **Avoid reinventing the wheel**: Granim.js solved angle wraparound (350°→10° via 0°) through years of real-world use
- **Learn from edge cases**: Their code handles scenarios we wouldn't discover until production (negative angles, 180° ambiguity)
- **Build on proven foundations**: Mathematical algorithms like shortest-path angle interpolation are well-established
- **Adapt, don't copy**: Used their insights but tailored to Remotion's frame-based, not time-based, architecture

**Red Flags When Building Custom Solutions:**
- ❌ "I'll figure out angle interpolation myself" → Led to initial bug (270° instead of 90°)
- ❌ "How hard can CSS parsing be?" → Very hard (nested commas, "at" keyword, multiple syntaxes)
- ✅ "Let me see how established libraries handle this" → Discovered wraparound math, position normalization patterns
- ✅ "Can I reuse existing solutions?" → Used culori for Oklch colors instead of building color space conversion

**Concrete Benefits in This Implementation:**
- **Angle interpolation**: Granim's `((diff % 360) + 360) % 360` with ±180 adjustment saved hours of debugging
- **Position normalization**: Their auto-distribution algorithm handles undefined stop positions elegantly
- **Edge case handling**: Their code revealed scenarios like 180° ambiguity, mismatched stop counts
- **Code quality**: Well-tested patterns from production use (vs. untested custom logic)

**When Custom Implementation Makes Sense:**
- ✅ No external library fits the requirements (Remotion's frame-based vs. requestAnimationFrame)
- ✅ Bundle size concerns (gradient-parser is 50KB, our custom parser is ~600 lines)
- ✅ Learning from existing solutions first, then adapting their proven algorithms
- ❌ "Not Invented Here" syndrome - rejecting research because it's not original

**Key Takeaway:**
> **Always research existing robust solutions first. Learn their design patterns, understand their algorithms, then adapt (not copy) proven approaches to your specific requirements. Standing on the shoulders of giants is engineering wisdom, not laziness.**

**Lessons Learned:**
1. **Research before building**: Granim.js taught us angle wraparound, position normalization, and edge cases we wouldn't discover alone
2. **Parser complexity**: CSS gradient syntax is more complex than expected (nested commas, "at" keyword, various shapes)
3. **isColorStop heuristic**: Had to use negative checks (NOT "at", NOT "circle") before positive checks
4. **Angle interpolation direction**: Simple diff calculation gives wrong path; Granim's wraparound logic with ±180 adjustment is the correct approach
5. **TypeScript strictness**: Non-null assertions (`!`) after normalization cleaner than defensive checks everywhere
6. **Test-driven development**: Writing 60 tests first caught edge cases early (angle direction, position parsing)
7. **Adapt proven patterns**: Granim's math + culori's Oklch + Remotion's frame-based architecture = best of all worlds

**Future Enhancements:**
- Support for `repeating-linear-gradient`, `repeating-radial-gradient`
- Advanced CSS features: `closest-side`, `farthest-corner`, size keywords
- Hue interpolation direction control (shorter/longer/increasing/decreasing) for rainbow effects
- Gradient position interpolation (currently switches at 0.5)

---

### Single Source of Truth with Import Transformation (2026-01-24)

**Context:** The project had duplicate code in `src/components/` (for npm library) and `templates/components/` (for jsrepo registry), with different import patterns. This created maintenance burden and risk of divergence.

**Problem:**
- `src/components/` used barrel exports: `import { ... } from "../utils"`
- `templates/components/` used direct imports: `import { ... } from "../utils/interpolate"`
- Duplicate code had to be kept in sync manually

**Solution:** Use jsrepo transforms to automatically rewrite imports when copying files to user projects.

**Implementation:**
1. Keep components only in `src/` (single source of truth)
2. Point jsrepo.config.ts to `src/` files instead of `templates/`
3. Create custom transform to rewrite barrel imports to direct file imports
4. Use manual dependency resolution to avoid import resolution warnings
5. Suppress InvalidImportWarning for barrel imports that will be transformed

**Key Code:**
```typescript
function rewriteUtilsImports(): Transform {
  return {
    transform: async (code, fileName) => {
      // Rewrite imports from "../utils" to "../utils/interpolate"
      return { code: code.replace(/from\s+["']\.\.\/utils["']/g, 'from "../utils/interpolate"') };
    },
  };
}
```

**Benefits:**
- Single source of truth eliminates duplication
- No manual sync between src/ and templates/
- Library and registry use the same tested code
- Transform handles import differences automatically
- Reduced maintenance burden

**Files Modified:**
- `jsrepo.config.ts` - Added transform, updated paths, manual dependencies
- `package.json` - Removed "templates" from files array
- Deleted entire `templates/` directory

**Registry Build:** Successfully builds with 4 items and 4 files from src/

---

### InterpolateValue Pattern (2026-01-24)

**Context:** Components need to support both static values and frame-based animations without breaking backward compatibility.

**Solution:** Created a discriminated union type:
```typescript
export type InterpolateValue =
  | number
  | [inputRange: number[], outputRange: number[], options?];
```

**Implementation:**
- Helper function `resolveInterpolateValue(value, frame)` evaluates the union at runtime
- Components accept `InterpolateValue` for animatable numeric props
- Default values use the array form to define animations: `opacity = [[0, 20], [0, 1]]`
- Static numbers work as-is for backward compatibility

**Benefits:**
- Declarative animation definitions at prop level
- Type-safe with full IDE autocomplete
- Backward compatible with existing code
- Centralizes interpolation logic
- Supports custom interpolate implementation (non-monotonic ranges, easing, etc.)

**Applied to:**
- `TextTransition`: `offset` (can now animate over time)

**Testing Strategy:**
- Test both static and array forms
- Test with/without options (easing, extrapolation)
- Verify backward compatibility with static values

**Files Modified:**
- `src/utils/interpolate.ts` - Type and helper
- `src/components/*.tsx` - All components
- `src/utils/__tests__/interpolate.test.ts` - Test coverage

---

### Perceptually Uniform Color Interpolation with Oklch (2026-01-25)

**Context:** Color transitions in animations need to appear smooth and natural to the human eye. Traditional RGB interpolation produces muddy intermediate colors and uneven brightness (e.g., red→blue transitions through dark purple). TextTransition component had a crude binary color switch.

**Problem:**
- RGB interpolation is not perceptually uniform
- RGB red→blue goes through dark muddy colors
- HSL is better but still has brightness inconsistencies
- Original implementation: `return localProgress < 0.5 ? fromColor : toColor;` (binary switch, no actual interpolation)

**Solution:** Use Oklch color space via the `culori` library for professional-quality color transitions.

**Why Oklch:**
- Perceptually uniform (consistent perceived brightness)
- Modern standard (CSS, Figma, Tailwind CSS v4)
- Better hue uniformity than LAB/LCH
- Designed specifically for graphics/web use
- Minimal out-of-gamut issues

**Implementation:**
```typescript
// src/utils/color.ts
import { interpolate as culoriInterpolate, formatRgb } from "culori";

export function interpolateColorKeyframes(
  colors: string[],
  progress: number,
  easingFn?: EasingFunction
): string {
  // Multi-keyframe support matching interpolate.ts pattern
  const interpolator = culoriInterpolate([fromColor, toColor], "oklch");
  const result = interpolator(easedProgress);
  return formatRgb(result) || "transparent";
}
```

**Key Features:**
- Multi-keyframe support (not just two colors)
- Easing function integration (consistent with numeric interpolation)
- Graceful error handling for invalid colors
- Returns RGB strings for CSS compatibility
- Matches the API pattern of `interpolateKeyframes` from interpolate.ts

**Benefits:**
- Professional-quality color transitions for video/animation work
- No muddy intermediate colors
- Consistent perceived brightness
- Reusable across all components (not just TextTransition)
- Future-proof (Oklch is the modern standard)

**Trade-offs:**
- Bundle size: ~12KB for culori (acceptable for video rendering)
- No native TypeScript types (created custom declarations in src/culori.d.ts)
- Considered alternatives: colord (~5KB), pure implementation (~2KB), but culori chosen for robustness and quality

**Files Created:**
- `src/utils/color.ts` - Oklch color interpolation utility
- `src/utils/__tests__/color.test.ts` - Comprehensive test coverage (22 tests)
- `src/culori.d.ts` - TypeScript type definitions

**Files Modified:**
- `src/utils/index.ts` - Exported color utilities
- `src/components/TextTransition.tsx` - Removed binary interpolateColor function, imported and used interpolateColorKeyframes
- `package.json` - Added culori dependency

**Testing Strategy:**
- Edge cases (empty array, single color, invalid colors)
- Two-color interpolation (hex, rgb, rgba, hsl, named colors)
- Multi-keyframe transitions (3-4 colors with correct segment boundaries)
- Easing integration (linear, easeIn, easeOut, custom functions)
- Oklch perceptual uniformity validation
- Real-world use cases (gradients, high contrast, pastels)

**Usage Example:**
```typescript
// In TextTransition
<TextTransition
  transition={{
    color: ['#ff0000', '#ffff00', '#0000ff'], // red → yellow → blue
    frames: [0, 60],
    easing: 'easeInOut'
  }}
>
  Smooth Colors!
</TextTransition>
```

**Future Considerations:**
- Could expose hue interpolation direction (shorter/longer/increasing/decreasing) for rainbow effects
- Could add LAB mode as alternative for backward compatibility with older tools

---

### Deterministic Simulation Replay (2026-01-26)

**Context:** Implementing a particle system that needs iterative physics (velocity, acceleration, drag) but must run in Remotion's deterministic, frame-independent environment.

**Problem:**
- Particles are inherently stateful ($P_{t} = P_{t-1} + V$).
- Remotion renders frames in any order/parallel.
- Standard React state (\`useState\`, \`useRef\`) is reset on generic renders and doesn't support seeking.

**Solution: "Replay Pattern"**
- **Deterministic Birth:** Particle $I$ is always born at Frame $T_{birth}$ (calculated via seed/rate).
- **On-the-fly Simulation:** On Frame $F$, if a particle is "alive" ($T_{birth} < F < T_{death}$):
    1. Re-initialize state at $T_{birth}$ with deterministic seed.
    2. Run a micro-simulation loop for $(F - T_{birth})$ steps inside the render pass.
- **Performance:** For N < 1000 and Life < 100, checking N particles and running average 50 loop steps is negligible in JS (~50k ops).

**Result:**
- Fully deterministic physics without pre-rendering.
- Frame-perfect seeking.
- Supports complex, state-dependent behaviors (e.g., bouncing, logic constraints) unlike closed-form math equations.

---

## Architecture Decisions

### Interactive Playground with Zod Schemas (2026-01-24)

**Context:** Users need to experiment with component props in real-time without editing code. Remotion Studio provides a UI for tweaking props when schemas are defined.

**Solution:** Created individual showcase compositions for each component with Zod schemas:

**Pattern:**
```typescript
// 1. Define Zod schema for props
export const componentSchema = z.object({
  propName: z.string().default("value"),
  numericProp: z.number().min(0).max(100).default(50),
  enumProp: z.enum(["option1", "option2"]).default("option1"),
});

// 2. Infer TypeScript type
export type ComponentShowcaseProps = z.infer<typeof componentSchema>;

// 3. Register composition with schema
<Composition
  id="ComponentName"
  component={ComponentShowcase}
  schema={componentSchema}
  defaultProps={{...}}
/>
```

**Benefits:**
- Real-time prop editing in Remotion Studio UI
- Type-safe props with IDE support
- Built-in validation with min/max/enum constraints
- Isolated testing of individual components
- Better developer experience for exploring component APIs

**Implementation:**
- Created `/demo/src/showcases/` directory
- Individual showcases: `TextTransitionShowcase`
- Each has its own schema and composition registration
- Original combined `Playground` composition preserved for backward compatibility

**InterpolateValue Consideration:**
- For UI simplicity, showcases use `staticValue` props alongside `useAnimation` toggles
- This allows users to experiment with both static and animated values
- Full InterpolateValue arrays can still be edited in code

**Files Created:**
- `demo/src/showcases/TextTransitionShowcase.tsx`
- `demo/src/showcases/index.ts`

**Files Modified:**
- `demo/src/Root.tsx` - Added composition registrations
- `demo/package.json` - Added zod dependency

---

## Architecture Decisions

### Custom Interpolate Implementation
The project uses a custom `interpolate` function instead of Remotion's built-in version to support:
- Non-monotonic input ranges (e.g., `[0, 1, 0]`)
- Hold frames with duplicate values (e.g., `[30, 30]`)
- Rich easing function library
- Consistent extrapolation behavior

This custom implementation is foundational and should be used throughout all components.

---

### Cycle Animation Reset Pattern (2026-01-25)

**Context:** TextTransition component supports a `cycle` feature that rotates through different text strings. Each text should animate in with the same transition properties.

**Problem:**
- The first cycled text animated correctly (frames 0-45)
- Subsequent texts appeared instantly without animation
- Root cause: Animation progress was calculated from global frame, not per-cycle-item frame
- After first cycle completed, `progress` was always ≥1, showing final animation state immediately

**Solution:** Track frame position within the current cycle item using modulo arithmetic.

**Implementation:**
```typescript
// Calculate frame offset within current cycle item
cycleFrameOffset = relativeFrame % itemDuration;

// Use cycle offset instead of global frame for progress calculation
const baseFrame = cycle ? cycleFrameOffset : Math.max(0, frame - delay);
const relativeFrame = baseFrame - (index * splitStagger);
const progress = Math.min(Math.max((relativeFrame - startFrame) / totalDuration, 0), 1);
```

**Key Insight:** When implementing repeating/cycling animations, always normalize the frame counter to restart from 0 at the beginning of each cycle. Global frame counters only work for single-run animations.

**Pattern Application:**
- Use modulo (`%`) to reset frame counter per cycle: `frame % cycleDuration`
- Apply to any component with repeating states (carousels, slideshows, alternating content)
- Maintain separate logic paths for one-time vs. cycling animations

**Files Modified:**
- [src/components/TextTransition.tsx](src/components/TextTransition.tsx#L153-L175)

**Testing:** All existing tests pass, including cycle-specific tests that verify text content changes.

---

### Type Broadening with Backward Compatibility Pattern (2026-01-25)

**Context:** TextTransition component had `split` property constrained to literal union `"none" | "word" | "character" | "line"`, limiting flexibility for custom split behaviors.

**Problem:**
- Users wanted to split by arbitrary strings (e.g., `"|"`, `";"`, any custom delimiter)
- Strict literal union prevented this extension
- Needed to maintain backward compatibility with existing usage

**Solution:** Broaden type to accept `string` while preserving special handling for known keywords.

**Implementation:**
```typescript
// Before: Strict literal union
split?: "none" | "word" | "character" | "line";

// After: Flexible string type
split?: string;

// splitText function handles both cases
function splitText(text: string, mode: string): string[] {
  // Special handling for known keywords
  if (mode === "none") return [text];
  if (mode === "word") return text.split(/(\s+)/);
  if (mode === "character") return text.split("");
  if (mode === "line") return text.split("\n");

  // Custom separator: split by the provided string
  return text.split(mode);
}
```

**Key Principles:**
- **Expand type from specific to general** (literal union → string)
- **Preserve keyword behavior** via explicit checks before fallback
- **Default to intuitive behavior** for custom inputs (string.split())
- **Maintain 100% backward compatibility** (existing code continues to work)

**Benefits:**
- Users can now use any string as separator: `split: "|"`, `split: "::"`
- No breaking changes to existing code using `"word"`, `"character"`, etc.
- Intuitive API - custom split uses JavaScript's built-in `String.split()`
- Type system allows but doesn't enforce literal values (good IDE autocomplete)

**Testing Strategy:**
- Verify predefined keywords still work (`"word"`, `"character"`, `"line"`, `"none"`)
- Test custom separators (`"|"`, `","`, `";;"`)
- Test that `split: "\n"` works both as keyword `"line"` and custom separator
- All tests pass, no regression

**When to Apply:**
- Component APIs with enum-like properties that could benefit from user extensibility
- When you want to guide users toward standard options but not restrict them
- Type narrowing becomes a constraint rather than a safety feature

**Files Modified:**
- [src/components/TextTransition.tsx](src/components/TextTransition.tsx)
- [src/components/__tests__/TextTransition.test.tsx](src/components/__tests__/TextTransition.test.tsx)

**Usage Examples:**
```typescript
// Predefined keywords (still work)
<TextTransition transition={{ split: "word" }}>Hello World</TextTransition>
<TextTransition transition={{ split: "character" }}>ABC</TextTransition>

// Custom separators (new capability)
<TextTransition transition={{ split: "|" }}>One|Two|Three</TextTransition>
<TextTransition transition={{ split: "::" }}>A::B::C</TextTransition>
<TextTransition transition={{ split: "\n" }}>Line1\nLine2</TextTransition>
```

---

### Shared Motion Framework (2026-01-25)

**Context:** Both TextTransition and MotionTransition needed identical animation logic (timing, transforms, keyframe interpolation). Rather than duplicate ~150 lines of code, extracted a shared motion framework.

**Problem:**
- TextTransition had complex animation logic embedded inline (~200 lines)
- MotionTransition needed same capabilities but for generic React children
- Code duplication leads to inconsistent behavior and harder maintenance
- Future animation components would need the same foundation

**Solution:** Created `src/utils/motion/` with reusable hooks and utilities that both components consume.

**Implementation:**

1. **Shared Type Definitions** (`src/utils/motion/index.ts`):
```typescript
export type AnimatedValue = number | [number, number] | number[];
export interface TransformProps { x?, y?, z?, scale?, rotate?, ... }
export interface VisualProps { opacity?, color?, backgroundColor?, blur? }
export interface TimingProps { frames?, duration?, delay?, easing? }
```

2. **Core Utilities** (extracted from TextTransition):
```typescript
// Keyframe interpolation (supports arrays for multi-stop animation)
export function interpolateKeyframes(value: AnimatedValue, progress: number, easingFn?): number

// Easing function resolution (name string or custom function)
export function getEasingFunction(easing?: EasingFunction | EasingName): EasingFunction | undefined

// Transform string builder (combines all transform properties)
export function buildTransformString(transforms: TransformProps, progress: number, easingFn?): string

// Complete style generator (transforms + visual props → React.CSSProperties)
export function buildMotionStyles(config: MotionStyleConfig): React.CSSProperties
```

3. **Timing Hook** (frame-based progress calculation):
```typescript
export function useMotionTiming(config: MotionTimingConfig): number
// Handles: frames/duration, delay, stagger per unit, cycle offset
// Returns: progress value 0-1 (clamped)
```

4. **Component Usage Pattern**:
```typescript
// TextTransition (refactored)
const renderUnit = (unit: string, index: number) => {
  const progress = useMotionTiming({ frames, duration, delay, stagger: splitStagger, unitIndex: index, easing, cycleOffset });
  const unitStyle = buildMotionStyles({ progress, transforms: { x, y, scale, ... }, styles: { opacity, color, ... }, easing: easingFn, baseStyle });
  return <span style={unitStyle}>{unit}</span>;
};

// MotionTransition (new component)
const renderChild = (child: ReactNode, index: number) => {
  const staggerIndex = calculateStaggerIndex(index, totalChildren, staggerDirection);
  const progress = useMotionTiming({ frames, duration, delay, stagger, unitIndex: staggerIndex, easing });
  const motionStyle = buildMotionStyles({ progress, transforms, styles, easing: easingFn });
  return React.cloneElement(child, { style: { ...child.props.style, ...motionStyle } });
};
```

**Key Features:**
- **Single source of truth**: Animation logic lives in one place
- **Consistent behavior**: Both components use identical timing/interpolation
- **Easy testing**: Utilities are pure functions, hook is isolated
- **Extensible**: Future components can import and use immediately
- **Type-safe**: Shared types ensure API consistency

**Architectural Insight:**
- TextTransition: Wraps text units in `<span>` with `display: inline-block` and `whiteSpace: pre`
- MotionTransition: Uses `React.cloneElement()` to merge styles into existing children
- Both leverage same motion framework, different DOM manipulation strategies

**Files Created:**
- [src/utils/motion/index.ts](src/utils/motion/index.ts) - Motion framework

**Files Modified:**
- [src/components/TextTransition.tsx](src/components/TextTransition.tsx) - Refactored to use motion framework (~150 lines reduced)

**Files Created:**
- [src/components/MotionTransition.tsx](src/components/MotionTransition.tsx) - New component using motion framework
- [src/components/__tests__/MotionTransition.test.tsx](src/components/__tests__/MotionTransition.test.tsx) - Comprehensive tests
- [demo/src/showcases/MotionTransitionShowcase.tsx](demo/src/showcases/MotionTransitionShowcase.tsx) - Visual demos

**MotionTransition Unique Features:**
- **Stagger direction**: `forward`, `reverse`, `center` (animates from middle outward)
- **Style merging**: Preserves existing child styles, applies animation on top
- **Generic children**: Works with any React elements, not just text
- **Custom components**: Children can be custom components that forward `style` prop to underlying DOM

**Usage Examples:**
```typescript
// Forward stagger (default)
<MotionTransition transition={{ opacity: [0, 1], y: [50, 0], stagger: 5, staggerDirection: "forward" }}>
  <div>First</div>
  <div>Second</div>
  <div>Third</div>
</MotionTransition>

// Reverse stagger (last animates first)
<MotionTransition transition={{ x: [100, 0], stagger: 5, staggerDirection: "reverse" }}>
  <Card>A</Card>
  <Card>B</Card>
  <Card>C</Card>
</MotionTransition>

// Center stagger (middle animates first, spreads outward)
<MotionTransition transition={{ scale: [0.5, 1], stagger: 4, staggerDirection: "center" }}>
  <Icon name="star" />
  <Icon name="heart" />
  <Icon name="rocket" />
</MotionTransition>

// Custom component (forwards style prop)
const Card = ({ style, children }) => <div style={{ ...baseStyle, ...style }}>{children}</div>;
<MotionTransition transition={{ opacity: [0, 1], y: [30, 0] }}>
  <Card>Content</Card>
</MotionTransition>
```

---

## Best Practices

### Shared Logic Extraction
- When implementing similar components, extract shared logic into utilities FIRST
- Create a dedicated module (e.g., `src/utils/motion/`) for reusable animation logic
- Use hooks for React context-dependent logic (frame/fps access)
- Use pure functions for stateless calculations (interpolation, transforms)
- Both TextTransition and MotionTransition share ~70% of their animation code via the motion framework

### Component Template Synchronization
- Source files live in `src/`
- Template files in `templates/` must mirror source exactly
- Templates are distributed via jsrepo for direct copying into user projects
- Always update both locations when making changes

### Testing
- Use vitest for unit tests
- Test each component in isolation
- Ensure backward compatibility with existing APIs
- Add edge case tests for new patterns

### Deterministic Randomness in Remotion (2026-01-26)

**Context:** Added `staggerDirection: "random"` to MotionTransition component to shuffle child animation order randomly.

**Problem:**
- Video rendering requires deterministic output (same render = same result)
- JavaScript's `Math.random()` is non-deterministic (different on each render)
- Random stagger needs to be "random enough" but perfectly reproducible

**Solution:** Use Remotion's built-in `random(seed)` function for all randomization needs.

**Key Learnings:**

1. **Never use `Math.random()` in Remotion components**
   - Will cause flickering/inconsistent exports
   - Break preview reliability
   - Fail determinism requirements for video export

2. **Use `random(seed)` with meaningful seeds**
   ```typescript
   import { random } from "remotion";

   // Good: Stable seed for consistent randomization
   const shuffled = items.map((item, i) => {
     const randomValue = random(`stagger-${i}`);
     return { item, randomValue };
   });
   ```

3. **Fisher-Yates shuffle with Remotion's random**
   ```typescript
   const indices = Array.from({ length: total }, (_, i) => i);
   for (let i = indices.length - 1; i > 0; i--) {
     const j = Math.floor(random(`stagger-${i}`) * (i + 1));
     [indices[i], indices[j]] = [indices[j], indices[i]];
   }
   ```

4. **Test determinism explicitly**
   - Mock `random()` in tests with consistent hash function
   - Verify multiple renders produce identical results
   - Test pattern variation (ensure "random enough")

**Implementation Pattern:**
- Added `"random"` to `StaggerDirection` union type
- Enhanced `calculateStaggerIndex()` with random case
- Used stable seed pattern (`stagger-${i}`) for shuffle
- Added tests for both randomness and determinism

**Red flags:** Using `Math.random()`, `Date.now()`, or any non-deterministic source

**Green flags:** `random(seed)`, stable seeds, determinism tests

> In video rendering, "random" means "unpredictable yet perfectly reproducible." Remotion's random() achieves both.

---

---

### Astro + Starlight Documentation with Interactive React Islands (2026-01-26)

**Context:** Needed a static documentation site with live, interactive Remotion Player examples, searchable docs, blog support, and markdown authoring. The site must deploy to CloudFlare Pages with zero server costs.

**Problem:**
- Traditional static site generators (Jekyll, Hugo) lack React component support
- Next.js/Remix require server runtime (not truly static)
- VitePress is Vue-focused, awkward for React components
- Need to embed `@remotion/player` (React component requiring hydration) in static docs
- Want to reuse existing showcase components from `demo/src/showcases/` without duplication

**Solution:** Astro + Starlight with React Islands architecture - static HTML with selective client-side hydration only where needed.

**Why Astro + Starlight:**
- **Zero JS by default**: Pages ship pure HTML/CSS, JavaScript only loads for interactive components
- **React Islands**: `client:visible` directive hydrates components when scrolled into view
- **True static output**: `npm run build` generates pure HTML (no Node.js server needed)
- **Starlight features**: Built-in search (Pagefind), sidebar, dark mode, mobile-responsive
- **MDX support**: Import and use React components directly in markdown
- **Best performance**: ~50KB base bundle vs. 300KB+ (Docusaurus) or 200KB+ (Nextra)

**Implementation:**

1. **Project Structure**:
```
docs/
├── src/
│   ├── pages/
│   │   └── index.astro              # Custom marketing landing page (/)
│   ├── content/
│   │   └── docs/                    # Documentation under /docs route
│   │       ├── getting-started.mdx
│   │       ├── components/
│   │       │   ├── text-transition.mdx
│   │       │   ├── background-transition.mdx
│   │       │   └── motion-transition.mdx
│   │       ├── utilities/
│   │       └── examples/
│   └── components/
│       ├── ShowcasePlayer.tsx       # Reusable Player wrapper
│       └── showcases/               # Copied from demo/, imports updated
│           ├── TextTransitionShowcaseItem.tsx
│           ├── BackgroundTransitionShowcaseItem.tsx
│           └── Center.tsx
├── astro.config.mjs                 # Astro + Starlight config
├── package.json
└── dist/                            # Build output (deploy this)
```

2. **ShowcasePlayer Wrapper Pattern**:
```tsx
// docs/src/components/ShowcasePlayer.tsx
import { Player } from '@remotion/player';

export const ShowcasePlayer: React.FC<{
  component: React.ComponentType;
  duration: number;
  fps?: number;
  width?: number;
  height?: number;
}> = ({ component, duration, fps = 30, width = 1920, height = 1080 }) => (
  <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
    <Player
      component={component}
      durationInFrames={duration}
      compositionWidth={width}
      compositionHeight={height}
      fps={fps}
      controls
      loop
      style={{ width: '100%', aspectRatio: `${width}/${height}` }}
    />
  </div>
);
```

3. **Importing Showcases in MDX**:
```mdx
---
title: TextTransition
description: Animated text with smooth transitions
---
import { ShowcasePlayer } from '@components/ShowcasePlayer';
import { FadeInShowcase, SlideFromLeftShowcase } from '@showcases/TextTransitionShowcaseItem';

# TextTransition

## Examples

### Fade In Animation

<ShowcasePlayer client:visible component={FadeInShowcase} duration={60} />

```tsx
<TextTransition transition={{ opacity: [0, 1] }}>
  Hello World
</TextTransition>
```
```

4. **Astro Configuration**:
```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    react(), // Must come before Starlight
    starlight({
      title: 'Remotion Bits',
      sidebar: [
        { label: 'Getting Started', items: [...] },
        { label: 'Components', items: [...] },
        { label: 'Utilities', items: [...] },
      ],
    }),
  ],
});
```

5. **Custom Landing Page at Root**:
```astro
<!-- docs/src/pages/index.astro -->
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Remotion Bits - Beautiful Animation Components</title>
</head>
<body>
  <div class="hero">
    <h1>Remotion Bits</h1>
    <p>Ready-made animation components for Remotion</p>
    <a href="/docs/getting-started">Get Started</a>
  </div>
  <!-- Marketing content, feature grid, code snippets -->
</body>
</html>
```

**Key Features:**

1. **Client Hydration Directives**:
   - `client:load` - Hydrates immediately (above-the-fold examples)
   - `client:visible` - Hydrates when scrolled into view (below-fold, best for performance)
   - `client:idle` - Hydrates when browser is idle
   - `client:only="react"` - Only renders on client (skip SSG entirely)

2. **Import Path Aliases** (tsconfig.json):
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@components/*": ["./src/components/*"],
         "@showcases/*": ["./src/components/showcases/*"]
       }
     }
   }
   ```

3. **Showcase Component Adaptation**:
   - Copied showcase files from `demo/src/showcases/` to `docs/src/components/showcases/`
   - Updated imports from `"../../../src/components"` to `"remotion-bits"` (published package)
   - Maintains single source of truth (showcases reference the library, not local src/)

**Performance Characteristics:**

| Metric | Value |
|--------|-------|
| Total build size | 2.6MB |
| Base page (no Player) | ~50-60KB JS |
| Page with Player | ~350KB JS (Player + React runtime) |
| Initial HTML load | ~5-10KB (pure HTML) |
| Build time | ~2-3 seconds |
| Pages built | 15 (landing + 14 docs) |

**Deployment (CloudFlare Pages):**
```bash
cd docs
npm run build
# Upload dist/ folder to CloudFlare Pages
# Build command: npm run build
# Output directory: dist
# Environment: NODE_VERSION=18
```

**Benefits:**

- ✅ **True static output**: No server runtime, no edge functions needed
- ✅ **Best performance**: Minimal JS bundle, only loads where needed
- ✅ **Live examples**: Full Remotion Player functionality in static docs
- ✅ **Reusable showcases**: Imported from demo/ without duplication
- ✅ **Built-in search**: Pagefind indexes all content automatically
- ✅ **Blog-ready**: Astro Content Collections support blog structure
- ✅ **Free hosting**: CloudFlare Pages, Netlify, Vercel, GitHub Pages
- ✅ **Zero traffic costs**: Static files, no serverless function invocations
- ✅ **SEO-friendly**: Pre-rendered HTML for search engines
- ✅ **Fast builds**: 2-3 seconds for 15 pages

**Trade-offs:**

- ⚠️ **Two-build process**: Library (`npm run build` in root) + Docs (`npm run build` in docs/)
- ⚠️ **Manual showcase sync**: Showcase files copied to docs/, must update imports to use `remotion-bits` package
- ⚠️ **Bundle size for interactive pages**: Pages with Player add ~300KB (acceptable for video documentation)
- ⚠️ **Remotion license notice**: Player shows license message in console (add `acknowledgeRemotionLicense` prop to suppress)

**Alternative Frameworks Considered:**

| Framework | Why Not Chosen |
|-----------|----------------|
| **Nextra** (Next.js) | Larger bundle (~200KB base), requires static export mode, less optimized |
| **Docusaurus** | Heaviest bundle (~300KB base), Webpack-based (slower), more opinionated |
| **VitePress** | Vue-focused, React support is awkward/hacky, not ideal for React libraries |
| **Jekyll/Hugo** | No React component support, would need iframe embeds or video exports |

**When to Use This Pattern:**

- ✅ React component library needing interactive examples in docs
- ✅ Video/animation tools where showing live output is critical
- ✅ Static hosting requirement (CloudFlare Pages, Netlify, GitHub Pages)
- ✅ Performance-critical (minimize JS bundle size)
- ✅ Need professional docs features (search, sidebar, dark mode)

**When NOT to Use:**

- ❌ Server-side features needed (authentication, real-time data, API routes)
- ❌ Heavy interactive app (not a documentation site)
- ❌ Team unfamiliar with Astro (steeper learning curve than Next.js)
- ❌ Need versioned docs (Docusaurus has better version support)

**Files Created:**

- `docs/` - Entire Astro documentation site
- `docs/src/pages/index.astro` - Custom landing page
- `docs/src/components/ShowcasePlayer.tsx` - Reusable Player wrapper
- `docs/src/components/showcases/*` - Copied showcase components
- `docs/src/content/docs/**/*.mdx` - 14 documentation pages
- `docs/astro.config.mjs` - Astro + Starlight configuration

**Key Learnings:**

1. **Island Architecture is Perfect for Docs**: Most doc pages are static text/code; interactive examples are isolated islands
2. **client:visible is Key for Performance**: Lazy-load Players below fold to keep initial page load fast
3. **Reuse Showcase Components**: Don't rewrite examples, import existing showcase components from demo/
4. **Update Imports to Published Package**: Showcases in docs should import `"remotion-bits"`, not relative paths to `src/`
5. **Single Git Repo**: Remove `.git` from docs/ folder to maintain single top-level repository
6. **Custom Landing + Docs Structure**: `src/pages/index.astro` for marketing, Starlight handles `/docs` route automatically
7. **Built-in Search Works Great**: Pagefind indexes everything, no Algolia API key needed
8. **MDX is Powerful**: Import React components directly in markdown, full TypeScript support

**Testing Strategy:**

- Build succeeds: `npm run build` in docs/ completes without errors
- Search works: Pagefind builds index for 15 pages
- Showcases load: Player components render when scrolled into view
- Navigation works: Sidebar links, breadcrumbs, page navigation all functional
- Responsive: Mobile menu, responsive layouts tested
- Bundle sizes: Verify base pages stay under 100KB, Player pages under 400KB

**Future Enhancements:**

- Add blog section with release notes and tutorials
- Create interactive playground with prop editors (using Zod schemas)
- Add video recordings as fallback for no-JS scenarios
- Set up automated deployment on git push
- Add sitemap and SEO metadata (needs `site` config in astro.config.mjs)
- Create OpenGraph images for social sharing

> Static doesn't mean boring. Astro's island architecture lets you build documentation that's both performant (pure HTML) and interactive (React components where needed). Perfect for component libraries that need live examples without server costs.

---

## Next Agent Guidance

When working on this codebase:
1. Check this log first for established patterns
2. **Shared motion framework**: Use `src/utils/motion/` utilities for any new animation components
3. **Reuse over rewrite**: Import `useMotionTiming`, `buildMotionStyles` instead of reimplementing
4. Use `InterpolateValue` for any numeric animatable props
5. Keep source and template files synchronized
6. Maintain backward compatibility unless explicitly breaking change
7. Add test coverage for new functionality
8. Update this log with new insights
9. **Documentation updates**: Add new components/utilities to docs site in `docs/src/content/docs/`
10. **Showcase reuse**: Create showcase in `demo/src/showcases/`, then import into docs with updated imports


### Animation Component Checklist
When creating new animation components:
- [ ] Import motion framework utilities from `src/utils/motion/`
- [ ] Use `useMotionTiming()` for progress calculation (handles frames, duration, delay, stagger, easing)
- [ ] Use `buildMotionStyles()` for style generation (handles all transforms + visual props)
- [ ] Define component-specific behavior (e.g., text splitting, child cloning, DOM strategy)
- [ ] Export types: `AnimatedValue`, `TransformProps`, `VisualProps`, `TimingProps`
- [ ] Write tests covering timing, stagger, transforms, and edge cases
- [ ] Create showcase demo with multiple examples in `demo/src/showcases/`
- [ ] Update exports in `src/components/index.ts` and `src/utils/index.ts`
- [ ] Add documentation page in `docs/src/content/docs/components/`
- [ ] Import showcase into docs with `client:visible` directive

---

### Per-Spawner Frame Offset for Particle Systems (2026-01-26)

**Context:** Particles component had a global `startFrame` prop that offset all spawners simultaneously, but individual Spawner components had a non-functional `startFrame` prop that was defined but never used. This prevented independent control of when different particle emitters would begin their simulation.

**Problem:**
- Spawner interface included `startFrame?: number` but it wasn't being applied
- In a previous fix attempt, calling `simulateParticles` separately per spawner broke particle display
- The simulator used a single frame value for all spawners, preventing per-spawner frame offsets
- Users couldn't create staggered particle effects (e.g., left emitter starts at frame 0, right emitter starts at frame 50)

**Requirements:**
1. Each spawner needs its own independent frame offset
2. Spawner's `startFrame` should override Particles' global `startFrame`
3. Must not break particle display (previous attempt broke this)
4. Must remain fully deterministic (Remotion requirement)

**Solution: Apply Per-Spawner Frame Offset in Simulator**

Rather than calling `simulateParticles` multiple times (Option A, which broke before), modify the simulator to apply each spawner's frame offset individually within a single simulation pass (Option B).

**Implementation:**

1. **Merge Spawner-level and Particles-level startFrame** ([Particles.tsx](src/components/Particles/Particles.tsx)):
   ```tsx
   // In useMemo where spawners are extracted from children
   extractedSpawners.push({
     ...props,
     id: props.id || `spawner-${spawnerCount++}`,
     // Spawner's startFrame takes precedence over Particles' startFrame
     startFrame: props.startFrame !== undefined ? props.startFrame : startFrame,
     children: props.children
   });
   ```

2. **Apply Per-Spawner Frame Offset in Simulator** ([simulator.ts](src/utils/particles/simulator.ts)):
   ```typescript
   for (const spawner of spawners) {
     // Apply spawner-specific startFrame offset
     const spawnerStartFrame = spawner.startFrame || 0;
     const spawnerFrame = frame + spawnerStartFrame;

     // Use spawnerFrame instead of global frame for all calculations
     totalBorn = Math.floor(Math.max(0, spawnerFrame) * rate);
     const age = spawnerFrame - birthFrame;

     // Pass spawnerFrame to behaviors and movement
     behavior.handler(particle, t, { frame: spawnerFrame, fps });
     movement(particle, t, { frame: spawnerFrame, fps });
   }
   ```

3. **Remove Global Frame Offset** (Particles.tsx):
   ```tsx
   // Before: Applied global offset
   const simulationFrame = frame + startFrame;
   return simulateParticles({ frame: simulationFrame, ... });

   // After: Let each spawner handle its own offset
   return simulateParticles({ frame, ... });
   ```

**Why This Works:**

- **Single simulation pass**: All spawners processed in one call (no particle ID conflicts)
- **Independent timelines**: Each spawner calculates `spawnerFrame = frame + spawnerStartFrame`
- **Deterministic**: Same frame input always produces same particle output
- **Backward compatible**: If `startFrame` is undefined, defaults to 0 (no offset)
- **Proper override behavior**: Spawner's `startFrame` takes precedence when set, otherwise inherits from Particles

**Key Architectural Insight:**

The previous broken approach likely called `simulateParticles` multiple times:
```typescript
// DON'T DO THIS - causes particle ID conflicts and rendering issues
spawners.forEach(spawner => {
  const particles = simulateParticles({ frame: frame + spawner.startFrame, spawners: [spawner], ... });
  allParticles.push(...particles);
});
```

The correct approach is to handle frame offsets **inside** the simulator loop:
```typescript
// DO THIS - single pass, per-spawner frame calculation
for (const spawner of spawners) {
  const spawnerFrame = frame + (spawner.startFrame || 0);
  // Use spawnerFrame for all spawner-specific calculations
}
```

**Testing:**

Added comprehensive test suite (142 tests total, all passing):

1. **Per-spawner startFrame independence**:
   - Spawner A (startFrame=0) at frame 10 → 10 particles
   - Spawner B (startFrame=50) at frame 10 → 60 particles (acts as if frame 60)

2. **Burst spawning with offset**:
   - Spawner A (burst=10, startFrame=0) at frame 0 → 10 particles alive
   - Spawner B (burst=10, startFrame=10, lifespan=5) at frame 0 → 0 particles (all dead from age 10)

3. **Multiple spawners with different offsets**:
   - Spawner A (startFrame=0) at frame 5 → 10 particles (rate=2)
   - Spawner B (startFrame=10) at frame 5 → 30 particles (rate=2, acts as frame 15)
   - Spawner C (startFrame=20) at frame 5 → 50 particles (rate=2, acts as frame 25)

4. **Default to 0 when undefined**:
   - Spawner without `startFrame` prop behaves as if `startFrame=0`

**Usage Examples:**

```tsx
// Global offset for all spawners
<Particles startFrame={100}>
  <Spawner rate={1} /> {/* Starts at frame 100 */}
  <Spawner rate={1} /> {/* Starts at frame 100 */}
</Particles>

// Per-spawner offset (overrides Particles startFrame)
<Particles startFrame={50}>
  <Spawner rate={1} startFrame={0} />   {/* Starts at frame 0 */}
  <Spawner rate={1} startFrame={100} /> {/* Starts at frame 100 */}
  <Spawner rate={1} />                  {/* Starts at frame 50 (inherits) */}
</Particles>

// Staggered particle effects
<Particles>
  <Spawner position={{ x: 0, y: 500 }} startFrame={0}>
    <div>❄️</div>
  </Spawner>
  <Spawner position={{ x: 500, y: 500 }} startFrame={30}>
    <div>❄️</div>
  </Spawner>
  <Spawner position={{ x: 1000, y: 500 }} startFrame={60}>
    <div>❄️</div>
  </Spawner>
</Particles>
```

**Files Modified:**
- [src/components/Particles/Particles.tsx](src/components/Particles/Particles.tsx) - Merge spawner startFrame with global startFrame
- [src/utils/particles/simulator.ts](src/utils/particles/simulator.ts) - Apply per-spawner frame offset in simulation loop
- [src/utils/particles/__tests__/simulator.test.ts](src/utils/particles/__tests__/simulator.test.ts) - Added 4 new tests for per-spawner startFrame

**Test Results:**
- All 142 tests passing (12 in simulator.test.ts, 130 in other test files)
- TypeScript compilation passes with no errors
- No regressions in existing particle behavior

**Benefits:**
- ✅ Per-spawner frame control enables complex choreographed particle effects
- ✅ Maintains deterministic simulation (Remotion requirement)
- ✅ Particles still render correctly (fixed the previous broken approach)
- ✅ Clean API: Spawner's `startFrame` naturally overrides Particles' `startFrame`
- ✅ Fully backward compatible (undefined startFrame defaults to 0)
- ✅ Efficient: Single simulation pass, no duplicate calculations

**Key Learnings:**

1. **Apply frame offsets inside the simulation loop, not by calling the simulator multiple times**
   - Multiple simulator calls can cause particle ID conflicts and accumulation issues
   - Single pass with per-spawner frame calculations is cleaner and more efficient

2. **Frame offset inheritance pattern**:
   ```typescript
   // In parent component, merge child prop with parent default
   startFrame: childProp !== undefined ? childProp : parentDefault
   ```

3. **Deterministic simulation requires frame-based offsets, not time-based**:
   - Each spawner gets its own "virtual frame" (`spawnerFrame = frame + spawnerStartFrame`)
   - All calculations (birth, age, behaviors) use `spawnerFrame` instead of global `frame`

4. **Test both independence and interaction**:
   - Test each spawner works independently with its own offset
   - Test multiple spawners with different offsets in same simulation
   - Test inheritance (undefined spawner startFrame uses Particles default)
   - Test override (defined spawner startFrame ignores Particles default)

---