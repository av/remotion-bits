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
        lifespan={50}
        velocity={{
          x: 0,
          y: 0,
          z: rect.vmin * 10,
          varianceZ: rect.vmin * 10,
        }}
      >
        {WORDS.map((word, i) => (
          <MotionTransition
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
          </MotionTransition>
        ))}
      </Spawner>

      <Behavior

      />
    </Particles>
  );
};
