
export type Point = { x: number; y: number };
export type Size = { width: number; height: number };

export interface RectLike extends Point, Size {}

export type RelativeValue = number | string; // 100 or "50%"

export type PositionObject = { x?: RelativeValue; y?: RelativeValue };
export type PositionString =
  | 'center'
  | 'top' | 'bottom' | 'left' | 'right'
  | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

// Also support [x, y] tuple
export type PositionTuple = [RelativeValue, RelativeValue];

export type PositionDescriptor = PositionObject | PositionString | PositionTuple | Point;

export class Rect implements RectLike {
  constructor(
    public width: number,
    public height: number,
    public x: number = 0,
    public y: number = 0
  ) {}

  get left(): number {
    return this.x;
  }

  get top(): number {
    return this.y;
  }

  get right(): number {
    return this.x + this.width;
  }

  get bottom(): number {
    return this.y + this.height;
  }

  // Horizontal Center
  get cx(): number {
    return this.x + this.width / 2;
  }

  // Vertical Center
  get cy(): number {
    return this.y + this.height / 2;
  }

  get center(): Point {
    return { x: this.cx, y: this.cy };
  }
}

/**
 * Parses a value that can be a number or a string percentage.
 * @param val The value to parse (e.g. 50, "50%")
 * @param total The total dimension value to calculate percentage against
 * @returns The absolute number value
 */
export function parseRelativeValue(val: RelativeValue, total: number): number {
  if (typeof val === 'number') {
    return val;
  }

  if (typeof val === 'string') {
    if (val === 'center') return total / 2;
    if (val === 'left' || val === 'top') return 0;
    if (val === 'right' || val === 'bottom') return total;

    if (val.endsWith('%')) {
      const percentage = parseFloat(val);
      if (!isNaN(percentage)) {
        return (percentage / 100) * total;
      }
    } else {
        // Try parsing as simple number string
        const num = parseFloat(val);
        if (!isNaN(num)) return num;
    }
  }

  return 0;
}

/**
 * Resolves a PositionDescriptor into a concrete Point within a Rect.
 * @param rect The rectangle context
 * @param pos The position descriptor
 * @returns A Point {x, y}
 */
export function resolvePoint(rect: RectLike, pos: PositionDescriptor): Point {
  const { x, y, width, height } = rect;

  // Handle strings (keywords)
  if (typeof pos === 'string') {
    const cx = x + width / 2;
    const cy = y + height / 2;

    switch (pos) {
      case 'center': return { x: cx, y: cy };
      case 'top': return { x: cx, y };
      case 'bottom': return { x: cx, y: y + height };
      case 'left': return { x, y: cy };
      case 'right': return { x: x + width, y: cy };
      case 'topLeft': return { x, y };
      case 'topRight': return { x: x + width, y };
      case 'bottomLeft': return { x, y: y + height };
      case 'bottomRight': return { x: x + width, y: y + height };
      default: return { x, y }; // Fallback
    }
  }

  // Handle Tuples [x, y]
  if (Array.isArray(pos)) {
    return {
      x: x + parseRelativeValue(pos[0], width),
      y: y + parseRelativeValue(pos[1], height),
    };
  }

  // Handle Objects {x, y}
  if (typeof pos === 'object') {
    // If it's already a clean Point-like structure
    const pX = 'x' in pos ? pos.x : 0;
    const pY = 'y' in pos ? pos.y : 0;

    return {
      x: x + parseRelativeValue(pX ?? 0, width),
      y: y + parseRelativeValue(pY ?? 0, height),
    };
  }

  return { x, y };
}

/**
 * Gets a rectangular region from absolute coordinates or size
 */
export function createRect(width: number, height: number, x: number = 0, y: number = 0): Rect {
  return new Rect(width, height, x, y);
}
