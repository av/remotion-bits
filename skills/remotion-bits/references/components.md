# Components Reference

## Table of Contents
- [AnimatedText](#animatedtext)
- [StaggeredMotion](#staggeredmotion)
- [GradientTransition](#gradienttransition)
- [Particle System](#particle-system)
- [Scene3D](#scene3d)

---

## AnimatedText

### Props

| Prop | Type | Description |
|------|------|-------------|
| `transition` | `AnimatedTextTransitionProps` | Animation configuration |
| `children` | `React.ReactNode` | Text content to animate |
| `className` | `string?` | CSS class names |
| `style` | `React.CSSProperties?` | Inline styles |

### Transition Props

**Text-specific:**
- `split`: `"none" | "word" | "character" | "line" | string` - Split mode or custom separator
- `splitStagger`: `number` - Frames between each split unit (default: 0)
- `cycle`: `{ texts: string[]; itemDuration: number }` - Cycle through text array

**Transform properties (all accept AnimatedValue):**
- `x`, `y`, `z` - Translation in pixels
- `scale`, `scaleX`, `scaleY` - Scale factor
- `rotate`, `rotateX`, `rotateY`, `rotateZ` - Rotation in degrees
- `skew`, `skewX`, `skewY` - Skew in degrees

**Visual properties:**
- `opacity`: `AnimatedValue` - 0 to 1
- `color`: `string[]` - Array of CSS colors to interpolate
- `backgroundColor`: `string[]` - Array of CSS colors
- `blur`: `AnimatedValue` - Blur in pixels

**Timing:**
- `frames`: `[number, number]` - Start and end frame
- `duration`: `number` - Duration in frames (alternative to frames)
- `delay`: `number` - Delay before animation starts
- `easing`: `EasingName | EasingFunction` - Easing curve

---

## StaggeredMotion

### Props

| Prop | Type | Description |
|------|------|-------------|
| `transition` | `StaggeredMotionTransitionProps` | Animation configuration |
| `children` | `React.ReactNode` | Child elements to animate |
| `className` | `string?` | CSS class names |
| `style` | `React.CSSProperties?` | Inline styles |
| `cycleOffset` | `number?` | Override frame for relative animations |

### Transition Props

Inherits all transform, visual, and timing props from AnimatedText, plus:

- `stagger`: `number` - Frames between each child (default: 0)
- `staggerDirection`: `"forward" | "reverse" | "center" | "random"` - Animation order

---

## GradientTransition

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gradient` | `string[]` | required | CSS gradient strings to transition |
| `frames` | `[number, number]?` | `[0, duration]` | Frame range |
| `duration` | `number?` | composition duration | Duration in frames |
| `delay` | `number?` | `0` | Start frame |
| `easing` | `EasingName | EasingFunction?` | `"linear"` | Easing curve |
| `shortestAngle` | `boolean?` | `true` | Interpolate angles via shortest path |
| `className` | `string?` | | CSS class names |
| `style` | `React.CSSProperties?` | | Inline styles |
| `children` | `React.ReactNode?` | | Content on top of gradient |

### Supported Gradient Types
- `linear-gradient(angle, color1, color2, ...)`
- `radial-gradient(shape at position, color1, color2, ...)`
- `conic-gradient(from angle at position, color1, color2, ...)`

---

## Particle System

### Particles

Container component that runs the simulation.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `startFrame` | `number?` | `0` | Pre-simulate this many frames |
| `children` | `React.ReactNode` | | Spawner and Behavior components |
| `style` | `React.CSSProperties?` | | Container styles |
| `className` | `string?` | | CSS class names |

### Spawner

Defines particle emission source.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string?` | auto-generated | Unique spawner ID |
| `rate` | `number` | required | Particles per frame |
| `burst` | `number?` | | Particles to emit on first frame |
| `max` | `number?` | | Max active particles |
| `lifespan` | `number` | required | Frames each particle lives |
| `startFrame` | `number?` | `0` | Frame offset for this spawner |
| `position` | `Point?` | `{x:0, y:0}` | Spawn position |
| `area` | `{width, height, depth?}?` | | Spawn area size |
| `velocity` | `VelocityConfig?` | | Initial velocity |
| `transition` | `TransitionProps?` | | Animation applied to each particle |
| `children` | `React.ReactNode` | | Particle visual(s) |

**VelocityConfig:**
```ts
{
  x?: number; y?: number; z?: number;
  varianceX?: number; varianceY?: number; varianceZ?: number;
}
```

### Behavior

Defines physics and property changes.

| Prop | Type | Description |
|------|------|-------------|
| `gravity` | `{x?, y?, z?, varianceX?, varianceY?, varianceZ?}` | Force vector |
| `drag` | `number` | Air resistance (0-1, where 1 = no drag) |
| `dragVariance` | `number` | Random variation in drag |
| `wiggle` | `{magnitude, frequency, variance?}` | Random movement |
| `scale` | `{start, end, startVariance?, endVariance?}` | Scale over life |
| `opacity` | `number[]` | Opacity keyframes over life |
| `handler` | `(particle) => void` | Custom particle modifier |

---

## Scene3D

### Scene3D

Container for 3D scene with camera.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `perspective` | `number?` | `1000` | CSS perspective in pixels |
| `transitionDuration` | `number?` | `30` | Frames for camera transitions |
| `easing` | `EasingName | EasingFunction?` | `"easeInOutCubic"` | Transition easing |
| `activeStep` | `string?` | | Force specific step by ID |
| `stepDuration` | `number?` | auto | Duration per step in frames |
| `width` | `number?` | video width | Design width |
| `height` | `number?` | video height | Design height |
| `children` | `React.ReactNode` | | Step and Element3D components |

### Step

Defines a camera position/target.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string?` | auto-generated | Step identifier |
| `x`, `y`, `z` | `AnimatedValue?` | `0` | Camera target position |
| `scale`, `scaleX`, `scaleY` | `AnimatedValue?` | `1` | Camera zoom |
| `rotateX`, `rotateY`, `rotateZ` | `AnimatedValue?` | `0` | Camera rotation |
| `rotateOrder` | `"xyz" | "xzy" | "yxz" | ...` | `"xyz"` | Rotation order |
| `children` | `React.ReactNode?` | | Content visible during step |

### Element3D

Positions content in 3D space.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `x`, `y`, `z` | `AnimatedValue?` | `0` | Position in 3D space |
| `scale`, `scaleX`, `scaleY` | `AnimatedValue?` | `1` | Scale |
| `rotateX`, `rotateY`, `rotateZ` | `AnimatedValue?` | `0` | Rotation |
| `children` | `React.ReactNode` | | Content to position |
| `style` | `React.CSSProperties?` | | Additional styles |

### Hooks

- `useScene3D()` - Returns `{ camera, activeStepId, registerStep, steps }`
- `useCamera()` - Returns current camera state
- `useActiveStep()` - Returns currently active step ID
