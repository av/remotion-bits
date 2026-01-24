/**
 * Easing functions for non-linear interpolation
 */
export const Easing = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInSine: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t: number) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
} as const;

export type EasingName = keyof typeof Easing;
export type EasingFunction = (t: number) => number;

/**
 * Custom interpolate function that supports non-monotonic input ranges.
 * Compatible with Remotion's interpolate signature but handles cases like:
 * - [0, 30, 30, 600] -> [5, 5, 10, 10] (duplicate values for "hold" frames)
 * - [0, 1, 0] -> [-100, -200, -300] (non-monotonic ranges)
 */
export function interpolate(
  input: number,
  inputRange: number[],
  outputRange: number[],
  options?: {
    extrapolateLeft?: 'clamp' | 'extend' | 'identity';
    extrapolateRight?: 'clamp' | 'extend' | 'identity';
    easing?: EasingFunction | EasingName;
  }
): number {
  const {
    extrapolateLeft = 'extend',
    extrapolateRight = 'extend',
    easing
  } = options || {};

  if (inputRange.length !== outputRange.length) {
    throw new Error('inputRange and outputRange must have the same length');
  }

  if (inputRange.length < 2) {
    throw new Error('inputRange must have at least 2 elements');
  }

  // Find the segment where input falls
  let segmentIndex = -1;

  for (let i = 0; i < inputRange.length - 1; i++) {
    const start = inputRange[i];
    const end = inputRange[i + 1];

    // Handle segment (including equal values for "hold" periods)
    if (start === end) {
      // Zero-length segment - if input matches, use this segment
      if (input === start) {
        segmentIndex = i;
        break;
      }
    } else if (start < end) {
      // Ascending segment
      if (input >= start && input <= end) {
        segmentIndex = i;
        break;
      }
    } else {
      // Descending segment (non-monotonic)
      if (input <= start && input >= end) {
        segmentIndex = i;
        break;
      }
    }
  }

  // Handle extrapolation
  if (segmentIndex === -1) {
    if (input < inputRange[0]) {
      // Extrapolate left
      if (extrapolateLeft === 'clamp') {
        return outputRange[0];
      } else if (extrapolateLeft === 'identity') {
        return input;
      } else {
        // extend
        segmentIndex = 0;
      }
    } else {
      // Extrapolate right (input > inputRange[last])
      if (extrapolateRight === 'clamp') {
        return outputRange[outputRange.length - 1];
      } else if (extrapolateRight === 'identity') {
        return input;
      } else {
        // extend
        segmentIndex = inputRange.length - 2;
      }
    }
  }

  // Interpolate within the segment
  const inputStart = inputRange[segmentIndex];
  const inputEnd = inputRange[segmentIndex + 1];
  const outputStart = outputRange[segmentIndex];
  const outputEnd = outputRange[segmentIndex + 1];

  // Handle zero-length segments (hold frames)
  if (inputStart === inputEnd) {
    return outputStart;
  }

  // Calculate progress (0 to 1)
  let progress = (input - inputStart) / (inputEnd - inputStart);

  // Apply easing if provided
  if (easing) {
    const easingFn = typeof easing === 'string' ? Easing[easing] : easing;
    progress = easingFn(progress);
  }

  // Linear interpolation
  return outputStart + (outputEnd - outputStart) * progress;
}
