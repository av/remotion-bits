import React from "react";
import { AnimatedText } from "remotion-bits";

export const metadata = {
  name: "Word by Word",
  description: "Animated text that appears word by word with staggered timing",
  tags: ["text", "word", "stagger"],
  duration: 120,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-word-by-word",
    title: "Word by Word Animation",
    description: "Animated text that appears word by word with staggered timing",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["animated-text"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/animated-text/WordByWord.tsx",
      },
    ],
  },
};

export const Component: React.FC = () => (
  <AnimatedText
    transition={{
      y: [20, 0],
      opacity: [0, 1],
      split: "word",
      splitStagger: 3,
      easing: "easeOutQuad",
    }}
  >
    This appears word by word
  </AnimatedText>
);


