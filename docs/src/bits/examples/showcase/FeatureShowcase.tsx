import React, { useMemo } from 'react';
import { AbsoluteFill, useVideoConfig, Sequence, interpolate, Easing } from 'remotion';
import {
  AnimatedText,
  GradientTransition,
  StaggeredMotion,
  Particles,
  Spawner,
  Behavior,
  useViewportRect,
  Scene3D,
  Step,
  Element3D,
  interpolate as interpolateUtil
} from 'remotion-bits';

export const metadata = {
  name: "Feature Showcase",
  description: "A comprehensive showcase of Remotion Bits features.",
  tags: ["showcase", "composite", "demo"],
  duration: 160,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-feature-showcase",
    title: "Feature Showcase",
    description: "A comprehensive showcase of Remotion Bits features.",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["animated-text", "gradient-transition", "staggered-motion", "particle-system", "scene-3d", "use-viewport-rect"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/showcase/FeatureShowcase.tsx",
      },
    ],
  },
};


export const Component: React.FC = () => {
  const { width, height, durationInFrames } = useVideoConfig();
  const rect = useViewportRect();

  // Dark, moody gradient background
  const bgGradients = [
    'linear-gradient(to bottom, #000000, #050510)',
    'radial-gradient(circle at 50% 50%, #0a0a20 0%, #000000 100%)',
  ];

  const StarField: React.FC = () => (
    <AbsoluteFill style={{ zIndex: 0 }}>
      <Particles>
        <Spawner rate={5}>
          <div style={{
            width: 4, height: 4, background: '#fff', borderRadius: '50%',
            boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
          }} />
        </Spawner>
        <Behavior
          // Creating a warp tunnel effect
          scale={{ start: 0, end: 1 }}
          opacity={[0, 1, 0.5]}
          gravity={{ z: -20 }} // Move towards camera (or away depending on perspective)
          wiggle={{ magnitude: 5 }}
        />
      </Particles>
    </AbsoluteFill>
  );

  const FeatureCard: React.FC<{
    title: string;
    icon: string;
    color: string;
    description: string;
  }> = ({ title, icon, color, description }) => {
    return (
      <div style={{
        width: 400,
        height: 250,
        background: 'rgba(20, 20, 30, 0.7)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${color}40`,
        borderRadius: 24,
        padding: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
        boxShadow: `0 20px 50px -10px ${color}30`,
        transformStyle: 'preserve-3d',
      }}>
        <div style={{
          fontSize: 40, marginBottom: 15,
          background: `linear-gradient(135deg, ${color}, white)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {icon}
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 16, color: '#8890a0', lineHeight: 1.4 }}>{description}</div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ background: '#000', color: 'white' }}>
      {/* 1. Atmosphere */}
      <GradientTransition
        gradient={bgGradients}
        duration={durationInFrames}
      />
      <StarField />

      {/* 2. The Journey */}
      {/* Scene3D wraps the content. Steps define camera positions over time. */}
      <Scene3D
        perspective={1200}
        style={{ width: '100%', height: '100%' }}
        // We divide the duration into 4 steps
        stepDuration={durationInFrames / 4}
        transitionDuration={40}
        easing="easeInOutCubic"
      >
        {/* --- Camera Steps --- */}
        {/* Step 0: Initial View (Looking at Title) */}
        <Step id="start" z={100} />

        {/* Step 1: Move In (Approaching Orbit) */}
        <Step id="enter-orbit" z={-400} rotateY={-10} />

        {/* Step 2: Orbit (Rotating around cards) */}
        <Step id="orbit" z={-600} rotateY={20} />

        {/* Step 3: Warp (Zoom out) */}
        <Step id="warp" z={-2500} />


        {/* --- Content Elements --- */}

        {/* A. Title Section (Z: 0) */}
        <Element3D z={0} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <AnimatedText
            transition={{
              type: 'fly-in',
              y: 50,
              delay: 5,
              stagger: 3,
              duration: 30,
              easing: 'back-out'
            }}
            style={{
              fontSize: rect.vmin * 12,
              fontWeight: 900,
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-0.05em',
              color: 'white',
              textShadow: '0 0 30px rgba(255,255,255,0.3)'
            }}
          >
            REMOTION
          </AnimatedText>
          <AnimatedText
            transition={{
              type: 'fade',
              delay: 20,
              duration: 20
            }}
            style={{
              fontSize: rect.vmin * 12,
              fontWeight: 300,
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '0.2em',
              color: '#44aaff', // Cyan accent
              marginTop: -20
            }}
          >
            BITS
          </AnimatedText>
        </Element3D>

        {/* B. Feature Orbit (Z: -800) */}
        {/* We arrange cards in a circle by rotating a container or individual elements */}
        <Element3D z={-800}>
          <Sequence from={40} layout="none">
            <StaggeredMotion
              transition={{
                type: 'scale',
                duration: 25,
                stagger: 5,
                easing: 'elastic-out'
              }}
            >
              {/* Card 1: Left */}
              <Element3D x={-500} rotateY={30}>
                <FeatureCard
                  title="Particles"
                  icon="✨"
                  color="#ff0080"
                  description="Determinisic simulation system with spawners and behaviors."
                />
              </Element3D>

              {/* Card 2: Center */}
              <Element3D z={-100}>
                <FeatureCard
                  title="3D Scenes"
                  icon="🧊"
                  color="#00ffcc"
                  description="Camera control, steps, and smooth perspective transitions."
                />
              </Element3D>

              {/* Card 3: Right */}
              <Element3D x={500} rotateY={-30}>
                <FeatureCard
                  title="Motion"
                  icon="🌊"
                  color="#4d79ff"
                  description="Advanced staggering, easing, and layout transitions."
                />
              </Element3D>
            </StaggeredMotion>
          </Sequence>
        </Element3D>

        {/* C. Outro (Z: -2000) */}
        <Element3D z={-2200}>
          <Sequence from={110} layout="none">
            <div style={{
              fontSize: rect.vmin * 15,
              fontWeight: 900,
              color: 'transparent',
              WebkitTextStroke: '2px rgba(255,255,255,0.5)',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center'
            }}>
              READY?
            </div>
          </Sequence>
        </Element3D>

      </Scene3D>
    </AbsoluteFill>
  );
};
