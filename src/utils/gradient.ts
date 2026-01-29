import { interpolate as culoriInterpolate, formatRgb } from "culori";
import type { EasingFunction } from "./interpolate";

export type GradientType = "linear" | "radial" | "conic";

export interface ColorStop {
  color: string;
  position?: number;
}

export interface ParsedGradient {
  type: GradientType;
  angle?: number;
  shape?: string;
  position?: string;
  stops: ColorStop[];
}

export function parseGradient(gradientString: string): ParsedGradient | null {
  const trimmed = gradientString.trim();

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
    return null;
  }

  const lastParen = trimmed.lastIndexOf(")");
  if (lastParen === -1) return null;

  const content = trimmed.substring(contentStart, lastParen).trim();
  if (type === "linear") {
    return parseLinearGradient(content);
  } else if (type === "radial") {
    return parseRadialGradient(content);
  } else if (type === "conic") {
    return parseConicGradient(content);
  }

  return null;
}

function parseLinearGradient(content: string): ParsedGradient {
  const gradient: ParsedGradient = {
    type: "linear",
    angle: 180,
    stops: [],
  };

  const parts = splitGradientParts(content);
  let startIndex = 0;

  const firstPart = parts[0]?.trim();
  if (firstPart) {
    const angleMatch = firstPart.match(/^(-?\d+\.?\d*)deg$/);
    if (angleMatch) {
      gradient.angle = parseFloat(angleMatch[1]);
      startIndex = 1;
    } else if (firstPart.startsWith("to ")) {
      gradient.angle = parseDirection(firstPart);
      startIndex = 1;
    }
  }

  for (let i = startIndex; i < parts.length; i++) {
    const stop = parseColorStop(parts[i]);
    if (stop) gradient.stops.push(stop);
  }

  return gradient;
}

function parseRadialGradient(content: string): ParsedGradient {
  const gradient: ParsedGradient = {
    type: "radial",
    shape: "ellipse",
    position: "center",
    stops: [],
  };

  const parts = splitGradientParts(content);
  let startIndex = 0;

  const firstPart = parts[0]?.trim();
  if (firstPart && !isColorStop(firstPart)) {
    const shapeMatch = firstPart.match(/\b(circle|ellipse)\b/);
    if (shapeMatch) {
      gradient.shape = shapeMatch[1];
    }

    const atIndex = firstPart.indexOf(" at ");
    if (atIndex !== -1) {
      gradient.position = firstPart.substring(atIndex + 4).trim();
    }

    startIndex = 1;
  }

  for (let i = startIndex; i < parts.length; i++) {
    const stop = parseColorStop(parts[i]);
    if (stop) gradient.stops.push(stop);
  }

  return gradient;
}

function parseConicGradient(content: string): ParsedGradient {
  const gradient: ParsedGradient = {
    type: "conic",
    angle: 0,
    position: "center",
    stops: [],
  };

  const parts = splitGradientParts(content);
  let startIndex = 0;

  const firstPart = parts[0]?.trim();
  if (firstPart && !isColorStop(firstPart)) {
    const fromMatch = firstPart.match(/from\s+(-?\d+\.?\d*)deg/);
    if (fromMatch) {
      gradient.angle = parseFloat(fromMatch[1]);
    }

    const atIndex = firstPart.indexOf(" at ");
    if (atIndex !== -1) {
      gradient.position = firstPart.substring(atIndex + 4).trim();
    }

    startIndex = 1;
  }

  for (let i = startIndex; i < parts.length; i++) {
    const stop = parseColorStop(parts[i]);
    if (stop) gradient.stops.push(stop);
  }

  return gradient;
}

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

function parseColorStop(stopString: string): ColorStop | null {
  const trimmed = stopString.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^(.+?)\s+([\d.]+%|[\d.]+px)$/);

  if (match) {
    const color = match[1].trim();
    const positionStr = match[2].trim();
    const position = parsePosition(positionStr);
    return { color, position };
  }

  return { color: trimmed };
}

function parsePosition(positionStr: string): number {
  if (positionStr.endsWith("%")) {
    return parseFloat(positionStr);
  }
  return parseFloat(positionStr);
}

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

  return 180;
}

function isColorStop(str: string): boolean {
  const trimmed = str.trim().toLowerCase();

  if (trimmed.includes(" at ") || trimmed.startsWith("from ") || trimmed.startsWith("to ")) {
    return false;
  }
  if (/\b(circle|ellipse)\b/.test(trimmed)) {
    return false;
  }

  const colorKeywords = [
    "red", "blue", "green", "yellow", "orange", "purple", "pink", "brown",
    "black", "white", "gray", "grey", "cyan", "magenta", "transparent",
  ];
  if (colorKeywords.some(keyword => trimmed.startsWith(keyword))) {
    return true;
  }

  if (trimmed.startsWith("#")) return true;

  if (trimmed.startsWith("rgb") || trimmed.startsWith("hsl")) return true;

  if (trimmed.includes("%") || trimmed.includes("px")) return true;

  return false;
}

function parseGradientPosition(position: string): { x: number; y: number } {
  const parts = position.trim().split(/\s+/);
  let x: number | null = null;
  let y: number | null = null;

  parts.forEach((part) => {
    switch (part) {
      case "left":
        x = 0;
        break;
      case "right":
        x = 100;
        break;
      case "top":
        y = 0;
        break;
      case "bottom":
        y = 100;
        break;
      case "center":
        if (x === null) x = 50;
        else if (y === null) y = 50;
        break;
      default: {
        const val = parseFloat(part);
        if (!isNaN(val)) {
          if (x === null) x = val;
          else y = val;
        }
      }
    }
  });

  return {
    x: x ?? 50,
    y: y ?? 50,
  };
}

