import React from "react";
import { AbsoluteFill } from "remotion";
import { TextTransition } from "../../../src/components";
import { Center } from "./Center";

const baseStyle = {
  fontSize: "12rem",
  fontWeight: 700,
  color: "#ffffff",
  fontFamily: "Inter, ui-sans-serif, system-ui",
  textAlign: "center" as const,
};

const Bg = ({ children }: { children: React.ReactNode }) => (
  <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
    <Center style={{ padding: '4rem', ...baseStyle }}>
      {children}
    </Center>
  </AbsoluteFill>
);

// Example 1: Simple Fade In
export const FadeInShowcase: React.FC = () => (
  <Bg>
    <TextTransition transition={{ opacity: [0, 1] }}>
      Hello World
    </TextTransition>
  </Bg>
);

// Example 2: Slide from Left
export const SlideFromLeftShowcase: React.FC = () => (
  <Bg>
    <TextTransition
      transition={{
        opacity: [0, 1],
        x: [-400, 0],
        easing: "easeInOut",
      }}
    >
      Sliding Text
    </TextTransition>
  </Bg>
);

// Example 3: Word-by-Word Reveal
export const WordByWordShowcase: React.FC = () => (
  <Bg>
    <TextTransition
      transition={{
        y: [200, 0],
        opacity: [0, 1],
        split: "word",
        splitStagger: 3,
        easing: "easeOutQuad",
      }}
    >
      This appears word by word
    </TextTransition>
  </Bg>
);

// Example 4: Character Color Transition
export const CharacterColorShowcase: React.FC = () => (
  <Bg>
    <TextTransition
      transition={{
        color: ["#ffffff", "#000000", "#ffffff"],
        split: "character",
        splitStagger: 2,
        frames: [0, 10],
        easing: "easeOutCubic",
      }}
    >
      Color Transition
    </TextTransition>
  </Bg>
);

// Example 5: Complex Animation
export const ComplexAnimationShowcase: React.FC = () => (
  <Bg>
    <TextTransition
      transition={{
        x: [200, 0],
        y: [50, 0],
        scale: [0.5, 1],
        rotate: [30, 0],
        opacity: [0, 1],
        easing: "easeOutCubic",
        split: "word",
        splitStagger: 5,
        frames: [10, 50],
      }}
    >
      Composite Animation
    </TextTransition>
  </Bg>
);

// Example 6: Cycling Text
export const CyclingTextShowcase: React.FC = () => (
  <Bg>
    <TextTransition
      transition={{
        opacity: [0, 1],
        y: [24, 0],
        cycle: {
          texts: ["Create", "Animate", "Export"],
          itemDuration: 45,
        },
      }}
    />
  </Bg>
);

// Example 7: Custom Easing
export const CustomEasingShowcase: React.FC = () => (
  <Bg>
    <TextTransition
      transition={{
        x: [-100, 0],
        opacity: [0, 1],
        easing: (t) => t * t * t,
        split: "character",
        splitStagger: 1,
      }}
    >
      Custom Easing
    </TextTransition>
  </Bg>
);

// Example 8: Line-by-Line Reveal
export const LineByLineShowcase: React.FC = () => (
  <Bg>
    <TextTransition
      transition={{
        x: [-50, 0],
        opacity: [0, 1],
        split: "line",
        splitStagger: 10,
        easing: "easeOutQuad",
      }}
    >
      {`First line\nSecond line\nThird line`}
    </TextTransition>
  </Bg>
);
