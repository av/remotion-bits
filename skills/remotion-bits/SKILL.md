---
name: remotion-bits
description: Animation components and utilities for Remotion video projects. Use when building Remotion compositions with text animations, gradient transitions, particle effects, 3D scenes, or staggered motion effects. Provides example bits (complete compositions) and reusable components that can be installed via jsrepo.
---

# Remotion Bits

Animation components and utilities for building Remotion videos. Provides reusable components (AnimatedText, Particles, Scene3D, etc.) and complete example compositions (bits).

**Prerequisites:** `remotion` >= 4.0, `react` >= 18, `react-dom` >= 18

```bash
# Via npm
npm install remotion-bits

# Via jsrepo (copies source for customization)
npx jsrepo init https://unpkg.com/remotion-bits/registry.json
npx jsrepo add animated-text particle-system scene-3d
```

## Imports

Everything is exported from `remotion-bits`:

```tsx
import {
  // Components
  AnimatedText, AnimatedCounter, TypeWriter, CodeBlock,
  StaggeredMotion, GradientTransition, MatrixRain, ScrollingColumns,
  Particles, Spawner, Behavior,
  Scene3D, Step, Element3D, StepResponsive,
  // Hooks
  useViewportRect, useScene3D, useCamera, useActiveStep,
  // Utilities
  interpolate, Easing, Transform3D, Vector3,
  interpolateColorKeyframes, interpolateGradientKeyframes,
  random, resolvePoint, createRect,
} from "remotion-bits";
```

## Core Concepts

### 1. AnimatedValue

Most animation properties accept `AnimatedValue`: a static number OR an array of keyframes interpolated over the animation's duration.

```tsx
opacity: 1                // Static
opacity: [0, 1]           // Animate 0→1
opacity: [0, 1, 0.5, 0]  // Multi-keyframe: 0→1→0.5→0 evenly spaced
scale: [0.8, 1]           // Scale from 80% to 100%
y: [30, 0]                // Slide up from 30px offset
```

Keyframes are evenly distributed across the duration. With 4 keyframes over 60 frames: frame 0→20→40→60.

### 2. Responsive Sizing with useViewportRect

**Never hardcode pixel values.** Always use viewport-relative units:

```tsx
const rect = useViewportRect();
// rect.width   — composition width (e.g. 1920)
// rect.height  — composition height (e.g. 1080)
// rect.vw      — 1% of width (19.2)
// rect.vh      — 1% of height (10.8)
// rect.vmin    — min(vw, vh) — USE THIS for most sizing
// rect.vmax    — max(vw, vh)
// rect.cx, cy  — center coordinates
const { vmin } = rect;

<div style={{ fontSize: vmin * 5 }}>Scales with any resolution</div>
<div style={{ width: vmin * 60, height: vmin * 30 }}>Responsive card</div>
```

Use `vmin` for font sizes, element dimensions, spacing, and padding. This ensures compositions render identically at 1920×1080, 1080×1920, 3840×2160, etc.

### 3. Transition Props Pattern

Components accept a `transition` prop with this shape:

```tsx
transition={{
  // Timing
  duration: 30,           // Duration in frames
  delay: 10,              // Delay before start
  frames: [0, 60],        // Or explicit frame range (alternative to duration)
  easing: "easeOutCubic", // Easing curve

  // Transform (all accept AnimatedValue)
  x: [30, 0],             // translateX
  y: [30, 0],             // translateY
  z: [0, 100],            // translateZ (3D)
  scale: [0.8, 1],        // uniform scale
  scaleX, scaleY,         // axis scale
  rotate: [0, 360],       // 2D rotation (degrees)
  rotateX, rotateY, rotateZ, // 3D rotation (degrees)
  skew, skewX, skewY,     // skew (degrees)
  transform: Transform3D[], // 3D transform keyframes (see Transform3D section)

  // Visual (all accept AnimatedValue)
  opacity: [0, 1],
  blur: [10, 0],          // Gaussian blur in pixels
  borderRadius: [0, 20],
  color: ["#ff0000", "#00ff00"],           // CSS color interpolation
  backgroundColor: ["#000", "#fff"],
}}
```

### 4. Easing Functions

```tsx
type EasingName =
  | "linear"
  | "easeIn" | "easeOut" | "easeInOut"
  | "easeInQuad" | "easeOutQuad" | "easeInOutQuad"
  | "easeInCubic" | "easeOutCubic" | "easeInOutCubic"
  | "easeInSine" | "easeOutSine" | "easeInOutSine"
  | "easeInQuart" | "easeOutQuart" | "easeInOutQuart";
```

