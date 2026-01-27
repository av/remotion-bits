import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { TextTransition } from "remotion-bits";
import { Center } from "./Center";

const baseStyle = {
  fontSize: "12rem",
  fontWeight: 700,
  color: "#ffffff",
  fontFamily: "Geist Sans, sans-serif",
  textAlign: "center" as const,
};

export const Bg = ({ children }: { children: React.ReactNode }) => {
  const { width } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <Center style={{ padding: '4rem', ...baseStyle, fontSize: width * 0.12 }}>
        {children}
      </Center>
    </AbsoluteFill>
  );
};

export const FadeInShowcase: React.FC = () => (
  <Bg>
    <TextTransition transition={{ opacity: [0, 1] }}>
      Hello World
    </TextTransition>
  </Bg>
);

export const SlideFromLeftShowcase: React.FC = () => {
  const { width } = useVideoConfig();
  return (
    <Bg>
      <TextTransition
        transition={{
          opacity: [0, 1],
          x: [-width / 2, 0],
          easing: "easeInOut",
        }}
      >
        Sliding Text
      </TextTransition>
    </Bg>
  );
};

export const WordByWordShowcase: React.FC = () => {
  const { height } = useVideoConfig();
  return (
    <Bg>
      <TextTransition
        transition={{
          y: [height * 0.25, 0],
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
};

export const CharacterColorShowcase: React.FC = () => (
  <Bg>
    <TextTransition
      transition={{
        color: ["#ffffff", "black", "oklch(100% 0.3 270)"],
        opacity: [1, 0.1, 1],
        split: "character",
        splitStagger: 1,
        frames: [0, 30],
      }}
    >
      Color Transition
    </TextTransition>
  </Bg>
);

export const ComplexAnimationShowcase: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <Bg>
      <TextTransition
        transition={{
          x: [width * 0.25, 0],
          y: [height * 0.1, 0],
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
};

export const CyclingTextShowcase: React.FC = () => (
  <Bg>
    <TextTransition
      transition={{
        opacity: [0, 1, 0],
        y: [24, 0, -24],
        frames: [0, 25, 30],
        cycle: {
          texts: ["Create", "Animate", "Export"],
          itemDuration: 30,
        },
      }}
    />
  </Bg>
);

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
