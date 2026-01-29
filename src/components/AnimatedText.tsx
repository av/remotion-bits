import React from "react";
import { useCurrentFrame } from "remotion";
import type { EasingName, EasingFunction } from "../utils";
import {
  useMotionTiming,
  buildMotionStyles,
  getEasingFunction,
  type AnimatedValue,
  type TransformProps,
  type VisualProps,
  type TimingProps,
} from "../utils/motion";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type { AnimatedValue };

export type AnimatedTextTransitionProps = TransformProps & VisualProps & TimingProps & {
  // Split configuration
  split?: string;
  splitStagger?: number;

  // Text cycling (backward compatibility)
  cycle?: {
    texts: string[];
    itemDuration: number;
  };
};

export type AnimatedTextProps = {
  transition: AnimatedTextTransitionProps;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function splitText(text: string, mode: string): string[] {
  if (mode === "none") return [text];
  if (mode === "word") return text.split(/(\s+)/);
  if (mode === "character") return text.split("");
  if (mode === "line") return text.split("\n");
  // Custom separator: split by the provided string
  return text.split(mode);
}

// ============================================================================
// COMPONENT
// ============================================================================

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  transition,
  children,
  className,
  style,
}) => {
  const frame = useCurrentFrame();

  const {
    x,
    y,
    z,
    scale,
    scaleX,
    scaleY,
    rotate,
    rotateX,
    rotateY,
    rotateZ,
    skew,
    skewX,
    skewY,
    opacity,
    color,
    backgroundColor,
    blur,
    frames,
    duration,
    delay = 0,
    split = "none",
    splitStagger = 0,
    easing,
    cycle,
  } = transition;

  const easingFn = getEasingFunction(easing);

  // Handle text cycling
  let content: string;
  let cycleFrameOffset: number | undefined;

  if (cycle) {
    const { texts, itemDuration } = cycle;
    const relativeFrame = Math.max(0, frame - delay);
    const cycleIndex = Math.floor(relativeFrame / itemDuration) % texts.length;
    content = texts[cycleIndex] || "";
    // Calculate frame offset within the current cycle item
    cycleFrameOffset = relativeFrame % itemDuration;
  } else {
    content = typeof children === "string" ? children : String(children || "");
  }

  // Split text
  const units = splitText(content, split);

  // Render function for each unit
  const renderUnit = (unit: string, index: number) => {
    // Calculate progress using motion framework
    const progress = useMotionTiming({
      frames,
      duration,
      delay,
      stagger: splitStagger,
      unitIndex: index,
      easing,
      cycleOffset: cycleFrameOffset,
    });

    // Build animated styles using motion framework
    const unitStyle = buildMotionStyles({
      progress,
      transforms: { x, y, z, scale, scaleX, scaleY, rotate, rotateX, rotateY, rotateZ, skew, skewX, skewY },
      styles: { opacity, color, backgroundColor, blur },
      easing: easingFn,
      baseStyle: {
        display: "inline-block",
        whiteSpace: "pre",
      },
    });

    return (
      <span key={index} style={unitStyle}>
        {unit}
      </span>
    );
  };

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        ...style,
      }}
    >
      {units.map(renderUnit)}
    </span>
  );
};
