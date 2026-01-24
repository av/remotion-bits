import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Backgrounds, HeroTitle, TextTransition } from "../../src/components";

export type PlaygroundProps = {
  // Background props
  backgroundVariant: "gradient" | "radial" | "solid";
  backgroundColors: string[];
  backgroundBlur: number;

  // HeroTitle props
  title: string;
  subtitle: string;
  accent: string;
  titleAlign: "left" | "center" | "right";

  // TextTransition props
  texts: string[];
  transitionDuration: number;
  transitionOffset: number;
};

export const Playground: React.FC<PlaygroundProps> = ({
  backgroundVariant,
  backgroundColors,
  backgroundBlur,
  title,
  subtitle,
  accent,
  titleAlign,
  texts,
  transitionDuration,
  transitionOffset,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animation for text transition container
  const textSpring = spring({
    frame: frame - 60,
    fps,
    config: {
      damping: 100,
    },
  });

  return (
    <AbsoluteFill>
      {/* Background Layer */}
      <Backgrounds
        variant={backgroundVariant}
        colors={backgroundColors}
        blur={backgroundBlur}
      />

      {/* Main Content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem",
          gap: "3rem",
        }}
      >
        {/* Hero Title */}
        <HeroTitle
          title={title}
          subtitle={subtitle}
          accent={accent}
          align={titleAlign}
        />

        {/* Text Transition Demo */}
        <div
          style={{
            fontSize: "4rem",
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "Inter, ui-sans-serif, system-ui",
            opacity: textSpring,
            transform: `scale(${0.8 + textSpring * 0.2})`,
          }}
        >
          <TextTransition
            transition={{
              opacity: [0, 1],
              y: [transitionOffset, 0],
              cycle: {
                texts: texts,
                itemDuration: transitionDuration,
              },
              delay: 60,
            }}
          />
        </div>

        {/* Component Labels */}
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            padding: "2rem",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "2rem",
              left: "2rem",
              background: "rgba(0, 0, 0, 0.5)",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              color: "#ffffff",
              fontSize: "1rem",
              fontFamily: "monospace",
              opacity: frame < 280 ? 0.6 : 0,
              transition: "opacity 0.3s",
            }}
          >
            Backgrounds Component
          </div>

          <div
            style={{
              position: "absolute",
              bottom: "2rem",
              right: "2rem",
              background: "rgba(0, 0, 0, 0.5)",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              color: "#ffffff",
              fontSize: "0.875rem",
              fontFamily: "monospace",
              opacity: 0.6,
            }}
          >
            Frame: {frame} / 300
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
