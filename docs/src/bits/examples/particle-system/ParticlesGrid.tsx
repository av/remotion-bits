import React from "react";
import { AbsoluteFill } from "remotion";
import { Particles, Spawner, Behavior, useViewportRect, resolvePoint } from "remotion-bits";

export const metadata = {
  name: "Grid Particles",
  description: "Particles snapping to a grid",
  tags: ["particles", "grid", "snap"],
  duration: 200,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-particles-grid",
    title: "Grid Snap Particles",
    description: "Particles snapping to a grid",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["particle-system", "use-viewport-rect"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/particle-system/ParticlesGrid.tsx",
      },
    ],
  },
};

export const Component: React.FC = () => {
  const rect = useViewportRect();
  const gridSize = Math.floor(rect.width * 0.05);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const snapToGridHandler = (p: any, age: number) => {
    p.position.x = Math.floor(p.position.x / gridSize) * gridSize;
    p.position.y = Math.floor(p.position.y / gridSize) * gridSize;

    const jumpInterval = 30;

    if (age % jumpInterval === 0 && age > 0) {
      const step = Math.floor(age / jumpInterval);
      const dir = (p.seed + step) % 4; // 0,1,2,3
      if (dir === 0) p.position.x += gridSize;
      if (dir === 1) p.position.x -= gridSize;
      if (dir === 2) p.position.y += gridSize;
      if (dir === 3) p.position.y -= gridSize;
    }
  };

  return (
    <Particles>
      <Spawner
        rate={1}
        area={{ width: rect.width * 0.52, height: rect.height * 0.74 }}
        position={rect.center}
        lifespan={150}
        max={50}
        transition={{
          opacity: [0, 1],
          duration: 10
        }}
      >
        <div style={{
          width: gridSize, height: gridSize,
          backgroundColor: "#ffffff22",
          opacity: 0.8
        }} />
        <div style={{
          width: gridSize, height: gridSize,
          borderRadius: "50%",
          backgroundColor: "#ffffff5f",
          opacity: 0.8
        }} />
        <div style={{
          width: gridSize, height: gridSize,
          transform: 'rotate(45deg) scale(0.75)',
          backgroundColor: "#ffffff5f",
          opacity: 0.8
        }} />
      </Spawner>

      <Behavior handler={snapToGridHandler} />
    </Particles>
  );
};
