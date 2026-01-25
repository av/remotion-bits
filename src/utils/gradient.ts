import { interpolate as culoriInterpolate, formatRgb } from "culori";
import type { EasingFunction } from "./interpolate";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type GradientType = "linear" | "radial" | "conic";

export interface ColorStop {
  color: string;
  position?: number; // 0-100 percentage
}

export interface ParsedGradient {
  type: GradientType;
  angle?: number; // For linear gradients (degrees)
  shape?: string; // For radial gradients (circle, ellipse)
  position?: string; // For radial/conic (e.g., "center", "50% 50%")
  stops: ColorStop[];
}

// ============================================================================
// CSS GRADIENT PARSER (NO EXTERNAL DEPENDENCIES)
// ============================================================================

/**
 * Parse CSS gradient string into structured format
 * Supports: linear-gradient, radial-gradient, conic-gradient
 *
 * @example
 * parseGradient("linear-gradient(90deg, red, blue 50%, green)")
 * parseGradient("radial-gradient(circle at center, red, blue)")
 * parseGradient("conic-gradient(from 0deg, red, yellow, green)")
 */
export function parseGradient(gradientString: string): ParsedGradient | null {
  const trimmed = gradientString.trim();

  // Detect gradient type
  let type: GradientType;
  let contentStart: number;

  if (trimmed.startsWith("linear-gradient(")) {
    type = "linear";
    contentStart = "linear-gradient(".length;
  } else if (trimmed.startsWith("radial-gradient(")) {
    type = "radial";
    contentStart = "radial-gradient(".length;
  } else if (trimmed.startsWith("conic-gradient(")) {
    type = "conic";
    contentStart = "conic-gradient(".length;
  } else {
    return null; // Not a valid gradient
  }

  // Extract content between parentheses
  const lastParen = trimmed.lastIndexOf(")");
  if (lastParen === -1) return null;

  const content = trimmed.substring(contentStart, lastParen).trim();

  // Parse based on type
  if (type === "linear") {
    return parseLinearGradient(content);
  } else if (type === "radial") {
    return parseRadialGradient(content);
  } else if (type === "conic") {
    return parseConicGradient(content);
  }

  return null;
}

/**
 * Parse linear-gradient content
 * Format: [angle,] color-stop [, color-stop]*
 */
function parseLinearGradient(content: string): ParsedGradient {
  const gradient: ParsedGradient = {
    type: "linear",
    angle: 180, // Default: to bottom
    stops: [],
  };

  const parts = splitGradientParts(content);
  let startIndex = 0;

  // Check if first part is an angle
  const firstPart = parts[0]?.trim();
  if (firstPart) {
    const angleMatch = firstPart.match(/^(-?\d+\.?\d*)deg$/);
    if (angleMatch) {
      gradient.angle = parseFloat(angleMatch[1]);
      startIndex = 1;
    } else if (firstPart.startsWith("to ")) {
      // Handle directional keywords: to top, to right, etc.
      gradient.angle = parseDirection(firstPart);
      startIndex = 1;
    }
  }

  // Parse color stops
  for (let i = startIndex; i < parts.length; i++) {
    const stop = parseColorStop(parts[i]);
    if (stop) gradient.stops.push(stop);
  }

  return gradient;
}

/**
 * Parse radial-gradient content
 * Format: [shape size at position,] color-stop [, color-stop]*
 */
function parseRadialGradient(content: string): ParsedGradient {
  const gradient: ParsedGradient = {
    type: "radial",
    shape: "ellipse",
    position: "center",
    stops: [],
  };

  const parts = splitGradientParts(content);
  let startIndex = 0;

  // Check if first part contains shape/position info
  const firstPart = parts[0]?.trim();
  if (firstPart && !isColorStop(firstPart)) {
    // Parse shape
    const shapeMatch = firstPart.match(/\b(circle|ellipse)\b/);
    if (shapeMatch) {
      gradient.shape = shapeMatch[1];
    }

    // Parse position (after "at")
    const atIndex = firstPart.indexOf(" at ");
    if (atIndex !== -1) {
      gradient.position = firstPart.substring(atIndex + 4).trim();
    }

    startIndex = 1;
  }

  // Parse color stops
  for (let i = startIndex; i < parts.length; i++) {
    const stop = parseColorStop(parts[i]);
    if (stop) gradient.stops.push(stop);
  }

  return gradient;
}

