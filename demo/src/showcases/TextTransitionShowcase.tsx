import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { z } from "zod";
import { TextTransition } from "../../../src/components";
import { Center } from "./Center";

export const textTransitionSchema = z.object({
  texts: z
    .string()
    .default("Create,Animate,Export,Share")
    .describe("Comma-separated text items"),
  itemDurationInFrames: z.number().min(10).max(120).default(45),
  startAt: z.number().min(0).max(300).default(0),
  direction: z.enum(["up", "down", "left", "right"]).default("up"),
  staticOffset: z.number().min(0).max(100).default(24),
  fontSize: z.string().default("4rem"),
  fontWeight: z.number().min(100).max(900).step(100).default(700),
  color: z.string().default("#ffffff"),
});

export type TextTransitionShowcaseProps = z.infer<typeof textTransitionSchema>;

export const TextTransitionShowcase: React.FC<TextTransitionShowcaseProps> = ({
  texts,
  itemDurationInFrames,
  startAt,
  direction,
  staticOffset,
  fontSize,
  fontWeight,
  color,
}) => {
  const textArray = texts.split(",").map((t) => t.trim());

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <Sequence from={0}>
        <Center>
          <div
            style={{
              fontSize,
              fontWeight,
              color,
              fontFamily: "Inter, ui-sans-serif, system-ui",
            }}
          >
            <TextTransition
              texts={textArray}
              itemDurationInFrames={itemDurationInFrames}
              startAt={startAt}
              direction={direction}
              offset={staticOffset}
            />
          </div>
        </Center>
      </Sequence>
    </AbsoluteFill>
  );
};
