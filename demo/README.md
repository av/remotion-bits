# Remotion Bits Demo Playground

Interactive playground to preview and test all Remotion Bits components.

## Getting Started

### Installation

```bash
cd demo
npm install
```

### Running the Demo

```bash
npm start
```

This will open the Remotion Studio where you can:
- Preview the composition in real-time
- Tweak component properties using the controls panel
- See changes instantly without reloading

## Available Components

### TextTransition
Animated text that cycles through multiple strings with smooth transitions.

**Tweakable Props:**
- `texts`: Array of strings to cycle through
- `transitionDuration`: Duration of each text in frames
- `transitionDirection`: "up" | "down" | "left" | "right"
- `transitionOffset`: Distance of animation in pixels

## Composition Details

- **Duration**: 300 frames (10 seconds at 30fps)
- **Resolution**: 1920x1080 (Full HD)
- **FPS**: 30

## Building/Rendering

To render the video:

```bash
npm run build
```

This will output the video to `out/playground.mp4`.

## Customization

You can modify the default props in [src/Root.tsx](src/Root.tsx) or use the Remotion Studio UI to adjust properties in real-time.
