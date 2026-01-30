# Common Animation Patterns

## Table of Contents
- [Text Animations](#text-animations)
- [Particle Effects](#particle-effects)
- [Gradient Backgrounds](#gradient-backgrounds)
- [3D Scenes](#3d-scenes)
- [Responsive Design](#responsive-design)

---

## Text Animations

### Fade In Word by Word

```tsx
<AnimatedText
  transition={{
    split: "word",
    splitStagger: 3,
    opacity: [0, 1],
    y: [20, 0],
    duration: 30,
    easing: "easeOutCubic"
  }}
>
  Hello World
</AnimatedText>
```

### Character by Character with Scale

```tsx
<AnimatedText
  transition={{
    split: "character",
    splitStagger: 1,
    opacity: [0, 1],
    scale: [0.7, 1],
    y: [15, 0],
    duration: 10,
    easing: "easeOutCubic"
  }}
>
  Character Animation
</AnimatedText>
```

### Blur Slide Effect

```tsx
<AnimatedText
  transition={{
    split: "word",
    splitStagger: 2,
    opacity: [0, 1],
    blur: [10, 0],
    x: [-30, 0],
    duration: 20,
    easing: "easeOutCubic"
  }}
>
  Blur Slide Text
</AnimatedText>
```

### Cycling Text (Typewriter)

```tsx
<AnimatedText
  transition={{
    cycle: {
      texts: ["Building", "Creating", "Designing"],
      itemDuration: 60
    },
    opacity: [0, 1, 1, 0],
    duration: 60,
    easing: "easeInOutCubic"
  }}
/>
```

---

## Particle Effects

### Snow Effect

```tsx
const rect = useViewportRect();

<Particles startFrame={200}>
  <Spawner
    rate={1}
    lifespan={200}
    area={{ width: rect.width, height: 0 }}
    position={resolvePoint(rect, { x: "center", y: -200 })}
    transition={{ opacity: [0, 1] }}
  >
    {/* Multiple sizes for variety */}
    <div style={{
      width: rect.vmin * 1,
      height: rect.vmin * 1,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(255,255,255,0.9), transparent 70%)"
    }} />
    <div style={{
      width: rect.vmin * 2,
      height: rect.vmin * 2,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(224,231,255,0.9), transparent 70%)"
    }} />
  </Spawner>
  <Behavior gravity={{ y: 0.1 }} />
  <Behavior wiggle={{ magnitude: 1, frequency: 0.5 }} />
</Particles>
```

### Fountain Effect

```tsx
const rect = useViewportRect();

<Particles>
  <Spawner
    rate={3}
    lifespan={100}
    position={resolvePoint(rect, { x: "center", y: rect.height })}
    velocity={{
      y: -15,
      varianceX: 3,
      varianceY: 2
    }}
  >
    <div style={{
      width: rect.vmin * 2,
      height: rect.vmin * 2,
      borderRadius: "50%",
      background: "#4f46e5"
    }} />
  </Spawner>
  <Behavior gravity={{ y: 0.3 }} />
  <Behavior opacity={[0, 1, 1, 0]} />
  <Behavior scale={{ start: 1, end: 0.3 }} />
</Particles>
```

### Flying Text Words

```tsx
const WORDS = ["React", "Remotion", "Animation"];
const rect = useViewportRect();

<Particles style={{ perspective: 5000 }}>
  <Spawner
    rate={0.2}
    lifespan={100}
    area={{ width: rect.width, height: rect.height, depth: -rect.vmin * 50 }}
    position={resolvePoint(rect, "center")}
    velocity={{ z: rect.vmin * 10, varianceZ: rect.vmin * 10 }}
  >
    {WORDS.map((word, i) => (
      <StaggeredMotion
        key={i}
        style={{ color: "white", fontSize: rect.vmin * 10 }}
        transition={{ opacity: [0, 1, 0.5, 0] }}
      >
        {word}
      </StaggeredMotion>
    ))}
  </Spawner>
</Particles>
```

---

## Gradient Backgrounds

### Linear Gradient Transition

```tsx
<GradientTransition
  gradient={[
    "linear-gradient(0deg, #051226, #1e0541)",
    "linear-gradient(180deg, #a5d4dd, #5674b1)"
  ]}
  duration={90}
  easing="easeInOut"
/>
```

### Radial Gradient Pulse

```tsx
<GradientTransition
  gradient={[
    "radial-gradient(circle at center, #ff6b6b, #4ecdc4)",
    "radial-gradient(circle at center, #4ecdc4, #ff6b6b)"
  ]}
  duration={60}
  easing="easeInOutSine"
/>
```

### Conic Gradient Rotation

```tsx
<GradientTransition
  gradient={[
    "conic-gradient(from 0deg, red, yellow, green, blue, red)",
    "conic-gradient(from 360deg, red, yellow, green, blue, red)"
  ]}
  duration={120}
  shortestAngle={false}  // Full rotation, not shortest path
/>
```

### Multi-Stop Transition

```tsx
<GradientTransition
  gradient={[
    "linear-gradient(45deg, #ff0000 0%, #ff7700 25%, #ffff00 50%, #00ff00 75%, #0000ff 100%)",
    "linear-gradient(225deg, #0000ff 0%, #00ff00 25%, #ffff00 50%, #ff7700 75%, #ff0000 100%)"
  ]}
  duration={120}
/>
```

---

## 3D Scenes

### Camera Transitions Between Steps

Steps define camera positions. The camera moves between them automatically:

```tsx
const rect = useViewportRect();
const fontSize = rect.vmin * 8;

<Scene3D
  perspective={1000}
  transitionDuration={50}
  stepDuration={50}
  easing="easeInOutCubic"
>
  <Step
    id="1"
    x={0}
    y={0}
    z={0}
    transition={{ opacity: [0, 1] }}
    exitTransition={{ opacity: [1, 0] }}
  >
    <h1 style={{ fontSize }}>Control</h1>
  </Step>
  <Step
    id="2"
    x={0}
    y={rect.vmin * 10}
    z={rect.vmin * 200}
    transition={{ opacity: [0, 1] }}
    exitTransition={{ opacity: [1, 0] }}
  >
    <h1 style={{ fontSize, background: 'white', color: 'black' }}>Camera</h1>
  </Step>
  <Step
    id="3"
    x={0}
    y={rect.vmin * 20}
    z={rect.vmin * 400}
    transition={{ opacity: [0, 1] }}
    exitTransition={{ opacity: [1, 0] }}
  >
    <h1 style={{ fontSize }}>Action</h1>
  </Step>
</Scene3D>
```

### 3D Elements with Staggered Animations

Place elements in 3D space and animate them independently:

```tsx
const rect = useViewportRect();

<Scene3D
  perspective={rect.width > 500 ? 1000 : 500}
  transitionDuration={20}
  stepDuration={20}
  easing="easeInOutCubic"
>
  {Array(20).fill(0).map((_, i) => {
    const x = randomFloat(`x-${i}`, -rect.width, rect.width * 2);
    const y = randomFloat(`y-${i}`, -rect.height, rect.height);
    const z = randomFloat(`z-${i}`, -rect.vmin * 200, rect.vmin * 20);
    
    return (
      <Element3D
        key={i}
        x={x}
        y={y}
        z={z}
        rotateZ={0.0001}
      >
        <StaggeredMotion
          transition={{
            opacity: [0, 0.2],
          }}
        >
          <div style={{
            width: rect.vmin * 2,
            height: rect.vmin * 2,
            borderRadius: "50%",
            background: `hsl(${randomFloat(`color-${i}`, 0, 360)}, 80%, 60%)`
          }} />
        </StaggeredMotion>
      </Element3D>
    );
  })}

  {/* Camera flies through positioned steps */}
  {["Fly", "Your", "Camera", "Through", "Space"].map((word, i) => (
    <Step
      key={i}
      x={i * rect.vmin * 50}
      y={0}
      z={0}
      rotateZ={-i * 15}
    >
      <h1 style={{ fontSize: rect.vmin * 8, color: 'white' }}>{word}</h1>
    </Step>
  ))}
</Scene3D>
```

---

## Responsive Design

### Using useViewportRect for Sizing

Always use viewport-relative units for responsive sizing:

```tsx
const rect = useViewportRect();

// Font sizes
<div style={{ fontSize: rect.vmin * 5 }}>Responsive text</div>

// Element sizes
<div style={{
  width: rect.vmin * 20,
  height: rect.vmin * 20,
  padding: rect.vmin * 2
}} />

// Positioning
<div style={{
  position: "absolute",
  left: rect.cx - (rect.vmin * 10),  // Centered horizontally
  top: rect.vh * 10                   // 10% from top
}} />
```

### Responsive Particle Sizes

```tsx
const rect = useViewportRect();

<Spawner rate={1} lifespan={100}>
  <div style={{
    width: rect.vmin * 3,   // 3% of smaller dimension
    height: rect.vmin * 3,
    borderRadius: "50%"
  }} />
</Spawner>
```

### Conditional Layout

```tsx
const rect = useViewportRect();
const isSmall = rect.width < 500;

<AnimatedText
  style={{ fontSize: isSmall ? rect.vmin * 8 : rect.vmin * 5 }}
  transition={{ ... }}
>
  Adaptive Text
</AnimatedText>
```

---

## Combining Components

### Text with Gradient Background

```tsx
<GradientTransition
  gradient={["linear-gradient(...)", "linear-gradient(...)"]}
  duration={90}
>
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%"
  }}>
    <AnimatedText
      transition={{ split: "word", opacity: [0, 1], y: [30, 0], duration: 30 }}
      style={{ color: "white", fontSize: 48 }}
    >
      Text Over Gradient
    </AnimatedText>
  </div>
</GradientTransition>
```

### Particles with 3D Scene

```tsx
<Scene3D perspective={1000}>
  <Step z={0} />

  <Particles>
    <Spawner rate={2} lifespan={60} position={{ x: rect.cx, y: rect.cy }}>
      <div style={{ width: 10, height: 10, background: "white" }} />
    </Spawner>
    <Behavior gravity={{ y: 0.05 }} />
  </Particles>

  <Element3D x={rect.cx} y={rect.cy} z={0}>
    <AnimatedText transition={{ opacity: [0, 1], duration: 30 }}>
      3D Text with Particles
    </AnimatedText>
  </Element3D>
</Scene3D>
```
