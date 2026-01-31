import { describe, it, expect } from 'vitest';
import { Transform3D, Vector3, Quaternion } from '../transform3d';

describe('Transform3D', () => {
  describe('Construction', () => {
    it('should create identity transform by default', () => {
      const transform = new Transform3D();
      
      expect(transform.position.x).toBe(0);
      expect(transform.position.y).toBe(0);
      expect(transform.position.z).toBe(0);
      expect(transform.scale.x).toBe(1);
      expect(transform.scale.y).toBe(1);
      expect(transform.scale.z).toBe(1);
    });

    it('should create transform from options', () => {
      const transform = new Transform3D({
        position: new Vector3(10, 20, 30),
        scale: new Vector3(2, 3, 4),
      });

      expect(transform.position.x).toBe(10);
      expect(transform.position.y).toBe(20);
      expect(transform.position.z).toBe(30);
      expect(transform.scale.x).toBe(2);
      expect(transform.scale.y).toBe(3);
      expect(transform.scale.z).toBe(4);
    });

    it('should create identity transform', () => {
      const transform = Transform3D.identity();
      
      expect(transform.position.x).toBe(0);
      expect(transform.position.y).toBe(0);
      expect(transform.position.z).toBe(0);
      expect(transform.scale.x).toBe(1);
      expect(transform.scale.y).toBe(1);
      expect(transform.scale.z).toBe(1);
    });

    it('should create transform from Euler angles', () => {
      const transform = Transform3D.fromEuler(
        Math.PI / 2, // 90 degrees X
        0,
        0,
        new Vector3(10, 20, 30),
        new Vector3(2, 2, 2)
      );

      expect(transform.position.x).toBe(10);
      expect(transform.position.y).toBe(20);
      expect(transform.position.z).toBe(30);
      expect(transform.scale.x).toBe(2);
      expect(transform.scale.y).toBe(2);
      expect(transform.scale.z).toBe(2);
    });

    it('should create transform from matrix', () => {
      const original = Transform3D.fromEuler(
        Math.PI / 4,
        Math.PI / 6,
        0,
        new Vector3(5, 10, 15),
        new Vector3(1.5, 1.5, 1.5)
      );

      const matrix = original.toMatrix4();
      const reconstructed = Transform3D.fromMatrix(matrix);

      expect(reconstructed.position.x).toBeCloseTo(5, 5);
      expect(reconstructed.position.y).toBeCloseTo(10, 5);
      expect(reconstructed.position.z).toBeCloseTo(15, 5);
      expect(reconstructed.scale.x).toBeCloseTo(1.5, 5);
      expect(reconstructed.scale.y).toBeCloseTo(1.5, 5);
      expect(reconstructed.scale.z).toBeCloseTo(1.5, 5);
    });
  });

  describe('Operations', () => {
    it('should translate', () => {
      const transform = Transform3D.identity();
      const translated = transform.translate(10, 20, 30);

      expect(translated.position.x).toBe(10);
      expect(translated.position.y).toBe(20);
      expect(translated.position.z).toBe(30);
      
      expect(transform.position.x).toBe(0);
    });

    it('should rotate', () => {
      const transform = Transform3D.identity();
      const rotated = transform.rotateX(Math.PI / 2);

      const euler = rotated.toEuler();
      expect(euler.x).toBeCloseTo(Math.PI / 2, 5);
    });

    it('should rotate on Y axis', () => {
      const transform = Transform3D.identity();
      const rotated = transform.rotateY(Math.PI / 3);

      const euler = rotated.toEuler();
      expect(euler.y).toBeCloseTo(Math.PI / 3, 5);
    });

    it('should rotate on Z axis', () => {
      const transform = Transform3D.identity();
      const rotated = transform.rotateZ(Math.PI / 4);

      const euler = rotated.toEuler();
      expect(euler.z).toBeCloseTo(Math.PI / 4, 5);
    });

    it('should scale', () => {
      const transform = Transform3D.identity();
      const scaled = transform.scaleBy(2, 3, 4);

      expect(scaled.scale.x).toBe(2);
      expect(scaled.scale.y).toBe(3);
      expect(scaled.scale.z).toBe(4);
      
      expect(transform.scale.x).toBe(1);
    });

    it('should chain operations', () => {
      const transform = Transform3D.identity()
        .translate(10, 20, 30)
        .rotateZ(Math.PI / 4)
        .scaleBy(2, 2, 2);

      expect(transform.position.x).toBe(10);
      expect(transform.position.y).toBe(20);
      expect(transform.position.z).toBe(30);
      expect(transform.scale.x).toBe(2);
      expect(transform.scale.y).toBe(2);
      expect(transform.scale.z).toBe(2);
    });

    it('should multiply transforms', () => {
      const t1 = Transform3D.identity().translate(10, 0, 0);
      const t2 = Transform3D.identity().translate(5, 0, 0);
      
      const result = t1.multiply(t2);
      const point = result.apply(new Vector3(0, 0, 0));
      
      expect(point.x).toBeCloseTo(15, 5);
    });

    it('should invert transform', () => {
      const transform = Transform3D.fromEuler(
        Math.PI / 4,
        Math.PI / 6,
        0,
        new Vector3(10, 20, 30),
        new Vector3(2, 2, 2)
      );

      const inverted = transform.inverse();
      const identity = transform.multiply(inverted);
      
      const point = identity.apply(new Vector3(0, 0, 0));
      
      expect(point.x).toBeCloseTo(0, 1);
      expect(point.y).toBeCloseTo(0, 1);
      expect(point.z).toBeCloseTo(0, 1);
    });

    it('should apply transform to point', () => {
      const transform = Transform3D.identity()
        .translate(10, 20, 30)
        .scaleBy(2, 2, 2);
      
      const point = new Vector3(5, 5, 5);
      const transformed = transform.apply(point);

      expect(transformed.x).toBeCloseTo(20, 5);
      expect(transformed.y).toBeCloseTo(30, 5);
      expect(transformed.z).toBeCloseTo(40, 5);
    });
  });

  describe('Interpolation', () => {
    it('should interpolate position', () => {
      const from = Transform3D.identity().translate(0, 0, 0);
      const to = Transform3D.identity().translate(100, 100, 100);
      
      const mid = from.lerp(to, 0.5);

      expect(mid.position.x).toBeCloseTo(50, 5);
      expect(mid.position.y).toBeCloseTo(50, 5);
      expect(mid.position.z).toBeCloseTo(50, 5);
    });

    it('should interpolate scale', () => {
      const from = Transform3D.identity().scaleBy(1, 1, 1);
      const to = Transform3D.identity().scaleBy(3, 3, 3);
      
      const mid = from.lerp(to, 0.5);

      expect(mid.scale.x).toBeCloseTo(2, 5);
      expect(mid.scale.y).toBeCloseTo(2, 5);
      expect(mid.scale.z).toBeCloseTo(2, 5);
    });

    it('should interpolate rotation smoothly', () => {
      const from = Transform3D.fromEuler(0, 0, 0);
      const to = Transform3D.fromEuler(Math.PI, 0, 0);
      
      const mid = from.lerp(to, 0.5);
      const euler = mid.toEuler();

      expect(euler.x).toBeCloseTo(Math.PI / 2, 1);
    });

    it('should interpolate complete transforms', () => {
      const from = Transform3D.fromEuler(
        0, 0, 0,
        new Vector3(0, 0, 0),
        new Vector3(1, 1, 1)
      );
      
      const to = Transform3D.fromEuler(
        Math.PI / 2, 0, 0,
        new Vector3(100, 100, 100),
        new Vector3(2, 2, 2)
      );
      
      const mid = from.lerp(to, 0.5);

      expect(mid.position.x).toBeCloseTo(50, 5);
      expect(mid.position.y).toBeCloseTo(50, 5);
      expect(mid.position.z).toBeCloseTo(50, 5);
      expect(mid.scale.x).toBeCloseTo(1.5, 5);
      expect(mid.scale.y).toBeCloseTo(1.5, 5);
      expect(mid.scale.z).toBeCloseTo(1.5, 5);
    });
  });

  describe('Conversion', () => {
    it('should convert to Matrix4', () => {
      const transform = Transform3D.identity().translate(10, 20, 30);
      const matrix = transform.toMatrix4();
      
      expect(matrix.elements[12]).toBeCloseTo(10, 5);
      expect(matrix.elements[13]).toBeCloseTo(20, 5);
      expect(matrix.elements[14]).toBeCloseTo(30, 5);
    });

    it('should convert to CSS matrix3d', () => {
      const transform = Transform3D.identity().translate(10, 20, 30);
      const css = transform.toCSSMatrix3D();
      
      expect(css).toContain('matrix3d');
      expect(css).toMatch(/matrix3d\([^)]+\)/);
    });

    it('should convert to Euler angles', () => {
      const original = Transform3D.fromEuler(Math.PI / 4, Math.PI / 6, Math.PI / 3);
      const euler = original.toEuler();
      
      expect(euler.x).toBeCloseTo(Math.PI / 4, 5);
      expect(euler.y).toBeCloseTo(Math.PI / 6, 5);
      expect(euler.z).toBeCloseTo(Math.PI / 3, 5);
    });

    it('should decompose transform', () => {
      const transform = Transform3D.fromEuler(
        Math.PI / 4,
        0,
        0,
        new Vector3(10, 20, 30),
        new Vector3(2, 3, 4)
      );

      const decomposed = transform.decompose();

      expect(decomposed.position.x).toBe(10);
      expect(decomposed.position.y).toBe(20);
      expect(decomposed.position.z).toBe(30);
      expect(decomposed.scale.x).toBe(2);
      expect(decomposed.scale.y).toBe(3);
      expect(decomposed.scale.z).toBe(4);
    });
  });

  describe('Cloning', () => {
    it('should clone transform', () => {
      const original = Transform3D.identity()
        .translate(10, 20, 30)
        .scaleBy(2, 2, 2);
      
      const clone = original.clone();

      expect(clone.position.x).toBe(10);
      expect(clone.position.y).toBe(20);
      expect(clone.position.z).toBe(30);
      expect(clone.scale.x).toBe(2);

      const modified = clone.translate(5, 0, 0);
      expect(original.position.x).toBe(10);
      expect(modified.position.x).toBe(15);
    });
  });
});
