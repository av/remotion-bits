import React from "react";
import { AnimatedText } from "remotion-bits";

export const metadata = {
  name: "Blur Slide Word",
  description: "Text that fades, unblurs and slides up word by word",
  tags: ["text", "word", "blur", "slide", "stagger"],
  duration: 90,
  width: 1920,
  height: 1080,
};

export const Component: React.FC = () => (
  <AnimatedText
    transition={{
      y: [40, 0],
      blur: [10, 0],
      opacity: [0, 1],
      split: "word",
      splitStagger: 1,
      easing: "easeOutCubic",
    }}
    style={{
      fontWeight: "bold",
      color: "white",
    }}
  >
    Text Transition
  </AnimatedText>
);
