import React from "react";
import { AbsoluteFill } from "remotion";
import { Particles, Spawner, Behavior } from "remotion-bits";

export const metadata = {
  name: "Fountain",
  description: "Bursting fountain particles effect",
  tags: ["particles", "burst", "fountain"],
  duration: 150,
  width: 1920,
  height: 1080,
};

export const Component: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Particles>
        <Spawner
          rate={20}
          burst={20}
          position={{ x: 960, y: 1350 }}
          area={{ width: 50, height: 0 }}
          velocity={{ x: 0, y: -70, varianceX: 100, varianceY: 30, }}
          lifespan={100}
          max={500}
          transition={{
            opacity: [0, 1],
            duration: 20,
          }}
        >
          <div style={{
            width: 30, height: 30,
            background: "radial-gradient(circle, #ebb03b, transparent 50%)",
          }} />
          <div style={{
            width: 20, height: 20,
            background: "radial-gradient(circle, gray, transparent 50%)",
          }} />
          <div style={{
            width: 400, height: 400,
            background: "radial-gradient(circle, rgba(176, 126, 223, 0.05), transparent 50%)",
          }} />
        </Spawner>

        <Behavior gravity={{ y: 0.1, }} />
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
        Burst
      </div>
    </AbsoluteFill>
  );
};
