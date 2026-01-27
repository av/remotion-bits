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
      "linear-gradient(0deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(180deg, #f093fb 0%, #f5576c 100%)",
    ]}
    duration={90}
  >
  </BackgroundTransition>
);


