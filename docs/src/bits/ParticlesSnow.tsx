import React from "react";
import { AbsoluteFill } from "remotion";
import { Particles, Spawner, Behavior } from "remotion-bits";

export const metadata = {
  name: "Snow",
  description: "Falling snow particles effect",
  tags: ["particles", "snow", "weather"],
  duration: 300,
  width: 1920,
  height: 1080,
};

export const Component: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#01050e" }}>
      <Particles>
        <Spawner
          rate={1}
          area={{ width: 1920, height: 0 }}
          position={{ x: 960, y: -200 }}
          lifespan={200}
          startFrame={0} 
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
      <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: "white", 
          fontFamily: "sans-serif", 
          fontSize: '128px' 
      }}>
        Snow
      </div>
    </AbsoluteFill>
  );
};
