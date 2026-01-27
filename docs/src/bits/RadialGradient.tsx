import React from "react";
import { BackgroundTransition } from "remotion-bits";

export const metadata = {
  name: "Radial Gradient",
  description: "Smooth transition between radial gradients",
  tags: ["background", "gradient", "radial"],
  duration: 90,
  width: 1920,
  height: 1080,
};

const textStyle = {
  fontSize: "6rem",
  fontWeight: 700,
  color: "#ffffff",
  fontFamily: "Inter, ui-sans-serif, system-ui",
  textAlign: "center" as const,
  textShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "4rem",
  height: "100%",
};

export const Component: React.FC = () => (
  <BackgroundTransition
    gradient={[
      "radial-gradient(circle at center, #667eea 0%, #764ba2 100%)",
      "radial-gradient(circle at top right, #f093fb 0%, #f5576c 100%)",
    ]}
    duration={90}
  >
    <div style={textStyle}>
      Radial Gradient Transition
    </div>
  </BackgroundTransition>
);

export const sourceCode = `import { BackgroundTransition } from 'remotion-bits';

export const RadialGradient = () => (
  <BackgroundTransition
    gradient={[
      "radial-gradient(circle at center, #667eea 0%, #764ba2 100%)",
      "radial-gradient(circle at top right, #f093fb 0%, #f5576c 100%)",
    ]}
    duration={90}
  >
    <div style={{ color: '#fff' }}>
      Radial Gradient Transition
    </div>
  </BackgroundTransition>
);`;
