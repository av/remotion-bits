# Compound Engineering Log

This file tracks architectural patterns, lessons learned, and key insights for the remotion-bits project.

## Patterns

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
