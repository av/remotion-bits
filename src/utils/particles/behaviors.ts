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
 */
export const createGravity = (force: { x?: number; y?: number }): ParticleBehaviorHandler => {
  return (p) => {
    if (force.x) p.acceleration.x += force.x;
    if (force.y) p.acceleration.y += force.y;
  };
};

/**
 * Applies drag/friction.
 * factor: 0.9 means 10% speed loss per frame.
 */
export const createDrag = (factor: number): ParticleBehaviorHandler => {
  return (p) => {
    p.velocity.x *= factor;
    p.velocity.y *= factor;
  };
};

/**
 * Applies random noise to velocity.
 */
export const createWiggle = (magnitude: number, frequency: number = 0.5): ParticleBehaviorHandler => {
  return (p, age) => {
    // We use a specific seed for the wiggle based on particle ID and current age
    // to ensure the noise is deterministic per frame of age.
    const noiseX = (random(`wiggle-x-${p.seed}-${age}`) - 0.5) * 2;
    const noiseY = (random(`wiggle-y-${p.seed}-${age}`) - 0.5) * 2;

    if (random(`wiggle-freq-${p.seed}-${age}`) < frequency) {
        p.velocity.x += noiseX * magnitude;
        p.velocity.y += noiseY * magnitude;
    }
  };
};

/**
 * Modulates opacity over life.
 * e.g. fadeOut: [1, 0]
 */
export const createOpacityOverLife = (keyframes: number[]): ParticleBehaviorHandler => {
  return (p, age) => {
    const lifeProgress = age / p.lifespan;
    if (keyframes.length === 2) {
       p.opacity = keyframes[0] + (keyframes[1] - keyframes[0]) * lifeProgress;
    }
  };
};

/**
 * Scales over life.
 */
export const createScaleOverLife = (start: number, end: number): ParticleBehaviorHandler => {
  return (p, age) => {
    const lifeProgress = age / p.lifespan;
    p.scale = start + (end - start) * lifeProgress;
  };
};
