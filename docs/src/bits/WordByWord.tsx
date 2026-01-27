import React from "react";
import { AbsoluteFill } from "remotion";
import { TextTransition } from "remotion-bits";

export const metadata = {
  name: "Word by Word",
  description: "Animated text that appears word by word with staggered timing",
  tags: ["text", "word", "stagger"],
  duration: 120,
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
          y: [200, 0],
          opacity: [0, 1],
          split: "word",
          splitStagger: 3,
          easing: "easeOutQuad",
        }}
      >
        This appears word by word
      </TextTransition>
    </div>
  </AbsoluteFill>
);

export const sourceCode = `import { TextTransition } from 'remotion-bits';

export const WordByWord = () => (
  <TextTransition
    transition={{
      y: [200, 0],
      opacity: [0, 1],
      split: "word",
      splitStagger: 3,
      easing: "easeOutQuad",
    }}
  >
    This appears word by word
  </TextTransition>
);`;
