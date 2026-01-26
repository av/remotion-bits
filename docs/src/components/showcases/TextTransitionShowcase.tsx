import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  CharacterColorShowcase,
  ComplexAnimationShowcase,
  CustomEasingShowcase,
  CyclingTextShowcase,
  FadeInShowcase,
  LineByLineShowcase,
  SlideFromLeftShowcase,
  WordByWordShowcase,
} from "./TextTransitionShowcaseItem";

export const TextTransitionShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
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
