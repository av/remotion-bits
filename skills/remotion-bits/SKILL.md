---
name: remotion-bits
description: Animation components and utilities for Remotion video projects. Use when building Remotion compositions with text animations, gradient transitions, particle effects, 3D scenes, or staggered motion effects. Provides example bits (complete compositions) and reusable components that can be installed via jsrepo.
---

# Remotion Bits

Use this skill to build from live Remotion Bits examples first, then fall back to primitives only when the examples are not enough.

## Default Workflow

1. Start with `find_remotion_bits` using the user's visual goal, motion style, or scene description.
2. Fetch the best one or two matches with `fetch_remotion_bit`.
3. Adapt the closest example before composing from primitives.
4. If multiple examples match, prefer the simplest one that satisfies the request.
5. If the request is multi-step, camera-driven, or presentation-like, bias toward `Scene3D` examples.
6. When adapting docs bits, preserve responsive sizing, theme color usage, and the self-contained example structure.

Treat the docs bits as the primary library of working patterns. Reach for primitives only after checking whether an existing bit already gives you the composition shape, timing model, and layout structure you need.

## Fallback Chain

1. MCP first.
   Use `find_remotion_bits` for discovery and `fetch_remotion_bit` for the full source.
2. CLI second.
   Use `npx remotion-bits find "hero intro" --tag scene-3d --json` and `npx remotion-bits fetch bit-fade-in --json`.
3. Direct docs inspection last.
   Inspect `docs/src/bits/catalog.ts` and `docs/src/bits/examples/**`, then adapt the nearest example manually.

If the MCP surface is available, use it before the CLI. If the CLI is available, use it before reading files directly.

## CLI And MCP Setup

Use the published package directly when you do not want a repo-local workflow:

```bash
# No install
npx remotion-bits find 3d cards
npx remotion-bits fetch bit-fade-in --json

# Global install
npm i -g remotion-bits
remotion-bits find 3d cards
remotion-bits fetch bit-fade-in --json
```

Start the MCP server from the published package the same way:

```bash
# No install
npx remotion-bits mcp

# Global install
remotion-bits mcp
```

When an agent or MCP client needs a stdio command, point it at one of these:

```json
{
  "command": "npx",
  "args": ["-y", "remotion-bits", "mcp"]
}
```

```json
{
  "command": "remotion-bits",
  "args": ["mcp"]
}
```

Inside this repository, the equivalent repo-local commands remain:

```bash
npm run bits:find -- --query "hero intro" --tag scene-3d --json
npm run bits:fetch -- bit-fade-in --json
npm run mcp:bits
```

## How To Search Well

- Search by the visual outcome: `flying camera through cards`, `counter with confetti`, `typewriter terminal`, `gradient background`, `staggered grid reveal`.
- Add tags when the shape is obvious: `scene-3d`, `text`, `particles`, `gradient`, `code`, `counter`.
- Fetch one strong match and one backup when the request is ambiguous.
- Prefer the example with the fewest moving parts that still satisfies the request.

## Adaptation Rules

- Keep `useViewportRect` sizing. Prefer `rect.vmin`, `rect.vmax`, `rect.width`, and `rect.height` over hardcoded pixels.
- Keep theme colors from `docs/src/styles/custom.css`. Do not swap in arbitrary colors unless the user asked for a new palette.
- Keep docs bit `Component` functions fully self-contained. Do not leave helpers, constants, or data arrays at module scope if the example will be used in the docs playground path.
- Docs bits are pre-wrapped for display. If you turn one into a standalone Remotion composition, add your own outer layout and background.
- For staged in and out motion, prefer `StaggeredMotion` sequencing over hand-rolled frame phase math.
- For presentation flows, preserve the example's step structure first and then change content, camera targets, and timing.

## Primitive Quick Reference

- `AnimatedText`: entry point for fades, slides, split-by-word, split-by-character, and text cycling. Use it when the motion is primarily text reveal. Avoid rebuilding text staggering manually.
- `AnimatedCounter`: numeric interpolation with prefix and postfix support. Use it for KPI, pricing, and stats reveals. Avoid animating formatted strings yourself.
- `TypeWriter`: typing and deleting text with cursor behavior. Use it for terminal, CLI, and sequential headline effects. Avoid it for dense code layouts where `CodeBlock` is the real primitive.
- `CodeBlock`: syntax-highlighted code reveal with line staggering, focus, and highlight regions. Use it for editor and code demo scenes. Avoid hand-rendering code lines unless the layout is intentionally custom.
- `MatrixRain`: ready-made matrix-style text rain. Use it when the request is explicitly matrix or hacker-rain themed. Avoid using it as a generic particle background.
- `GradientTransition`: animated CSS-gradient backgrounds and transitions. Use it when the motion is mostly background color and gradient evolution. Avoid replacing it with manual color interpolation unless the effect is not a gradient transition.
- `StaggeredMotion`: shared sequencing primitive for repeated children. Use it for lists, grids, card stacks, and multi-element entrances. Avoid per-child frame math when the animation is just staggered transforms and opacity.
- `Particles` and particle system primitives: use `Particles`, `Spawner`, and `Behavior` for ambient motion, fountains, snow, fireflies, and field effects. Avoid them for text sequencing or layout transitions.
- `Scene3D`: camera, steps, and 3D spatial composition. Use it when the request feels like a presentation, flythrough, multi-step walkthrough, or camera-driven showcase. Avoid rebuilding this with plain sequences if camera movement is central.
- `useViewportRect`: sizing and layout foundation. Use it in nearly every responsive bit. Avoid hardcoded pixel sizes unless you are matching a fixed render target on purpose.

## Common Decision Rules

- Need the same motion on repeated children: use `StaggeredMotion`.
- Need text-specific reveal behavior: start with `AnimatedText`.
- Need counting: use `AnimatedCounter`.
- Need typing: use `TypeWriter`.
- Need code on screen: use `CodeBlock`.
- Need ambient emitters or particles: use particle system primitives.
- Need scene-to-scene camera motion: use `Scene3D`.

## Example-First Patterns

- Text request: find a text bit, fetch it, then swap copy, timing, and split mode.
- Counter request: find a counter example, then adapt values, labels, and particle accents.
- Code request: find a code-block or typewriter example, then adapt the code sample and highlight regions.
- Background request: find a gradient or particle example, then adapt palette, density, and duration.
- Presentation request: find a `Scene3D` example first, then adapt step positions, titles, and card content before introducing any new primitives.

## Minimal Operational Examples

```bash
# MCP
find_remotion_bits {"query":"camera flythrough product showcase","tags":["scene-3d"],"limit":2}
fetch_remotion_bit {"id":"bit-carousel-3d"}

# CLI
npx remotion-bits find "camera flythrough product showcase" --tag scene-3d --limit 2 --json
npx remotion-bits fetch bit-carousel-3d --json
```

## References

- `references/components.md`
- `references/utilities.md`
- `references/patterns.md`
