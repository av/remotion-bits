import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TextTransition } from "../../../src/components";
import { Center } from "./Center";
import { CharacterColorShowcase, ComplexAnimationShowcase, CustomEasingShowcase, CyclingTextShowcase, FadeInShowcase, LineByLineShowcase, SlideFromLeftShowcase, WordByWordShowcase } from './TextTransitionShowcaseItem';

const baseStyle = {
  fontSize: "12rem",
  fontWeight: 700,
  color: "#fffcf0",
  fontFamily: "Inter, ui-sans-serif, system-ui",
};

export const TextTransitionShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#100f0f" }}>
      <Sequence from={0} durationInFrames={90}>
        <FadeInShowcase />
      </Sequence>

      <Sequence from={90} durationInFrames={90}>
        <SlideFromLeftShowcase />
      </Sequence>

      <Sequence from={180} durationInFrames={120}>
        <WordByWordShowcase />
      </Sequence>

      <Sequence from={300} durationInFrames={90}>
        <CharacterColorShowcase />
      </Sequence>

      <Sequence from={390} durationInFrames={120}>
        <ComplexAnimationShowcase />
      </Sequence>

      <Sequence from={510} durationInFrames={180}>
        <CyclingTextShowcase />
      </Sequence>

      <Sequence from={690} durationInFrames={90}>
        <CustomEasingShowcase />
      </Sequence>

      <Sequence from={780} durationInFrames={120}>
        <LineByLineShowcase />
      </Sequence>
    </AbsoluteFill>
  );
};
