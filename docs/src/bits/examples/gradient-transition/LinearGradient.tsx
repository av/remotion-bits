import React from "react";
import { GradientTransition } from "remotion-bits";

export const metadata = {
  name: "Linear Gradient",
  description: "Smooth transition between linear gradients",
  tags: ["background", "gradient", "linear"],
  duration: 90,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-linear-gradient",
    title: "Linear Gradient Transition",
    description: "Smooth transition between linear gradients",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["gradient-transition"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/gradient-transition/LinearGradient.tsx",
      },
    ],
  },
};

export const props = {
  color1Start: "#051226",
  color1End: "#1e0541",
  color2Start: "#a5d4dd",
  color2End: "#5674b1",
  angle1: 0,
  angle2: 180,
};

export const controls = [
  { key: "color1Start", type: "color" as const, label: "Gradient 1 Start" },
  { key: "color1End", type: "color" as const, label: "Gradient 1 End" },
  { key: "color2Start", type: "color" as const, label: "Gradient 2 Start" },
  { key: "color2End", type: "color" as const, label: "Gradient 2 End" },
  { key: "angle1", type: "number" as const, label: "Angle 1", min: 0, max: 360, step: 15 },
  { key: "angle2", type: "number" as const, label: "Angle 2", min: 0, max: 360, step: 15 },
];

export const Component: React.FC = () => (
  <GradientTransition
    gradient={[
      `linear-gradient(${props.angle1}deg, ${props.color1Start} 0%, ${props.color1End} 100%)`,
      `linear-gradient(${props.angle2}deg, ${props.color2Start} 0%, ${props.color2End} 100%)`,
    ]}
    duration={90}
  >
  </GradientTransition>
);


