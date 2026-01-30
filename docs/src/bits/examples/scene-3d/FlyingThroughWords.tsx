import React from "react";
import { Particles, Spawner, Behavior, useViewportRect, resolvePoint, StaggeredMotion } from "remotion-bits";

export const metadata = {
  name: "Flying Through Words",
  description: "Words spawning and flying past the camera",
  tags: ["particles", "text", "3d", "flythrough"],
  duration: 300,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-flying-through-words",
    title: "Flying Through Words",
    description: "Words spawning and flying past the camera",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["particle-system", "staggered-motion", "use-viewport-rect"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/scene-3d/FlyingThroughWords.tsx",
      },
    ],
  },
};

export const Component: React.FC = () => {
  const rect = useViewportRect();
  const WORDS = [
    "GPT", "Claude", "PaLM", "Gemini", "LLaMA", "Mistral", "Mixtral", "Falcon", "BLOOM",
    "Kimi", "MiniMax", "Qwen"
  ];
  const isSmall = rect.width < 500;

  return (
    <Particles
      style={{ perspective: isSmall ? 1000 : 5000 }}
    >
      <Spawner
        rate={0.2}
        area={{ width: rect.width, height: rect.height, depth: -rect.vmin * 50 }}
        position={resolvePoint(rect, { x: "center", y: "center" })}
        lifespan={100}
        velocity={{
          x: 0,
          y: 0,
          z: rect.vmin * 10,
          varianceZ: rect.vmin * 10,
        }}
      >
        {WORDS.map((word, i) => (
          <StaggeredMotion
            key={i}
            style={{
              color: "white",
              fontSize: rect.vmin * 10,
              textAlign: "center"
            }}
            transition={{
              opacity: [0, 1, 0.5, 0.2, 0],
            }}
          >
            {word}
          </StaggeredMotion>
        ))}
      </Spawner>

      <Behavior

      />
    </Particles>
  );
};
