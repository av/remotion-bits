import { random } from "remotion";
import type { Particle, ParticleBehaviorHandler } from "./types";

/**
 * Standard Euler integration step.
 * Should usually be the LAST behavior in the stack.
 */
export const movement: ParticleBehaviorHandler = (p) => {
  p.velocity.x += p.acceleration.x;
  p.velocity.y += p.acceleration.y;
  p.position.x += p.velocity.x;
  p.position.y += p.velocity.y;
  // Reset acceleration - forces must be re-applied each frame
  p.acceleration.x = 0;
  p.acceleration.y = 0;
};

/**
 * Applies a constant force (like Gravity).
 *
 * @param force - Base force vector
 * @param force.x - Horizontal force
 * @param force.y - Vertical force
 * @param force.varianceX - Random variance for X force (±variance/2)
 * @param force.varianceY - Random variance for Y force (±variance/2)
 *
 * @example
 * // Gravity with no variance
 * createGravity({ y: 0.5 })
 *
 * @example
 * // Gravity with variance - each particle gets slightly different gravity
 * createGravity({ y: 0.5, varianceY: 0.2 })
 * // Particles will have gravity between 0.4 and 0.6
 */
export const createGravity = (force: {
  x?: number;
  y?: number;
  varianceX?: number;
  varianceY?: number;
}): ParticleBehaviorHandler => {
  const perParticleForce = new Map<string, { x: number; y: number }>();

  return (p) => {
    // Calculate per-particle force on first encounter
    if (!perParticleForce.has(p.id)) {
      const varX = force.varianceX || 0;
      const varY = force.varianceY || 0;

      const forceX = (force.x || 0) + (random(`gravity-x-${p.seed}`) - 0.5) * 2 * varX;
      const forceY = (force.y || 0) + (random(`gravity-y-${p.seed}`) - 0.5) * 2 * varY;

      perParticleForce.set(p.id, { x: forceX, y: forceY });
    }

    const particleForce = perParticleForce.get(p.id)!;
    p.acceleration.x += particleForce.x;
    p.acceleration.y += particleForce.y;
  };
};

/**
 * Applies drag/friction.
 *
 * @param factor - Drag factor (0.9 means 10% speed loss per frame)
 * @param variance - Random variance for drag factor (±variance/2)
 *
 * @example
 * // Uniform drag
 * createDrag(0.95)
 *
 * @example
 * // Drag with variance - each particle gets slightly different drag
 * createDrag(0.95, 0.05)
 * // Particles will have drag between 0.925 and 0.975
 */
export const createDrag = (factor: number, variance?: number): ParticleBehaviorHandler => {
  if (!variance) {
    // Fast path: no variance, no per-particle tracking needed
    return (p) => {
      p.velocity.x *= factor;
      p.velocity.y *= factor;
    };
  }

  const perParticleDrag = new Map<string, number>();

  return (p) => {
    // Calculate per-particle drag on first encounter
    if (!perParticleDrag.has(p.id)) {
      const drag = factor + (random(`drag-${p.seed}`) - 0.5) * 2 * variance;
      perParticleDrag.set(p.id, drag);
    }

    const particleDrag = perParticleDrag.get(p.id)!;
    p.velocity.x *= particleDrag;
    p.velocity.y *= particleDrag;
  };
};

/**
 * Applies random noise to velocity.
 *
 * @param magnitude - Base magnitude of the wiggle effect
 * @param frequency - Probability of applying wiggle each frame (0-1)
 * @param magnitudeVariance - Random variance for magnitude per particle (±variance/2)
 *
 * @example
 * // Uniform wiggle
 * createWiggle(0.5, 0.3)
 *
 * @example
 * // Wiggle with per-particle magnitude variance
 * createWiggle(0.5, 0.3, 0.2)
 * // Each particle will have magnitude between 0.4 and 0.6
 */
