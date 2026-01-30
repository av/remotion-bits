import React from "react";
import { GradientTransition } from "remotion-bits";

export const metadata = {
  name: "Conic Gradient",
  description: "Colorful conic gradient rotation",
  tags: ["background", "gradient", "conic", "rainbow"],
  duration: 60,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-conic-gradient",
    title: "Conic Gradient Rotation",
    description: "Colorful conic gradient rotation",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["gradient-transition"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/gradient-transition/ConicGradient.tsx",
      },
    ],
  },
};

export const Component: React.FC = () => (
  <GradientTransition
    gradient={[
      "conic-gradient(from 0deg, #000000, #009900)",
      "conic-gradient(from 359deg, #000000, #009900)",
    ]}
    easing="linear"
    shortestAngle={false}
    duration={60}
  />
);
