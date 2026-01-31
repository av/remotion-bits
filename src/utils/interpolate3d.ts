import { Vector3, Quaternion, Matrix4 } from 'three';
import { Transform3D } from './transform3d';
import type { EasingFunction } from './interpolate';

export function lerpVector3(v1: Vector3, v2: Vector3, alpha: number): Vector3 {
  return v1.clone().lerp(v2, alpha);
}

export function slerpQuaternion(q1: Quaternion, q2: Quaternion, alpha: number): Quaternion {
  return q1.clone().slerp(q2, alpha);
}

export function interpolateTransform(
  from: Transform3D,
  to: Transform3D,
  progress: number,
  easing?: EasingFunction
): Transform3D {
  const t = easing ? easing(progress) : progress;
  return from.lerp(to, t);
}

export function interpolateTransformKeyframes(
  keyframes: Transform3D[],
  progress: number,
  easing?: EasingFunction
): Transform3D {
  if (keyframes.length === 0) {
    return Transform3D.identity();
  }

  if (keyframes.length === 1) {
    return keyframes[0].clone();
  }

  if (progress <= 0) {
    return keyframes[0].clone();
  }

  if (progress >= 1) {
    return keyframes[keyframes.length - 1].clone();
  }

  const segmentCount = keyframes.length - 1;
  const segmentProgress = progress * segmentCount;
  const segmentIndex = Math.floor(segmentProgress);
  const localProgress = segmentProgress - segmentIndex;

  if (segmentIndex >= segmentCount) {
    return keyframes[keyframes.length - 1].clone();
  }

  const from = keyframes[segmentIndex];
  const to = keyframes[segmentIndex + 1];

  return interpolateTransform(from, to, localProgress, easing);
}

export function matrixToCSS(matrix: Matrix4): string {
  const elements = matrix.elements.map((x) => (Math.abs(x) < 1.0e-6 ? 0 : x));
  return `matrix3d(${elements.join(',')})`;
}

export function transformToCSS(transform: Transform3D): string {
  return matrixToCSS(transform.toMatrix4());
}

export function decomposeMatrix(matrix: Matrix4): {
  position: Vector3;
  rotation: Quaternion;
  scale: Vector3;
} {
  const position = new Vector3();
  const rotation = new Quaternion();
  const scale = new Vector3();
  matrix.decompose(position, rotation, scale);

  return { position, rotation, scale };
}

export { Vector3, Quaternion, Matrix4 };
