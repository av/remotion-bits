import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  Easing,
  type EasingName,
  type EasingFunction,
  interpolateGradientKeyframes,
} from "../utils";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type GradientTransitionProps = {
  /**
   * Array of CSS gradient strings to transition between
   * Supports linear-gradient, radial-gradient, and conic-gradient
   *
   * @example
   * gradient={[
   *   "linear-gradient(90deg, red, blue)",
   *   "linear-gradient(180deg, green, yellow)",
   * ]}
   */
  gradient: string[];

  /**
   * Frame range for the transition [start, end]
   * If not specified, uses [0, composition duration]
   */
  frames?: [number, number];

  /**
   * Duration in frames
   * Alternative to frames range
   */
  duration?: number;

  /**
   * Start frame (delay)
   * Default: 0
   */
  delay?: number;

  /**
   * Easing function to apply to the interpolation
   * Default: 'linear'
   */
  easing?: EasingFunction | EasingName;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Additional inline styles (applied after gradient)
   */
  style?: React.CSSProperties;

  /**
   * Children to render on top of the gradient background
   */
  children?: React.ReactNode;

  /**
   * Whether to use shortest angle interpolation for gradient angles
   * When true, angles interpolate via shortest path (e.g., 350° → 10° goes through 0°)
   * When false, angles interpolate linearly
   * Default: true
   */
  shortestAngle?: boolean;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getEasingFunction(easing?: EasingFunction | EasingName): EasingFunction | undefined {
  if (!easing) return undefined;
  if (typeof easing === "function") return easing;
  return Easing[easing];
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * GradientTransition - Smooth gradient transitions for Remotion compositions
 *
 * Intelligently interpolates between CSS gradients using:
 * - Perceptually uniform Oklch color interpolation (via culori)
 * - Granim.js-inspired angle/position interpolation
 * - Frame-based rendering for deterministic Remotion video export
 *
 * Features:
 * - Supports linear-gradient, radial-gradient, conic-gradient
 * - Handles gradients with varying color stop counts
 * - Auto-distributes missing color stop positions
 * - Shortest-path angle interpolation (350° → 10° goes through 0°)
 * - Seamless transitions between different gradient types
 *
 * @example
 * // Simple linear gradient transition
 * <GradientTransition
 *   gradient={[
 *     "linear-gradient(0deg, #ff0000, #0000ff)",
 *     "linear-gradient(180deg, #00ff00, #ffff00)",
 *   ]}
 *   duration={60}
 * />
 *
 * @example
 * // Radial to linear transition
 * <GradientTransition
 *   gradient={[
 *     "radial-gradient(circle, red, blue)",
 *     "linear-gradient(90deg, green, yellow)",
 *   ]}
 *   easing="easeInOut"
 * />
 *
 * @example
 * // Multi-keyframe with conic gradients
 * <GradientTransition
 *   gradient={[
 *     "conic-gradient(from 0deg, red, yellow, green)",
 *     "conic-gradient(from 180deg, blue, purple, pink)",
 *     "conic-gradient(from 360deg, orange, cyan, magenta)",
 *   ]}
 *   frames={[0, 120]}
 * />
 */
export const GradientTransition: React.FC<GradientTransitionProps> = ({
  gradient,
  frames,
  duration,
  delay = 0,
  easing = "linear",
  className,
  style,
  children,
  shortestAngle = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const easingFn = getEasingFunction(easing);

  // Calculate timing
  const startFrame = frames ? frames[0] : 0;
  const endFrame = frames ? frames[1] : (duration ?? durationInFrames);
  const totalDuration = endFrame - startFrame;

  // Calculate progress
  const relativeFrame = Math.max(0, frame - delay);
  const progress = Math.min(Math.max((relativeFrame - startFrame) / totalDuration, 0), 1);

  // Interpolate gradient
  const interpolatedGradient = interpolateGradientKeyframes(gradient, progress, easingFn, shortestAngle);

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: interpolatedGradient,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
