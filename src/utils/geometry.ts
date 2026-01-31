import { Vector3 } from 'three';

export type Point = { x: number; y: number };
export type Point3D = Vector3;
export type Size = { width: number; height: number };
export type Size3D = { width: number; height: number; depth: number };

export interface RectLike extends Point, Size {}

export type RelativeValue = number | string; // 100 or "50%"

export type PositionObject = { x?: RelativeValue; y?: RelativeValue };
export type PositionObject3D = { x?: RelativeValue; y?: RelativeValue; z?: RelativeValue };

export type PositionString =
  | 'center'
  | 'top' | 'bottom' | 'left' | 'right'
  | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export type PositionString3D =
  | 'center'
  | 'top' | 'bottom' | 'left' | 'right'
  | 'front' | 'back'
  | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  | 'topLeftFront' | 'topRightFront' | 'bottomLeftFront' | 'bottomRightFront'
  | 'topLeftBack' | 'topRightBack' | 'bottomLeftBack' | 'bottomRightBack';

// Also support [x, y] tuple
export type PositionTuple = [RelativeValue, RelativeValue];
export type PositionTuple3D = [RelativeValue, RelativeValue, RelativeValue];

export type PositionDescriptor = PositionObject | PositionString | PositionTuple | Point;
export type Position3DDescriptor = PositionObject3D | PositionString3D | PositionTuple3D | Point3D;

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

  get vh(): number {
    return this.height / 100;
  }

  get vw(): number {
    return this.width / 100;
  }

  get vmin(): number {
    return Math.min(this.vw, this.vh);
  }

  get vmax(): number {
    return Math.max(this.vw, this.vh);
  }
}

export class Rect3D extends Rect {
  constructor(
    width: number,
    height: number,
    public depth: number,
    x: number = 0,
    y: number = 0,
    public z: number = 0
  ) {
    super(width, height, x, y);
  }

  get front(): number {
    return this.z;
  }

  get back(): number {
    return this.z + this.depth;
  }

  get near(): number {
    return this.z;
  }

  get far(): number {
    return this.z + this.depth;
  }

  get centerZ(): number {
    return this.z + this.depth / 2;
  }

  get center3D(): Point3D {
    return new Vector3(this.cx, this.cy, this.centerZ);
  }

  get volume(): number {
    return this.width * this.height * this.depth;
  }

  resolvePoint3D(pos: Position3DDescriptor): Point3D {
    const { x, y, z, width, height, depth } = this;

    if (typeof pos === 'string') {
      const cx = x + width / 2;
      const cy = y + height / 2;
      const cz = z + depth / 2;

      switch (pos) {
        case 'center': return new Vector3(cx, cy, cz);
        case 'top': return new Vector3(cx, y, cz);
        case 'bottom': return new Vector3(cx, y + height, cz);
        case 'left': return new Vector3(x, cy, cz);
        case 'right': return new Vector3(x + width, cy, cz);
        case 'front': return new Vector3(cx, cy, z);
        case 'back': return new Vector3(cx, cy, z + depth);
        case 'topLeft': return new Vector3(x, y, cz);
        case 'topRight': return new Vector3(x + width, y, cz);
        case 'bottomLeft': return new Vector3(x, y + height, cz);
        case 'bottomRight': return new Vector3(x + width, y + height, cz);
        case 'topLeftFront': return new Vector3(x, y, z);
        case 'topRightFront': return new Vector3(x + width, y, z);
        case 'bottomLeftFront': return new Vector3(x, y + height, z);
        case 'bottomRightFront': return new Vector3(x + width, y + height, z);
        case 'topLeftBack': return new Vector3(x, y, z + depth);
        case 'topRightBack': return new Vector3(x + width, y, z + depth);
        case 'bottomLeftBack': return new Vector3(x, y + height, z + depth);
        case 'bottomRightBack': return new Vector3(x + width, y + height, z + depth);
        default: return new Vector3(x, y, z);
      }
    }

    if (Array.isArray(pos)) {
      return new Vector3(
        x + parseRelativeValue(pos[0], width),
        y + parseRelativeValue(pos[1], height),
        z + parseRelativeValue(pos[2], depth)
      );
    }

    if (pos instanceof Vector3) {
      return pos.clone();
    }

    if (typeof pos === 'object') {
      const pX = 'x' in pos ? pos.x : 0;
      const pY = 'y' in pos ? pos.y : 0;
      const pZ = 'z' in pos ? pos.z : 0;

      return new Vector3(
        x + parseRelativeValue(pX ?? 0, width),
        y + parseRelativeValue(pY ?? 0, height),
        z + parseRelativeValue(pZ ?? 0, depth)
      );
    }

    return new Vector3(x, y, z);
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

/**
 * Creates a 3D rectangular region from absolute coordinates or size
 */
export function createRect3D(
  width: number,
  height: number,
  depth: number,
  x: number = 0,
  y: number = 0,
  z: number = 0
): Rect3D {
  return new Rect3D(width, height, depth, x, y, z);
}