function interpolatePositions(from: string, to: string, progress: number): string {
  const fromPos = parseGradientPosition(from);
  const toPos = parseGradientPosition(to);

  const x = fromPos.x + (toPos.x - fromPos.x) * progress;
  const y = fromPos.y + (toPos.y - fromPos.y) * progress;

  return `${x}% ${y}%`;
}

export function normalizeColorStops(stops: ColorStop[]): ColorStop[] {
  if (stops.length === 0) return [];
  if (stops.length === 1) return [{ ...stops[0], position: 50 }];

  const normalized: ColorStop[] = [];

  normalized.push({
    ...stops[0],
    position: stops[0].position ?? 0,
  });

  const lastStop = stops[stops.length - 1];
  const lastPosition = lastStop.position ?? 100;

  for (let i = 1; i < stops.length - 1; i++) {
    if (stops[i].position !== undefined) {
      normalized.push(stops[i] as Required<ColorStop>);
    } else {
      let nextWithPosition = stops.length - 1;
      for (let j = i + 1; j < stops.length; j++) {
        if (stops[j].position !== undefined) {
          nextWithPosition = j;
          break;
        }
      }

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

  normalized.push({
    ...lastStop,
    position: lastPosition,
  });

  return normalized;
}

export function interpolateAngle(
  from: number,
  to: number,
  progress: number,
  useShortestAngle: boolean = true
): number {
  const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;
  const fromNorm = normalizeAngle(from);
  const toNorm = normalizeAngle(to);

  let diff = toNorm - fromNorm;

  if (useShortestAngle) {
    if (diff > 180) {
      diff -= 360;
    } else if (diff < -180) {
      diff += 360;
    }
  }

  return normalizeAngle(fromNorm + diff * progress);
}

export function matchColorStopCount(
  stops: ColorStop[],
  targetCount: number
): ColorStop[] {
  if (stops.length === targetCount) return stops;

  if (stops.length < targetCount) {
    const padded = [...stops];
    while (padded.length < targetCount) {
      padded.push({ ...stops[stops.length - 1] });
    }
    return padded;
  }

  const resampled: ColorStop[] = [];
  for (let i = 0; i < targetCount; i++) {
    const position = (i / (targetCount - 1)) * 100;
    const color = interpolateColorAtPosition(stops, position);
    resampled.push({ color, position });
  }
  return resampled;
}

function interpolateColorAtPosition(stops: ColorStop[], position: number): string {
  const normalized = normalizeColorStops(stops);

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

  try {
    const interpolator = culoriInterpolate([before.color, after.color], "oklch");
    const result = interpolator(localProgress);
    return formatRgb(result) || before.color;
  } catch {
    return before.color;
  }
}

export function interpolateGradients(
  from: ParsedGradient,
  to: ParsedGradient,
  progress: number,
  easingFn?: EasingFunction,
  useShortestAngle: boolean = true
): ParsedGradient {
  const easedProgress = easingFn ? easingFn(progress) : progress;

  const type = easedProgress < 0.5 ? from.type : to.type;

  let angle: number | undefined;
  if (from.angle !== undefined && to.angle !== undefined) {
    angle = interpolateAngle(from.angle, to.angle, easedProgress, useShortestAngle);
  } else if (from.angle !== undefined) {
    angle = from.angle;
  } else if (to.angle !== undefined) {
    angle = to.angle;
  }

  const shape = easedProgress < 0.5 ? from.shape : to.shape;

  let position: string | undefined;
  if (from.position && to.position) {
    position = interpolatePositions(from.position, to.position, easedProgress);
  } else {
    position = easedProgress < 0.5 ? from.position : to.position;
  }

  const fromStops = normalizeColorStops(from.stops);
  const toStops = normalizeColorStops(to.stops);

  const maxStops = Math.max(fromStops.length, toStops.length);
  const fromMatched = matchColorStopCount(fromStops, maxStops);
  const toMatched = matchColorStopCount(toStops, maxStops);

  const stops: ColorStop[] = fromMatched.map((fromStop, i) => {
    const toStop = toMatched[i];

    const position =
      fromStop.position! + (toStop.position! - fromStop.position!) * easedProgress;

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

export function interpolateGradientKeyframes(
  gradients: string[],
  progress: number,
  easingFn?: EasingFunction,
  useShortestAngle: boolean = true
): string {
  if (gradients.length === 0) return "";
  if (gradients.length === 1) return gradients[0];

  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const segments = gradients.length - 1;
  const segmentProgress = clampedProgress * segments;
  const segmentIndex = Math.min(Math.floor(segmentProgress), segments - 1);
  const localProgress = segmentProgress - segmentIndex;

  const fromGradient = parseGradient(gradients[segmentIndex]);
  const toGradient = parseGradient(gradients[segmentIndex + 1]);

  if (!fromGradient) return gradients[segmentIndex];
  if (!toGradient) return gradients[segmentIndex + 1];

  const interpolated = interpolateGradients(fromGradient, toGradient, localProgress, easingFn, useShortestAngle);

  return gradientToCSS(interpolated);
}