export const createWiggle = (
  magnitude: number,
  frequency: number = 0.5,
  magnitudeVariance?: number
): ParticleBehaviorHandler => {
  if (!magnitudeVariance) {
    // Fast path: no variance, no per-particle tracking needed
    return (p, age) => {
      const noiseX = (random(`wiggle-x-${p.seed}-${age}`) - 0.5) * 2;
      const noiseY = (random(`wiggle-y-${p.seed}-${age}`) - 0.5) * 2;

      if (random(`wiggle-freq-${p.seed}-${age}`) < frequency) {
        p.velocity.x += noiseX * magnitude;
        p.velocity.y += noiseY * magnitude;
      }
    };
  }

  const perParticleMagnitude = new Map<string, number>();

  return (p, age) => {
    // Calculate per-particle magnitude on first encounter
    if (!perParticleMagnitude.has(p.id)) {
      const mag = magnitude + (random(`wiggle-mag-${p.seed}`) - 0.5) * 2 * magnitudeVariance;
      perParticleMagnitude.set(p.id, mag);
    }

    const particleMagnitude = perParticleMagnitude.get(p.id)!;
    const noiseX = (random(`wiggle-x-${p.seed}-${age}`) - 0.5) * 2;
    const noiseY = (random(`wiggle-y-${p.seed}-${age}`) - 0.5) * 2;

    if (random(`wiggle-freq-${p.seed}-${age}`) < frequency) {
      p.velocity.x += noiseX * particleMagnitude;
      p.velocity.y += noiseY * particleMagnitude;
    }
  };
};

/**
 * Modulates opacity over life.
 *
 * @param keyframes - Opacity values [start, end]
 * @param startVariance - Random variance for start opacity (±variance/2)
 * @param endVariance - Random variance for end opacity (±variance/2)
 *
 * @example
 * // Uniform fade out
 * createOpacityOverLife([1, 0])
 *
 * @example
 * // Fade with variance - each particle has slightly different start/end
 * createOpacityOverLife([1, 0], 0.2, 0.1)
 * // Start opacity will be between 0.9-1.0, end between 0-0.05
 */
export const createOpacityOverLife = (
  keyframes: number[],
  startVariance?: number,
  endVariance?: number
): ParticleBehaviorHandler => {
  if (!startVariance && !endVariance) {
    // Fast path: no variance
    return (p, age) => {
      const lifeProgress = age / p.lifespan;
      if (keyframes.length === 2) {
        p.opacity = keyframes[0] + (keyframes[1] - keyframes[0]) * lifeProgress;
      }
    };
  }

  const perParticleKeyframes = new Map<string, [number, number]>();

  return (p, age) => {
    // Calculate per-particle keyframes on first encounter
    if (!perParticleKeyframes.has(p.id)) {
      const startVar = startVariance || 0;
      const endVar = endVariance || 0;

      const start = keyframes[0] + (random(`opacity-start-${p.seed}`) - 0.5) * 2 * startVar;
      const end = keyframes[1] + (random(`opacity-end-${p.seed}`) - 0.5) * 2 * endVar;

      // Clamp to valid opacity range [0, 1]
      perParticleKeyframes.set(p.id, [
        Math.max(0, Math.min(1, start)),
        Math.max(0, Math.min(1, end))
      ]);
    }

    const [start, end] = perParticleKeyframes.get(p.id)!;
    const lifeProgress = age / p.lifespan;
    if (keyframes.length === 2) {
      p.opacity = start + (end - start) * lifeProgress;
    }
  };
};

/**
 * Scales over life.
 *
 * @param start - Starting scale value
 * @param end - Ending scale value
 * @param startVariance - Random variance for start scale (±variance/2)
 * @param endVariance - Random variance for end scale (±variance/2)
 *
 * @example
 * // Uniform scale
 * createScaleOverLife(1, 0)
 *
 * @example
 * // Scale with variance - each particle has slightly different start/end
 * createScaleOverLife(1, 0, 0.2, 0.1)
 * // Start scale will be between 0.9-1.1, end between 0-0.05
 */
export const createScaleOverLife = (
  start: number,
  end: number,
  startVariance?: number,
  endVariance?: number
): ParticleBehaviorHandler => {
  if (!startVariance && !endVariance) {
    // Fast path: no variance
    return (p, age) => {
      const lifeProgress = age / p.lifespan;
      p.scale = start + (end - start) * lifeProgress;
    };
  }

  const perParticleScale = new Map<string, { start: number; end: number }>();

  return (p, age) => {
    // Calculate per-particle scale on first encounter
    if (!perParticleScale.has(p.id)) {
      const startVar = startVariance || 0;
      const endVar = endVariance || 0;

      const startScale = start + (random(`scale-start-${p.seed}`) - 0.5) * 2 * startVar;
      const endScale = end + (random(`scale-end-${p.seed}`) - 0.5) * 2 * endVar;

      perParticleScale.set(p.id, { start: startScale, end: endScale });
    }

    const { start: particleStart, end: particleEnd } = perParticleScale.get(p.id)!;
    const lifeProgress = age / p.lifespan;
    p.scale = particleStart + (particleEnd - particleStart) * lifeProgress;
  };
};
