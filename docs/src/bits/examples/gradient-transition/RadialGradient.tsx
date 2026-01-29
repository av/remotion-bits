import React from "react";
import { GradientTransition } from "remotion-bits";

export const metadata = {
  name: "Radial Gradient",
  description: "Smooth transition between radial gradients",
  tags: ["background", "gradient", "radial"],
  duration: 90,
  width: 1920,
  height: 1080,
};

export const Component: React.FC = () => (
  <GradientTransition
    gradient={[
      "radial-gradient(circle at 20% 20%, #FDB813 0%, #78C0E0 60%)",
      "radial-gradient(circle at 80% 80%, #F5576C 0%, #2F2044 100%)",
    ]}
    duration={90}
  >
  </GradientTransition>
);


