import React from "react";
import { TextTransition } from "remotion-bits";

export const metadata = {
  name: "Character by Character",
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
      scale: [0.5, 1],
      split: "character",
      splitStagger: 2,
      easing: "easeOutCubic",
    }}
  >
    Character Animation
  </TextTransition>
);

export const sourceCode = `<TextTransition
  transition={{
    opacity: [0, 1],
    scale: [0.5, 1],
    split: "character",
    splitStagger: 2,
    easing: "easeOutCubic",
  }}
>
  Character Animation
</TextTransition>`;
