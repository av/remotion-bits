import React from "react";
import { BackgroundTransition } from "remotion-bits";

export const metadata = {
  name: "Linear Gradient",
  description: "Smooth transition between linear gradients",
  tags: ["background", "gradient", "linear"],
  duration: 90,
  width: 1920,
  height: 1080,
};

export const Component: React.FC = () => (
  <BackgroundTransition
    gradient={[
      "linear-gradient(0deg, #cacaca 0%, #b76c1c 100%)",
      "linear-gradient(180deg, #454545 0%, #f5576c 100%)",
    ]}
    duration={90}
  >
  </BackgroundTransition>
);


