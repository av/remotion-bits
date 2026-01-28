import React from "react";
import { Scene3D, Step, useViewportRect } from "remotion-bits";

export const metadata = {
  name: "Basic 3D Scene",
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
      transitionDuration={20}
      stepDuration={20}
      easing="easeInOutCubic"
    >
      <Step
        id="1"
        x={0}
        y={0}
        z={0}
      >
        <h1 style={{ fontSize }}>Hello</h1>
      </Step>
      <Step
        id="2"
        x={200}
        y={0}
        z={-300}
        rotateZ={45}
        scale={0.5}
      >
        <h1 style={{ fontSize }}>Hello</h1>
      </Step>
      <Step
        id="3"
        x={400}
        y={0}
        z={0}
      >
        <h1 style={{ fontSize }}>Hello</h1>
      </Step>
    </Scene3D>
  );
};
