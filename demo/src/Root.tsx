import React from "react";
import { Composition } from "remotion";
import {
  TextTransitionShowcase,
  BackgroundTransitionShowcase,
  MotionTransitionShowcase,
  ParticlesSnowShowcase,
  ParticlesFountainShowcase,
  ParticlesGridShowcase,
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
import {
  SimpleFadeSlideShowcase,
  SimultaneousFadeShowcase,
  FadeInStaggerShowcase,
  ReverseStaggerShowcase,
  CenterStaggerShowcase,
  ComplexMotionShowcase,
  RandomGridShowcase,
} from "./showcases/MotionTransitionShowcase";

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

      <Composition
        id="MotionTransition"
        component={MotionTransitionShowcase}
        durationInFrames={690}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Individual Particles Examples */}
      <Composition
        id="Particles-Snow"
        component={ParticlesSnowShowcase}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Particles-Fountain"
        component={ParticlesFountainShowcase}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Particles-Grid"
        component={ParticlesGridShowcase}
        durationInFrames={180}
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

      {/* Individual MotionTransition Examples */}

      <Composition
        id="MotionTransition-SimpleFadeSlide"
        component={SimpleFadeSlideShowcase}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="MotionTransition-SimultaneousFade"
        component={SimultaneousFadeShowcase}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="MotionTransition-FadeInStagger"
        component={FadeInStaggerShowcase}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="MotionTransition-ReverseStagger"
        component={ReverseStaggerShowcase}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="MotionTransition-CenterStagger"
        component={CenterStaggerShowcase}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="MotionTransition-RandomGrid"
        component={RandomGridShowcase}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="MotionTransition-ComplexMotion"
        component={ComplexMotionShowcase}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
