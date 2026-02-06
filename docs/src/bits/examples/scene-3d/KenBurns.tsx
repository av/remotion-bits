import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { Scene3D, Step, StaggeredMotion, useViewportRect } from "remotion-bits";

export const metadata = {
  name: "Ken Burns Effect",
  description: "Slow camera movement over images using Scene3D steps",
  tags: ["scene-3d", "camera", "ken-burns", "motion"],
  duration: 300,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-ken-burns",
    title: "Ken Burns Effect",
    description: "Slow camera movement over images using Scene3D steps with Ken Burns effect.",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["scene-3d", "staggered-motion"],
    dependencies: [],
    files: [
      {
        type: "bit" as const,
        role: "file" as const,
        path: "KenBurns.tsx",
        relativePath: "docs/src/bits/examples/scene-3d/KenBurns.tsx",
        _imports_: [],
        registryDependencies: [],
        dependencies: [],
        devDependencies: [],
      },
    ],
  },
};

export const Component: React.FC = () => {
  const rect = useViewportRect();
  const IMAGE_URL = "https://picsum.photos/seed/picsum/1920/1080";
  const frameWidth = rect.vmin * 177.78;
  const frameHeight = rect.vmin * 100;
  const xShift = rect.vmin * 4.63;
  const yShift = rect.vmin * 5.56;

  return (
    <AbsoluteFill className="bg-black">
      <Scene3D
        stepDuration={60}
        transitionDuration={60}
      >
        <Step
          id="0"
          z={0}
          duration={100}
          transition={{ opacity: [0, 1] }}
          exitTransition={{ opacity: [1, 0] }}
        >
          <StaggeredMotion
            style={{ width: frameWidth, height: frameHeight }}
            transition={{
              scale: [1.1, 1.4],
              x: [0, xShift],
              duration: 100,
            }}
          >
            <Img
              src="https://picsum.photos/seed/1/1920/1080"
              style={{ width: frameWidth, height: frameHeight, objectFit: "cover" }}
            />
          </StaggeredMotion>
        </Step>

        <Step
          id="1"
          z={-10}
          duration={100}
          transition={{ opacity: [0, 1] }}
          exitTransition={{ opacity: [1, 0] }}
        >
          <StaggeredMotion
            style={{ width: frameWidth, height: frameHeight }}
            transition={{
              scale: [1.3, 1.1],
              x: [-xShift, 0],
              duration: 100,
            }}
          >
            <Img
              src="https://picsum.photos/seed/2/1920/1080"
              style={{ width: frameWidth, height: frameHeight, objectFit: "cover" }}
            />
          </StaggeredMotion>
        </Step>

        <Step
          id="2"
          z={-20}
          duration={100}
          transition={{ opacity: [0, 1] }}
          exitTransition={{ opacity: [1, 0] }}
        >
          <StaggeredMotion
            style={{ width: frameWidth, height: frameHeight }}
            transition={{
              scale: [1.0, 1.2],
              y: [yShift, -yShift],
              duration: 100,
            }}
          >
            <Img
              src="https://picsum.photos/seed/4/1920/1080"
              style={{ width: frameWidth, height: frameHeight, objectFit: "cover" }}
            />
          </StaggeredMotion>
        </Step>
      </Scene3D>
    </AbsoluteFill>
  );
};
