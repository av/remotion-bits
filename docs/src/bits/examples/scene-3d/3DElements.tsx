import React from "react";
import {
  Scene3D,
  Step,
  Element3D,
  StepResponsive,
  useViewportRect,
  StaggeredMotion,
  randomFloat,
  anyElement,
} from "remotion-bits";

export const metadata = {
  name: "Basic 3D Scene",
  description: "3D Scene allows placing arbitrary elements in 3D space",
  tags: ["3d", "camera", "presentation", "transition"],
  duration: 200,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-3d-elements",
    title: "3D Elements Scene",
    description: "3D Scene allows placing arbitrary elements in 3D space",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: [
      "scene-3d",
      "staggered-motion",
      "use-viewport-rect",
      "random",
    ],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/scene-3d/3DElements.tsx",
      },
    ],
  },
};

export const Component: React.FC = () => {
  const rect = useViewportRect();
  const fontSize = rect.vmin * 8;
  const words = ["Fly", "Your", "Camera", "Through", "Space"];

  const els = React.useMemo(() => {
    const sizes = [16, 32];
    const cellSize = rect.vmin * 2;

    return Array(20)
      .fill(0)
      .map((_, i) => {
        const x =
          Math.round(
            randomFloat(`element3d-x-${i}`, -50 * rect.vw, 200 * rect.vw) /
            cellSize,
          ) * cellSize;
        const y =
          Math.round(
            randomFloat(`element3d-y-${i}`, -100 * rect.vh, 20 * rect.vh) /
            cellSize,
          ) * cellSize;
        const z =
          Math.round(
            randomFloat(`element3d-z-${i}`, -200 * rect.vmin, 20 * rect.vmin) /
            cellSize,
          ) * cellSize;
        const size = () =>
          anyElement(`el3d-size-${i}-${probes++}`, sizes) * rect.vmin;
        let probes = 0;

        return (
          <Element3D key={i} x={x} y={y} z={z} rotateZ={0.0001}>
            <StaggeredMotion
              transition={{
                opacity: [0, 0.2],
              }}
            >
              {(() => {
                const shapes = ["circle", "triangle", "diamond"];
                const shape = anyElement(`el3d-shape-${i}-${probes++}`, shapes);
                const color = `hsl(${randomFloat(`el3d-color-${i}-${probes++}`, 0, 360)}, 80%, 60%)`;
                const dimension = size() * 1.25;

                if (shape === "triangle") {
                  return (
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: `${dimension / 2}px solid transparent`,
                        borderRight: `${dimension / 2}px solid transparent`,
                        borderBottom: `${dimension}px solid ${color}`,
                      }}
                    />
                  );
                }

                if (shape === "diamond") {
                  return (
                    <div
                      style={{
                        background: color,
                        width: dimension,
                        height: dimension,
                        transform: "rotate(45deg)",
                      }}
                    />
                  );
                }

                return (
                  <div
                    style={{
                      background: color,
                      width: dimension,
                      height: dimension,
                      borderRadius: "50%",
                    }}
                  />
                );
              })()}
            </StaggeredMotion>
          </Element3D>
        );
      });
  }, [rect.width, rect.height]);

  return (
    <Scene3D
      perspective={rect.width > 500 ? 1000 : 500}
      transitionDuration={20}
      stepDuration={20}
      easing="easeInOutCubic"
    >
      <StepResponsive
        steps={{
          "step-0": { x: 0, y: 0, z: 0, rotateZ: 0 },
          "step-1": { x: rect.vmin * 50, y: 0, z: 0, rotateZ: -30 },
          "step-2": { x: rect.vmin * 100, y: 0, z: 0, rotateZ: -60 },
          "step-3": { x: rect.vmin * 150, y: 0, z: 0, rotateZ: -90 },
          "step-4": { x: rect.vmin * 200, y: 0, z: 0, rotateZ: -120 },
        }}
        transition={{ duration: 20, easing: "easeInOutCubic" }}
      >
        <Element3D z={500}>
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${rect.vmin * 10}px solid transparent`,
              borderRight: `${rect.vmin * 10}px solid transparent`,
              borderBottom: `${rect.vmin * 20}px solid red`,
            }}
          />
        </Element3D>
      </StepResponsive>

      {els}

      {words.map((word, i) => {
        return (
          <Step
            id={`step-${i}`}
            key={i}
            x={i * rect.vmin * 50}
            y={0}
            z={0}
            rotateZ={-i * 30}
            style={{
              width: "250px",
            }}
            exitTransition={{
              opacity: [1, 0],
              duration: 15,
            }}
          >
            <StaggeredMotion
              transition={{
                y: [rect.vmin * 15, 0],
                opacity: [0, 1],
                easing: 'easeOutCubic',
                duration: 15,
              }}
              style={{ fontSize: rect.vmin * 10 }}
            >
              <h1 style={{ fontSize, color: "white", textAlign: "center" }}>
                {word}
              </h1>
            </StaggeredMotion>
          </Step>
        );
      })}
    </Scene3D>
  );
};
