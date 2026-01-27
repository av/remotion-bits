import React from "react";
import { AbsoluteFill } from "remotion";
import { TextTransition } from "remotion-bits";

export const metadata = {
  name: "Slide from Left",
  description: "Text that slides in from the left with fade-in effect",
  tags: ["text", "slide", "motion"],
  duration: 90,
  width: 1920,
  height: 1080,
};

const baseStyle = {
  fontSize: "12rem",
  fontWeight: 700,
  color: "#ffffff",
  fontFamily: "Inter, ui-sans-serif, system-ui",
  textAlign: "center" as const,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "4rem",
};

export const Component: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
    <div style={baseStyle}>
      <TextTransition
        transition={{
          opacity: [0, 1],
          x: [-400, 0],
          easing: "easeInOut",
        }}
      >
        Sliding Text
      </TextTransition>
    </div>
  </AbsoluteFill>
);

export const sourceCode = `import { TextTransition } from 'remotion-bits';

export const SlideFromLeft = () => (
  <TextTransition
    transition={{
      opacity: [0, 1],
      x: [-400, 0],
      easing: "easeInOut",
    }}
  >
    Sliding Text
  </TextTransition>
);`;
