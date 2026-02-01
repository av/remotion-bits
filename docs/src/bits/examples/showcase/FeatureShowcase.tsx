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
  interpolate as interpolateUtil,
  Transform3D,
  StepResponsive
} from 'remotion-bits';

export const metadata = {
  name: "RemotionBits",
  description: "Promotional showcase for the RemotionBits library.",
  tags: ["showcase", "promo", "library"],
  duration: 240,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-remotion-bits-promo",
    title: "RemotionBits",
    description: "A promotional showcase highlighting RemotionBits library capabilities.",
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
  const { durationInFrames } = useVideoConfig();
  const rect = useViewportRect();

  const positions = useMemo(() => {
    const base = Transform3D.identity();

    return {
      base,
    }
  }, []);

  return (
    <AbsoluteFill
      style={{
        background: 'var(--color-background-dark)',
        color: 'var(--color-primary-hover)',
      }}
    > 
      <h1>Hi</h1>
      <Scene3D>
        <Step
          id="intro"
          {...positions.base.toProps()}
        ></Step>

        <StepResponsive
          steps={{
            'intro': {
              
            }
          }}
        >
          <h1>Remotion Bits</h1>
        </StepResponsive>

      </Scene3D>
    </AbsoluteFill>
  );
};
