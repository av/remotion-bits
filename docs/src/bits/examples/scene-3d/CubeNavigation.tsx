import React, { useMemo } from "react";
import { Scene3D, Step, Element3D, useViewportRect } from "remotion-bits";

export const metadata = {
  name: "Cube Navigation 3D",
  description: "Navigate through faces of a 3D Cube using Scene3D steps",
  tags: ["3d", "cube", "navigation", "camera", "isometric"],
  duration: 480,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-scene-3d-cube-nav",
    title: "Cube Navigation 3D",
    description: "Navigate through faces of a 3D Cube using Scene3D steps",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["scene-3d"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/scene-3d/CubeNavigation.tsx",
      },
    ],
  },
};

export const Component: React.FC = () => {
  const { vmin } = useViewportRect();
  const size = vmin * 35;
  const distance = size * 0.8;

  const FaceContent: React.FC<{
    color: string;
    title: string;
    size: number;
  }> = ({ color, title, size }) => (
    <div
      style={{
        width: size,
        height: size,
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `${size * 0.02}px ${color}`,
        boxShadow: "0 0 40px rgba(0,0,0,0.3) inset",
      }}
    >
      <h1
        style={{
          fontSize: size * 0.15,
        }}
      >{title}</h1>
    </div>
  );

  const faces = useMemo(
    () => [
      {
        id: "front",
        color: "var(--color-surface-light)",
        title: "TEXT",
        rot: [0, 0, 0],
        pos: [0, 0, size / 2],
      },
      {
        id: "right",
        color: "var(--color-surface-dark)",
        title: "MOTION",
        rot: [0, 90, 90],
        pos: [size / 2, 0, 0],
      },
      {
        id: "back",
        color: "var(--color-surface-light)",
        title: "PARTICLES",
        rot: [0, 180, 180],
        pos: [0, 0, -size / 2],
      },
      {
        id: "left",
        color: "var(--color-surface-dark)",
        title: "GRADIENTS",
        rot: [0, -90, -90],
        pos: [-size / 2, 0, 0],
      },
      {
        id: "top",
        color: "var(--color-primary)",
        title: "3D",
        rot: [90, 0, 0],
        pos: [0, -size / 2, 0],
      },
      {
        id: "bottom",
        color: "var(--color-primary)",
        title: "BITS",
        rot: [-90, 0, 0],
        pos: [0, size / 2, 0],
      },
    ],
    [size],
  );

  const isoDist = size * 1.5;

  const isoStep = useMemo(() => {
    const offset = isoDist / Math.sqrt(3);
    return {
      id: "iso-view",
      x: offset,
      y: -offset,
      z: offset,
      rotateX: 35.264,
      rotateY: 45,
      rotateZ: 0,
      rotateOrder: 'yxz' as const,
    };
  }, [isoDist]);

  const getCameraStep = (face: (typeof faces)[0], index: number) => {
    let x = face.pos[0];
    let y = face.pos[1];
    let z = face.pos[2];

    const [rx, ry, rz] = face.rot;

    if (Math.abs(rx) === 90) {
      y += (rx > 0 ? -1 : 1) * distance;
    } else if (Math.abs(ry) === 90) {
      x += (ry > 0 ? 1 : -1) * distance;
    } else if (Math.abs(ry) === 180) {
      z -= distance;
    } else {
      z += distance;
    }

    return {
      id: `step-${face.id}`,
      x,
      y,
      z,
      rotateX: rx,
      rotateY: ry,
      rotateZ: rz,
    };
  };

  return (
    <Scene3D
      perspective={2000}
      transitionDuration={40}
      stepDuration={60}
      easing="easeInOutCubic"
      style={{ background: "#111" }}
    >
      {faces.map((face) => (
        <Element3D
          key={face.id}
          centered
          x={face.pos[0]}
          y={face.pos[1]}
          z={face.pos[2]}
          rotateX={face.rot[0]}
          rotateY={face.rot[1]}
          rotateZ={face.rot[2]}
        >
          <FaceContent color={face.color} title={face.title} size={size} />
        </Element3D>
      ))}
      <Step id="start" transition={{ opacity: [0, 1] }} {...isoStep} />
      {faces.map((face, idx) => {
        const cam = getCameraStep(face, idx);
        return (
          <Step
            key={`s-${face.id}`}
            id={cam.id}
            x={cam.x}
            y={cam.y}
            z={cam.z}
            rotateX={cam.rotateX}
            rotateY={cam.rotateY}
            rotateZ={cam.rotateZ}
          />
        );
      })}
      <Step id="end" {...isoStep} />
    </Scene3D>
  );
};