Most common: `"easeOutCubic"` for entries, `"easeInOutCubic"` for camera moves.

---

## Transform3D (Critical for Complex Scenes)

`Transform3D` represents a 3D transformation (position + rotation + scale) using Three.js internals. It is **immutable by convention** — every method returns a new instance.

```tsx
import { Transform3D, Vector3 } from "remotion-bits";
```

### Creating Transforms

```tsx
const base = Transform3D.identity(); // Origin: position(0,0,0), rotation(0,0,0), scale(1,1,1)
```

### Chaining Transforms

Every method returns a new Transform3D. Chain freely:

```tsx
const cardPosition = base
  .translate(vmin * 50, vmin * -20, 0)  // Move right and up
  .rotateY(-15)                          // Rotate around Y axis (degrees)
  .scaleBy(1.5);                         // Scale uniformly by 1.5x
```

### Available Methods

```tsx
// Position
transform.translate(x, y, z)           // Add to position
transform.translate(vector3)            // Add Vector3 to position

// Rotation (angles in DEGREES)
transform.rotateX(degrees)              // Rotate around X axis
transform.rotateY(degrees)              // Rotate around Y axis
transform.rotateZ(degrees)              // Rotate around Z axis
transform.rotateAround(origin, axis, degrees) // Rotate around arbitrary point+axis

// Scale
transform.scaleBy(uniform)             // Scale all axes equally
transform.scaleBy(sx, sy, sz)          // Scale per-axis

// Composition
transform.multiply(other)              // Matrix multiplication
transform.inverse()                    // Invert transform
transform.lerp(target, alpha)          // Linear interpolation (0-1)
transform.clone()                      // Deep copy

// Randomization (deterministic via seed)
transform.randomTranslate([minX, maxX], [minY, maxY], [minZ, maxZ], seed)
transform.randomRotateX([minDeg, maxDeg], seed)
transform.randomRotateY([minDeg, maxDeg], seed)
transform.randomRotateZ([minDeg, maxDeg], seed)

// Conversion
transform.toProps()                    // → { x, y, z, rotateX, rotateY, rotateZ, scaleX, scaleY, scaleZ, rotateOrder }
transform.toCSSMatrix3D()              // → "matrix3d(...)" CSS string
transform.toMatrix4()                  // → Three.js Matrix4
```

### Using Transform3D with Step/Element3D

The `.toProps()` method converts a Transform3D to props that Step and Element3D accept:

```tsx
const position = base.translate(vmin * 50, 0, 0).rotateY(-15);

// Spread directly into Step or Element3D
<Step id="my-step" {...position.toProps()} />
```

This is equivalent to manually specifying `x={...} y={...} z={...} rotateX={...} rotateY={...} rotateZ={...}`.

### Using Transform3D as Keyframes

Pass `Transform3D[]` arrays as the `transform` property for smooth 3D interpolation between positions:

```tsx
const start = base.translate(0, vmin * 20, 0);
const end = base.translate(0, 0, 0);

<Element3D
  centered
  transition={{
    duration: 35,
    transform: [start, end],  // Interpolates position, rotation, scale via slerp
    opacity: [0, 1],
    easing: "easeInOutCubic",
  }}
>
  <div>Animates from start to end</div>
</Element3D>
```

Transform keyframes use quaternion slerp for rotation (no gimbal lock) and linear interpolation for position and scale.

### Vector3

Three.js `Vector3` is re-exported for position math:

```tsx
const offset = new Vector3(0, -vmin * 2, 0);
const farOffset = offset.clone().multiplyScalar(4.0); // Scale the offset
const combined = offset.clone().add(new Vector3(vmin * 5, 0, 0));
```

---

## Scene3D System (3D Presentations)

Scene3D creates camera-based 3D presentations (like impress.js). The camera flies between Steps; content is placed in 3D space.

### Architecture

```
Scene3D (perspective, timing)
├── Step (camera target 1) — children visible during this step
├── Step (camera target 2) — children visible during this step
├── ...
├── StepResponsive — element that animates differently per step
├── StepResponsive — another step-aware element
└── (any other children — always rendered)
```

### Scene3D Container

```tsx
<Scene3D
  perspective={1000}            // CSS perspective in px (depth effect)
  stepDuration={60}             // Default frames per step
  transitionDuration={60}       // Frames for camera transitions between steps
  easing="easeInOutCubic"       // Camera transition easing
>
  {/* Steps and content */}
</Scene3D>
```

