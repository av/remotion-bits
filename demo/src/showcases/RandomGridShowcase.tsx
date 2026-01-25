import React from "react";
import { AbsoluteFill } from "remotion";
import { MotionTransition } from "../../../src/components/MotionTransition";
import { Center } from "./Center";

const Bg = ({ children }: { children: React.ReactNode }) => (
  <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
    <Center style={{ padding: "4rem" }}>{children}</Center>
  </AbsoluteFill>
);

const labelStyle: React.CSSProperties = {
  fontSize: "2.5rem",
  fontWeight: 600,
  opacity: 0.2,
  color: "#94a3b8",
  marginBottom: "4rem",
  fontFamily: "Inter, ui-sans-serif, system-ui",
};

const gridItemStyle: React.CSSProperties = {
  width: 80,
  height: 80,
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.2rem",
  fontWeight: 600,
  color: "white",
};

const colors = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
];

export const RandomGridShowcase: React.FC = () => {
  // Create 24 grid items (4 rows x 6 columns)
  const gridItems = Array.from({ length: 24 }, (_, i) => (
    <div
      key={i}
      style={{
        ...gridItemStyle,
        backgroundColor: colors[i % colors.length],
      }}
    >
      {i + 1}
    </div>
  ));

  return (
    <Bg>
      <div style={labelStyle}>Random Stagger Grid</div>
      <MotionTransition
        transition={{
          y: [200, 0],
          opacity: [0, 1],
          scale: [0.5, 1],
          duration: 40,
          stagger: 2,
          staggerDirection: "random",
          easing: "easeOutCubic",
        }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "1rem",
          maxWidth: "600px",
        }}
      >
        {gridItems}
      </MotionTransition>
    </Bg>
  );
};
