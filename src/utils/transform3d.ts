import { Matrix4, Quaternion, Vector3, Euler } from 'three';
import { randomFloat } from './random';

export interface TransformOptions {
  position?: Vector3;
  rotation?: Quaternion;
  scale?: Vector3 | number;
}



export class Transform3D {
  private static _idCounter: number = 0;
  id: number;

  position: Vector3;
  rotation: Quaternion;
  scale: Vector3;
  private _matrix: Matrix4;
  private _matrixDirty: boolean = true;

  constructor(options: TransformOptions & { id?: number } = {}) {
    this.id = options.id ?? Transform3D._idCounter++;
    this.position = options.position?.clone() ?? new Vector3(0, 0, 0);
    this.rotation = options.rotation?.clone() ?? new Quaternion(0, 0, 0, 1);
    if (typeof options.scale === 'number') {
      this.scale = new Vector3(options.scale, options.scale, options.scale);
    } else {
      this.scale = options.scale?.clone() ?? new Vector3(1, 1, 1);
    }
    this._matrix = new Matrix4();
  }

  static fromMatrix(matrix: Matrix4, id?: number): Transform3D {
    const position = new Vector3();
    const rotation = new Quaternion();
    const scale = new Vector3();
    matrix.decompose(position, rotation, scale);

    return new Transform3D({ position, rotation, scale, id });
  }

  static fromEuler(
    x: number,
    y: number,
    z: number,
    position?: Vector3,
    scale?: Vector3 | number,
    order: 'XYZ' | 'XZY' | 'YXZ' | 'YZX' | 'ZXY' | 'ZYX' = 'XYZ'
  ): Transform3D {
    const euler = new Euler(x, y, z, order);
    const rotation = new Quaternion().setFromEuler(euler);

    return new Transform3D({
      position: position ?? new Vector3(0, 0, 0),
      rotation,
      scale: typeof scale === 'number' ? new Vector3(scale, scale, scale) : scale ?? new Vector3(1, 1, 1),
    });
  }

  static identity(): Transform3D {
    return new Transform3D();
  }

  clone(): Transform3D {
    return new Transform3D({
      id: this.id,
      position: this.position.clone(),
      rotation: this.rotation.clone(),
      scale: this.scale.clone(),
    });
  }

  reseed(newId?: number): Transform3D {
    const newTransform = this.clone();
    newTransform.id = newId ?? Transform3D._idCounter++;
    return newTransform;
  }

  translate(x: number | Vector3, y: number = 0, z: number = 0): Transform3D {
    const newTransform = this.clone();

    if (typeof x === 'number') {
      newTransform.position.set(
        newTransform.position.x + x,
        newTransform.position.y + y,
        newTransform.position.z + z
      );
    } else {
      newTransform.position.add(x);
    }

    newTransform._markDirty();
    return newTransform;
  }

  rotate(quaternion: Quaternion): Transform3D {
    const newTransform = this.clone();
    newTransform.rotation.multiply(quaternion);
    newTransform._markDirty();
    return newTransform;
  }