### Steps (Camera Targets)

Steps define where the camera flies to. They execute sequentially. Content inside a Step is visible when that step is active.

```tsx
<Step
  id="intro"                   // Unique identifier (used by StepResponsive)
  {...position.toProps()}       // Camera target position/rotation/scale
  duration={120}               // Override stepDuration for this step (optional)
  transition={{                // Animate children on step ENTRY (optional)
    opacity: [0, 1],
    blur: [10, 0],
    duration: 20,
  }}
  exitTransition={{            // Animate children on step EXIT (optional)
    opacity: [1, 0],
    blur: [0, 10],
  }}
>
  {/* Content shown during this step */}
  <FloatingCard>...</FloatingCard>
</Step>
```

**Step timing model:**
- Steps play sequentially: step1 → transition → step2 → transition → step3
- `stepDuration` (on Scene3D): default duration each step is active
- `duration` (on Step): override for specific step
- `transitionDuration` (on Scene3D): how long the camera takes to move between steps
- Total composition should be ≥ sum of all step durations

### Element3D (3D Positioned Content)

Places content at a specific 3D position, independent of camera:

```tsx
<Element3D
  centered                     // Center-align the element (transform-origin: center)
  x={vmin * 50} y={0} z={0}   // Position in 3D space
  style={{ width: vmin * 60 }}
  transition={{                // Animate on mount (optional)
    delay: 20,
    opacity: [0, 1],
    duration: 35,
    transform: [startTransform, endTransform], // 3D keyframes
    easing: "easeInOutCubic",
  }}
>
  <div>Content positioned in 3D space</div>
</Element3D>
```

### StepResponsive (Step-Aware Animations)

The key to complex scenes. Elements define how they should look/position at each step, and animate between states when the camera moves:

```tsx
<StepResponsive
  centered                     // Center the child
  style={{ position: 'absolute', fontSize }}
  steps={{
    // Key = step ID, Value = properties at that step
    'intro': {
      transform: [base, shiftedPosition],  // Transform3D keyframes
      opacity: [0, 1],
    },
    'elements': {
      transform: [elementPosition],        // Hold at this position
    },
    'outro': {
      transform: [outroStart, outroEnd],
      opacity: [1, 1, 1, 0],              // Hold visible, then fade
      duration: "step",                    // Match step duration
      easing: "easeInOutCubic",
    },
  }}
>
  <h1>Title That Follows Camera</h1>
</StepResponsive>
```

**StepResponsive key behaviors:**
- Properties **accumulate/inherit**: if step "elements" doesn't set opacity, it keeps the value from the last step that set it
- Arrays flatten to their final value when moving to the next step (no re-animation of past keyframes)
- `transform` accepts `Transform3D[]` arrays — the primary way to position elements in 3D
- `duration: "step"` makes the animation last the entire step duration
- You can map the same props to multiple step IDs to hold position across steps

**Mapping same props to multiple steps** (common pattern):

```tsx
const mapToAllElementSteps = (props) => ({
  'elements': props,
  'element-particles': props,
  'element-text': props,
  'element-code': props,
});

<StepResponsive
  steps={{
    'intro': { transform: [introPosition] },
    ...mapToAllElementSteps({ transform: [elementPosition] }),
    'outro': { transform: [outroPosition] },
  }}
>
  <h1>Elements</h1>
</StepResponsive>
```

---

## Building Complex Scenes (Architecture Guide)

### Step 1: Plan the Scene Structure

Decide on the major sections (acts) and what the camera shows in each:

```
intro → elements → element-particles → element-text → ... → transitions → scenes → outro
```

Each section = one Step. Steps execute sequentially.

### Step 2: Pre-compute All Positions

Use `useMemo` to build a position tree. This is THE critical architectural pattern:

```tsx
const positions = useMemo(() => {
  const { vmin } = rect;
  const base = Transform3D.identity();

  // Define base positions for each scene section
  const elementsBase = base.translate(0, -vmin * 120, 0).rotateX(15);
  const transitionsBase = base.translate(vmin * 200, vmin * 50, 0).rotateY(-15);
  const scenesBase = base.translate(-vmin * 120, vmin * 70, 0).rotateY(15);

  // Derive sub-positions from bases
  const cardW = vmin * 70;
  const particlesCard = elementsBase.translate(-cardW, -vmin * 40, 0).rotateY(15);
  const textCard = elementsBase.translate(0, -vmin * 50, vmin * 10).rotateX(10);

  return {
    base,
    elements: {
      base: elementsBase,
      cards: { particles: particlesCard, text: textCard },
    },
    transitions: { base: transitionsBase },
    scenes: { base: scenesBase },
  };
}, [rect.width, rect.height]); // Re-compute on resize
```

