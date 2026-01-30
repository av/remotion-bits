import React from "react";
import { AnimatedText } from "remotion-bits";

export const metadata = {
  name: "Slide from Left",
  description: "Text that slides in from the left with fade-in effect",
  tags: ["text", "slide", "motion"],
  duration: 90,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-slide-from-left",
    title: "Slide from Left Text",
    description: "Text that slides in from the left with fade-in effect",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["animated-text"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/staggered-motion/SlideFromLeft.tsx",
      },
    ],
  },
};

export const Component: React.FC = () => (
  <AnimatedText
    transition={{
      opacity: [0, 1],
      x: [-400, 0],
      easing: "easeInOut",
    }}
  >
    Sliding Text
  </AnimatedText>
);


