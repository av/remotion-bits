import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { z } from "zod";
import { HeroTitle } from "../../../src/components";
import { Center } from "./Center";

export const heroTitleSchema = z.object({
  title: z.string().default("Remotion Bits"),
  subtitle: z.string().default("Beautiful components for your videos"),
  accent: z.string().default("Demo Playground"),
  align: z.enum(["left", "center", "right"]).default("center"),
  // InterpolateValue support - for simplicity in UI, using static values
  staticOpacity: z.number().min(0).max(1).default(1),
  staticTranslateY: z.number().min(-100).max(100).default(0),
  // Animation toggles
  useAnimatedOpacity: z.boolean().default(true),
  useAnimatedTranslate: z.boolean().default(true),
});

export type HeroTitleShowcaseProps = z.infer<typeof heroTitleSchema>;

export const HeroTitleShowcase: React.FC<HeroTitleShowcaseProps> = ({
  title,
  subtitle,
  accent,
  align,
  staticOpacity,
  staticTranslateY,
  useAnimatedOpacity,
  useAnimatedTranslate,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <Sequence from={0}>
        <Center>
          <HeroTitle
            title={title}
            subtitle={subtitle}
            accent={accent}
            align={align}
            opacity={useAnimatedOpacity ? [[0, 20], [0, 1]] : staticOpacity}
            translateY={useAnimatedTranslate ? [[0, 20], [16, 0]] : staticTranslateY}
          />
        </Center>
      </Sequence>
    </AbsoluteFill>
  );
};
