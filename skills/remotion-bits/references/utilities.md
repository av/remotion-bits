# Utilities Reference

## Table of Contents
- [interpolate](#interpolate)
- [Color Utilities](#color-utilities)
- [Gradient Utilities](#gradient-utilities)
- [Geometry Utilities](#geometry-utilities)
- [Motion Utilities](#motion-utilities)
- [Random Utilities](#random-utilities)
- [Hooks](#hooks)

---

## interpolate

Custom interpolation supporting non-monotonic ranges (unlike Remotion's built-in).

```ts
import { interpolate, Easing } from "remotion-bits";

interpolate(
  input: number,
  inputRange: number[],
  outputRange: number[],
  options?: {
    extrapolateLeft?: 'clamp' | 'extend' | 'identity';
    extrapolateRight?: 'clamp' | 'extend' | 'identity';
    easing?: EasingFunction | EasingName;
  }
): number
```

### Key Features
- **Non-monotonic ranges**: Input doesn't need to be ascending
- **Hold frames**: Use duplicate values like `[0, 30, 30, 60]` to hold a value
- **Easing**: Apply easing to segments

### Examples

```ts
// Hold value at 0 from frames 0-30, then animate to 100
interpolate(frame, [0, 30, 30, 60], [0, 0, 100, 100]);

// With easing
interpolate(frame, [0, 60], [0, 100], { easing: "easeOutCubic" });

// Clamp extrapolation
interpolate(frame, [0, 60], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

### Easing Functions

Available easing names:
```ts
type EasingName =
  | "linear"
  | "easeIn" | "easeOut" | "easeInOut"
  | "easeInQuad" | "easeOutQuad" | "easeInOutQuad"
  | "easeInCubic" | "easeOutCubic" | "easeInOutCubic"
  | "easeInSine" | "easeOutSine" | "easeInOutSine"
  | "easeInQuart" | "easeOutQuart" | "easeInOutQuart";
```

Access functions directly:
```ts
import { Easing } from "remotion-bits";
const value = Easing.easeOutCubic(0.5); // 0.875
```

---

## Color Utilities

### interpolateColorKeyframes

Perceptually uniform color transitions using Oklch color space.

```ts
import { interpolateColorKeyframes } from "remotion-bits";

interpolateColorKeyframes(
  colors: string[],      // CSS color strings
  progress: number,      // 0 to 1
  easingFn?: EasingFunction
): string  // Returns "rgb(r, g, b)" or "rgba(r, g, b, a)"
```

### Example

```ts
// Transition through multiple colors
const color = interpolateColorKeyframes(
  ["#ff0000", "#00ff00", "#0000ff"],
  progress,
  Easing.easeInOut
);
```

---

## Gradient Utilities

### interpolateGradientKeyframes

Interpolates between CSS gradient strings.

```ts
import { interpolateGradientKeyframes } from "remotion-bits";

const gradient = interpolateGradientKeyframes(
  [
    "linear-gradient(0deg, red, blue)",
    "linear-gradient(180deg, green, yellow)"
  ],
  progress,
  { shortestAngle: true }
);
```

Features:
- Handles different gradient types (linear, radial, conic)
- Interpolates angles via shortest path when `shortestAngle: true`
- Auto-distributes color stops

---

## Geometry Utilities

### Rect Class

Represents a rectangle with viewport-relative units.

```ts
import { Rect, createRect } from "remotion-bits";

const rect = createRect(1920, 1080);

// Properties
rect.width;   // 1920
rect.height;  // 1080
rect.x;       // 0 (always)
rect.y;       // 0 (always)
rect.cx;      // 960 (horizontal center)
rect.cy;      // 540 (vertical center)
rect.center;  // { x: 960, y: 540 }

// Viewport units (CSS-like)
rect.vw;      // 19.2 (width / 100)
rect.vh;      // 10.8 (height / 100)
rect.vmin;    // 10.8 (min of vw, vh)
rect.vmax;    // 19.2 (max of vw, vh)

// Edge positions
rect.left;    // 0
rect.right;   // 1920
rect.top;     // 0
rect.bottom;  // 1080
```

### resolvePoint

Converts position descriptors to absolute coordinates.

```ts
import { resolvePoint } from "remotion-bits";

// String presets
resolvePoint(rect, "center");      // { x: 960, y: 540 }
resolvePoint(rect, "topLeft");     // { x: 0, y: 0 }
resolvePoint(rect, "bottomRight"); // { x: 1920, y: 1080 }

// Percentage strings
resolvePoint(rect, { x: "50%", y: "25%" }); // { x: 960, y: 270 }

// Numbers (absolute)
resolvePoint(rect, { x: 100, y: 200 }); // { x: 100, y: 200 }

// Tuple
resolvePoint(rect, ["50%", 100]); // { x: 960, y: 100 }
```

### parseRelativeValue

Parse percentage or number values.

```ts
import { parseRelativeValue } from "remotion-bits";

parseRelativeValue("50%", 1920);  // 960
parseRelativeValue(100, 1920);    // 100
parseRelativeValue("center", 1920); // 960
```

---

## Motion Utilities

### interpolateKeyframes

Interpolates through keyframe values.

```ts
import { interpolateKeyframes } from "remotion-bits";

// AnimatedValue: number | [number, number] | number[]
interpolateKeyframes(
  value: AnimatedValue,
  progress: number,      // 0 to 1
  easingFn?: EasingFunction
): number
```

### useMotionTiming

Hook for calculating animation progress.

```ts
import { useMotionTiming } from "remotion-bits";

const progress = useMotionTiming({
  frames: [0, 60],
  duration: 60,
  delay: 0,
  stagger: 0,
  unitIndex: 0,
  easing: "easeOutCubic",
  cycleOffset: undefined
});
```

### buildMotionStyles

Builds CSS styles from motion configuration.

```ts
import { buildMotionStyles } from "remotion-bits";

const style = buildMotionStyles({
  progress: 0.5,
  transforms: { x: [0, 100], y: [0, 50], rotate: [0, 360] },
  styles: { opacity: [0, 1], blur: [10, 0] },
  easing: Easing.easeOut,
  baseStyle: { display: "inline-block" }
});
```

### getEasingFunction

Resolve easing name to function.

```ts
import { getEasingFunction } from "remotion-bits";

const fn = getEasingFunction("easeOutCubic");
// or
const fn = getEasingFunction((t) => t * t);
```

---

## Random Utilities

Deterministic random value generation (uses Remotion's seed-based random).

```ts
import { random } from "remotion-bits";

// These use Remotion's deterministic random internally
random(seed: string | number): number  // 0 to 1
```

---

## Hooks

### useViewportRect

Returns a Rect for the current composition.

```ts
import { useViewportRect } from "remotion-bits";

const rect = useViewportRect();
// rect.width, rect.height, rect.vmin, rect.vmax, etc.
```

### Scene3D Hooks

```ts
import { useScene3D, useCamera, useActiveStep } from "remotion-bits";

// Full context
const { camera, activeStepId, steps, registerStep } = useScene3D();

// Just camera state
const camera = useCamera();

// Just active step
const stepId = useActiveStep();
```
