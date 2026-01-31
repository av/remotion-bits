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

export type { AnimatedValue };

export type StaggerDirection = "forward" | "reverse" | "center" | "random";

export type StaggeredMotionTransitionProps = TransformProps & VisualProps & TimingProps & {
  stagger?: number;
  staggerDirection?: StaggerDirection;
};

export type StaggeredMotionProps = {
  transition?: StaggeredMotionTransitionProps;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  cycleOffset?: number;
};

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
    return Math.abs(actualIndex - mid);
  }

  if (direction === "random") {
    const indices = Array.from({ length: totalChildren }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(random(`stagger-${i}`) * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.indexOf(actualIndex);
  }

  return actualIndex;
}

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
  } = transition ?? {};

  const easingFn = getEasingFunction(easing);

  const childArray = React.Children.toArray(children);
  const totalChildren = childArray.length;

  const renderChild = (child: React.ReactNode, actualIndex: number) => {
    const staggerIndex = calculateStaggerIndex(actualIndex, totalChildren, staggerDirection);

    const progress = useMotionTiming({
      frames,
      duration,
      delay,
      stagger,
      unitIndex: staggerIndex,
      easing,
      cycleOffset: cycleOffset !== undefined ? cycleOffset - delay : undefined,
    });

    const motionStyle = buildMotionStyles({
      progress,
      transforms: transition,
      styles: { opacity, color, backgroundColor, blur },
      easing: easingFn,
    });

    if (React.isValidElement(child)) {
      const existingStyle = (child.props as any).style || {};
      return React.cloneElement(child, {
        key: actualIndex,
        style: { ...existingStyle, ...motionStyle },
      } as any);
    }

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
