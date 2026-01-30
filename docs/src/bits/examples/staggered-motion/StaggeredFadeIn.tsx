import React from "react";
import { AbsoluteFill } from "remotion";
import { StaggeredMotion } from "remotion-bits";

export const metadata = {
  name: "Staggered Fade In",
  description: "Elements fading in sequentially",
  tags: ["motion", "stagger", "fade"],
  duration: 90,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-staggered-fade-in",
    title: "Staggered Fade In Elements",
    description: "Elements fading in sequentially",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["staggered-motion"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/staggered-motion/StaggeredFadeIn.tsx",
      },
    ],
  },
};

const boxStyle: React.CSSProperties = {
  width: 150,
  height: 150,
  borderRadius: "12px",
  backgroundColor: "#3b82f6",
};

export const Component: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0f172a", justifyContent: 'center', alignItems: 'center' }}>
      <StaggeredMotion
        transition={{
          opacity: [0, 1],
          y: [100, 0],
          duration: 30,
          stagger: 5,
          staggerDirection: "forward",
          easing: "easeOutCubic",
        }}
        style={{
          display: "flex",
          gap: "2rem",
        }}
      >
        <div style={{ ...boxStyle, backgroundColor: "#3b82f6" }} />
        <div style={{ ...boxStyle, backgroundColor: "#ef4444" }} />
        <div style={{ ...boxStyle, backgroundColor: "#10b981" }} />
        <div style={{ ...boxStyle, backgroundColor: "#f59e0b" }} />
        <div style={{ ...boxStyle, backgroundColor: "#8b5cf6" }} />
      </StaggeredMotion>
  </AbsoluteFill>
);