/**
 * Parse conic-gradient content
 * Format: [from angle] [at position,] color-stop [, color-stop]*
 */
function parseConicGradient(content: string): ParsedGradient {
  const gradient: ParsedGradient = {
    type: "conic",
    angle: 0, // Default: from 0deg
    position: "center",
    stops: [],
  };

  const parts = splitGradientParts(content);
  let startIndex = 0;

  // Check if first part contains from/at info
  const firstPart = parts[0]?.trim();
  if (firstPart && !isColorStop(firstPart)) {
    // Parse "from" angle
    const fromMatch = firstPart.match(/from\s+(-?\d+\.?\d*)deg/);
    if (fromMatch) {
      gradient.angle = parseFloat(fromMatch[1]);
    }

    // Parse "at" position
    const atIndex = firstPart.indexOf(" at ");
    if (atIndex !== -1) {
      gradient.position = firstPart.substring(atIndex + 4).trim();
    }

    startIndex = 1;
  }

  // Parse color stops
  for (let i = startIndex; i < parts.length; i++) {
    const stop = parseColorStop(parts[i]);
    if (stop) gradient.stops.push(stop);
  }

  return gradient;
}

/**
 * Split gradient content by commas, respecting nested parentheses
 * Handles: rgb(255, 0, 0), rgba(255, 0, 0, 0.5), hsl(), etc.
 */
