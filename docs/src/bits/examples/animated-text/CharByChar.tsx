import React from "react";
import { AnimatedText } from "remotion-bits";

export const metadata = {
  name: "Staggered Char Animation",
  description: "Text that appears character by character with staggered timing",
  tags: ["text", "character", "stagger"],
  duration: 120,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-char-by-char",
    title: "Character by Character Animation",
    description: "Text that appears character by character with staggered timing",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["animated-text"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/animated-text/CharByChar.tsx",
      },
    ],
  },
};

export const Component: React.FC = () => (
  <AnimatedText
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
  </AnimatedText>
);


