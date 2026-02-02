import { useCurrentFrame, useVideoConfig } from "remotion";
import { Matrix4 } from "three";
import { Easing, interpolate, type EasingName, type EasingFunction, type Hold } from "../interpolate";
import { matrixToCSS } from "../interpolate3d";
import { interpolateColorKeyframes } from "../color";
import { useStepTiming } from "../StepContext";
import { Transform3D } from "../transform3d";

export type AnimatedValue<T = number> = T | (T | Hold)[];

export interface TransformProps {
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
  transform?: AnimatedValue<Matrix4 | Transform3D | string>;
}

export interface VisualProps {
  opacity?: AnimatedValue;
  color?: string[];
  backgroundColor?: string[];
  blur?: AnimatedValue;
}

export interface TimingProps {
  frames?: [number, number];
  duration?: number;
  delay?: number;
  easing?: EasingFunction | EasingName;
}

export interface MotionConfig extends TransformProps, VisualProps, TimingProps { }

export interface MotionTimingConfig {
  frames?: [number, number];
  duration?: number;
  delay?: number;
  stagger?: number;
  unitIndex?: number;
  easing?: EasingFunction | EasingName;
  cycleOffset?: number;
}

export interface MotionStyleConfig {
  progress: number;
  transforms?: TransformProps;
  styles?: VisualProps;
  easing?: EasingFunction;
  baseStyle?: React.CSSProperties;
  duration?: number;
}
export function interpolateKeyframes<T = number>(
  value: AnimatedValue<T>,
  progress: number,
  easingFn?: EasingFunction,
  duration?: number
): T {
  if (!Array.isArray(value)) return value as T;

  const rawKeyframes = value as (T | Hold)[];
  if (rawKeyframes.length === 0) return 0 as unknown as T;
  
  // Check for holds
  const hasHolds = rawKeyframes.some(k => typeof k === 'object' && k && (k as any).type === 'hold');

  if (hasHolds) {
    if (typeof duration !== 'number') {
      console.warn("interpolateKeyframes: duration required for hold frames");
      return (rawKeyframes.filter(k => !(typeof k === 'object' && k && (k as any).type === 'hold')) as T[])[0];
    }

    const simpleKeyframes: T[] = [];
    const inputRange: number[] = [];
    
    // Calculate timing
    const holds = rawKeyframes.filter(k => typeof k === 'object' && k && (k as any).type === 'hold') as Hold[];
    const totalHoldFrames = holds.reduce((acc, h) => acc + h.frames, 0);
    
    // Calculate number of transitions
    // A transition occurs between two values.
    // Holds are inserted "at" a value (extending it).
    // Sequence: Value1, Hold1, Value2, Hold2, Value3...
    // Transitions: V1->V2, V2->V3.
    // Total duration available for transitions = duration - totalHoldFrames
    
    const valuesOnly = rawKeyframes.filter(k => !(typeof k === 'object' && k && (k as any).type === 'hold')) as T[];
    const transitionsCount = Math.max(0, valuesOnly.length - 1);
    
    const availableFrames = Math.max(0, duration - totalHoldFrames);
    const transitionDuration = transitionsCount > 0 ? availableFrames / transitionsCount : 0;
    
    let currentFrame = 0;
    let lastValue: T | undefined;

    // First value is at time 0
    if (rawKeyframes.length > 0) {
      const first = rawKeyframes[0];
      if (typeof first === 'object' && first && (first as any).type === 'hold') {
         // Should not start with hold? Or hold implies holding previous value (undefined?)
         // Assume valid sequence starts with value
      }
    }

    rawKeyframes.forEach((item, index) => {
      if (typeof item === 'object' && item && (item as any).type === 'hold') {
        const h = item as Hold;
        // Extend current time by hold duration
        // Add a keyframe at the end of hold with the SAME last value
        if (lastValue !== undefined) {
           currentFrame += h.frames;
           inputRange.push(currentFrame / duration);
           simpleKeyframes.push(lastValue);
        }
      } else {
        const val = item as T;
        if (lastValue !== undefined) {
           // This is a new value, so we transitioned from lastValue
           // Add transition duration
           currentFrame += transitionDuration;
        }
        
        // Add point
        // If it's the very first item, currentFrame is 0.
        inputRange.push(currentFrame / duration);
        simpleKeyframes.push(val);
        
        lastValue = val;
      }
    });
    
    // Ensure we cover 0 to 1
    // If constructed range doesn't start at 0 (should be handled by logic)
    // If doesn't end at 1?
    // Due to precision or logic, ensure last point is at 1 or we might extrapolate
    
    return interpolate(progress, inputRange, simpleKeyframes as any[], { easing: easingFn }) as unknown as T;
  }

  const keyframes = value as T[];
  if (keyframes.length === 1) return keyframes[0];

  const inputRange = keyframes.map((_, i) => i / (keyframes.length - 1));

  return interpolate(progress, inputRange, keyframes as any[], { easing: easingFn }) as unknown as T;
}
export function getEasingFunction(easing?: EasingFunction | EasingName): EasingFunction | undefined {
  if (!easing) return undefined;
  if (typeof easing === "function") return easing;
  return Easing[easing];
}
export function buildTransformString(
  transforms: TransformProps,
  progress: number,
  easingFn?: EasingFunction,
  duration?: number
): string {
  const transformParts: string[] = [];

  if (transforms.transform !== undefined) {
    const rawVal = transforms.transform;
    const isString = typeof rawVal === 'string' || (Array.isArray(rawVal) && rawVal.length > 0 && typeof rawVal[0] === 'string');

    if (!isString) {
      const matrixVal = interpolateKeyframes(transforms.transform as AnimatedValue<Matrix4>, progress, easingFn, duration);
      transformParts.push(matrixToCSS(matrixVal));
    } else {
      if (typeof rawVal === 'string') {
        transformParts.push(rawVal);
      }
    }
  }

  if (transforms.x !== undefined) {
    const xVal = interpolateKeyframes(transforms.x, progress, easingFn, duration);
    transformParts.push(`translateX(${xVal}px)`);
  }
  if (transforms.y !== undefined) {
    const yVal = interpolateKeyframes(transforms.y, progress, easingFn, duration);
    transformParts.push(`translateY(${yVal}px)`);
  }
  if (transforms.z !== undefined) {
    const zVal = interpolateKeyframes(transforms.z, progress, easingFn, duration);
    transformParts.push(`translateZ(${zVal}px)`);
  }

  if (transforms.scale !== undefined) {
    const scaleVal = interpolateKeyframes(transforms.scale, progress, easingFn, duration);
    transformParts.push(`scale(${scaleVal})`);
  }
  if (transforms.scaleX !== undefined) {
    const scaleXVal = interpolateKeyframes(transforms.scaleX, progress, easingFn, duration);
    transformParts.push(`scaleX(${scaleXVal})`);
  }
  if (transforms.scaleY !== undefined) {
    const scaleYVal = interpolateKeyframes(transforms.scaleY, progress, easingFn, duration);
    transformParts.push(`scaleY(${scaleYVal})`);
  }

  if (transforms.rotate !== undefined) {
    const rotateVal = interpolateKeyframes(transforms.rotate, progress, easingFn, duration);
    transformParts.push(`rotate(${rotateVal}deg)`);
  }
  if (transforms.rotateX !== undefined) {
    const rotateXVal = interpolateKeyframes(transforms.rotateX, progress, easingFn, duration);
    transformParts.push(`rotateX(${rotateXVal}deg)`);
  }
  if (transforms.rotateY !== undefined) {
    const rotateYVal = interpolateKeyframes(transforms.rotateY, progress, easingFn, duration);
    transformParts.push(`rotateY(${rotateYVal}deg)`);
  }
  if (transforms.rotateZ !== undefined) {
    const rotateZVal = interpolateKeyframes(transforms.rotateZ, progress, easingFn, duration);
    transformParts.push(`rotateZ(${rotateZVal}deg)`);
  }

  if (transforms.skew !== undefined) {
    const skewVal = interpolateKeyframes(transforms.skew, progress, easingFn, duration);
    transformParts.push(`skew(${skewVal}deg)`);
  }
  if (transforms.skewX !== undefined) {
    const skewXVal = interpolateKeyframes(transforms.skewX, progress, easingFn, duration);
    transformParts.push(`skewX(${skewXVal}deg)`);
  }
  if (transforms.skewY !== undefined) {
    const skewYVal = interpolateKeyframes(transforms.skewY, progress, easingFn, duration);
    transformParts.push(`skewY(${skewYVal}deg)`);
  }

  return transformParts.join(" ");
}
export function buildMotionStyles(config: MotionStyleConfig): React.CSSProperties {
  const { progress, transforms = {}, styles = {}, easing, baseStyle = {}, duration } = config;
  const easingFn = getEasingFunction(easing);

  const result: React.CSSProperties = { ...baseStyle };

  const transformString = buildTransformString(transforms, progress, easingFn, duration);
  if (transformString) {
    result.transform = transformString;
  }

  if (styles.opacity !== undefined) {
    result.opacity = interpolateKeyframes(styles.opacity, progress, easingFn, duration);
  }

  if (styles.color) {
    // color interpolation support for holds not implemented yet
    // filtering holds for now to prevent crash
    const safeColors = Array.isArray(styles.color) 
      ? styles.color.filter(c => typeof c === 'string') 
      : styles.color;
    result.color = interpolateColorKeyframes(safeColors, progress, easingFn);
  }

  if (styles.backgroundColor) {
     const safeColors = Array.isArray(styles.backgroundColor) 
      ? styles.backgroundColor.filter(c => typeof c === 'string') 
      : styles.backgroundColor;
    result.backgroundColor = interpolateColorKeyframes(safeColors, progress, easingFn);
  }

  if (styles.blur !== undefined) {
    const blurVal = interpolateKeyframes(styles.blur, progress, easingFn, duration);

    if (Number.isFinite(blurVal) && blurVal > 0) {
      result.filter = `blur(${blurVal}px)`;
    }
  }

  return result;
}

export function useMotionTiming(config: MotionTimingConfig): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stepTiming = useStepTiming();

  const {
    frames,
    duration,
    delay = 0,
    stagger = 0,
    unitIndex = 0,
    cycleOffset,
  } = config;

  let startFrame: number;
  let endFrame: number;

  if (cycleOffset !== undefined) {
    startFrame = 0;
    endFrame = duration ?? 30;
  } else if (frames) {
    startFrame = frames[0];
    endFrame = frames[1];
  } else if (stepTiming?.stepConfig) {
    const computedDelay = delay + (unitIndex * stagger);
    startFrame = stepTiming.stepConfig.enterFrame + computedDelay;
    const computedDuration = duration ?? 30;
    endFrame = startFrame + computedDuration;
  } else {
    startFrame = 0;
    endFrame = duration ?? fps;
  }

  const totalDuration = endFrame - startFrame;
  const baseFrame = cycleOffset !== undefined ? cycleOffset : Math.max(0, frame - delay);
  const relativeFrame = baseFrame - (unitIndex * stagger);
  const progress = Math.min(Math.max((relativeFrame - startFrame) / totalDuration, 0), 1);

  return progress;
}

export { useStepTiming, StepTimingContext } from "../StepContext";
