import React from "react";
import { AnimatedText } from "remotion-bits";

export const metadata = {
  name: "Fade In",
  description: "Simple fade-in text animation from transparent to opaque",
  tags: ["text", "fade", "basic"],
  duration: 90,
  width: 1920,
  height: 1080,
};

export const Component: React.FC = () => (
  <AnimatedText transition={{ opacity: [0, 1] }}>
    Hello World
  </AnimatedText>
);


