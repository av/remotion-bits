import React from "react";
import { TextTransition } from "remotion-bits";

export const metadata = {
  name: "Word by Word",
  description: "Animated text that appears word by word with staggered timing",
  tags: ["text", "word", "stagger"],
  duration: 120,
  width: 1920,
  height: 1080,
};

export const Component: React.FC = () => (
  <TextTransition
    transition={{
      y: [20, 0],
      opacity: [0, 1],
      split: "word",
      splitStagger: 3,
      easing: "easeOutQuad",
    }}
  >
    This appears word by word
  </TextTransition>
);


