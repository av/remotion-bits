import React from "react";
import { AbsoluteFill } from "remotion";
import { Scene3D, Step, Element3D, useViewportRect } from "remotion-bits";

export const metadata = {
  name: "Basic",
  description: "3D camera transitions between positioned steps, impress.js style",
  tags: ["3d", "camera", "presentation", "transition"],
  duration: 60,
  width: 1920,
  height: 1080,
};

export const Component: React.FC = () => {
  const rect = useViewportRect();
  const fontSize = rect.vmin * 8;

  return (
    <Scene3D
      perspective={1000}
      transitionDuration={45}
      easing="easeInOutCubic"
      stepDuration={20}
    >
      <Step
        id="hello"
        x={0}
        y={0}
        z={0}
      >
        <h1 style={{ fontSize, background: 'red' }}>Hello</h1>
      </Step>

      <Step
        id="3d"
        x={0}
        y={0}
        z={-200}
        rotateY={-90}
        rotateX={-90}
      >
        <h1 style={{ fontSize, background: 'blue' }}>3D</h1>
      </Step>
    </Scene3D>
  );
};
