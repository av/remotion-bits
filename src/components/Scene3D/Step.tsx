import React, { useLayoutEffect, useMemo } from "react";
import { random } from "remotion";
import type { StepProps, TransitionConfig } from "./types";
import { useScene3D } from "./context";
import {
  useMotionTiming,
  buildMotionStyles,
  getEasingFunction,
  interpolateKeyframes,
  StepTimingContext,
} from "../../utils/motion";
import { Transform3D, Vector3 } from "../../utils/transform3d";
import { transformToCSS } from "../../utils/interpolate3d";

const STEP_SYMBOL = Symbol("Scene3D.Step");

export function isStepElement(
  element: React.ReactNode
): element is React.ReactElement<StepProps> {
  return (
    React.isValidElement(element) &&
    typeof element.type === "function" &&
    STEP_SYMBOL in element.type
  );
}

function calculateStaggerIndex(
  actualIndex: number,
  totalChildren: number,
  direction: "forward" | "reverse" | "center" | "random"
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
      const j = Math.floor(random(`step-stagger-${i}`) * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.indexOf(actualIndex);
  }
  return actualIndex;
}

function getTransitionStyles(
  transition: TransitionConfig,
  progress: number,
  duration?: number
): React.CSSProperties {
  return buildMotionStyles({
    progress,
    transforms: {
      x: transition.x,
      y: transition.y,
      z: transition.z,
      scale: transition.scale,
      scaleX: transition.scaleX,
      scaleY: transition.scaleY,
      rotate: transition.rotate,
      rotateX: transition.rotateX,
      rotateY: transition.rotateY,
      rotateZ: transition.rotateZ,
      skew: transition.skew,
      skewX: transition.skewX,
      skewY: transition.skewY,
      transform: transition.transform,
    },
    styles: {
      opacity: transition.opacity,
      color: transition.color,
      backgroundColor: transition.backgroundColor,
      blur: transition.blur,
    },
    easing: getEasingFunction(transition.easing),
    duration,
  });
}

function useTransitionStyle(
  transition: TransitionConfig | undefined,
  shouldApply: boolean
): React.CSSProperties {
  const duration = transition?.frames 
    ? transition.frames[1] - transition.frames[0] 
    : (transition?.duration ?? 30); // Default based on fallback logic logic

  const progress = useMotionTiming({
    frames: transition?.frames,
    duration: transition?.duration,
    delay: transition?.delay ?? 0,
    easing: transition?.easing,
  });

  if (!transition || !shouldApply) {
    return {};
  }

  return getTransitionStyles(transition, progress, duration);
}

interface StaggeredChildProps {
  child: React.ReactNode;
  actualIndex: number;
  staggerIndex: number;
  transition: TransitionConfig;
}

const StaggeredChild: React.FC<StaggeredChildProps> = ({
  child,
  actualIndex,
  staggerIndex,
  transition,
}) => {
  const duration = transition.frames 
    ? transition.frames[1] - transition.frames[0] 
    : (transition.duration ?? 30);

  const staggerProgress = useMotionTiming({
    frames: transition.frames,
    duration: transition.duration,
    delay: transition.delay ?? 0,
    stagger: transition.stagger,
    unitIndex: staggerIndex,
    easing: transition.easing,
  });

  const staggerStyle = buildMotionStyles({
    progress: staggerProgress,
    transforms: {
      x: transition.x,
      y: transition.y,
      z: transition.z,
      scale: transition.scale,
      scaleX: transition.scaleX,
      scaleY: transition.scaleY,
      rotate: transition.rotate,
      rotateX: transition.rotateX,
      rotateY: transition.rotateY,
      rotateZ: transition.rotateZ,
      skew: transition.skew,
      skewX: transition.skewX,
      skewY: transition.skewY,
      transform: transition.transform,
    },
    styles: {
      opacity: transition.opacity,
      color: transition.color,
      backgroundColor: transition.backgroundColor,
      blur: transition.blur,
    },
    easing: getEasingFunction(transition.easing),
    duration,
  });

  if (React.isValidElement(child)) {
    const existingStyle = (child.props as any).style || {};
    return React.cloneElement(child, {
      key: actualIndex,
      style: { ...existingStyle, ...staggerStyle },
    } as any);
  }

  return (
    <span key={actualIndex} style={staggerStyle}>
      {child}
    </span>
  );
};

