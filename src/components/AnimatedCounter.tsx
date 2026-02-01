import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  useMotionTiming,
  buildMotionStyles,
  interpolateKeyframes,
  getEasingFunction,
  type AnimatedValue,
  type TransformProps,
  type VisualProps,
  type TimingProps,
} from "../utils/motion";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type AnimatedCounterTransitionProps = TransformProps & VisualProps & TimingProps & {
  /**
   * The values to interpolate between.
   * Can be a single number or an array of numbers (keyframes).
   * Supports `hold` frames for complex timing.
   * @example
   * values: [0, 100] // interpolates from 0 to 100
   * values: [0, 100, 50] // interpolates from 0 to 100 then back to 50
   */
  values: AnimatedValue;
};

export type AnimatedCounterProps = {
  /**
   * Configuration for the animation
   */
  transition: AnimatedCounterTransitionProps;
  
  /**
   * Element to render before the counter number
   */
  prefix?: React.ReactNode;
  
  /**
   * Element to render after the counter number
   */
  postfix?: React.ReactNode;
  
  /**
   * Number of decimal places to display. Defaults to 0 (integer).
   */
  toFixed?: number;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Additional inline styles
   */
  style?: React.CSSProperties;
};

// ============================================================================
// COMPONENT
// ============================================================================

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  transition,
  prefix,
  postfix,
  toFixed = 0,
  className,
  style,
}) => {
  const { fps } = useVideoConfig();

  const {
    values,
    frames,
    duration,
    delay = 0,
    easing,
    opacity,
    color,
    backgroundColor,
    blur,
    ...transforms
  } = transition;

  // Calculate total duration for interpolation context
  const startFrame = frames ? frames[0] : 0;
  const endFrame = frames ? frames[1] : (duration ?? fps);
  const totalDuration = endFrame - startFrame;

  const easingFn = getEasingFunction(easing);

  // Calculate progress
  const progress = useMotionTiming({
    frames,
    duration,
    delay,
    easing: easingFn,
  });

  // Interpolate the counter value
  const value = interpolateKeyframes(values, progress, easingFn, totalDuration);

  // Build container styles
  const containerStyle = buildMotionStyles({
    progress,
    transforms,
    styles: { opacity, color, backgroundColor, blur },
    easing: easingFn,
    baseStyle: {
       display: "inline-flex",
       alignItems: "center",
       ...style
    },
    duration: totalDuration,
  });

  return (
    <span className={className} style={containerStyle}>
      {prefix}
      <span>{value.toFixed(toFixed)}</span>
      {postfix}
    </span>
  );
};
