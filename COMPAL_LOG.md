# Compound Engineering Log

This file tracks architectural patterns, lessons learned, and key insights for the remotion-bits project.

## Core Principles

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

## Best Practices

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

---

## Next Agent Guidance

When working on this codebase:
1. Check this log first for established patterns
2. Use `InterpolateValue` for any numeric animatable props
3. Keep source and template files synchronized
4. Maintain backward compatibility unless explicitly breaking change
5. Add test coverage for new functionality
6. Update this log with new insights
