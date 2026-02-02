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

  describe('ID Management', () => {
    it('should assign unique IDs to new transforms', () => {
      const t1 = Transform3D.identity();
      const t2 = Transform3D.identity();
      const t3 = Transform3D.identity();

      expect(t1.id).not.toBe(t2.id);
      expect(t2.id).not.toBe(t3.id);
      expect(t1.id).not.toBe(t3.id);
    });

    it('should preserve ID across chainable methods', () => {
      const original = Transform3D.identity();
      const originalId = original.id;

      const transformed = original
        .translate(10, 20, 30)
        .rotateZ(Math.PI / 4)
        .scaleBy(2, 2, 2);

      expect(transformed.id).toBe(originalId);
    });

    it('should preserve ID in clone', () => {
      const original = Transform3D.identity();
      const clone = original.clone();

      expect(clone.id).toBe(original.id);
    });

    it('should preserve ID in lerp', () => {
      const t1 = Transform3D.identity();
      const t2 = Transform3D.identity().translate(100, 0, 0);
      
      const mid = t1.lerp(t2, 0.5);

      expect(mid.id).toBe(t1.id);
    });
  });

  describe('Random Operations', () => {
    it('should randomly translate within bounds using array notation', () => {
      const transform = Transform3D.identity();
      const randomized = transform.randomTranslate([-10, 10], [-5, 5], [0, 20]);

      expect(randomized.position.x).toBeGreaterThanOrEqual(-10);
      expect(randomized.position.x).toBeLessThanOrEqual(10);
      expect(randomized.position.y).toBeGreaterThanOrEqual(-5);
      expect(randomized.position.y).toBeLessThanOrEqual(5);
      expect(randomized.position.z).toBeGreaterThanOrEqual(0);
      expect(randomized.position.z).toBeLessThanOrEqual(20);
    });

    it('should randomly rotate within bounds using array notation', () => {
      const transform = Transform3D.identity();
      const randomized = transform
        .randomRotateX([-45, 45])
        .randomRotateY([-90, 90])
        .randomRotateZ([0, 180]);

      const euler = randomized.toEuler();
      const xDeg = euler.x * (180 / Math.PI);
      const yDeg = euler.y * (180 / Math.PI);
      const zDeg = euler.z * (180 / Math.PI);

      expect(xDeg).toBeGreaterThanOrEqual(-45);
      expect(xDeg).toBeLessThanOrEqual(45);
      expect(yDeg).toBeGreaterThanOrEqual(-90);
      expect(yDeg).toBeLessThanOrEqual(90);
      expect(zDeg).toBeGreaterThanOrEqual(0);
      expect(zDeg).toBeLessThanOrEqual(180);
    });

    it('should use auto-namespaced seed based on transform ID', () => {
      const t1 = Transform3D.identity();
      const t2 = Transform3D.identity();

      const r1a = t1.randomTranslate([0, 100]);
      const r1b = t1.randomTranslate([0, 100]);
      
      const r2 = t2.randomTranslate([0, 100]);

      expect(r1a.position.x).toBe(r1b.position.x);
      expect(r1a.position.x).not.toBe(r2.position.x);
    });

    it('should accept custom seed override', () => {
      const transform = Transform3D.identity();
      
      const r1 = transform.randomTranslate([0, 100], undefined, undefined, 'custom-seed');
      const r2 = transform.randomTranslate([0, 100], undefined, undefined, 'custom-seed');
      const r3 = transform.randomTranslate([0, 100], undefined, undefined, 'different-seed');

      expect(r1.position.x).toBe(r2.position.x);
      expect(r1.position.x).not.toBe(r3.position.x);
    });

    it('should preserve ID in random operations', () => {
      const original = Transform3D.identity();
      const originalId = original.id;

      const randomized = original
        .randomTranslate([-10, 10])
        .randomRotateZ([-45, 45]);

      expect(randomized.id).toBe(originalId);
    });

    it('should handle partial bounds in random translate', () => {
      const transform = Transform3D.identity();
      const randomized = transform.randomTranslate([-10, 10]);

      expect(randomized.position.x).toBeGreaterThanOrEqual(-10);
      expect(randomized.position.x).toBeLessThanOrEqual(10);
      expect(randomized.position.y).toBe(0);
      expect(randomized.position.z).toBe(0);
    });

    it('should support individual random rotation axes', () => {
      const transform = Transform3D.identity();
      
      const rX = transform.randomRotateX([-45, 45]);
      const rY = transform.randomRotateY([-90, 90]);
      const rZ = transform.randomRotateZ([0, 180]);

      const eulerX = rX.toEuler();
      const eulerY = rY.toEuler();
      const eulerZ = rZ.toEuler();

      expect(Math.abs(eulerX.x * (180 / Math.PI))).toBeGreaterThan(0);
      expect(Math.abs(eulerY.y * (180 / Math.PI))).toBeGreaterThan(0);
      expect(Math.abs(eulerZ.z * (180 / Math.PI))).toBeGreaterThan(0);
    });
  });
});
