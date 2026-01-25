import React from "react";
import { Composition } from "remotion";
import { Playground } from "./Playground";
import {
  TextTransitionShowcase,
  BackgroundTransitionShowcase,
} from "./showcases";
import {
  FadeInShowcase,
  SlideFromLeftShowcase,
  WordByWordShowcase,
  CharacterColorShowcase,
  ComplexAnimationShowcase,
  CyclingTextShowcase,
  CustomEasingShowcase,
  LineByLineShowcase,
} from "./showcases/TextTransitionShowcaseItem";
import {
  LinearGradientShowcase,
  RadialGradientShowcase,
  ConicGradientShowcase,
  MultiStopGradientShowcase,
  AngleInterpolationShowcase,
  TypeTransitionShowcase,
  ComplexGradientShowcase,
  ShortestPathAngleShowcase,
} from "./showcases/BackgroundTransitionShowcaseItem";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Component Showcase Collections */}
      <Composition
        id="TextTransition"
        component={TextTransitionShowcase}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="BackgroundTransition"
        component={BackgroundTransitionShowcase}
        durationInFrames={960}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Individual TextTransition Examples */}
      <Composition
        id="TextTransition-FadeIn"
        component={FadeInShowcase}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="TextTransition-SlideFromLeft"
        component={SlideFromLeftShowcase}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="TextTransition-WordByWord"
        component={WordByWordShowcase}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="TextTransition-CharacterColor"
        component={CharacterColorShowcase}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="TextTransition-ComplexAnimation"
        component={ComplexAnimationShowcase}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="TextTransition-CyclingText"
        component={CyclingTextShowcase}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="TextTransition-CustomEasing"
        component={CustomEasingShowcase}
        durationInFrames={60}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="TextTransition-LineByLine"
        component={LineByLineShowcase}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Individual BackgroundTransition Examples */}
      <Composition
        id="BackgroundTransition-Linear"
        component={LinearGradientShowcase}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="BackgroundTransition-Radial"
        component={RadialGradientShowcase}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="BackgroundTransition-Conic"
        component={ConicGradientShowcase}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="BackgroundTransition-MultiStop"
        component={MultiStopGradientShowcase}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="BackgroundTransition-AngleInterpolation"
        component={AngleInterpolationShowcase}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="BackgroundTransition-TypeTransition"
        component={TypeTransitionShowcase}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="BackgroundTransition-Complex"
        component={ComplexGradientShowcase}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="BackgroundTransition-ShortestPath"
        component={ShortestPathAngleShowcase}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
