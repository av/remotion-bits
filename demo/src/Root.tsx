import React from "react";
import { Composition } from "remotion";
import { Playground } from "./Playground";

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
          transitionDirection: "up" as const,
          transitionOffset: 24,
        }}
      />
    </>
  );
};
