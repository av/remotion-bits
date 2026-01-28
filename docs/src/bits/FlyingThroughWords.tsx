import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Particles, Spawner, Behavior, useViewportRect, resolvePoint, MotionTransition } from "remotion-bits";

export const metadata = {
  name: "Flying Through Words",
  description: "Words spawning and flying past the camera",
  tags: ["particles", "text", "3d", "flythrough"],
  duration: 300,
  width: 1920,
  height: 1080,
};

export const Component: React.FC = () => {
  const rect = useViewportRect();
  const WORDS = ["Idea", "Concept", "Vision", "Future", "Dream", "Create", "Design", "Inspire", "Build", "Launch"];

  // Custom handler for [0, 1, 0] opacity
  // Using explicit any for particle to avoid complex type imports in docs
  const opacityHandler = (p: any, age: number) => {
    const progress = age / p.lifespan;
    // Fade in 0->0.2, Visible 0.2->0.8, Fade out 0.8->1
    p.opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  };

  return (
    <Particles
      style={{ perspective: '1000px' }}
    >
      <Spawner
        rate={0.15}
        area={{ width: rect.width, height: rect.height }}
        position={resolvePoint(rect, { x: "center", y: "center" })}
        lifespan={180}
      >
        {WORDS.map((word, i) => (
          <MotionTransition
            key={i}
            style={{
              color: "white",
              fontSize: rect.vmin * 2,
              textAlign: "center"
            }}
            transition={{
              x: [0, 100],
              z: [0, 1000]
            }}
          >
            {word}
          </MotionTransition>
        ))}
      </Spawner>

      <Behavior

      />
    </Particles>
  );
};
