import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { Particles, Spawner, Behavior } from 'remotion-bits';
import { ShowcasePlayer } from '../ShowcasePlayer';

const ParticlesCardContent = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <Particles>
        <Spawner
            rate={2}
            area={{ width, height }}
            position={{ x: width / 2, y: height / 2 }}
            lifespan={200}
            startFrame={200}
        >
             <div className="w-1 h-1 rounded-full bg-[#ec8b49]/40 blur-[1px]" />
             <div className="w-2 h-2 rounded-full bg-white/20 blur-[1px]" />
             <div className="w-1.5 h-1.5 rounded-full bg-[#ec8b49]/20" />
        </Spawner>
        <Behavior wiggle={{ magnitude: 5, frequency: 0.1 }} />
        <Behavior gravity={{ y: -0.2 }} />
        <Behavior
            overLife={{
                opacity: [0, 1, 0]
            }}
        />
      </Particles>
    </AbsoluteFill>
  );
};

export const ParticlesCardShowcase = () => {
    return (
        <ShowcasePlayer
            component={ParticlesCardContent}
            duration={300}
            fps={30}
            width={600}
            height={400}
            autoPlay
            loop
            controls={false}
            className="w-full h-full opacity-50 pointer-events-none"
        />
    )
}
