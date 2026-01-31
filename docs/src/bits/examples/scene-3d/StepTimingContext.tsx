import React from "react";
import { Scene3D, Step, useViewportRect, AnimatedText, StaggeredMotion } from "remotion-bits";

export const metadata = {
  name: "Step-Aware Motion Timing",
  description: "Demonstrates useMotionTiming context awareness in Scene3D Steps",
  tags: ["3d", "timing", "animation", "context"],
  duration: 300,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-3d-step-timing-context",
    title: "Step-Aware Motion Timing",
    description: "Demonstrates useMotionTiming context awareness in Scene3D Steps",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["scene-3d", "animated-text", "staggered-motion"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/scene-3d/StepTimingContext.tsx",
      },
    ],
  },
};

export const Component: React.FC = () => {
  const rect = useViewportRect();
  const fontSize = rect.vmin * 6;

  return (
    <Scene3D
      perspective={1000}
      transitionDuration={40}
      stepDuration={100}
      easing="easeInOutCubic"
    >
      {/* Step 1: Auto-aligned timing (duration-based, inherits Step frames) */}
      <Step
        id="1"
        x={0}
        y={-rect.vmin * 20}
        z={0}
        transition={{ opacity: [0, 1], y: [50, 0] }}
        exitTransition={{ opacity: [1, 0], y: [0, -50] }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: fontSize * 0.6, marginBottom: "20px", color: "#666" }}>
            Auto-Aligned Timing
          </h2>
          <AnimatedText
            transition={{
              opacity: [0, 1],
              y: [20, 0],
              duration: 30, // Uses Step's enterFrame + duration
            }}
          >
            <h1 style={{ fontSize }}>Step 1</h1>
          </AnimatedText>
        </div>
      </Step>

      {/* Step 2: Mixed timing (some auto-aligned, some explicit) */}
      <Step
        id="2"
        x={0}
        y={rect.vmin * 10}
        z={rect.vmin * 300}
        transition={{ opacity: [0, 1] }}
        exitTransition={{ opacity: [1, 0] }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: fontSize * 0.6, marginBottom: "20px", color: "#666" }}>
            Mixed Timing
          </h2>
          <div style={{ marginBottom: "40px" }}>
            <p style={{ fontSize: fontSize * 0.5, color: "#999", marginBottom: "10px" }}>
              Auto-aligned (uses Step frames):
            </p>
            <AnimatedText
              transition={{
                opacity: [0, 1],
                scale: [0.8, 1],
                duration: 25,
              }}
            >
              <h1 style={{ fontSize }}>Auto</h1>
            </AnimatedText>
          </div>
          <div>
            <p style={{ fontSize: fontSize * 0.5, color: "#999", marginBottom: "10px" }}>
              Explicit frames (overrides Step):
            </p>
            <AnimatedText
              transition={{
                opacity: [0, 1],
                scale: [0.8, 1],
                frames: [140, 180], // Explicit frames override context
              }}
            >
              <h1 style={{ fontSize }}>Explicit</h1>
            </AnimatedText>
          </div>
        </div>
      </Step>

      {/* Step 3: Staggered animation (stagger offset applied to Step frame) */}
      <Step
        id="3"
        x={0}
        y={rect.vmin * 30}
        z={rect.vmin * 600}
        transition={{ opacity: [0, 1] }}
        exitTransition={{ opacity: [1, 0] }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: fontSize * 0.6, marginBottom: "40px", color: "#666" }}>
            Staggered Within Step
          </h2>
          <StaggeredMotion
            transition={{
              opacity: [0, 1],
              y: [30, 0],
              duration: 20,
              stagger: 8, // Each child staggered 8 frames
            }}
          >
            <h1 style={{ fontSize, marginBottom: "10px" }}>Letter</h1>
            <h1 style={{ fontSize, marginBottom: "10px" }}>By</h1>
            <h1 style={{ fontSize }}>Letter</h1>
          </StaggeredMotion>
        </div>
      </Step>

      {/* Step 4: All timing features combined */}
      <Step
        id="4"
        x={0}
        y={rect.vmin * 50}
        z={rect.vmin * 900}
        transition={{ opacity: [0, 1], scale: [0.9, 1] }}
        exitTransition={{ opacity: [1, 0], scale: [1, 0.9] }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: fontSize * 0.6, marginBottom: "20px", color: "#666" }}>
            Summary
          </h2>
          <AnimatedText
            transition={{
              opacity: [0, 1],
              y: [20, 0],
              duration: 25,
            }}
          >
            <h1 style={{ fontSize: fontSize * 1.2, color: "#4CAF50" }}>
              useMotionTiming
            </h1>
          </AnimatedText>
          <AnimatedText
            transition={{
              opacity: [0, 1],
              y: [20, 0],
              delay: 10,
              duration: 25,
            }}
          >
            <h1 style={{ fontSize: fontSize * 1.2, color: "#4CAF50" }}>
              is Step-Aware!
            </h1>
          </AnimatedText>
        </div>
      </Step>
    </Scene3D>
  );
};
