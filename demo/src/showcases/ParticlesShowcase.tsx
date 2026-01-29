import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Particles, Spawner, Behavior } from "../../../src/components/Particles";
import { Center } from "./Center";

export const ParticlesSnowShowcase = () => {
  const { width } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#100f0f" }}>
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
        <h1 style={{ color: "#fffcf0", fontFamily: "sans-serif", fontSize: '128px' }}>Snow</h1>
      </Center>
    </AbsoluteFill>
  );
};

export const ParticlesFountainShowcase = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#100f0f" }}>
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
      <Center>
        <h1 style={{ color: "#fffcf0", fontFamily: "sans-serif", fontSize: '128px' }}>Burst</h1>
      </Center>
    </AbsoluteFill>
  );
};


export const ParticlesGridShowcase = () => {

  const snapToGridHandler = (p: any, age: number) => {
    p.position.x = Math.floor(p.position.x / 100) * 100;
    p.position.y = Math.floor(p.position.y / 100) * 100;

    const jumpInterval = 30;

    if (age % jumpInterval === 0 && age > 0) {
      const step = Math.floor(age / jumpInterval);
      const dir = (p.seed + step) % 4; // 0,1,2,3
      if (dir === 0) p.position.x += 100;
      if (dir === 1) p.position.x -= 100;
      if (dir === 2) p.position.y += 100;
      if (dir === 3) p.position.y -= 100;
    }
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#100f0f" }}>
      <Particles>
        <Spawner
          rate={1}
          area={{ width: 1000, height: 800 }}
          position={{ x: 960, y: 540 }}
          lifespan={150}
          max={10}
          transition={{
            opacity: [0, 1],
            duration: 10
          }}
        >
          <div style={{
            width: 80, height: 80,
            backgroundColor: "#ffffff5f",
            opacity: 0.8
          }} />
          <div style={{
            width: 80, height: 80,
            borderRadius: "50%",
            backgroundColor: "#ffffff5f",
            opacity: 0.8
          }} />
          <div style={{
            width: 80, height: 80,
            transform: 'rotate(45deg) scale(0.75)',
            backgroundColor: "#ffffff5f",
            opacity: 0.8
          }} />
        </Spawner>

        <Behavior handler={snapToGridHandler} />
      </Particles>
      <Center>
        <h1 style={{ color: "#fffcf0", fontFamily: "sans-serif", fontSize: '128px' }}>Grid</h1>
      </Center>
    </AbsoluteFill>
  );
};