function splitGradientParts(content: string): string[] {
  const parts: string[] = [];
  let current = "";
  let parenDepth = 0;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (char === "(") {
      parenDepth++;
      current += char;
    } else if (char === ")") {
      parenDepth--;
      current += char;
    } else if (char === "," && parenDepth === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}

/**
 * Parse a color stop: "color [position]"
 * Examples: "red", "blue 50%", "rgba(255,0,0,0.5) 25%"
 */
function parseColorStop(stopString: string): ColorStop | null {
  const trimmed = stopString.trim();
  if (!trimmed) return null;

  // Match: color followed by optional position
  // Position can be: 50%, 100px, etc.
  const match = trimmed.match(/^(.+?)\s+([\d.]+%|[\d.]+px)$/);

  if (match) {
    const color = match[1].trim();
    const positionStr = match[2].trim();
    const position = parsePosition(positionStr);
    return { color, position };
  }

  // No position specified
  return { color: trimmed };
}

/**
 * Parse position string to percentage (0-100)
 */
function parsePosition(positionStr: string): number {
  if (positionStr.endsWith("%")) {
    return parseFloat(positionStr);
  }
  // For px values, we can't convert without context, so return as-is
  // (This is a limitation; real implementation might need gradient size)
  return parseFloat(positionStr);
}

/**
 * Convert CSS direction keywords to angles
 * to top = 0deg, to right = 90deg, to bottom = 180deg, to left = 270deg
 */
function parseDirection(direction: string): number {
  const normalized = direction.toLowerCase().trim();

  if (normalized === "to top") return 0;
  if (normalized === "to right") return 90;
  if (normalized === "to bottom") return 180;
  if (normalized === "to left") return 270;
  if (normalized === "to top right") return 45;
  if (normalized === "to bottom right") return 135;
  if (normalized === "to bottom left") return 225;
  if (normalized === "to top left") return 315;

  return 180; // Default
}

/**
 * Check if a string is likely a color stop (vs. gradient params)
 */
function isColorStop(str: string): boolean {
  const trimmed = str.trim().toLowerCase();

  // Gradient-specific keywords (not color stops)
  if (trimmed.includes(" at ") || trimmed.startsWith("from ") || trimmed.startsWith("to ")) {
    return false;
  }
  if (/\b(circle|ellipse)\b/.test(trimmed)) {
    return false;
  }

  // Color keywords
  const colorKeywords = [
    "red", "blue", "green", "yellow", "orange", "purple", "pink", "brown",
    "black", "white", "gray", "grey", "cyan", "magenta", "transparent",
  ];
  if (colorKeywords.some(keyword => trimmed.startsWith(keyword))) {
    return true;
  }

  // Hex colors
  if (trimmed.startsWith("#")) return true;

  // rgb/rgba/hsl/hsla functions
  if (trimmed.startsWith("rgb") || trimmed.startsWith("hsl")) return true;

  // Has percentage or px (likely a positioned color stop)
  if (trimmed.includes("%") || trimmed.includes("px")) return true;

  return false;
}

// ============================================================================
// GRADIENT INTERPOLATION (GRANIM.JS-INSPIRED MATH)
// ============================================================================

/**
 * Auto-distribute positions for color stops that don't have explicit positions
 * Matching Granim.js behavior
 */
export function normalizeColorStops(stops: ColorStop[]): ColorStop[] {
  if (stops.length === 0) return [];
  if (stops.length === 1) return [{ ...stops[0], position: 50 }];

  const normalized: ColorStop[] = [];

  // First stop defaults to 0% if no position
  normalized.push({
    ...stops[0],
    position: stops[0].position ?? 0,
  });

  // Last stop defaults to 100% if no position
  const lastStop = stops[stops.length - 1];
  const lastPosition = lastStop.position ?? 100;

  // Handle middle stops
  for (let i = 1; i < stops.length - 1; i++) {
    if (stops[i].position !== undefined) {
      normalized.push(stops[i] as Required<ColorStop>);
    } else {
      // Find the next stop with a position
      let nextWithPosition = stops.length - 1;
      for (let j = i + 1; j < stops.length; j++) {
        if (stops[j].position !== undefined) {
          nextWithPosition = j;
          break;
        }
      }

      // Interpolate position evenly
      const prevPosition = normalized[normalized.length - 1].position!;
      const nextPosition = stops[nextWithPosition].position ?? lastPosition;
      const gap = nextPosition - prevPosition;
      const stopsInGap = nextWithPosition - i + 1;
      const step = gap / stopsInGap;

      normalized.push({
        ...stops[i],
        position: prevPosition + step,
      });
    }
  }

  // Add last stop
  normalized.push({
    ...lastStop,
    position: lastPosition,
  });

  return normalized;
}

/**
 * Interpolate angle with wraparound (shortest path)
 * Granim.js uses modulo arithmetic to avoid spinning through 359 degrees
 *
 * @example
 * interpolateAngle(350, 10, 0.5) // => 0 (via 360, not 180)
 * interpolateAngle(10, 350, 0.5) // => 0 (via 360, not 180)
 */
export function interpolateAngle(from: number, to: number, progress: number): number {
  // Normalize angles to [0, 360)
  const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;
  const fromNorm = normalizeAngle(from);
  const toNorm = normalizeAngle(to);

  // Calculate direct difference
  let diff = toNorm - fromNorm;

  // Adjust for shortest path through 0/360 boundary
  if (diff > 180) {
    diff -= 360;
  } else if (diff < -180) {
    diff += 360;
  }

  // Interpolate and normalize
  return normalizeAngle(fromNorm + diff * progress);
}

/**
 * Pad or resample color stops to match target count
 * When interpolating between gradients with different stop counts
 */
export function matchColorStopCount(
  stops: ColorStop[],
  targetCount: number
): ColorStop[] {
  if (stops.length === targetCount) return stops;

  if (stops.length < targetCount) {
    // Pad by duplicating last stop
    const padded = [...stops];
    while (padded.length < targetCount) {
      padded.push({ ...stops[stops.length - 1] });
    }
    return padded;
  }

  // Resample by evenly spacing
  const resampled: ColorStop[] = [];
  for (let i = 0; i < targetCount; i++) {
    const position = (i / (targetCount - 1)) * 100;
    const color = interpolateColorAtPosition(stops, position);
    resampled.push({ color, position });
  }
  return resampled;
}

/**
 * Get color at a specific position in a gradient
 */
function interpolateColorAtPosition(stops: ColorStop[], position: number): string {
  const normalized = normalizeColorStops(stops);

  // Find surrounding stops
  let beforeIndex = 0;
  let afterIndex = normalized.length - 1;

  for (let i = 0; i < normalized.length - 1; i++) {
    if (normalized[i].position! <= position && normalized[i + 1].position! >= position) {
      beforeIndex = i;
      afterIndex = i + 1;
      break;
    }
  }

  const before = normalized[beforeIndex];
  const after = normalized[afterIndex];

  if (before.position === after.position) {
    return before.color;
  }

  const localProgress = (position - before.position!) / (after.position! - before.position!);

  // Use culori Oklch interpolation
  try {
    const interpolator = culoriInterpolate([before.color, after.color], "oklch");
    const result = interpolator(localProgress);
    return formatRgb(result) || before.color;
  } catch {
    return before.color;
  }
}

/**
 * Interpolate between two gradients
 * Core algorithm inspired by Granim.js gradient state transitions
 */
export function interpolateGradients(
  from: ParsedGradient,
  to: ParsedGradient,
  progress: number,
  easingFn?: EasingFunction
): ParsedGradient {
  const easedProgress = easingFn ? easingFn(progress) : progress;

  // Handle type transitions (linear → radial, etc.)
  const type = easedProgress < 0.5 ? from.type : to.type;

  // Interpolate angle (for linear/conic)
  let angle: number | undefined;
  if (from.angle !== undefined && to.angle !== undefined) {
    angle = interpolateAngle(from.angle, to.angle, easedProgress);
  } else if (from.angle !== undefined) {
    angle = from.angle;
  } else if (to.angle !== undefined) {
    angle = to.angle;
  }

  // Interpolate shape (for radial) - discrete switch at 0.5
  const shape = easedProgress < 0.5 ? from.shape : to.shape;

  // Interpolate position (for radial/conic) - discrete switch at 0.5
  const position = easedProgress < 0.5 ? from.position : to.position;

  // Normalize and match color stop counts
  const fromStops = normalizeColorStops(from.stops);
  const toStops = normalizeColorStops(to.stops);

  const maxStops = Math.max(fromStops.length, toStops.length);
  const fromMatched = matchColorStopCount(fromStops, maxStops);
  const toMatched = matchColorStopCount(toStops, maxStops);

  // Interpolate each color stop
  const stops: ColorStop[] = fromMatched.map((fromStop, i) => {
    const toStop = toMatched[i];

    // Interpolate position
    const position =
      fromStop.position! + (toStop.position! - fromStop.position!) * easedProgress;

    // Interpolate color using culori Oklch
    let color: string;
    try {
      const interpolator = culoriInterpolate([fromStop.color, toStop.color], "oklch");
      const result = interpolator(easedProgress);
      color = formatRgb(result) || fromStop.color;
    } catch {
      color = fromStop.color;
    }

    return { color, position };
  });

  return {
    type,
    angle,
    shape,
    position,
    stops,
  };
}

/**
 * Convert ParsedGradient back to CSS string
 */
export function gradientToCSS(gradient: ParsedGradient): string {
  const stops = gradient.stops
    .map(stop => {
      if (stop.position !== undefined) {
        return `${stop.color} ${stop.position}%`;
      }
      return stop.color;
    })
    .join(", ");

  if (gradient.type === "linear") {
    const angle = gradient.angle ?? 180;
    return `linear-gradient(${angle}deg, ${stops})`;
  } else if (gradient.type === "radial") {
    const shape = gradient.shape ?? "ellipse";
    const position = gradient.position ?? "center";
    return `radial-gradient(${shape} at ${position}, ${stops})`;
  } else if (gradient.type === "conic") {
    const angle = gradient.angle ?? 0;
    const position = gradient.position ?? "center";
    return `conic-gradient(from ${angle}deg at ${position}, ${stops})`;
  }

  return "";
}

/**
 * Interpolate between multiple gradient keyframes
 * Matches the pattern of interpolateColorKeyframes from color.ts
 */
export function interpolateGradientKeyframes(
  gradients: string[],
  progress: number,
  easingFn?: EasingFunction
): string {
  // Handle edge cases
  if (gradients.length === 0) return "";
  if (gradients.length === 1) return gradients[0];

  // Clamp progress to [0, 1]
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  // Calculate which segment we're in
  const segments = gradients.length - 1;
  const segmentProgress = clampedProgress * segments;
  const segmentIndex = Math.min(Math.floor(segmentProgress), segments - 1);
  const localProgress = segmentProgress - segmentIndex;

  // Parse gradients
  const fromGradient = parseGradient(gradients[segmentIndex]);
  const toGradient = parseGradient(gradients[segmentIndex + 1]);

  // Handle parse failures
  if (!fromGradient) return gradients[segmentIndex];
  if (!toGradient) return gradients[segmentIndex + 1];

  // Interpolate
  const interpolated = interpolateGradients(fromGradient, toGradient, localProgress, easingFn);

  // Convert back to CSS
  return gradientToCSS(interpolated);
}
