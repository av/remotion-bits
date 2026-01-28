import React from "react";
import { Scene3D, Step, Element3D, useViewportRect, MotionTransition, randomFloat, anyElement } from "remotion-bits";

export const metadata = {
  name: "Basic 3D Scene",
  description: "3D camera transitions between positioned steps, impress.js style",
  tags: ["3d", "camera", "presentation", "transition"],
  duration: 200,
  width: 1920,
  height: 1080,
};

export const Component: React.FC = () => {
  const rect = useViewportRect();
  const fontSize = rect.vmin * 8;


  const els = React.useMemo(() => {
    const sizes = [4, 16];
    const cellSize = rect.vmin * 2;

    return Array(20).fill(0).map((_, i) => {
      const x =
        Math.round(
          randomFloat(`element3d-x-${i}`, -50 * rect.vw, 200 * rect.vw) / cellSize
        ) * cellSize;
      const y =
        Math.round(
          randomFloat(`element3d-y-${i}`, -50 * rect.vh, 50 * rect.vh) / cellSize
        ) * cellSize;
      const z =
        Math.round(
          randomFloat(`element3d-z-${i}`, -200 * rect.vmin, 20 * rect.vmin) / cellSize
        ) * cellSize;
      const size = () => anyElement(`el3d-size-${i}-${probes++}`, sizes) * rect.vmin;
      let probes = 0;

      return (
        <Element3D
          key={i}
          x={x}
          y={y}
          z={z}
        >
          <MotionTransition
            transition={{
              opacity: [0, 0.2],
            }}
          >
            <div style={{ background: 'white', width: size(), height: size() }}></div>
          </MotionTransition>
        </Element3D>
      )
    })
  }, [rect.width, rect.height]);

  return (
    <Scene3D
      perspective={rect.width > 500 ? 1000 : 500}
      transitionDuration={20}
      stepDuration={20}
      easing="easeInOutCubic"
    >
      {els}

      {Array(5).fill(0).map((_, i) => {
        return (
          <Step
            id={`step-${i}`}
            key={i}
            x={i * rect.vmin * 50}
            y={0}
            z={0}
            style={{
              width: '200px'
            }}
          >
            <h1 style={{ fontSize, color: 'white', textAlign: 'center' }}>Step {i + 1}</h1>
          </Step>
        )
      })}

    </Scene3D>
  );
};
