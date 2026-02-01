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
  Vector3,
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

  const fontSize = rect.vmin * 10;

  const positions = useMemo(() => {
    const base = Transform3D.identity();
    const initialIconBase = base.translate(-rect.vmin * 12, -rect.vmin * 1, 0);

    const elementsBase = base.translate(0, -rect.vmin * 50, 0).rotateX(15);
    const elementsIconBase = elementsBase.translate(-rect.vmin * 12, -rect.vmin * 1, 0);

    const triangleOffset = new Vector3(0, -rect.vmin * 2, 0);
    const squareOffset = new Vector3(-rect.vmin * 2, rect.vmin * 2, 0);
    const circleOffset = new Vector3(rect.vmin * 2, rect.vmin * 2, 0);

    return {
      base,
      elementsBase,
      elementsIconBase,
      initialIconBase,
      triangleOffset,
      squareOffset,
      circleOffset,
    } 
  }, []);

  const ShapeIcon = ({
    size,
    variant,
    style,
    className,
  }: {
    size: number;
    variant: 'triangle' | 'square' | 'circle';
    style?: React.CSSProperties;
    className?: string;
  }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill='none'
        stroke="var(--color-primary-hover)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
      >
        {variant === "triangle" && (
          <path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        )}
        {variant === "square" && <rect width="18" height="18" x="3" y="3" rx="2" />}
        {variant === "circle" && <circle cx="12" cy="12" r="10" />}
      </svg>
    );
  };

  return (
    <AbsoluteFill
      style={{
        background: 'var(--color-background-dark)',
        color: 'var(--color-primary-hover)',
        position: 'relative',
      }}
    >
      <Scene3D
        perspective={1000}
        stepDuration={60}
        transitionDuration={30}
      >
        <Step
          id="intro"
          {...positions.base.toProps()}
        ></Step>

        <Step
          id="elements"
          {...positions.elementsBase.toProps()}
        ></Step>

        <StepResponsive
          centered
          style={{
            fontSize,
            width: rect.vmin * 70,
            position: 'absolute',
          }}
          steps={{
            'intro': {
              transform: [
                positions.base,
                positions.base.translate(rect.vmin * 20, 0, 0),
              ],
            }
          }}
        >
          <h1>Remotion Bits</h1>
        </StepResponsive>

        <StepResponsive
          centered
          style={{
            fontSize,
            width: rect.vmin * 70,
            position: 'absolute',
          }}
          steps={{
            'intro': {
              transform: [
                positions.elementsBase
              ],
            },
            'elements': {
              transform: [
                positions.elementsBase,
                positions.elementsBase.translate(rect.vmin * 60, 0, 0),
              ],
            }
          }}
        >
          <h1>Elements</h1>
        </StepResponsive>

        <StepResponsive
          centered
          style={{ position: 'absolute' }}
          steps={{
            'intro': {
              opacity: [0, 1],
              transform: [
                positions.initialIconBase.translate(positions.triangleOffset.clone().multiplyScalar(2.0)),
                positions.initialIconBase.translate(positions.triangleOffset),
              ],
            },
            'elements': {
              transform: [
                positions.elementsIconBase.translate(positions.triangleOffset),
              ]
            }

          }}
        >
          <ShapeIcon
            size={rect.vmin * 10}
            variant="triangle"
          />
        </StepResponsive>
        <StepResponsive
          style={{ position: 'absolute' }}
          centered
          steps={{
            'intro': {
              opacity: [0, 1],
              transform: [
                positions.initialIconBase.translate(positions.squareOffset.clone().multiplyScalar(2)),
                positions.initialIconBase.translate(positions.squareOffset),
              ],
            }

          }}
        >
          <ShapeIcon
            size={rect.vmin * 10}
            variant="square"
          />
        </StepResponsive>
        <StepResponsive
          style={{ position: 'absolute' }}
          centered
          steps={{
            'intro': {
              opacity: [0, 1],
              transform: [
                positions.initialIconBase.translate(positions.circleOffset.clone().multiplyScalar(2)),
                positions.initialIconBase.translate(positions.circleOffset),
              ],
            }

          }}
        >
          <ShapeIcon
            size={rect.vmin * 10}
            variant="circle"
          />
        </StepResponsive>

      </Scene3D>
    </AbsoluteFill>
  );
};