**Why pre-compute positions?**
- Separation of layout from rendering
- Positions can be derived from each other (hierarchy)
- Easy to adjust entire sections by changing the base
- StepResponsive needs position references, not inline calculations

### Step 3: Define Steps

```tsx
<Scene3D perspective={1000} stepDuration={60} transitionDuration={60}>
  <Step id="intro" {...positions.base.toProps()} />
  <Step id="elements" {...positions.elements.base.toProps()} />
  <Step id="element-particles"
    {...positions.elements.cards.particles.toProps()}
    transition={{ opacity: [0, 1], blur: [10, 0] }}
  >
    <FloatingCard><ParticleDemo /></FloatingCard>
  </Step>
  <Step id="transitions" duration={120} {...positions.transitions.base.toProps()} />
  <Step id="scenes" duration={120} {...positions.scenes.base.toProps()} />
  <Step id="outro" {...positions.base.toProps()} duration={120} />
</Scene3D>
```

### Step 4: Add Step-Responsive Elements

Titles, icons, and persistent elements that move with the camera:

```tsx
<StepResponsive
  centered
  style={{ fontSize: vmin * 10, position: 'absolute' }}
  steps={{
    'intro': { transform: [positions.base, positions.base.translate(vmin * 7, 0, 0)] },
    'elements': { transform: [positions.elements.base.translate(vmin * 7, 0, 0)] },
    'outro': {
      transform: [positions.base.translate(vmin * 7, 0, 0), positions.base],
      duration: "step",
      easing: "easeInOutCubic",
    },
  }}
>
  <h1>Remotion Bits</h1>
</StepResponsive>
```

### Step 5: Content Inside Steps

Steps can contain rich content — cards, particles, code blocks, counters:

```tsx
<Step id="element-particles" {...cardPos.toProps()}
  transition={{ opacity: [0, 1], blur: [10, 0] }}>
  <FloatingCard>
    <Particles style={{ position: 'absolute', inset: 0, opacity: 0.6 }}>
      <Spawner rate={1} max={200} lifespan={80}
        velocity={{ x: 0, y: -0.6, varianceX: 0.4, varianceY: 0.2 }}
        area={{ width: rect.width, height: rect.height }}>
        <div style={{ width: vmin * 2, height: vmin * 2, borderRadius: '50%',
          background: 'var(--color-primary)' }} />
      </Spawner>
      <Behavior drag={0.96}
        wiggle={{ magnitude: 0.6, frequency: 0.25 }}
        opacity={[1, 0]}
        scale={{ start: 1, end: 0.4 }} />
    </Particles>
    <span style={{ position: 'relative', zIndex: 1, fontWeight: 'bold',
      fontSize: vmin * 3, fontFamily: 'monospace' }}>Particles</span>
  </FloatingCard>
</Step>
```

---

## Components Quick Reference

### AnimatedText

```tsx
<AnimatedText
  style={{ fontSize: vmin * 5, fontWeight: 'bold' }}
  transition={{
    split: "character",           // "none" | "word" | "character" | "line" | custom separator
    splitStagger: 2,              // Frames between each unit
    opacity: [0, 1],
    y: [15, 0],
    blur: [2, 0],
    duration: 20,
    delay: 10,
    easing: "easeOutCubic",
    // Cycling text:
    cycle: { texts: ["Build", "Create", "Ship"], itemDuration: 40 },
    // Glitch effect:
    glitch: [0.6, 0],            // Glitch intensity AnimatedValue
  }}
>
  Hello World
</AnimatedText>
```

### AnimatedCounter

```tsx
<AnimatedCounter
  transition={{
    values: [0, 1000],            // Number keyframes
    color: ['#ff0000', '#00ff00'], // Color transition
    scale: [0.8, 1],
    duration: 30,
    delay: 10,
  }}
  prefix="$"
  postfix="+"
  toFixed={0}
  style={{ fontSize: vmin * 4, fontWeight: 'bold' }}
/>
```

### TypeWriter

