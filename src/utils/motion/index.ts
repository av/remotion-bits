import { useCurrentFrame, useVideoConfig } from "remotion";
import { Easing, type EasingName, type EasingFunction } from "../interpolate";
import { interpolateColorKeyframes } from "../color";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type AnimatedValue = number | [number, number] | [number, number, number] | number[];

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

export interface MotionConfig extends TransformProps, VisualProps, TimingProps {}

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

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Interpolates between keyframe values based on progress (0-1)
 * Supports single values, tuples, or arrays of keyframes
 */
export function interpolateKeyframes(
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

/**
 * Resolves an easing name or function to an EasingFunction
 */
export function getEasingFunction(easing?: EasingFunction | EasingName): EasingFunction | undefined {
  if (!easing) return undefined;
  if (typeof easing === "function") return easing;
  return Easing[easing];
}

/**
 * Builds a CSS transform string from transform properties and progress
 */
export function buildTransformString(
  transforms: TransformProps,
  progress: number,
  easingFn?: EasingFunction
): string {
  const transformParts: string[] = [];

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

/**
 * Builds a complete animated style object from motion configuration
 */
export function buildMotionStyles(config: MotionStyleConfig): React.CSSProperties {
  const { progress, transforms = {}, styles = {}, easing, baseStyle = {} } = config;
  const easingFn = getEasingFunction(easing);

  const result: React.CSSProperties = { ...baseStyle };

  // Apply transform
  const transformString = buildTransformString(transforms, progress, easingFn);
  if (transformString) {
    result.transform = transformString;
  }

  // Apply opacity
  if (styles.opacity !== undefined) {
    result.opacity = interpolateKeyframes(styles.opacity, progress, easingFn);
  }

  // Apply color
  if (styles.color) {
    result.color = interpolateColorKeyframes(styles.color, progress, easingFn);
  }

  // Apply backgroundColor
  if (styles.backgroundColor) {
    result.backgroundColor = interpolateColorKeyframes(styles.backgroundColor, progress, easingFn);
  }

  // Apply blur
  if (styles.blur !== undefined) {
    const blurVal = interpolateKeyframes(styles.blur, progress, easingFn);
    result.filter = `blur(${blurVal}px)`;
  }

  return result;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook that calculates animation progress (0-1) based on timing configuration
 */
export function useMotionTiming(config: MotionTimingConfig): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const {
    frames,
    duration,
    delay = 0,
    stagger = 0,
    unitIndex = 0,
    cycleOffset,
  } = config;

  // Calculate timing boundaries
  const startFrame = frames ? frames[0] : 0;
  const endFrame = frames ? frames[1] : (duration ?? fps);
  const totalDuration = endFrame - startFrame;

  // Calculate base frame (with cycle support)
  const baseFrame = cycleOffset !== undefined ? cycleOffset : Math.max(0, frame - delay);

  // Apply stagger offset
  const relativeFrame = baseFrame - (unitIndex * stagger);

  // Convert to progress and clamp to [0, 1]
  const progress = Math.min(Math.max((relativeFrame - startFrame) / totalDuration, 0), 1);

  return progress;
}
