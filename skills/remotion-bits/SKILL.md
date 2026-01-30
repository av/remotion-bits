---
name: remotion-bits
description: Animation components and utilities for Remotion video projects. Use when building Remotion compositions with text animations (AnimatedText), gradient transitions (GradientTransition), particle effects (Particles, Spawner, Behavior), 3D scenes (Scene3D, Step, Element3D), or staggered motion effects (StaggeredMotion). Also use when working with remotion-bits utilities like interpolate, color, gradient, geometry, or the useViewportRect hook.
---

# Remotion Bits

Collection of animation components for Remotion. Install components via jsrepo or import from `remotion-bits`.

## Installation

```bash
# jsrepo (recommended - copies source for customization)
npx jsrepo add animated-text particle-system scene-3d

# npm (library usage)
npm install remotion-bits
```

## Core Concepts

### AnimatedValue Type
Components use `AnimatedValue` for animated properties:
- Single value: `opacity: 1` (static)
- Two values: `opacity: [0, 1]` (from → to)
- Multiple values: `opacity: [0, 1, 0.5, 0]` (keyframes over duration)

### Responsive Sizing with useViewportRect
Never hardcode font sizes. Use viewport-relative units:

```tsx
import { useViewportRect } from "remotion-bits";

const rect = useViewportRect();
// rect.vmin = min(width, height) / 100
// rect.vmax = max(width, height) / 100
// rect.vw = width / 100
// rect.vh = height / 100

<div style={{ fontSize: rect.vmin * 5 }}>Responsive text</div>
```

### Easing Functions
All components accept `easing` as string name or function:
`"linear"`, `"easeIn"`, `"easeOut"`, `"easeInOut"`, `"easeInCubic"`, `"easeOutCubic"`, `"easeInOutCubic"`, `"easeInSine"`, `"easeOutSine"`, `"easeInOutSine"`, `"easeInQuart"`, `"easeOutQuart"`, `"easeInOutQuart"`

## Components

### AnimatedText
Text animation with character/word/line splitting and staggered timing.

```tsx
import { AnimatedText } from "remotion-bits";

<AnimatedText
  transition={{
    split: "word",           // "none" | "word" | "character" | "line"
    splitStagger: 3,         // frames between each unit
    opacity: [0, 1],
    y: [20, 0],
    duration: 30,
    easing: "easeOutCubic"
  }}
>
  Hello World
</AnimatedText>
```

For cycling text:
```tsx
<AnimatedText transition={{
  cycle: { texts: ["First", "Second", "Third"], itemDuration: 60 },
  opacity: [0, 1, 1, 0],
  duration: 60
}} />
```

### StaggeredMotion
Applies animations to child elements with stagger and direction control.

```tsx
import { StaggeredMotion } from "remotion-bits";

<StaggeredMotion
  transition={{
    stagger: 5,
    staggerDirection: "forward",  // "forward" | "reverse" | "center" | "random"
    opacity: [0, 1],
    x: [-50, 0],
    duration: 20
  }}
>
  <div>First</div>
  <div>Second</div>
  <div>Third</div>
</StaggeredMotion>
```

### GradientTransition
Smooth transitions between CSS gradients using Oklch color interpolation.

```tsx
import { GradientTransition } from "remotion-bits";

<GradientTransition
  gradient={[
    "linear-gradient(0deg, #ff0000, #0000ff)",
    "linear-gradient(180deg, #00ff00, #ffff00)"
  ]}
  duration={90}
  easing="easeInOut"
/>
```

Supports `linear-gradient`, `radial-gradient`, `conic-gradient`.

### Particle System
Declarative particle effects with spawners and behaviors.

```tsx
import { Particles, Spawner, Behavior, useViewportRect, resolvePoint } from "remotion-bits";

const rect = useViewportRect();

<Particles startFrame={100}> {/* Pre-simulate 100 frames */}
  <Spawner
    rate={2}                    // particles per frame
    lifespan={120}              // frames each particle lives
    area={{ width: rect.width, height: 0 }}
    position={resolvePoint(rect, { x: "center", y: 0 })}
    velocity={{ y: 2, varianceX: 1 }}
  >
    {/* Single child = all particles look the same */}
    <div style={{ width: 10, height: 10, background: "white", borderRadius: "50%" }} />

    {/* Multiple children = random variant per particle */}
    <div style={{ width: 5, background: "red" }} />
    <div style={{ width: 10, background: "blue" }} />
  </Spawner>

  <Behavior gravity={{ y: 0.1 }} />
  <Behavior drag={0.98} />
  <Behavior wiggle={{ magnitude: 1, frequency: 0.5 }} />
  <Behavior scale={{ start: 1, end: 0 }} />
  <Behavior opacity={[1, 0.5, 0]} />
  <Behavior handler={(p) => { p.velocity.x += 0.01; }} /> {/* Custom handler */}
</Particles>
```

### Scene3D

3D scene with camera following steps. This component has very specific requirements to function correctly:
1. `Scene3D` MUST contain one or more `Step` components as direct children to define camera positions.
2. `Scene3D` MAY contain `Element3D` components as direct children to place 3D positioned elements in the scene.
3. `Step` SHOULD have its own children that will be as the content at that step.
4. Each `Step` is a 2d plane in 3D space where the camera will focus, and the camera will transition between these steps based on the current frame easing.
5. Both `Step` and `Element3D` COULD contain any valid React children, including other Motion components.

**Behavior:**
- `Element3D` components can be placed anywhere in 3D space and will remain static as the camera moves.
- Both `Step` and `Element3D` accept `x`, `y`, `z` props to define their position in 3D space, as well as rotation props like `rotateX`, `rotateY`, and `rotateZ`.
- `Element3D` inside `Step` will be positioned relative to that step's coordinate system, not the global 3D space.
- `Step`, `Element3D`, and `Scene3D` must be imported from `remotion-bits`, not from `remotion`.
- `Step` has `transition` and `exitTransition` props to define how the content enters and exits the view when the camera moves to/from that step.

```tsx
import { Scene3D, Step, Element3D, useViewportRect } from "remotion-bits";

const rect = useViewportRect();

<Scene3D perspective={1000} transitionDuration={30} easing="easeInOutCubic">
  <Step x={0} y={0} z={0}>
    <h1>Hello in 3D</h1>
  </Step>
  <Step x={rect.cx} y={rect.cy} z={500} rotateY={45}>
    <h1>Camera moves here</h1>
  </Step>

  <Element3D x={100} y={100} z={0}>
    <div>3D positioned element</div>
  </Element3D>
</Scene3D>
```

## Utilities

### interpolate
Supports non-monotonic ranges and easing:
```tsx
import { interpolate } from "remotion-bits";

// Hold value: input [0, 30, 30, 60] output [0, 0, 100, 100]
const value = interpolate(frame, [0, 30, 30, 60], [0, 0, 100, 100]);
```

### Color interpolation
Perceptually uniform Oklch color transitions:
```tsx
import { interpolateColorKeyframes } from "remotion-bits";

const color = interpolateColorKeyframes(["#ff0000", "#00ff00", "#0000ff"], progress);
```

### Geometry helpers
```tsx
import { Rect, resolvePoint, createRect } from "remotion-bits";

const rect = createRect(1920, 1080);
const center = resolvePoint(rect, "center");
const custom = resolvePoint(rect, { x: "50%", y: 100 });
```

## Reference Files

For detailed API documentation:
- [references/components.md](references/components.md) - Full component props reference
- [references/utilities.md](references/utilities.md) - Utility functions reference
- [references/patterns.md](references/patterns.md) - Common animation patterns
