import React from "react";
import { TextTransition } from "remotion-bits";

export const metadata = {
  name: "Staggered Char Animation",
  description: "Text that appears character by character with staggered timing",
  tags: ["text", "character", "stagger"],
  duration: 120,
  width: 1920,
  height: 1080,
};

export const Component: React.FC = () => (
  <TextTransition
    transition={{
      opacity: [0, 1],
      scale: [0.7, 1],
      y: [15, 0],
      duration: 10,
      split: "character",
      splitStagger: 1,
      easing: "easeOutCubic",
    }}
  >
    Character Animation
  </TextTransition>
);


