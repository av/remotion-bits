import React from "react";
import { Composition } from "remotion";
import { Playground } from "./Playground";
import {
  TextTransitionShowcase,
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

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Individual Component Showcases with Tweakable Props */}
      <Composition
        id="TextTransition"
        component={TextTransitionShowcase}
        durationInFrames={900}
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
    </>
  );
};
