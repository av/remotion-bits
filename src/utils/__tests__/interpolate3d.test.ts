import { describe, it, expect } from 'vitest';
import { 
  interpolateTransform, 
  interpolateTransformKeyframes,
  lerpVector3,
  slerpQuaternion,
  matrixToCSS,
  transformToCSS
} from '../interpolate3d';
import { Transform3D, Vector3, Quaternion } from '../transform3d';

describe('Interpolate3D', () => {
  describe('lerpVector3', () => {
    it('should interpolate vectors', () => {
      const v1 = new Vector3(0, 0, 0);
      const v2 = new Vector3(100, 100, 100);
      
      const mid = lerpVector3(v1, v2, 0.5);

      expect(mid.x).toBeCloseTo(50, 5);
      expect(mid.y).toBeCloseTo(50, 5);
      expect(mid.z).toBeCloseTo(50, 5);
    });

    it('should not mutate original vectors', () => {
      const v1 = new Vector3(0, 0, 0);
      const v2 = new Vector3(100, 100, 100);
      
      lerpVector3(v1, v2, 0.5);

      expect(v1.x).toBe(0);
      expect(v2.x).toBe(100);
    });
  });

  describe('slerpQuaternion', () => {
    it('should interpolate quaternions', () => {
      const q1 = new Quaternion();
      const q2 = new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI);
      
      const mid = slerpQuaternion(q1, q2, 0.5);

      expect(mid).toBeDefined();
    });

    it('should not mutate original quaternions', () => {
      const q1 = new Quaternion();
      const q2 = new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI);
      
      const originalW = q1.w;
      
      slerpQuaternion(q1, q2, 0.5);

      expect(q1.w).toBe(originalW);
    });
  });

  describe('interpolateTransform', () => {
    it('should interpolate transforms', () => {
      const from = Transform3D.identity();
      const to = Transform3D.identity().translate(100, 100, 100);
      
      const mid = interpolateTransform(from, to, 0.5);

      expect(mid.position.x).toBeCloseTo(50, 5);
      expect(mid.position.y).toBeCloseTo(50, 5);
      expect(mid.position.z).toBeCloseTo(50, 5);
    });

    it('should apply easing function', () => {
      const from = Transform3D.identity();
      const to = Transform3D.identity().translate(100, 0, 0);
      
      const easing = (t: number) => t * t;
      
      const result = interpolateTransform(from, to, 0.5, easing);

      expect(result.position.x).toBeCloseTo(25, 5);
    });

    it('should interpolate all components', () => {
      const from = Transform3D.fromEuler(
        0, 0, 0,
        new Vector3(0, 0, 0),
        new Vector3(1, 1, 1)
      );
      
      const to = Transform3D.fromEuler(
        Math.PI / 2, 0, 0,
        new Vector3(100, 100, 100),
        new Vector3(3, 3, 3)
      );
      
      const mid = interpolateTransform(from, to, 0.5);

      expect(mid.position.x).toBeCloseTo(50, 5);
      expect(mid.scale.x).toBeCloseTo(2, 5);
    });
  });

  describe('interpolateTransformKeyframes', () => {
    it('should return identity for empty keyframes', () => {
      const result = interpolateTransformKeyframes([], 0.5);
      
      expect(result.position.x).toBe(0);
      expect(result.position.y).toBe(0);
      expect(result.position.z).toBe(0);
    });

    it('should return single keyframe', () => {
      const keyframe = Transform3D.identity().translate(10, 20, 30);
      const result = interpolateTransformKeyframes([keyframe], 0.5);
      
      expect(result.position.x).toBe(10);
      expect(result.position.y).toBe(20);
      expect(result.position.z).toBe(30);
    });

    it('should interpolate between two keyframes', () => {
      const k1 = Transform3D.identity().translate(0, 0, 0);
      const k2 = Transform3D.identity().translate(100, 100, 100);
      
      const result = interpolateTransformKeyframes([k1, k2], 0.5);

      expect(result.position.x).toBeCloseTo(50, 5);
      expect(result.position.y).toBeCloseTo(50, 5);
      expect(result.position.z).toBeCloseTo(50, 5);
    });

    it('should interpolate between multiple keyframes', () => {
      const k1 = Transform3D.identity().translate(0, 0, 0);
      const k2 = Transform3D.identity().translate(50, 50, 50);
      const k3 = Transform3D.identity().translate(100, 100, 100);
      
      const result = interpolateTransformKeyframes([k1, k2, k3], 0.5);

      expect(result.position.x).toBeCloseTo(50, 5);
      expect(result.position.y).toBeCloseTo(50, 5);
      expect(result.position.z).toBeCloseTo(50, 5);
    });

    it('should handle progress at start', () => {
      const k1 = Transform3D.identity().translate(0, 0, 0);
      const k2 = Transform3D.identity().translate(100, 100, 100);
      
      const result = interpolateTransformKeyframes([k1, k2], 0);

      expect(result.position.x).toBe(0);
    });

    it('should handle progress at end', () => {
      const k1 = Transform3D.identity().translate(0, 0, 0);
      const k2 = Transform3D.identity().translate(100, 100, 100);
      
      const result = interpolateTransformKeyframes([k1, k2], 1);

      expect(result.position.x).toBe(100);
    });

    it('should clamp progress beyond bounds', () => {
      const k1 = Transform3D.identity().translate(0, 0, 0);
      const k2 = Transform3D.identity().translate(100, 100, 100);
      
      const resultBefore = interpolateTransformKeyframes([k1, k2], -0.5);
      const resultAfter = interpolateTransformKeyframes([k1, k2], 1.5);

      expect(resultBefore.position.x).toBe(0);
      expect(resultAfter.position.x).toBe(100);
    });

    it('should apply easing function', () => {
      const k1 = Transform3D.identity().translate(0, 0, 0);
      const k2 = Transform3D.identity().translate(100, 0, 0);
      
      const easing = (t: number) => t * t;
      
      const result = interpolateTransformKeyframes([k1, k2], 0.5, easing);

      expect(result.position.x).toBeCloseTo(25, 5);
    });
  });

  describe('CSS Conversion', () => {
    it('should convert matrix to CSS', () => {
      const transform = Transform3D.identity().translate(10, 20, 30);
      const matrix = transform.toMatrix4();
      const css = matrixToCSS(matrix);
      
      expect(css).toContain('matrix3d');
      expect(css).toMatch(/matrix3d\([^)]+\)/);
    });

    it('should convert transform to CSS', () => {
      const transform = Transform3D.identity().translate(10, 20, 30);
      const css = transformToCSS(transform);
      
      expect(css).toContain('matrix3d');
      expect(css).toMatch(/matrix3d\([^)]+\)/);
    });

    it('should include all matrix elements', () => {
      const transform = Transform3D.identity();
      const css = transformToCSS(transform);
      
      const elements = css.match(/matrix3d\(([^)]+)\)/)?.[1].split(',');
      expect(elements).toHaveLength(16);
    });
  });
});
