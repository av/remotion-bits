import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Particles, Spawner, Behavior } from "remotion-bits";
import { Center } from "./Center";

export const ParticlesSnowShowcase = () => {
  const { width } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#01050e" }}>
      <Particles>
        <Spawner
          rate={1}
          area={{ width, height: 0 }}
          position={{ x: width / 2, y: -200 }}
          lifespan={200}
          startFrame={200}
          transition={{
            opacity: [0, 1],
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.9), transparent 70%)",
            }}
          />
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(224,231,255,0.9), transparent 70%)",
            }}
          />
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(199,210,254,0.3), transparent 70%)",
            }}
          />
        </Spawner>
        <Behavior gravity={{ y: 0.1 }} />
        <Behavior wiggle={{ magnitude: 1, frequency: 0.5 }} />
        <Behavior handler={(p) => { p.velocity.x += 0.01; }} />
      </Particles>
      <Center>
        <h1 style={{ color: "white", fontFamily: "sans-serif", fontSize: width * 0.16 }}>Snow</h1>
      </Center>
    </AbsoluteFill>
  );
};
