import React from "react";
import { TextTransition } from "remotion-bits";

export const metadata = {
  name: "Slide from Left",
  description: "Text that slides in from the left with fade-in effect",
  tags: ["text", "slide", "motion"],
  duration: 90,
  width: 1920,
  height: 1080,
};

export const Component: React.FC = () => (
  <TextTransition
    transition={{
      opacity: [0, 1],
      x: [-400, 0],
      easing: "easeInOut",
    }}
  >
    Sliding Text
  </TextTransition>
);


