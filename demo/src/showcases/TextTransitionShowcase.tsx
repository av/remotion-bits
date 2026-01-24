import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TextTransition } from "../../../src/components";
import { Center } from "./Center";

const baseStyle = {
  fontSize: "4rem",
  fontWeight: 700,
  color: "#ffffff",
  fontFamily: "Inter, ui-sans-serif, system-ui",
};

export const TextTransitionShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      {/* Example 1: Simple Fade In */}
      <Sequence from={0} durationInFrames={90}>
        <Center>
          <div style={baseStyle}>
            <TextTransition transition={{ opacity: [0, 1] }}>
              Hello World
            </TextTransition>
          </div>
        </Center>
      </Sequence>

      {/* Example 2: Slide from Left */}
      <Sequence from={90} durationInFrames={90}>
        <Center>
          <div style={baseStyle}>
            <TextTransition
              transition={{
                opacity: [0, 1],
                x: [-400, 0],
                easing: "easeInOut",
              }}
            >
              Sliding Text
            </TextTransition>
          </div>
        </Center>
      </Sequence>

      {/* Example 3: Word-by-Word Reveal */}
      <Sequence from={180} durationInFrames={120}>
        <Center>
          <div style={baseStyle}>
            <TextTransition
              transition={{
                scale: [0, 1.2, 1],
                opacity: [0, 1],
                split: "word",
                splitStagger: 3,
                easing: "easeOutCubic",
              }}
            >
              This appears word by word
            </TextTransition>
          </div>
        </Center>
      </Sequence>

      {/* Example 4: Character Color Transition */}
      <Sequence from={300} durationInFrames={90}>
        <Center>
          <div style={baseStyle}>
            <TextTransition
              transition={{
                color: ["#ffffff", "#fbbf24", "#f97316"],
                split: "character",
                splitStagger: 2,
                frames: [0, 60],
              }}
            >
              RAINBOW TEXT
            </TextTransition>
          </div>
        </Center>
      </Sequence>

      {/* Example 5: Complex Animation */}
      <Sequence from={390} durationInFrames={120}>
        <Center>
          <div style={baseStyle}>
            <TextTransition
              transition={{
                x: [-200, 0],
                y: [50, 0],
                scale: [0.5, 1],
                rotate: [90, 0],
                opacity: [0, 1],
                easing: "easeOutCubic",
                split: "word",
                splitStagger: 5,
                frames: [10, 80],
              }}
            >
              Complex Animation
            </TextTransition>
          </div>
        </Center>
      </Sequence>

      {/* Example 6: Cycling Text */}
      <Sequence from={510} durationInFrames={180}>
        <Center>
          <div style={baseStyle}>
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
          </div>
        </Center>
      </Sequence>

      {/* Example 7: Custom Easing */}
      <Sequence from={690} durationInFrames={90}>
        <Center>
          <div style={baseStyle}>
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
          </div>
        </Center>
      </Sequence>

      {/* Example 8: Line-by-Line Reveal */}
      <Sequence from={780} durationInFrames={120}>
        <Center>
          <div style={{ ...baseStyle, fontSize: "2rem", textAlign: "center" }}>
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
          </div>
        </Center>
      </Sequence>
    </AbsoluteFill>
  );
};
