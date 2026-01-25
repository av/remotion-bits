import { interpolate as culoriInterpolate, formatRgb } from "culori";
import type { EasingFunction } from "./interpolate";

/**
 * Interpolates between multiple color keyframes using Oklch color space
 * for perceptually uniform color transitions.
 *
 * Oklch (Oklab with cylindrical coordinates) provides:
 * - Perceptually uniform transitions (no muddy intermediate colors)
 * - Better hue interpolation than RGB/HSL
 * - Modern standard used by CSS, Figma, and Tailwind
 *
 * @param colors - Array of CSS color strings (hex, rgb, rgba, hsl, etc.)
 * @param progress - Animation progress from 0 to 1
 * @param easingFn - Optional easing function to apply to interpolation
 * @returns RGB color string in the format "rgb(r, g, b)" or "rgba(r, g, b, a)"
 *
 * @example
 * // Two-color transition
 * interpolateColorKeyframes(['#ff0000', '#0000ff'], 0.5) // Mid-point between red and blue
 *
 * @example
 * // Multi-keyframe transition with easing
 * interpolateColorKeyframes(['red', 'yellow', 'blue'], 0.5, Easing.easeInOut)
 */
export function interpolateColorKeyframes(
  colors: string[],
  progress: number,
  easingFn?: EasingFunction
): string {
  // Handle edge cases
  if (colors.length === 0) return "transparent";
  if (colors.length === 1) return colors[0];

  // Clamp progress to [0, 1]
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  // Calculate which segment we're in
  const segments = colors.length - 1;
  const segmentProgress = clampedProgress * segments;
  const segmentIndex = Math.min(Math.floor(segmentProgress), segments - 1);
  const localProgress = segmentProgress - segmentIndex;

  // Apply easing to local progress if provided
  const easedProgress = easingFn ? easingFn(localProgress) : localProgress;

  // Get the two colors to interpolate between
  const fromColor = colors[segmentIndex];
  const toColor = colors[segmentIndex + 1];

  try {
    // Use culori's Oklch interpolation for perceptually uniform transitions
    const interpolator = culoriInterpolate([fromColor, toColor], "oklch");
    const result = interpolator(easedProgress);

    // Format as RGB string for CSS compatibility
    return formatRgb(result) || "transparent";
  } catch {
    // If interpolation fails (e.g., invalid colors), return transparent
    return "transparent";
  }
}
