import React from "react";
import { GradientTransition } from "remotion-bits";

export const metadata = {
  name: "Linear Gradient",
  description: "Smooth transition between linear gradients",
  tags: ["background", "gradient", "linear"],
  duration: 90,
  width: 1920,
  height: 1080,
};

export const props = {
  color1Start: "#cacaca",
  color1End: "#b76c1c",
  color2Start: "#454545",
  color2End: "#f5576c",
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


