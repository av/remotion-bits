import React from "react";
import { AbsoluteFill } from "remotion";
import { TextTransition } from "remotion-bits";

export const metadata = {
  name: "Fade In",
  description: "Simple fade-in text animation from transparent to opaque",
  tags: ["text", "fade", "basic"],
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
      <TextTransition transition={{ opacity: [0, 1] }}>
        Hello World
      </TextTransition>
    </div>
  </AbsoluteFill>
);

export const sourceCode = `import { TextTransition } from 'remotion-bits';

export const FadeIn = () => (
  <TextTransition transition={{ opacity: [0, 1] }}>
    Hello World
  </TextTransition>
);`;
