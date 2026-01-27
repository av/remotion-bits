import React from "react";
import { AbsoluteFill } from "remotion";
import { Particles, Spawner, Behavior } from "remotion-bits";

export const metadata = {
  name: "Grid Particles",
  description: "Particles snapping to a grid",
  tags: ["particles", "grid", "snap"],
  duration: 200,
  width: 1920,
  height: 1080,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const Component: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
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
      <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: "white", 
          fontFamily: "sans-serif", 
          fontSize: '128px' 
      }}>
        Grid
      </div>
    </AbsoluteFill>
  );
};
