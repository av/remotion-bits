import React from "react";
import { AbsoluteFill } from "remotion";
import { Particles, Spawner, Behavior, useViewportRect, resolvePoint } from "remotion-bits";

export const metadata = {
  name: "Fountain",
  description: "Bursting fountain particles effect",
  tags: ["particles", "burst", "fountain"],
  duration: 60,
  width: 1920,
  height: 1080,
};

export const Component: React.FC = () => {
  const rect = useViewportRect();

  return (
    <Particles>
      <Spawner
        rate={10}
        burst={20}
        position={resolvePoint(rect, { x: "center", y: "110%" })}
        area={{ width: rect.width * 0.1, height: 0 }}
        velocity={{ x: 0, y: -rect.height * 0.05, varianceX: rect.width * 0.1, varianceY: rect.height * 0.01, }}
        lifespan={100}
        startFrame={100}
        max={200}
      >
        <div style={{
          width: rect.vmax * 1, height: rect.vmax * 1,
          background: "radial-gradient(circle, #ebb03b99, transparent 50%)",
        }} />
        <div style={{
          width: rect.vmax * 2, height: rect.vmax * 2,
          background: "radial-gradient(circle, #ebb03b22, transparent 50%)",
        }} />
        <div style={{
          width: rect.vmax * 1.5, height: rect.vmax * 1.5,
          background: "radial-gradient(circle, gray, transparent 50%)",
        }} />
        <div style={{
          width: rect.vmax * 30, height: rect.vmax * 30,
          background: "radial-gradient(circle, rgba(176, 126, 223, 0.05), transparent 50%)",
        }} />
      </Spawner>

      <Behavior gravity={{ y: 0.2, }} />
    </Particles>
  );
};
