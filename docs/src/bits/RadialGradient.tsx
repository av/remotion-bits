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

export const Component: React.FC = () => (
  <BackgroundTransition
    gradient={[
      "radial-gradient(circle at center, #000000 0%, #ffffff 100%)",
      "radial-gradient(circle at top right, #96eb03 0%, #f5576c 100%)",
    ]}
    duration={90}
  >
  </BackgroundTransition>
);


