import React from "react";
import { useCurrentFrame } from "remotion";
import { useScene3D } from "./context";
import {
  buildMotionStyles,
  getEasingFunction,
  type TransformProps,
  type VisualProps,
} from "../../utils/motion";
import type {
  StepResponsiveProps,
  StepResponsiveMap,
  StepResponsiveTransform,
  StepResponsiveTransition,
} from "./types";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Parse step reference like "step-0", "step-1" to extract numeric index
 */
function parseStepRef(ref: string): number | null {
  const match = ref.match(/step-(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Normalize different step map formats to a Map structure
 */
function normalizeStepsMap(
  steps: StepResponsiveMap
): Map<string | number, StepResponsiveTransform> {
  const map = new Map<string | number, StepResponsiveTransform>();

  if (Array.isArray(steps)) {
    steps.forEach((props, index) => {
      map.set(index, props);
      map.set(`step-${index}`, props);
    });
  } else {
    Object.entries(steps).forEach(([key, props]) => {
      // Handle ranges like "step-1..step-3"
      if (key.includes("..")) {
        const [start, end] = key.split("..").map((k) => k.trim());
        const startIdx = parseStepRef(start) ?? 0;
        const endIdx = parseStepRef(end) ?? 0;

        for (let i = startIdx; i <= endIdx; i++) {
          map.set(i, props);
          map.set(`step-${i}`, props);
        }
      } else {
        map.set(key, props);
        const numericKey = parseStepRef(key);
        if (numericKey !== null) {
          map.set(numericKey, props);
        }
      }
    });
  }

  return map;
}

/**
 * Resolve step props by accumulating all steps up to targetIndex.
 * Handles inheritance of properties and flattens arrays from previous steps.
 */
function resolveCumulativeStepProps(
  stepsMap: Map<string | number, StepResponsiveTransform>,
  targetIndex: number,
  sceneSteps: any[],
  defaultProps: StepResponsiveTransform
): StepResponsiveTransform {
  const accumulatedProps: any = { ...defaultProps };

  // Iterate from 0 to targetIndex
  for (let i = 0; i <= targetIndex; i++) {
    // If we've moved past a step, finalize its values (flatten arrays to end state)
    // This ensures inherited animations don't replay, but hold their final value
    if (i > 0) {
      for (const key in accumulatedProps) {
        const val = accumulatedProps[key];
        if (Array.isArray(val) && val.length > 0) {
          accumulatedProps[key] = val[val.length - 1];
        }
      }
    }

    const step = sceneSteps?.[i];
    const stepId = step?.id;

    let stepProps: StepResponsiveTransform | undefined;

    // 1. Try ID
    if (stepId && stepsMap.has(stepId)) {
      stepProps = stepsMap.get(stepId);
    }
    // 2. Try Index
    else if (stepsMap.has(i)) {
      stepProps = stepsMap.get(i);
    }

    if (stepProps) {
      Object.assign(accumulatedProps, stepProps);
    }
  }

  return accumulatedProps;
}

/**
 * Merges values from previous step and current step into a single animation sequence.
 * optimization: If transition start matches previous end, squash duplicates to allow step animation to play fully.
 */
function mergeStepValues(fromVal: any, toVal: any) {
  const effectiveFrom = Array.isArray(fromVal) ? fromVal[fromVal.length - 1] : fromVal;
  let targetValues = Array.isArray(toVal) ? toVal : [toVal];
  
  if (effectiveFrom === targetValues[0]) {
    targetValues = targetValues.slice(1);
    if (targetValues.length === 0) {
        return [effectiveFrom];
    }
  }
  
  return [effectiveFrom, ...targetValues];
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * StepResponsive component that animates element properties based on active step
 *
 * Example:
 * ```tsx
 * <StepResponsive
 *   steps={{
 *     "step-0": { x: 0, opacity: 1 },
 *     "step-1": { x: 100, opacity: 0.5 }
 *   }}
 *   transition={{ duration: 20, easing: "easeInOutCubic" }}
 * >
 *   <Element3D>{children}</Element3D>
 * </StepResponsive>
 * ```
 */
export const StepResponsive: React.FC<StepResponsiveProps> = ({
  steps,
  transition,
  children,
  defaultProps = {},
  animate = true,
  centered = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { activeStepIndex, transitionProgress, steps: sceneSteps, transitionDuration } = useScene3D();

  // Normalize steps to a Map structure
  const stepsMap = React.useMemo(
    () => normalizeStepsMap(steps),
    [steps]
  );

  // Get target (current active) props
  const targetStepProps = React.useMemo(
    () =>
      resolveCumulativeStepProps(
        stepsMap,
        activeStepIndex,
        sceneSteps,
        defaultProps
      ),
    [stepsMap, activeStepIndex, sceneSteps, defaultProps]
  );

  // Get previous step props for interpolation
  const prevStepIndex = activeStepIndex - 1;

  const prevStepProps = React.useMemo(
    () =>
      resolveCumulativeStepProps(
        stepsMap,
        prevStepIndex,
        sceneSteps,
        defaultProps
      ),
    [stepsMap, prevStepIndex, sceneSteps, defaultProps]
  );

  // Get easing function if specified
  const easingFn = React.useMemo(
    () => getEasingFunction(transition?.easing),
    [transition?.easing]
  );

  // Use transitionProgress if animating, otherwise use 1 (end state)
  const progress = React.useMemo(() => {
    if (!animate) return 1;

    if (transition?.duration !== undefined) {
      const activeStep = sceneSteps[activeStepIndex];
      if (activeStep) {
        // Calculate local progress based on step entry and custom duration
        const startFrame = activeStep.enterFrame + (transition.delay ?? 0);
        const duration = transition.duration;

        if (frame < startFrame) return 0;
        if (frame >= startFrame + duration) return 1;
        return (frame - startFrame) / duration;
      }
    }

    // Fallback to scene transition progress (already eased by scene)
    return transitionProgress;
  }, [animate, transition, sceneSteps, activeStepIndex, frame, transitionProgress]);

  const effectiveDuration = transition?.duration ?? transitionDuration;

  // Build animated styles using the motion system
  const motionStyle = React.useMemo(() => {
    const transforms: TransformProps = {};
    const styles: VisualProps = {};

    // Separate transform and visual props
    const transformKeys: (keyof StepResponsiveTransform)[] = [
      "x",
      "y",
      "z",
      "scale",
      "scaleX",
      "scaleY",
      "rotateX",
      "rotateY",
      "rotateZ",
      "transform",
    ];

    transformKeys.forEach((key) => {
      // Create keyframe array [from, to] for interpolation
      const fromVal = (prevStepProps as any)[key];
      const toVal = (targetStepProps as any)[key];

      if (fromVal !== undefined && toVal !== undefined) {
        (transforms as any)[key] = mergeStepValues(fromVal, toVal);
      } else if (toVal !== undefined) {
        (transforms as any)[key] = toVal;
      } else if (fromVal !== undefined) {
        (transforms as any)[key] = fromVal;
      }
    });

    // Handle opacity
    const opacityFrom = (prevStepProps as any).opacity;
    const opacityTo = (targetStepProps as any).opacity;
    if (opacityFrom !== undefined && opacityTo !== undefined) {
      styles.opacity = mergeStepValues(opacityFrom, opacityTo);
    } else if (opacityTo !== undefined) {
      styles.opacity = opacityTo;
    } else if (opacityFrom !== undefined) {
      styles.opacity = opacityFrom;
    }

    const calculatedStyle = buildMotionStyles({
      progress,
      transforms: Object.keys(transforms).length > 0 ? transforms : undefined,
      styles: Object.keys(styles).length > 0 ? styles : undefined,
      easing: easingFn,
      duration: effectiveDuration,
    });

    if (centered) {
      const centerTransform = "translate(-50%, -50%) rotate(0.01deg)";
      calculatedStyle.transform = calculatedStyle.transform
        ? `${centerTransform} ${calculatedStyle.transform}`
        : centerTransform;
    }

    return calculatedStyle;
  }, [targetStepProps, prevStepProps, progress, easingFn, centered]);

  if (!React.isValidElement(children)) {
    console.warn("StepResponsive: children must be a valid React element");
    return children;
  }

  // Merge motion styles with existing child and prop styles
  const childStyle = (children.props as any).style || {};
  const mergedStyle = { ...childStyle, ...style, ...motionStyle };

  return React.cloneElement(children, {
    style: mergedStyle,
  } as any);
};

StepResponsive.displayName = "StepResponsive";

// ============================================================================
// HOOK VERSION (for advanced use cases)
// ============================================================================

/**
 * Hook version of StepResponsive for more control
 *
 * Example:
 * ```tsx
 * function MyElement() {
 *   const style = useStepResponsive({
 *     "step-0": { x: 0, opacity: 1 },
 *     "step-1": { x: 100, opacity: 0.5 }
 *   });
 *
 *   return <div style={style}>{children}</div>;
 * }
 * ```
 */
export function useStepResponsive(
  steps: StepResponsiveMap,
  config?: StepResponsiveTransition
): React.CSSProperties {
  const frame = useCurrentFrame();
  const activeStepIndex = useScene3D().activeStepIndex;
  const transitionProgress = useScene3D().transitionProgress;
  const transitionDuration = useScene3D().transitionDuration;
  const sceneSteps = useScene3D().steps;

  // Normalize steps to a Map structure
  const stepsMap = React.useMemo(
    () => normalizeStepsMap(steps),
    [steps]
  );
  
  const centered = (config as any)?.centered;

  const targetStepProps = React.useMemo(
    () =>
      resolveCumulativeStepProps(
        stepsMap,
        activeStepIndex,
        sceneSteps,
        {}
      ),
    [stepsMap, activeStepIndex, sceneSteps]
  );

  const prevStepIndex = activeStepIndex - 1;

  const prevStepProps = React.useMemo(
    () =>
      resolveCumulativeStepProps(
        stepsMap,
        prevStepIndex,
        sceneSteps,
        {}
      ),
    [stepsMap, prevStepIndex, sceneSteps]
  );

  const easingFn = React.useMemo(
    () => getEasingFunction(config?.easing),
    [config?.easing]
  );

  const progress = React.useMemo(() => {
    if (config?.duration !== undefined) {
      const activeStep = sceneSteps[activeStepIndex];
      if (activeStep) {
        const startFrame = activeStep.enterFrame + (config.delay ?? 0);
        const duration = config.duration;

        if (frame < startFrame) return 0;
        if (frame >= startFrame + duration) return 1;
        return (frame - startFrame) / duration;
      }
    }

    return transitionProgress;
  }, [config, sceneSteps, activeStepIndex, frame, transitionProgress]);

  const effectiveDuration = config?.duration ?? transitionDuration;

  return React.useMemo(() => {
    const transforms: TransformProps = {};
    const styles: VisualProps = {};

    const transformKeys: (keyof StepResponsiveTransform)[] = [
      "x",
      "y",
      "z",
      "scale",
      "scaleX",
      "scaleY",
      "rotateX",
      "rotateY",
      "rotateZ",
      "transform",
    ];

    transformKeys.forEach((key) => {
      const fromVal = (prevStepProps as any)[key];
      const toVal = (targetStepProps as any)[key];

      if (fromVal !== undefined && toVal !== undefined) {
        (transforms as any)[key] = mergeStepValues(fromVal, toVal);
      } else if (toVal !== undefined) {
        (transforms as any)[key] = toVal;
      } else if (fromVal !== undefined) {
        (transforms as any)[key] = fromVal;
      }
    });

    const opacityFrom = (prevStepProps as any).opacity;
    const opacityTo = (targetStepProps as any).opacity;
    if (opacityFrom !== undefined && opacityTo !== undefined) {
      styles.opacity = mergeStepValues(opacityFrom, opacityTo);
    } else if (opacityTo !== undefined) {
      styles.opacity = opacityTo;
    } else if (opacityFrom !== undefined) {
      styles.opacity = opacityFrom;
    }

    const calculatedStyle = buildMotionStyles({
      progress,
      transforms: Object.keys(transforms).length > 0 ? transforms : undefined,
      styles: Object.keys(styles).length > 0 ? styles : undefined,
      easing: easingFn,
      duration: effectiveDuration,
    });

    if (centered) {
      const centerTransform = "translate(-50%, -50%) rotate(0.01deg)";
      calculatedStyle.transform = calculatedStyle.transform
        ? `${centerTransform} ${calculatedStyle.transform}`
        : centerTransform;
    }

    return calculatedStyle;
  }, [targetStepProps, prevStepProps, progress, easingFn, centered]);
}
