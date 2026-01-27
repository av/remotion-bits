import React from "react";
import { AbsoluteFill } from "remotion";
import { TextTransition } from "remotion-bits";

export const metadata = {
  name: "Character by Character",
  description: "Text that appears character by character with staggered timing",
  tags: ["text", "character", "stagger"],
  duration: 120,
  width: 1920,
  height: 1080,
};

const baseStyle = {
  fontSize: "10rem",
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
          scale: [0.5, 1],
          split: "character",
          splitStagger: 2,
          easing: "easeOutCubic",
        }}
      >
        Character Animation
      </TextTransition>
    </div>
  </AbsoluteFill>
);

export const sourceCode = `import { TextTransition } from 'remotion-bits';

export const CharByChar = () => (
  <TextTransition
    transition={{
      opacity: [0, 1],
      scale: [0.5, 1],
      split: "character",
      splitStagger: 2,
      easing: "easeOutCubic",
    }}
  >
    Character Animation
  </TextTransition>
);`;
