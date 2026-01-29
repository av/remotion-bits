import React from "react";
import { Scene3D, Step, useViewportRect } from "remotion-bits";

export const metadata = {
  name: "Basic 3D Scene",
  description: "3D camera transitions between positioned steps, impress.js style",
  tags: ["3d", "camera", "presentation", "transition"],
  duration: 150,
  width: 1920,
  height: 1080,
};

export const Component: React.FC = () => {
  const rect = useViewportRect();
  const fontSize = rect.vmin * 8;

  return (
    <Scene3D
      perspective={1000}
      transitionDuration={50}
      stepDuration={50}
      easing="easeInOutCubic"
    >
      <Step
        id="1"
        x={0}
        y={0}
        z={0}
        transition={{ opacity: [0, 1] }}
        exitTransition={{ opacity: [1, 0] }}
      >
        <h1 style={{ fontSize }}>Control</h1>
      </Step>
      <Step
        id="2"
        x={0}
        y={rect.vmin * 10}
        z={rect.vmin * 200}
        transition={{ opacity: [0, 1] }}
        exitTransition={{ opacity: [1, 0] }}
      >
        <h1 style={{ fontSize, background: 'white', color: 'black', padding: `${rect.vmin * 1}px ${rect.vmin * 4}px` }}>Camera</h1>
      </Step>
      <Step
        id="3"
        x={0}
        y={rect.vmin * 20}
        z={rect.vmin * 400}
        transition={{ opacity: [0, 1] }}
        exitTransition={{ opacity: [1, 0] }}
      >
        <h1 style={{ fontSize }}>Action</h1>
      </Step>
    </Scene3D>
  );
};