const StepComponent: React.FC<StepProps> = ({
  id,
  duration,
  x = 0,
  y = 0,
  z = 0,
  scale = 1,
  scaleX = 1,
  scaleY = 1,
  scaleZ = 1,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  rotateOrder = "xyz",
  transition,
  exitTransition,
  className,
  style,
  children,
}) => {
  const { activeStepIndex, steps, registerStep } = useScene3D();

  useLayoutEffect(() => {
    registerStep({
      id,
      x,
      y,
      z,
      scale,
      scaleX,
      scaleY,
      scaleZ,
      rotateX,
      rotateY,
      rotateZ,
      rotateOrder,
      enterFrame: 0,
      exitFrame: 0,
    });
  }, []);

  const stepIndex = steps.findIndex((s) => s.id === id);
  const isActive = stepIndex === activeStepIndex;
  const isPast = stepIndex < activeStepIndex;

  const xVal = interpolateKeyframes(x, 1);
  const yVal = interpolateKeyframes(y, 1);
  const zVal = interpolateKeyframes(z, 1);
  const scaleVal = interpolateKeyframes(scale, 1);
  const scaleXVal = interpolateKeyframes(scaleX, 1);
  const scaleZVal = interpolateKeyframes(scaleZ, 1);
  const scaleYVal = interpolateKeyframes(scaleY, 1);
  const rotateXVal = interpolateKeyframes(rotateX, 1);
  const rotateYVal = interpolateKeyframes(rotateY, 1);
  const rotateZVal = interpolateKeyframes(rotateZ, 1);

  const degreesToRadians = Math.PI / 180;

  const stepTransform = Transform3D.fromEuler(
    rotateXVal * degreesToRadians,
    rotateYVal * degreesToRadians,
    rotateZVal * degreesToRadians,
    new Vector3(xVal, yVal, zVal),
    new Vector3(scaleVal * scaleXVal, scaleVal * scaleYVal, scaleVal * scaleZVal),
    rotateOrder.toUpperCase() as any
  );

  const centerTransform = Transform3D.identity()
    .translate(-0.5, -0.5, 0)
    .rotateZ(0.01 * degreesToRadians);

  const positionTransform = `translate(-50%, -50%) rotate(0.01deg) ${transformToCSS(stepTransform)}`;

  const stepConfig = steps[stepIndex];

  const computedEnterTransition = useMemo(() => {
    if (!transition) return undefined;
    if (transition.frames) return transition;
    if (!stepConfig) return transition;

    const startFrame = stepConfig.enterFrame;
    const duration = transition.duration ?? 30;

    return {
      ...transition,
      frames: [startFrame, startFrame + duration] as [number, number],
    };
  }, [transition, stepConfig]);

  const computedExitTransition = useMemo(() => {
    if (!exitTransition) return undefined;
    if (exitTransition.frames) return exitTransition;
    if (!stepConfig) return exitTransition;

    const startFrame = stepConfig.exitFrame;
    const duration = exitTransition.duration ?? 30;

    return {
      ...exitTransition,
      frames: [startFrame, startFrame + duration] as [number, number],
    };
  }, [exitTransition, stepConfig]);

  const enterTransitionStyle = useTransitionStyle(computedEnterTransition, !isPast);
  const exitTransitionStyle = useTransitionStyle(computedExitTransition, isPast);

  const activeTransitionStyle = isPast
    ? exitTransitionStyle
    : enterTransitionStyle;

  const childArray = React.Children.toArray(children);
  const totalChildren = childArray.length;

  const stepStyle: React.CSSProperties = {
    position: "absolute",
    transformStyle: "preserve-3d",
    transform: positionTransform,
    ...style,
    ...activeTransitionStyle,
  };

  const renderChildren = () => {
    if (!computedEnterTransition?.stagger) {
      return children;
    }

    const staggerDirection = computedEnterTransition.staggerDirection ?? "forward";

    return childArray.map((child, actualIndex) => {
      const staggerIndex = calculateStaggerIndex(actualIndex, totalChildren, staggerDirection);
      return (
        <StaggeredChild
          key={actualIndex}
          child={child}
          actualIndex={actualIndex}
          staggerIndex={staggerIndex}
          transition={computedEnterTransition}
        />
      );
    });
  };

  return (
    <div className={className} style={stepStyle} data-step-id={id} data-step-active={isActive}>
      <StepTimingContext.Provider value={{ stepConfig }}>
        {renderChildren()}
      </StepTimingContext.Provider>
    </div>
  );
};

(StepComponent as any)[STEP_SYMBOL] = true;

export const Step = StepComponent;
