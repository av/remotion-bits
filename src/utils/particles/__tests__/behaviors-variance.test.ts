import { describe, it, expect } from "vitest";
import {
  createGravity,
  createDrag,
  createWiggle,
  createOpacityOverLife,
  createScaleOverLife,
} from "../behaviors";
import type { Particle } from "../types";

/**
 * Helper to create a test particle
 */
function createTestParticle(id: string, seed: number): Particle {
  return {
    id,
    index: 0,
    seed,
    birthFrame: 0,
    lifespan: 60,
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
    opacity: 1,
    spawnerId: "test",
  };
}

describe("Behavior Variance", () => {
  describe("createGravity with variance", () => {
    it("should apply consistent per-particle gravity with variance", () => {
      const behavior = createGravity({ y: 1.0, varianceY: 0.2 });

      const particle1 = createTestParticle("p1", 0.1);
      const particle2 = createTestParticle("p2", 0.9);

      // Apply behavior multiple times to same particle
      behavior(particle1, 0, { frame: 0, fps: 30 });
      const firstGravity1 = particle1.acceleration.y;

      particle1.acceleration.y = 0; // Reset
      behavior(particle1, 1, { frame: 1, fps: 30 });
      const secondGravity1 = particle1.acceleration.y;

      // Should be consistent across frames for same particle
      expect(firstGravity1).toBe(secondGravity1);

      // Different particles should get different values (with high probability)
      behavior(particle2, 0, { frame: 0, fps: 30 });
      const gravity2 = particle2.acceleration.y;

      expect(gravity2).not.toBe(firstGravity1);

      // Both should be within variance range [0.9, 1.1]
      expect(firstGravity1).toBeGreaterThanOrEqual(0.8);
      expect(firstGravity1).toBeLessThanOrEqual(1.2);
      expect(gravity2).toBeGreaterThanOrEqual(0.8);
      expect(gravity2).toBeLessThanOrEqual(1.2);
    });

    it("should work without variance (backward compatible)", () => {
      const behavior = createGravity({ y: 1.0 });

      const particle1 = createTestParticle("p1", 0.1);
      const particle2 = createTestParticle("p2", 0.9);

      behavior(particle1, 0, { frame: 0, fps: 30 });
      behavior(particle2, 0, { frame: 0, fps: 30 });

      // Without variance, all particles should have same gravity
      expect(particle1.acceleration.y).toBe(1.0);
      expect(particle2.acceleration.y).toBe(1.0);
    });
  });

  describe("createDrag with variance", () => {
    it("should apply consistent per-particle drag with variance", () => {
      const behavior = createDrag(0.95, 0.05);

      const particle1 = createTestParticle("p1", 0.1);
      particle1.velocity.x = 10;
      particle1.velocity.y = 10;

      const particle2 = createTestParticle("p2", 0.9);
      particle2.velocity.x = 10;
      particle2.velocity.y = 10;

      behavior(particle1, 0, { frame: 0, fps: 30 });
      const velocity1AfterFrame1 = particle1.velocity.x;

      behavior(particle1, 1, { frame: 1, fps: 30 });
      const velocity1AfterFrame2 = particle1.velocity.x;

      // Calculate the drag factor from velocity change
      const drag1 = velocity1AfterFrame2 / velocity1AfterFrame1;

      behavior(particle2, 0, { frame: 0, fps: 30 });
      behavior(particle2, 1, { frame: 1, fps: 30 });
      const drag2 = particle2.velocity.x / 10;

      // Different particles should have different drag (with high probability)
      expect(drag1).not.toBe(drag2);

      // Both should be within variance range [0.925, 0.975]
      expect(drag1).toBeGreaterThanOrEqual(0.9);
      expect(drag1).toBeLessThanOrEqual(1.0);
      expect(drag2).toBeGreaterThanOrEqual(0.9);
      expect(drag2).toBeLessThanOrEqual(1.0);
    });

    it("should work without variance (backward compatible)", () => {
      const behavior = createDrag(0.95);

      const particle1 = createTestParticle("p1", 0.1);
      particle1.velocity.x = 10;

      const particle2 = createTestParticle("p2", 0.9);
      particle2.velocity.x = 10;

      behavior(particle1, 0, { frame: 0, fps: 30 });
      behavior(particle2, 0, { frame: 0, fps: 30 });

      // Without variance, all particles should have same drag
      expect(particle1.velocity.x).toBe(9.5);
      expect(particle2.velocity.x).toBe(9.5);
    });
  });

  describe("createWiggle with variance", () => {
    it("should apply consistent per-particle magnitude with variance", () => {
      const behavior = createWiggle(1.0, 1.0, 0.2); // frequency=1 means always apply

      const particle1 = createTestParticle("p1", 0.1);
      const particle2 = createTestParticle("p2", 0.9);

      // Apply behavior and record velocity changes
      behavior(particle1, 0, { frame: 0, fps: 30 });
      const velocityChange1 = Math.abs(particle1.velocity.x) + Math.abs(particle1.velocity.y);

      behavior(particle2, 0, { frame: 0, fps: 30 });
      const velocityChange2 = Math.abs(particle2.velocity.x) + Math.abs(particle2.velocity.y);

      // Both should have some velocity change
      expect(velocityChange1).toBeGreaterThan(0);
      expect(velocityChange2).toBeGreaterThan(0);

      // They should likely be different (magnitude variance)
      // Note: Due to randomness, they could be similar, but with 0.2 variance they should differ
      expect(Math.abs(velocityChange1 - velocityChange2)).toBeGreaterThan(0);
    });

    it("should work without variance (backward compatible)", () => {
      const behavior = createWiggle(1.0, 1.0);

      const particle = createTestParticle("p1", 0.1);

      // Should not throw and should apply wiggle
      behavior(particle, 0, { frame: 0, fps: 30 });

      expect(Math.abs(particle.velocity.x) + Math.abs(particle.velocity.y)).toBeGreaterThan(0);
    });
  });

  describe("createOpacityOverLife with variance", () => {
    it("should apply consistent per-particle opacity with variance", () => {
      const behavior = createOpacityOverLife([1.0, 0.0], 0.1, 0.1);

      const particle1 = createTestParticle("p1", 0.1);
      const particle2 = createTestParticle("p2", 0.9);

      // At start of life
      behavior(particle1, 0, { frame: 0, fps: 30 });
      const startOpacity1 = particle1.opacity;

      behavior(particle2, 0, { frame: 0, fps: 30 });
      const startOpacity2 = particle2.opacity;

      // Different particles should have different start opacity (with high probability)
      expect(startOpacity1).not.toBe(startOpacity2);

      // Both should be within variance range [0.95, 1.05] but clamped to [0, 1]
      expect(startOpacity1).toBeGreaterThanOrEqual(0);
      expect(startOpacity1).toBeLessThanOrEqual(1);
      expect(startOpacity2).toBeGreaterThanOrEqual(0);
      expect(startOpacity2).toBeLessThanOrEqual(1);

      // Apply again to same particle - should be consistent
      particle1.opacity = 1; // Reset
      behavior(particle1, 0, { frame: 0, fps: 30 });
      expect(particle1.opacity).toBe(startOpacity1);
    });

    it("should work without variance (backward compatible)", () => {
      const behavior = createOpacityOverLife([1.0, 0.0]);

      const particle1 = createTestParticle("p1", 0.1);
      particle1.lifespan = 100;

      const particle2 = createTestParticle("p2", 0.9);
      particle2.lifespan = 100;

      // At start
      behavior(particle1, 0, { frame: 0, fps: 30 });
      behavior(particle2, 0, { frame: 0, fps: 30 });

      // Without variance, both should have same opacity
      expect(particle1.opacity).toBe(1.0);
      expect(particle2.opacity).toBe(1.0);

      // At end
      behavior(particle1, 100, { frame: 100, fps: 30 });
      behavior(particle2, 100, { frame: 100, fps: 30 });

      expect(particle1.opacity).toBe(0.0);
      expect(particle2.opacity).toBe(0.0);
    });
  });

  describe("createScaleOverLife with variance", () => {
    it("should apply consistent per-particle scale with variance", () => {
      const behavior = createScaleOverLife(1.0, 0.0, 0.2, 0.1);

      const particle1 = createTestParticle("p1", 0.1);
      const particle2 = createTestParticle("p2", 0.9);

      // At start of life
      behavior(particle1, 0, { frame: 0, fps: 30 });
      const startScale1 = particle1.scale;

      behavior(particle2, 0, { frame: 0, fps: 30 });
      const startScale2 = particle2.scale;

      // Different particles should have different start scale (with high probability)
      expect(startScale1).not.toBe(startScale2);

      // Both should be within variance range
      expect(startScale1).toBeGreaterThanOrEqual(0.8);
      expect(startScale1).toBeLessThanOrEqual(1.2);
      expect(startScale2).toBeGreaterThanOrEqual(0.8);
      expect(startScale2).toBeLessThanOrEqual(1.2);

      // Apply again to same particle - should be consistent
      particle1.scale = 1; // Reset
      behavior(particle1, 0, { frame: 0, fps: 30 });
      expect(particle1.scale).toBe(startScale1);
    });

    it("should work without variance (backward compatible)", () => {
      const behavior = createScaleOverLife(1.0, 0.5);

      const particle1 = createTestParticle("p1", 0.1);
      particle1.lifespan = 100;

      const particle2 = createTestParticle("p2", 0.9);
      particle2.lifespan = 100;

      // At start
      behavior(particle1, 0, { frame: 0, fps: 30 });
      behavior(particle2, 0, { frame: 0, fps: 30 });

      // Without variance, both should have same scale
      expect(particle1.scale).toBe(1.0);
      expect(particle2.scale).toBe(1.0);

      // At midpoint
      behavior(particle1, 50, { frame: 50, fps: 30 });
      behavior(particle2, 50, { frame: 50, fps: 30 });

      expect(particle1.scale).toBe(0.75);
      expect(particle2.scale).toBe(0.75);
    });
  });
});
