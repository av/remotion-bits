import React from "react";
import { Composition } from "remotion";
import { Playground } from "./Playground";
import {
  HeroTitleShowcase,
  heroTitleSchema,
  TextTransitionShowcase,
  BackgroundsShowcase,
  backgroundsSchema,
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
      {/* Original Combined Playground */}
      <Composition
        id="Playground"
        component={Playground}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          // Background props
          backgroundVariant: "gradient" as const,
          backgroundColors: ["#0f172a", "#1e293b", "#6366f1"],
          backgroundBlur: 0,

          // HeroTitle props
          title: "Remotion Bits",
          subtitle: "Beautiful components for your videos",
          accent: "Demo Playground",
          titleAlign: "center" as const,

          // TextTransition props
          texts: ["Create", "Animate", "Export", "Share"],
          transitionDuration: 45,
          transitionOffset: 24,
        }}
      />

      {/* Individual Component Showcases with Tweakable Props */}
      <Composition
        id="HeroTitle"
        component={HeroTitleShowcase}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        schema={heroTitleSchema}
        defaultProps={{
          title: "Remotion Bits",
          subtitle: "Beautiful components for your videos",
          accent: "Demo Playground",
          align: "center",
          staticOpacity: 1,
          staticTranslateY: 0,
          useAnimatedOpacity: true,
          useAnimatedTranslate: true,
        }}
      />

      <Composition
        id="TextTransition"
        component={TextTransitionShowcase}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Backgrounds"
        component={BackgroundsShowcase}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        schema={backgroundsSchema}
        defaultProps={{
          variant: "gradient",
          color1: "#0f172a",
          color2: "#1e293b",
          color3: "#6366f1",
          staticBlur: 0,
          useAnimatedBlur: false,
          showContent: true,
        }}
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
