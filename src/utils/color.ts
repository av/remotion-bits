import { interpolate as culoriInterpolate, formatRgb } from "culori";
import type { EasingFunction } from "./interpolate";

export function interpolateColorKeyframes(
  colors: string[],
  progress: number,
  easingFn?: EasingFunction
): string {
  if (colors.length === 0) return "transparent";
  if (colors.length === 1) return colors[0];

  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const segments = colors.length - 1;
  const segmentProgress = clampedProgress * segments;
  const segmentIndex = Math.min(Math.floor(segmentProgress), segments - 1);
  const localProgress = segmentProgress - segmentIndex;

  const easedProgress = easingFn ? easingFn(localProgress) : localProgress;

  const fromColor = colors[segmentIndex];
  const toColor = colors[segmentIndex + 1];

  try {
    const interpolator = culoriInterpolate([fromColor, toColor], "oklch");
    const result = interpolator(easedProgress);

    return formatRgb(result) || "transparent";
  } catch {
    return "transparent";
  }
}
