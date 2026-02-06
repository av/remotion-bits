import React from "react";
import {
  Scene3D,
  Step,
  Element3D,
  StepResponsive,
  useViewportRect,
  createRect,
  resolvePoint,
} from "remotion-bits";

export const metadata = {
  name: "Cursor Flyover",
  description: "Camera flies over an app screenshot while a cursor highlights different areas",
  tags: ["3d", "camera", "cursor", "screenshot", "presentation"],
  duration: 300,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-cursor-flyover",
    title: "Cursor Flyover",
    description: "Camera flies over an app screenshot while a cursor highlights different areas",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["scene-3d", "use-viewport-rect", "geometry"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/scene-3d/CursorFlyover.tsx",
      },
    ],
  },
};

export const Component: React.FC = () => {
  const rect = useViewportRect();

  const imgWidth = rect.vmin * 120;
  const imgHeight = imgWidth * 0.4;
  const imgRect = createRect(imgWidth, imgHeight, -imgWidth / 2, -imgHeight / 2);
  const zoom = imgWidth * 0.2;
  const corner = (anchor: Parameters<typeof resolvePoint>[1]) => resolvePoint(imgRect, anchor);

  const Cursor: React.FC<{ size: number }> = ({ size }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        position: "absolute",
        top: 0,
        filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.5))",
      }}
    >
      <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z" />
    </svg>
  );

  return (
    <Scene3D
      perspective={1200}
      transitionDuration={45}
      stepDuration={45}
      easing="easeInOutCubic"
      style={{ background: "#0a0a0a" }}
    >
      <Element3D x={-imgWidth / 2} y={-imgHeight / 2} z={0}>
        <img
          src="/gallery.png"
          style={{
            width: imgWidth,
            height: imgHeight,
            objectFit: "cover",
            borderRadius: rect.vmin * 1.5,
            boxShadow: `0 ${rect.vmin * 2}px ${rect.vmin * 6}px rgba(0,0,0,0.6)`,
          }}
        />
      </Element3D>

      <Step id="overview" x={0} y={0} z={imgWidth * 0.5} transition={{ opacity: [0, 1] }} />
      <Step id="top-left" {...corner("topLeft")} z={zoom} />
      <Step id="top-right" {...corner("topRight")} z={zoom} />
      <Step id="bottom-left" {...corner("bottomLeft")} z={zoom} />
      <Step id="bottom-right" {...corner("bottomRight")} z={zoom} />
      <Step id="zoom-out" x={0} y={0} z={imgWidth * 0.6} exitTransition={{ opacity: [1, 0] }} />

      <StepResponsive
        steps={{
          "overview": { ...corner("center"), opacity: 0, scale: 1.0 },
          "top-left": { ...corner("topLeft"), opacity: 1, scale: [1, 2.0, 1] },
          "top-right": { ...corner("topRight"), opacity: 1, scale: 1 },
          "bottom-left": { ...corner("bottomLeft"), opacity: 1, scale: [1, 2.0, 1] },
          "bottom-right": { ...corner("bottomRight"), opacity: 1, scale: 1 },
          "zoom-out": { ...corner("center"), opacity: 0, scale: 0.5 },
        }}
        transition={{
          duration: 35,
          easing: "easeInOutCubic",
        }}
      >
        <Element3D z={1}>
          <Cursor size={rect.vmin * 5} />
        </Element3D>
      </StepResponsive>
    </Scene3D>
  );
};
