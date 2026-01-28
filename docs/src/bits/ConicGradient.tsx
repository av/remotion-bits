import React from "react";
import { BackgroundTransition } from "remotion-bits";

export const metadata = {
  name: "Conic Gradient",
  description: "Colorful conic gradient rotation",
  tags: ["background", "gradient", "conic", "rainbow"],
  duration: 120,
  width: 1920,
  height: 1080,
};

export const Component: React.FC = () => (
  <BackgroundTransition
    gradient={[
      "conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
      "conic-gradient(from 180deg, #ff00ff, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000, #ff00ff)",
    ]}
    duration={120}
  >
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      fontSize: "6rem",
      fontWeight: 700,
      color: "#ffffff",
      fontFamily: "Inter, ui-sans-serif, system-ui",
      textShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
    }}>
      Conic Rainbow
    </div>
  </BackgroundTransition>
);
