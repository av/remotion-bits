import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Easing, type EasingName, type EasingFunction } from "../utils";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type AnimatedValue = number | [number, number] | [number, number, number] | number[];

export type TransitionProps = {
  // Transform properties
  x?: AnimatedValue;
  y?: AnimatedValue;
  z?: AnimatedValue;
  scale?: AnimatedValue;
  scaleX?: AnimatedValue;
  scaleY?: AnimatedValue;
  rotate?: AnimatedValue;
  rotateX?: AnimatedValue;
  rotateY?: AnimatedValue;
  rotateZ?: AnimatedValue;
  skew?: AnimatedValue;
  skewX?: AnimatedValue;
  skewY?: AnimatedValue;

  // Visual properties
  opacity?: AnimatedValue;
  color?: string[];
  backgroundColor?: string[];
  blur?: AnimatedValue;

  // Timing
  frames?: [number, number];
  duration?: number;
  delay?: number;

  // Split configuration
  split?: "none" | "word" | "character" | "line";
  splitStagger?: number;

  // Easing
  easing?: EasingFunction | EasingName;

  // Text cycling (backward compatibility)
  cycle?: {
    texts: string[];
    itemDuration: number;
  };
};

export type TextTransitionProps = {
  transition: TransitionProps;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function splitText(text: string, mode: "none" | "word" | "character" | "line"): string[] {
  if (mode === "none") return [text];
  if (mode === "word") return text.split(/(\s+)/);
  if (mode === "character") return text.split("");
  if (mode === "line") return text.split("\n");
  return [text];
}

function interpolateKeyframes(
  value: AnimatedValue,
  progress: number,
  easingFn?: EasingFunction
): number {
  if (typeof value === "number") return value;

  const keyframes = Array.isArray(value) ? value : [value];
  if (keyframes.length === 0) return 0;
  if (keyframes.length === 1) return keyframes[0];

  const segments = keyframes.length - 1;
  const segmentProgress = progress * segments;
  const segmentIndex = Math.min(Math.floor(segmentProgress), segments - 1);
  const localProgress = segmentProgress - segmentIndex;

  const from = keyframes[segmentIndex];
  const to = keyframes[segmentIndex + 1];

  const eased = easingFn ? easingFn(localProgress) : localProgress;
  return from + (to - from) * eased;
}

function interpolateColor(colors: string[], progress: number): string {
  if (colors.length === 0) return "transparent";
  if (colors.length === 1) return colors[0];

  const segments = colors.length - 1;
  const segmentProgress = progress * segments;
  const segmentIndex = Math.min(Math.floor(segmentProgress), segments - 1);
  const localProgress = segmentProgress - segmentIndex;

  const fromColor = colors[segmentIndex];
  const toColor = colors[segmentIndex + 1];

  // Simple color interpolation (could be enhanced with proper color space conversion)
  return localProgress < 0.5 ? fromColor : toColor;
}

function getEasingFunction(easing?: EasingFunction | EasingName): EasingFunction | undefined {
  if (!easing) return undefined;
  if (typeof easing === "function") return easing;
  return Easing[easing];
}

// ============================================================================
// COMPONENT
// ============================================================================

export const TextTransition: React.FC<TextTransitionProps> = ({
  transition,
  children,
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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

  // Calculate timing
  const startFrame = frames ? frames[0] : 0;
  const endFrame = frames ? frames[1] : (duration ?? fps);
  const totalDuration = endFrame - startFrame;

  // Handle text cycling
  let content: string;

  if (cycle) {
    const { texts, itemDuration } = cycle;
    const relativeFrame = Math.max(0, frame - delay);
    const cycleIndex = Math.floor(relativeFrame / itemDuration) % texts.length;
    content = texts[cycleIndex] || "";
  } else {
    content = typeof children === "string" ? children : String(children || "");
  }

  // Split text
  const units = splitText(content, split);

  // Render function for each unit
  const renderUnit = (unit: string, index: number) => {
    const relativeFrame = Math.max(0, frame - delay - (index * splitStagger));
    const progress = Math.min(Math.max((relativeFrame - startFrame) / totalDuration, 0), 1);

    // Build transform string
    const transforms: string[] = [];

    if (x !== undefined) {
      const xVal = interpolateKeyframes(x, progress, easingFn);
      transforms.push(`translateX(${xVal}px)`);
    }
    if (y !== undefined) {
      const yVal = interpolateKeyframes(y, progress, easingFn);
      transforms.push(`translateY(${yVal}px)`);
    }
    if (z !== undefined) {
      const zVal = interpolateKeyframes(z, progress, easingFn);
      transforms.push(`translateZ(${zVal}px)`);
    }

    if (scale !== undefined) {
      const scaleVal = interpolateKeyframes(scale, progress, easingFn);
      transforms.push(`scale(${scaleVal})`);
    }
    if (scaleX !== undefined) {
      const scaleXVal = interpolateKeyframes(scaleX, progress, easingFn);
      transforms.push(`scaleX(${scaleXVal})`);
    }
    if (scaleY !== undefined) {
      const scaleYVal = interpolateKeyframes(scaleY, progress, easingFn);
      transforms.push(`scaleY(${scaleYVal})`);
    }

    if (rotate !== undefined) {
      const rotateVal = interpolateKeyframes(rotate, progress, easingFn);
      transforms.push(`rotate(${rotateVal}deg)`);
    }
    if (rotateX !== undefined) {
      const rotateXVal = interpolateKeyframes(rotateX, progress, easingFn);
      transforms.push(`rotateX(${rotateXVal}deg)`);
    }
    if (rotateY !== undefined) {
      const rotateYVal = interpolateKeyframes(rotateY, progress, easingFn);
      transforms.push(`rotateY(${rotateYVal}deg)`);
    }
    if (rotateZ !== undefined) {
      const rotateZVal = interpolateKeyframes(rotateZ, progress, easingFn);
      transforms.push(`rotateZ(${rotateZVal}deg)`);
    }

    if (skew !== undefined) {
      const skewVal = interpolateKeyframes(skew, progress, easingFn);
      transforms.push(`skew(${skewVal}deg)`);
    }
    if (skewX !== undefined) {
      const skewXVal = interpolateKeyframes(skewX, progress, easingFn);
      transforms.push(`skewX(${skewXVal}deg)`);
    }
    if (skewY !== undefined) {
      const skewYVal = interpolateKeyframes(skewY, progress, easingFn);
      transforms.push(`skewY(${skewYVal}deg)`);
    }

    // Build style object
    const unitStyle: React.CSSProperties = {
      display: "inline-block",
    };

    if (transforms.length > 0) {
      unitStyle.transform = transforms.join(" ");
    }

    if (opacity !== undefined) {
      unitStyle.opacity = interpolateKeyframes(opacity, progress, easingFn);
    }

    if (color) {
      unitStyle.color = interpolateColor(color, progress);
    }

    if (backgroundColor) {
      unitStyle.backgroundColor = interpolateColor(backgroundColor, progress);
    }

    if (blur !== undefined) {
      const blurVal = interpolateKeyframes(blur, progress, easingFn);
      unitStyle.filter = `blur(${blurVal}px)`;
    }

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
