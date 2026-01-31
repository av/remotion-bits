import { useCurrentFrame, useVideoConfig } from "remotion";
import { Matrix4 } from "three";
import { Easing, interpolate, type EasingName, type EasingFunction } from "../interpolate";
import { matrixToCSS } from "../interpolate3d";
import { interpolateColorKeyframes } from "../color";
import { useStepTiming } from "../StepContext";
import { Transform3D } from "../transform3d";

export type AnimatedValue<T = number> = T | T[];

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
}
export function interpolateKeyframes<T = number>(
  value: AnimatedValue<T>,
  progress: number,
  easingFn?: EasingFunction
): T {
  if (!Array.isArray(value)) return value as T;

  const keyframes = value as T[];
  if (keyframes.length === 0) return 0 as unknown as T;
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
  easingFn?: EasingFunction
): string {
  const transformParts: string[] = [];

  if (transforms.transform !== undefined) {
    const rawVal = transforms.transform;
    const isString = typeof rawVal === 'string' || (Array.isArray(rawVal) && rawVal.length > 0 && typeof rawVal[0] === 'string');

    if (!isString) {
      const matrixVal = interpolateKeyframes(transforms.transform as AnimatedValue<Matrix4>, progress, easingFn);
      transformParts.push(matrixToCSS(matrixVal));
    } else {
      if (typeof rawVal === 'string') {
        transformParts.push(rawVal);
      }
    }
  }

  if (transforms.x !== undefined) {
    const xVal = interpolateKeyframes(transforms.x, progress, easingFn);
    transformParts.push(`translateX(${xVal}px)`);
  }
  if (transforms.y !== undefined) {
    const yVal = interpolateKeyframes(transforms.y, progress, easingFn);
    transformParts.push(`translateY(${yVal}px)`);
  }
  if (transforms.z !== undefined) {
    const zVal = interpolateKeyframes(transforms.z, progress, easingFn);
    transformParts.push(`translateZ(${zVal}px)`);
  }

  if (transforms.scale !== undefined) {
    const scaleVal = interpolateKeyframes(transforms.scale, progress, easingFn);
    transformParts.push(`scale(${scaleVal})`);
  }
  if (transforms.scaleX !== undefined) {
    const scaleXVal = interpolateKeyframes(transforms.scaleX, progress, easingFn);
    transformParts.push(`scaleX(${scaleXVal})`);
  }
  if (transforms.scaleY !== undefined) {
    const scaleYVal = interpolateKeyframes(transforms.scaleY, progress, easingFn);
    transformParts.push(`scaleY(${scaleYVal})`);
  }

  if (transforms.rotate !== undefined) {
    const rotateVal = interpolateKeyframes(transforms.rotate, progress, easingFn);
    transformParts.push(`rotate(${rotateVal}deg)`);
  }
  if (transforms.rotateX !== undefined) {
    const rotateXVal = interpolateKeyframes(transforms.rotateX, progress, easingFn);
    transformParts.push(`rotateX(${rotateXVal}deg)`);
  }
  if (transforms.rotateY !== undefined) {
    const rotateYVal = interpolateKeyframes(transforms.rotateY, progress, easingFn);
    transformParts.push(`rotateY(${rotateYVal}deg)`);
  }
  if (transforms.rotateZ !== undefined) {
    const rotateZVal = interpolateKeyframes(transforms.rotateZ, progress, easingFn);
    transformParts.push(`rotateZ(${rotateZVal}deg)`);
  }

  if (transforms.skew !== undefined) {
    const skewVal = interpolateKeyframes(transforms.skew, progress, easingFn);
    transformParts.push(`skew(${skewVal}deg)`);
  }
  if (transforms.skewX !== undefined) {
    const skewXVal = interpolateKeyframes(transforms.skewX, progress, easingFn);
    transformParts.push(`skewX(${skewXVal}deg)`);
  }
  if (transforms.skewY !== undefined) {
    const skewYVal = interpolateKeyframes(transforms.skewY, progress, easingFn);
    transformParts.push(`skewY(${skewYVal}deg)`);
  }

  return transformParts.join(" ");
}
export function buildMotionStyles(config: MotionStyleConfig): React.CSSProperties {
  const { progress, transforms = {}, styles = {}, easing, baseStyle = {} } = config;
  const easingFn = getEasingFunction(easing);

  const result: React.CSSProperties = { ...baseStyle };

  const transformString = buildTransformString(transforms, progress, easingFn);
  if (transformString) {
    result.transform = transformString;
  }

  if (styles.opacity !== undefined) {
    result.opacity = interpolateKeyframes(styles.opacity, progress, easingFn);
  }

  if (styles.color) {
    result.color = interpolateColorKeyframes(styles.color, progress, easingFn);
  }

  if (styles.backgroundColor) {
    result.backgroundColor = interpolateColorKeyframes(styles.backgroundColor, progress, easingFn);
  }

  if (styles.blur !== undefined) {
    const blurVal = interpolateKeyframes(styles.blur, progress, easingFn);

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

  if (frames) {
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