  rotateX(angle: number | string): Transform3D {
    const radians = Transform3D._parseAngle(angle);
    const q = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), radians);
    return this.rotate(q);
  }

  rotateY(angle: number | string): Transform3D {
    const radians = Transform3D._parseAngle(angle);
    const q = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), radians);
    return this.rotate(q);
  }

  rotateZ(angle: number | string): Transform3D {
    const radians = Transform3D._parseAngle(angle);
    const q = new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), radians);
    return this.rotate(q);
  }

  rotateAround(origin: Vector3, axis: Vector3, angle: number | string): Transform3D {
    const radians = Transform3D._parseAngle(angle);
    const q = new Quaternion().setFromAxisAngle(axis.clone().normalize(), radians);

    const newTransform = this.clone();

    // Rotate position relative to origin
    const relativePos = newTransform.position.clone().sub(origin);
    relativePos.applyQuaternion(q);
    newTransform.position.copy(origin).add(relativePos);

    // Rotate orientation
    newTransform.rotation.premultiply(q);
    
    newTransform._markDirty();
    return newTransform;
  }

  scaleBy(sx: number, sy?: number, sz?: number): Transform3D {
    const scaleY = sy ?? sx;
    const scaleZ = sz ?? sx;
    const newTransform = this.clone();
    newTransform.scale.set(
      newTransform.scale.x * sx,
      newTransform.scale.y * scaleY,
      newTransform.scale.z * scaleZ
    );
    newTransform._markDirty();
    return newTransform;
  }

  multiply(other: Transform3D): Transform3D {
    const matrix = this.toMatrix4().multiply(other.toMatrix4());
    return Transform3D.fromMatrix(matrix, this.id);
  }

  inverse(): Transform3D {
    const invMatrix = this.toMatrix4().clone().invert();
    return Transform3D.fromMatrix(invMatrix, this.id);
  }

  apply(point: Vector3): Vector3 {
    return point.clone().applyMatrix4(this.toMatrix4());
  }

  lerp(target: Transform3D, alpha: number): Transform3D {
    const position = this.position.clone().lerp(target.position, alpha);
    const rotation = this.rotation.clone().slerp(target.rotation, alpha);
    const scale = this.scale.clone().lerp(target.scale, alpha);

    return new Transform3D({ id: this.id, position, rotation, scale });
  }

  randomTranslate(x: [number, number], y?: [number, number], z?: [number, number], seed?: number | string): Transform3D {
    const actualSeed = seed ?? `transform-3d-${this.id}`;
    const newTransform = this.clone();
    
    const dx = randomFloat(`${actualSeed}-x`, x[0], x[1]);
    newTransform.position.x += dx;
    
    if (y) {
      const dy = randomFloat(`${actualSeed}-y`, y[0], y[1]);
      newTransform.position.y += dy;
    }
    
    if (z) {
      const dz = randomFloat(`${actualSeed}-z`, z[0], z[1]);
      newTransform.position.z += dz;
    }
    
    newTransform._markDirty();
    return newTransform;
  }

  randomRotateX(angle: [number, number], seed?: number | string): Transform3D {
    const actualSeed = seed ?? `transform-3d-${this.id}`;
    const degrees = randomFloat(`${actualSeed}-rx`, angle[0], angle[1]);
    return this.rotateX(degrees);
  }

  randomRotateY(angle: [number, number], seed?: number | string): Transform3D {
    const actualSeed = seed ?? `transform-3d-${this.id}`;
    const degrees = randomFloat(`${actualSeed}-ry`, angle[0], angle[1]);
    return this.rotateY(degrees);
  }

  randomRotateZ(angle: [number, number], seed?: number | string): Transform3D {
    const actualSeed = seed ?? `transform-3d-${this.id}`;
    const degrees = randomFloat(`${actualSeed}-rz`, angle[0], angle[1]);
    return this.rotateZ(degrees);
  }

  toMatrix4(): Matrix4 {
    if (this._matrixDirty) {
      this._matrix.compose(this.position, this.rotation, this.scale);
      this._matrixDirty = false;
    }
    return this._matrix.clone();
  }

  toCSSMatrix3D(): string {
    const elements = this.toMatrix4().elements.map((x) =>
      Math.abs(x) < 1.0e-6 ? 0 : x
    );
    return `matrix3d(${elements.join(',')})`;
  }

  decompose(): { position: Vector3; rotation: Quaternion; scale: Vector3 } {
    return {
      position: this.position.clone(),
      rotation: this.rotation.clone(),
      scale: this.scale.clone(),
    };
  }

  toEuler(order: 'XYZ' | 'XZY' | 'YXZ' | 'YZX' | 'ZXY' | 'ZYX' = 'XYZ'): Euler {
    return new Euler().setFromQuaternion(this.rotation, order);
  }

  toProps() {
    const euler = this.toEuler();
    return {
      x: this.position.x,
      y: this.position.y,
      z: this.position.z,
      rotateX: euler.x * (180 / Math.PI),
      rotateY: euler.y * (180 / Math.PI),
      rotateZ: euler.z * (180 / Math.PI),
      rotateOrder: euler.order.toLowerCase() as any,
      scaleX: this.scale.x,
      scaleY: this.scale.y,
      scaleZ: this.scale.z,
    };
  }

  private _markDirty(): void {
    this._matrixDirty = true;
  }

  private static _parseAngle(angle: number | string): number {
    if (!angle) {
      return 0;
    }

    if (typeof angle === 'number') {
      return (angle * Math.PI) / 180;
    }

    const trimmed = angle.trim();
    const match = trimmed.match(/^(-?\d+(?:\.\d+)?)(deg|rad)$/i);
    if (!match) {
      throw new Error(`Invalid angle format: ${angle}`);
    }

    const value = Number(match[1]);
    const unit = match[2].toLowerCase();
    if (unit === 'rad') {
      return value;
    }

    return (value * Math.PI) / 180;
  }
}

export { Vector3, Quaternion, Matrix4, Euler };
