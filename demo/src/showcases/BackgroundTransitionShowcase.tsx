import React from "react";
import { Sequence } from "remotion";
import {
  LinearGradientShowcase,
  RadialGradientShowcase,
  ConicGradientShowcase,
  MultiStopGradientShowcase,
  AngleInterpolationShowcase,
  TypeTransitionShowcase,
  ComplexGradientShowcase,
  ShortestPathAngleShowcase,
} from "./BackgroundTransitionShowcaseItem";

export const BackgroundTransitionShowcase: React.FC = () => {
  return (
    <>
      <Sequence from={0} durationInFrames={90}>
        <LinearGradientShowcase />
      </Sequence>

      <Sequence from={90} durationInFrames={90}>
        <RadialGradientShowcase />
      </Sequence>

      <Sequence from={180} durationInFrames={120}>
        <ConicGradientShowcase />
      </Sequence>

      <Sequence from={300} durationInFrames={120}>
        <MultiStopGradientShowcase />
      </Sequence>

      <Sequence from={420} durationInFrames={150}>
        <AngleInterpolationShowcase />
      </Sequence>

      <Sequence from={570} durationInFrames={180}>
        <TypeTransitionShowcase />
      </Sequence>

      <Sequence from={750} durationInFrames={120}>
        <ComplexGradientShowcase />
      </Sequence>

      <Sequence from={870} durationInFrames={90}>
        <ShortestPathAngleShowcase />
      </Sequence>
    </>
  );
};