```tsx
<TypeWriter
  text="import { TypeWriter } from 'remotion-bits';"
  typeSpeed={2}        // Frames per character
  deleteSpeed={1}
  pauseAfterType={60}  // Frames to wait before deleting
  delay={30}           // Start delay
  cursor="▋"
  style={{ fontSize: vmin * 2, fontFamily: 'monospace', whiteSpace: 'pre' }}
/>

// Multiple texts with cycling:
<TypeWriter
  text={["First line", "Second line", "Third line"]}
  deleteBeforeNext={true}
  loop={false}
  errorRate={0.05}     // 5% chance of typo
/>
```

### CodeBlock

```tsx
<CodeBlock
  code={`const x = useViewportRect();\nconsole.log(x.vmin);`}
  language="tsx"
  theme="dark"
  showLineNumbers={false}
  fontSize={vmin * 1.2}
  padding={vmin * 1.5}
  transition={{
    duration: 20,
    delay: 10,
    lineStagger: 2,                        // Frames between lines
    lineStaggerDirection: "forward",       // "forward" | "reverse" | "center" | "random"
    opacity: [0, 1],
    y: [8, 0],
    blur: [10, 0],
  }}
  highlight={[{ lines: [2, 3], color: "rgba(59,130,246,0.15)", opacity: [0, 1] }]}
  focus={{ lines: [2, 3], dimOpacity: 0.3, dimBlur: 2 }}
/>
```

### StaggeredMotion

```tsx
<StaggeredMotion
  transition={{
    opacity: [0, 1],
    scale: [0, 1],
    y: [20, 0],
    duration: 30,
    delay: 5,
    stagger: 3,                            // Frames between each child
    staggerDirection: "forward",           // "forward"|"reverse"|"center"|"random"
    easing: "easeOutCubic",
    borderRadius: 4,
  }}
>
  <div>Child 1</div>
  <div>Child 2</div>
  <div>Child 3</div>
</StaggeredMotion>
```

### GradientTransition

```tsx
<GradientTransition
  gradient={[
    "linear-gradient(0deg, #051226, #1e0541)",
    "linear-gradient(180deg, #a5d4dd, #5674b1)",
  ]}
  duration={90}
  easing="easeInOut"
  shortestAngle={true}   // Interpolate angles via shortest path
/>
```

### MatrixRain

```tsx
<MatrixRain fontSize={18} color="#00FF00" speed={1.2} density={0.8} streamLength={20} />
```

### ScrollingColumns

```tsx
<ScrollingColumns
  columns={[
    { images: ["/img1.jpg", "/img2.jpg"], speed: 100, direction: "up" },
    { images: ["/img3.jpg", "/img4.jpg"], speed: 150, direction: "down" },
  ]}
  height={rect.vmin * 40}
  gap={rect.vmin * 2}
/>
```

### Particle System

```tsx
<Particles style={{ position: 'absolute', inset: 0 }}>
  <Spawner
    rate={2}           // Particles per frame
    max={200}          // Maximum alive particles
    lifespan={100}     // Frames each particle lives
    burst={50}         // Emit 50 on first frame (optional)
    position={resolvePoint(rect, "center")}
    area={{ width: rect.width, height: 0 }}  // Spawn area
    velocity={{ x: 0, y: -2, varianceX: 1, varianceY: 0.5 }}
  >
    {/* Multiple children = random selection per particle */}
    <div style={{ width: vmin * 2, height: vmin * 2, borderRadius: '50%', background: '#fff' }} />
    <div style={{ width: vmin * 1, height: vmin * 1, borderRadius: '50%', background: '#aaa' }} />
  </Spawner>

  <Behavior
    gravity={{ y: 0.1 }}                              // Constant force
    drag={0.96}                                        // Air resistance (1=none, 0=instant stop)
    wiggle={{ magnitude: 0.6, frequency: 0.25 }}       // Random oscillation
    opacity={[1, 0]}                                   // Fade out over lifetime
    scale={{ start: 1, end: 0.3, startVariance: 0.2 }} // Shrink over lifetime
  />
</Particles>
```

---

## Procedural Content Generation

For grids, backgrounds, and data-driven visuals, use deterministic `random()`:

```tsx
import { random } from 'remotion-bits';

const items = useMemo(() => {
  const palette = ['#fb4934', '#b8bb26', '#fabd2f', '#83a598'];
  const result = [];

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 20; c++) {
      const seed = `grid-${r}-${c}`;
      const colorIndex = Math.floor(random(seed + 'color') * palette.length);
      const dist = Math.sqrt(r * r + c * c);

      result.push(
        <StaggeredMotion key={`${r}-${c}`}
          transition={{
            opacity: [0, 1],
            scale: [0, 1],
            delay: 30 + dist * 2,  // Wave from top-left
            duration: 40,
          }}>
          <div style={{
            width: vmin * 5, height: vmin * 5,
            background: palette[colorIndex],
          }} />
        </StaggeredMotion>
      );
    }
  }
  return result;
}, [vmin]);
```

