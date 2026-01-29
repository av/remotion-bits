import React from "react";
import { random } from "remotion";
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

export type StaggerDirection = "forward" | "reverse" | "center" | "random";

export type StaggeredMotionTransitionProps = TransformProps & VisualProps & TimingProps & {
  // Stagger configuration
  stagger?: number;
  staggerDirection?: StaggerDirection;
};

export type StaggeredMotionProps = {
  transition: StaggeredMotionTransitionProps;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Optional offset to override the current frame state.
   * If provided, this value is used as the current frame progress for the animation.
   * Useful for relative animations like particles.
   */
  cycleOffset?: number;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculates the stagger index based on direction
 */
function calculateStaggerIndex(
  actualIndex: number,
  totalChildren: number,
  direction: StaggerDirection
): number {
  if (direction === "reverse") {
    return totalChildren - 1 - actualIndex;
  }

  if (direction === "center") {
    const mid = Math.floor(totalChildren / 2);
    // Calculate distance from center - closer elements get lower stagger index
    return Math.abs(actualIndex - mid);
  }

  if (direction === "random") {
    // Use Remotion's deterministic random to generate a shuffle order
    // Create a shuffled array of indices using Fisher-Yates algorithm
    const indices = Array.from({ length: totalChildren }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(random(`stagger-${i}`) * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.indexOf(actualIndex);
  }

  // Default: forward
  return actualIndex;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const StaggeredMotion: React.FC<StaggeredMotionProps> = ({
  transition,
  children,
  className,
  style,
  cycleOffset,
}) => {
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
    stagger = 0,
    staggerDirection = "forward",
    easing,
  } = transition;

  const easingFn = getEasingFunction(easing);

  // Convert children to array for stable indexing
  const childArray = React.Children.toArray(children);
  const totalChildren = childArray.length;

  // Render function for each child
  const renderChild = (child: React.ReactNode, actualIndex: number) => {
    // Calculate stagger index based on direction
    const staggerIndex = calculateStaggerIndex(actualIndex, totalChildren, staggerDirection);

    // Calculate progress using motion framework
    const progress = useMotionTiming({
      frames,
      duration,
      delay,
      stagger,
      unitIndex: staggerIndex,
      easing,
      cycleOffset: cycleOffset !== undefined ? cycleOffset - delay : undefined,
    });

    // Build animated styles using motion framework
    const motionStyle = buildMotionStyles({
      progress,
      transforms: { x, y, z, scale, scaleX, scaleY, rotate, rotateX, rotateY, rotateZ, skew, skewX, skewY },
      styles: { opacity, color, backgroundColor, blur },
      easing: easingFn,
    });

    // Clone element and merge styles
    if (React.isValidElement(child)) {
      const existingStyle = (child.props as any).style || {};
      return React.cloneElement(child, {
        key: actualIndex,
        style: { ...existingStyle, ...motionStyle },
      } as any);
    }

    // For non-element children (text, numbers, etc.), wrap in span
    return (
      <span key={actualIndex} style={motionStyle}>
        {child}
      </span>
    );
  };

  return (
    <div
      className={className}
      style={style}
    >
      {childArray.map(renderChild)}
    </div>
  );
};
