import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { resolveInterpolateValue, type InterpolateValue } from "../utils";

export type TextTransitionProps = {
  texts: string[];
  itemDurationInFrames?: number;
  startAt?: number;
  direction?: "up" | "down" | "left" | "right";
  offset?: InterpolateValue;
  className?: string;
  style?: React.CSSProperties;
};

export const TextTransition: React.FC<TextTransitionProps> = ({
  texts,
  itemDurationInFrames,
  startAt = 0,
  direction = "up",
  offset = 24,
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = itemDurationInFrames ?? Math.round(fps * 1.5);

  const relativeFrame = Math.max(0, frame - startAt);
  const index = Math.min(
    Math.floor(relativeFrame / duration),
    texts.length - 1,
  );
  const localFrame = relativeFrame - index * duration;

  const opacity = resolveInterpolateValue(
    [[0, duration * 0.2, duration * 0.8, duration], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }],
    localFrame
  );

  const resolvedOffset = resolveInterpolateValue(offset, frame);
  const travel = resolveInterpolateValue(
    [[0, duration * 0.2], [resolvedOffset, 0], {
      extrapolateRight: "clamp",
    }],
    localFrame
  );

  const translate =
    direction === "up"
      ? `translateY(${travel}px)`
      : direction === "down"
        ? `translateY(${-travel}px)`
        : direction === "left"
          ? `translateX(${travel}px)`
          : `translateX(${-travel}px)`;

  const text = texts[index] ?? "";

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        opacity,
        transform: translate,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {text}
    </span>
  );
};
