import React from "react";
import { AbsoluteFill } from "remotion";
import { Particles, Spawner, Behavior, useViewportRect, resolvePoint } from "remotion-bits";

export const metadata = {
  name: "Snow",
  description: "Falling snow particles effect",
  tags: ["particles", "snow", "weather"],
  duration: 300,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-particles-snow",
    title: "Falling Snow Particles",
    description: "Falling snow particles effect",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["particle-system", "use-viewport-rect"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/particle-system/ParticlesSnow.tsx",
      },
    ],
  },
};

export const Component: React.FC = () => {
  const rect = useViewportRect();

  return (
    <AbsoluteFill style={{ backgroundColor: "#01050e" }}>
      <Particles>
        <Spawner
          rate={1}
          area={{ width: rect.width, height: 0 }}
          position={resolvePoint(rect, { x: "center", y: -200 })}
          lifespan={200}
          startFrame={200}
          transition={{
            opacity: [0, 1],
          }}
        >
          <div
            style={{
              width: rect.vmin * 1,
              height: rect.vmin * 1,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.9), transparent 70%)",
            }}
          />
          <div
            style={{
              width: rect.vmin * 2,
              height: rect.vmin * 2,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(224,231,255,0.9), transparent 70%)",
            }}
          />
          <div
            style={{
              width: rect.vmin * 4,
              height: rect.vmin * 4,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(199,210,254,0.3), transparent 70%)",
            }}
          />
        </Spawner>
        <Behavior gravity={{ y: 0.1 }} />
        <Behavior wiggle={{ magnitude: 1, frequency: 0.5 }} />
        <Behavior handler={(p) => { p.velocity.x += 0.01; }} />
      </Particles>
    </AbsoluteFill>
  );
};
