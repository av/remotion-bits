import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { z } from "zod";
import { Backgrounds } from "../../../src/components";
import { Center } from "./Center";

export const backgroundsSchema = z.object({
  variant: z.enum(["gradient", "radial", "solid"]).default("gradient"),
  color1: z.string().default("#0f172a"),
  color2: z.string().default("#1e293b"),
  color3: z.string().default("#6366f1"),
  staticBlur: z.number().min(0).max(50).default(0),
  useAnimatedBlur: z.boolean().default(false),
  showContent: z.boolean().default(true),
});

export type BackgroundsShowcaseProps = z.infer<typeof backgroundsSchema>;

export const BackgroundsShowcase: React.FC<BackgroundsShowcaseProps> = ({
  variant,
  color1,
  color2,
  color3,
  staticBlur,
  useAnimatedBlur,
  showContent,
}) => {
  return (
    <AbsoluteFill>
      <Sequence from={0}>
        <Backgrounds
          variant={variant}
          colors={[color1, color2, color3]}
          blur={useAnimatedBlur ? [[0, 60], [0, 20]] : staticBlur}
        />
      </Sequence>

      {showContent && (
        <Center
          style={{
            flexDirection: "column",
            gap: "2rem",
          }}
        >
          <h1
            style={{
              color: "#ffffff",
              fontSize: "5rem",
              fontWeight: 700,
              margin: 0,
              fontFamily: "Inter, ui-sans-serif, system-ui",
              textAlign: "center",
            }}
          >
            Background Showcase
          </h1>
          <p
            style={{
              color: "#ffffff",
              fontSize: "2rem",
              opacity: 0.8,
              margin: 0,
              fontFamily: "Inter, ui-sans-serif, system-ui",
            }}
          >
            Variant: {variant}
          </p>
        </Center>
      )}
    </AbsoluteFill>
  );
};