`random(seed)` is deterministic — same seed always returns same value. Use unique string seeds per element.

---

## Utility Functions

### interpolate (non-monotonic)

Unlike Remotion's built-in, supports non-monotonic input ranges:

```tsx
import { interpolate, Easing } from "remotion-bits";

// Hold then animate
interpolate(frame, [0, 30, 30, 60], [0, 0, 100, 100]);

// With easing
interpolate(frame, [0, 60], [0, 100], { easing: "easeOutCubic" });

// Clamp extrapolation
interpolate(frame, [0, 60], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
```

### Color Interpolation

```tsx
import { interpolateColorKeyframes } from "remotion-bits";

// Perceptually uniform (Oklch) color transitions
const color = interpolateColorKeyframes(["#ff0000", "#00ff00", "#0000ff"], progress);
```

### Geometry

```tsx
import { resolvePoint, createRect, Rect } from "remotion-bits";

const point = resolvePoint(rect, "center");       // { x: 960, y: 540 }
const point2 = resolvePoint(rect, { x: "50%", y: "25%" }); // { x: 960, y: 270 }
```

---

## Bit Metadata Format

Bits export a `metadata` object and a `Component`:

```tsx
export const metadata = {
  name: "MyBit",
  description: "Description of the bit.",
  tags: ["tag1", "tag2"],
  duration: 300,          // Total frames
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-my-bit",
    title: "My Bit",
    description: "Registry description.",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["animated-text", "scene-3d", "use-viewport-rect"],
    dependencies: [],
    files: [{ path: "path/to/MyBit.tsx" }],
  },
};

export const Component: React.FC = () => { /* ... */ };
```

---

## Common Patterns

### Floating Card Container

```tsx
const FloatingCard = ({ children }) => (
  <div style={{
    position: 'relative',
    width: vmin * 60, height: vmin * 30,
    background: 'rgba(20, 20, 30, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: vmin * 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: '0 0 20px rgba(0,0,0,0.2)',
  }}>
    {children}
  </div>
);
```

### Scene with Entry Animations per Step

```tsx
<Step id="particles-demo" {...cardPosition.toProps()}
  transition={{ opacity: [0, 1], blur: [10, 0] }}>
  <FloatingCard>
    {/* Content appears when camera arrives */}
  </FloatingCard>
</Step>
```

### Step-Responsive Title Tracking Camera

```tsx
<StepResponsive
  centered
  style={{ fontSize: vmin * 10, position: 'absolute', width: 'max-content' }}
  steps={{
    'intro': { transform: [startPos] },
    'main': { transform: [mainPos] },
    'outro': { transform: [mainPos, endPos], duration: "step", easing: "easeInOutCubic" },
  }}
>
  <h1>Section Title</h1>
</StepResponsive>
```

### Animated Grid with Wave Timing

```tsx
const dist = Math.sqrt(Math.pow(r - centerRow, 2) + Math.pow(c - centerCol, 2));
const delay = 30 + dist * 2; // Ripple outward from center

<StaggeredMotion transition={{ opacity: [0, 1], scale: [0, 1], delay, duration: 40 }}>
  <div style={{ width: size, height: size, background: color }} />
</StaggeredMotion>
```

### Exit Transitions on Steps

```tsx
<Step id="transitions" duration={120} {...pos.toProps()}
  exitTransition={{ blur: [0, 10], opacity: [1, 0] }}>
  {/* Content blurs out when camera leaves */}
</Step>
```

### Element3D with Transform Keyframes

```tsx
<Element3D centered
  style={{ width: vmin * 32, height: vmin * 24 }}
  transition={{
    delay: 10,
    opacity: [0, 1],
    duration: 35,
    transform: [
      base.translate(0, vmin * 20, 0),  // Start below
      base.translate(0, 0, 0),           // End at position
    ],
    easing: 'easeInOutCubic',
  }}>
  <div>slides up into place</div>
</Element3D>
```

---

## Reference Documentation

For exhaustive API details:
- [references/components.md](references/components.md) - Complete component props tables
- [references/utilities.md](references/utilities.md) - All utility functions
- [references/patterns.md](references/patterns.md) - More animation recipes and examples