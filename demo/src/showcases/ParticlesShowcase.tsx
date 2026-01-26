import React from "react";
import { AbsoluteFill } from "remotion";
import { Particles, Spawner, Behavior } from "../../../src/components/Particles";
import { Center } from "./Center";

// ----------------------------------------------------------------------------
// 1) "Snow" - randomised snowflakes with falling down in nice patterns
// ----------------------------------------------------------------------------
export const ParticlesSnowShowcase = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <Particles>
        <Spawner
          rate={1}
          area={{ width: 1920, height: 0 }} // Horizontal line at top
          position={{ x: 960, y: -50 }}
          lifespan={200}
          max={1000}
          startFrame={200}
          transition={{
            // Micro animation: Spin slowly and fade in
            // rotate: 360,
            // opacity: { frames: [0, 20], values: [0, 1] },
            // scale: [0.5, 1]
          }}
        >
          {/* Simple snowflake shape */}
          <div style={{ fontSize: 40, color: "white" }}>❄️</div>
        </Spawner>

        <Behavior gravity={{ y: 0.1 }} />

        {/* Wiggle adds the "floating" feeling */}
        <Behavior wiggle={{ magnitude: 1, frequency: 0.5 }} />

        {/* Slight drift via custom handler */}
        <Behavior handler={(p) => { p.velocity.x += 0.01; }} />
      </Particles>
      <Center>
        <h1 style={{ color: "white", fontFamily: "sans-serif" }}>Snow</h1>
      </Center>
    </AbsoluteFill>
  );
};

// ----------------------------------------------------------------------------
// 2) "Fountain" - randomised physics based spread of particles
// ----------------------------------------------------------------------------
export const ParticlesFountainShowcase = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <Particles>
        <Spawner
          rate={5}
          position={{ x: 960, y: 800 }} // Bottom center
          velocity={{ x: 0, y: -25, varianceX: 5, varianceY: 5 }} // Shoot up
          lifespan={80}
          transition={{
             // Scale up fast, then shrink
             scale: [0, 1.5, 0],
             duration: 60
          }}
        >
           <div style={{
               width: 20, height: 20,
               borderRadius: "50%",
               background: "linear-gradient(to bottom, #fbbf24, #d97706)"
           }} />
        </Spawner>

        <Behavior gravity={{ y: 0.8 }} />
      </Particles>
      <Center>
        <h1 style={{ color: "white", fontFamily: "sans-serif" }}>Fountain</h1>
      </Center>
    </AbsoluteFill>
  );
};


// ----------------------------------------------------------------------------
// 3) Randomised grid of particles
// ----------------------------------------------------------------------------
const GridBox = () => (
    <div style={{
        width: 80, height: 80,
        backgroundColor: "#3b82f6",
        border: "2px solid #60a5fa",
        opacity: 0.8
    }} />
);

export const ParticlesGridShowcase = () => {

  // Custom behavior to snap physics positions to a 100px grid
  const snapToGridHandler = (p: any, age: number) => {
       // Snap current position
       p.position.x = Math.floor(p.position.x / 100) * 100;
       p.position.y = Math.floor(p.position.y / 100) * 100;

       // Cardinal Movement: every 30 frames, jump 100px
       const jumpInterval = 30;
       if (age % jumpInterval === 0 && age > 0) {
           // Deterministic random direction based on partile + step
           const step = Math.floor(age / jumpInterval);
           // We used "seed" but here we can hack it via internal random props if exposed?
           // The Sim exposes `p.seed`.

           // Simple pseudo random
           const dir = (p.seed + step) % 4; // 0,1,2,3
           if (dir === 0) p.position.x += 100;
           if (dir === 1) p.position.x -= 100;
           if (dir === 2) p.position.y += 100;
           if (dir === 3) p.position.y -= 100;
       }
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <Particles>
         <Spawner
            rate={2} // slow spawn
            area={{ width: 1000, height: 800 }}
            position={{ x: 960, y: 540 }}
            lifespan={150}
            transition={{
                scale: [0, 1],
                duration: 10
            }}
         >
            <GridBox />
         </Spawner>

         <Behavior handler={snapToGridHandler} />
      </Particles>
      <Center>
        <h1 style={{ color: "white", fontFamily: "sans-serif" }}>Grid</h1>
      </Center>
    </AbsoluteFill>
  );
};
