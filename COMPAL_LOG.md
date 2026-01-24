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
- `HeroTitle`: `opacity`, `translateY`
- `TextTransition`: `offset` (can now animate over time)
- `Backgrounds`: `blur` (can now animate over time)

**Testing Strategy:**
- Test both static and array forms
- Test with/without options (easing, extrapolation)
- Verify backward compatibility with static values

**Files Modified:**
- `src/utils/interpolate.ts` - Type and helper
- `src/components/*.tsx` - All components
- `src/utils/__tests__/interpolate.test.ts` - Test coverage

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
- Individual showcases: `HeroTitleShowcase`, `TextTransitionShowcase`, `BackgroundsShowcase`
- Each has its own schema and composition registration
- Original combined `Playground` composition preserved for backward compatibility

**InterpolateValue Consideration:**
- For UI simplicity, showcases use `staticValue` props alongside `useAnimation` toggles
- This allows users to experiment with both static and animated values
- Full InterpolateValue arrays can still be edited in code

**Files Created:**
- `demo/src/showcases/HeroTitleShowcase.tsx`
- `demo/src/showcases/TextTransitionShowcase.tsx`
- `demo/src/showcases/BackgroundsShowcase.tsx`
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
