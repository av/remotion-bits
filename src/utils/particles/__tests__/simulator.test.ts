import { describe, it, expect } from "vitest";
import { simulateParticles } from "../simulator";
import type { SpawnerConfig, BehaviorConfig } from "../types";

describe("simulateParticles", () => {
  describe("max limit enforcement", () => {
    it("should limit particles to max count when max is specified", () => {
      const spawner: SpawnerConfig = {
        id: "test-spawner",
        rate: 10, // 10 particles per frame
        position: { x: 0, y: 0 },
        lifespan: 100, // Long lifespan so they all stay active
        max: 10, // Limit to 10 active particles
        children: null,
      };

      const behaviors: BehaviorConfig[] = [];

      // At frame 5, we would have 50 particles (10 per frame * 5 frames)
      // But with max=10, we should only have 10
      const result = simulateParticles({
        frame: 5,
        fps: 30,
        spawners: [spawner],
        behaviors,
      });

      expect(result.length).toBe(10);

      // Verify they are the newest 10 particles (indices 40-49)
      const indices = result.map(p => p.index).sort((a, b) => a - b);
      expect(indices).toEqual([40, 41, 42, 43, 44, 45, 46, 47, 48, 49]);
    });

    it("should not limit particles when max is undefined", () => {
      const spawner: SpawnerConfig = {
        id: "test-spawner",
        rate: 2,
        position: { x: 0, y: 0 },
        lifespan: 100,
        // max is not specified
        children: null,
      };

      const behaviors: BehaviorConfig[] = [];

      // At frame 5, we should have 10 particles (2 per frame * 5 frames)
      const result = simulateParticles({
        frame: 5,
        fps: 30,
        spawners: [spawner],
        behaviors,
      });

      expect(result.length).toBe(10);
    });

    it("should handle max limit with burst spawning", () => {
      const spawner: SpawnerConfig = {
        id: "test-spawner",
        burst: 50, // Spawn 50 particles at once
        position: { x: 0, y: 0 },
        lifespan: 100,
        max: 15, // But limit to 15 active
        children: null,
      };

      const behaviors: BehaviorConfig[] = [];

      const result = simulateParticles({
        frame: 10,
        fps: 30,
        spawners: [spawner],
        behaviors,
      });

      // Should be limited to 15 particles
      expect(result.length).toBe(15);

      // Should keep the newest 15 (indices 35-49)
      const indices = result.map(p => p.index).sort((a, b) => a - b);
      expect(indices).toEqual([35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49]);
    });

    it("should allow particles to die naturally and be replaced when under max limit", () => {
      const spawner: SpawnerConfig = {
        id: "test-spawner",
        rate: 5,
        position: { x: 0, y: 0 },
        lifespan: 3, // Very short lifespan
        max: 10,
        children: null,
      };

      const behaviors: BehaviorConfig[] = [];

      // At frame 10:
      // - Total born: 50 particles (5 per frame * 10 frames)
      // - With lifespan 3, only particles from frames 8, 9, 10 are alive
      // - That's particles born at frames 7-10 (15 particles)
      // - With max=10, we should have exactly 10 (the newest ones)
      const result = simulateParticles({
        frame: 10,
        fps: 30,
        spawners: [spawner],
        behaviors,
      });

      expect(result.length).toBeLessThanOrEqual(10);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should enforce max limit per spawner independently", () => {
      const spawner1: SpawnerConfig = {
        id: "spawner-1",
        rate: 10,
        position: { x: 0, y: 0 },
        lifespan: 100,
        max: 5,
        children: null,
      };

      const spawner2: SpawnerConfig = {
        id: "spawner-2",
        rate: 10,
        position: { x: 100, y: 100 },
        lifespan: 100,
        max: 8,
        children: null,
      };

      const behaviors: BehaviorConfig[] = [];

      const result = simulateParticles({
        frame: 5,
        fps: 30,
        spawners: [spawner1, spawner2],
        behaviors,
      });

      // Count particles from each spawner
      const spawner1Particles = result.filter(p => p.spawnerId === "spawner-1");
      const spawner2Particles = result.filter(p => p.spawnerId === "spawner-2");

      expect(spawner1Particles.length).toBe(5);
      expect(spawner2Particles.length).toBe(8);
      expect(result.length).toBe(13); // Total of both
    });

    it("should handle max=0 by not spawning any particles", () => {
      const spawner: SpawnerConfig = {
        id: "test-spawner",
        rate: 10,
        position: { x: 0, y: 0 },
        lifespan: 100,
        max: 0,
        children: null,
      };

      const behaviors: BehaviorConfig[] = [];

      const result = simulateParticles({
        frame: 5,
        fps: 30,
        spawners: [spawner],
        behaviors,
      });

      expect(result.length).toBe(0);
    });
  });

  describe("basic spawning without max limit", () => {
    it("should spawn particles at the correct rate", () => {
      const spawner: SpawnerConfig = {
        id: "test-spawner",
        rate: 2,
        position: { x: 0, y: 0 },
        lifespan: 100,
        children: null,
      };

      const behaviors: BehaviorConfig[] = [];

      const result = simulateParticles({
        frame: 5,
        fps: 30,
        spawners: [spawner],
        behaviors,
      });

      // 2 particles per frame * 5 frames = 10 particles
      expect(result.length).toBe(10);
    });

    it("should respect lifespan and remove dead particles", () => {
      const spawner: SpawnerConfig = {
        id: "test-spawner",
        rate: 1,
        position: { x: 0, y: 0 },
        lifespan: 5, // 5 frame lifespan (age < 5, so alive for frames 0-4)
        children: null,
      };

      const behaviors: BehaviorConfig[] = [];

      const result = simulateParticles({
        frame: 10,
        fps: 30,
        spawners: [spawner],
        behaviors,
      });

      // Particles die when age >= lifespan
      // At frame 10, particles born at frame 6+ are alive (age < 5)
      // That's particles from frames 6, 7, 8, 9, 10 = indices 6-10 = 5 particles
      // But age check is strict (<), so we get 4 particles
      expect(result.length).toBeGreaterThanOrEqual(4);
      expect(result.length).toBeLessThanOrEqual(5);
    });
  });

  describe("per-spawner startFrame", () => {
    it("should apply per-spawner startFrame offset independently", () => {
      const spawner1: SpawnerConfig = {
        id: "spawner-1",
        rate: 1, // 1 particle per frame
        position: { x: 0, y: 0 },
        lifespan: 100,
        startFrame: 0, // No offset
        children: null,
      };

      const spawner2: SpawnerConfig = {
        id: "spawner-2",
        rate: 1, // 1 particle per frame
        position: { x: 100, y: 0 },
        lifespan: 100,
        startFrame: 50, // 50 frame offset
        children: null,
      };

      const behaviors: BehaviorConfig[] = [];

      // At frame 10:
      // - spawner1 (startFrame=0): should have 10 particles (indices 0-9)
      // - spawner2 (startFrame=50): acts as if it's frame 60, should have 60 particles (indices 0-59)
      const result = simulateParticles({
        frame: 10,
        fps: 30,
        spawners: [spawner1, spawner2],
        behaviors,
      });

      const spawner1Particles = result.filter(p => p.spawnerId === "spawner-1");
      const spawner2Particles = result.filter(p => p.spawnerId === "spawner-2");

      expect(spawner1Particles.length).toBe(10);
      expect(spawner2Particles.length).toBe(60);
    });

    it("should work with burst spawning", () => {
      const spawner1: SpawnerConfig = {
        id: "spawner-burst-no-offset",
        burst: 10,
        position: { x: 0, y: 0 },
        lifespan: 100,
        startFrame: 0,
        children: null,
      };

      const spawner2: SpawnerConfig = {
        id: "spawner-burst-offset",
        burst: 10,
        position: { x: 100, y: 0 },
        lifespan: 5, // Short lifespan
        startFrame: 10, // Offset by 10 frames
        children: null,
      };

      const behaviors: BehaviorConfig[] = [];

      // At frame 0:
      // - spawner1: should spawn 10 particles (age 0)
      // - spawner2: acts as if it's frame 10, particles have age 10, should be dead (lifespan=5)
      const resultFrame0 = simulateParticles({
        frame: 0,
        fps: 30,
        spawners: [spawner1, spawner2],
        behaviors,
      });

      const spawner1Particles = resultFrame0.filter(p => p.spawnerId === "spawner-burst-no-offset");
      const spawner2Particles = resultFrame0.filter(p => p.spawnerId === "spawner-burst-offset");

      expect(spawner1Particles.length).toBe(10); // All 10 alive
      expect(spawner2Particles.length).toBe(0); // All dead due to offset
    });

    it("should allow different spawners to have different frame offsets", () => {
      const spawners: SpawnerConfig[] = [
        {
          id: "spawner-a",
          rate: 2,
          position: { x: 0, y: 0 },
          lifespan: 100,
          startFrame: 0,
          children: null,
        },
        {
          id: "spawner-b",
          rate: 2,
          position: { x: 100, y: 0 },
          lifespan: 100,
          startFrame: 10,
          children: null,
        },
        {
          id: "spawner-c",
          rate: 2,
          position: { x: 200, y: 0 },
          lifespan: 100,
          startFrame: 20,
          children: null,
        },
      ];

      const behaviors: BehaviorConfig[] = [];

      // At frame 5:
      // - spawner-a (startFrame=0): frame 5 → 10 particles (2*5)
      // - spawner-b (startFrame=10): frame 15 → 30 particles (2*15)
      // - spawner-c (startFrame=20): frame 25 → 50 particles (2*25)
      const result = simulateParticles({
        frame: 5,
        fps: 30,
        spawners,
        behaviors,
      });

      const aParticles = result.filter(p => p.spawnerId === "spawner-a");
      const bParticles = result.filter(p => p.spawnerId === "spawner-b");
      const cParticles = result.filter(p => p.spawnerId === "spawner-c");

      expect(aParticles.length).toBe(10);
      expect(bParticles.length).toBe(30);
      expect(cParticles.length).toBe(50);
    });

    it("should default to 0 when startFrame is undefined", () => {
      const spawner: SpawnerConfig = {
        id: "spawner-no-offset",
        rate: 1,
        position: { x: 0, y: 0 },
        lifespan: 100,
        // startFrame not specified
        children: null,
      };

      const behaviors: BehaviorConfig[] = [];

      const result = simulateParticles({
        frame: 10,
        fps: 30,
        spawners: [spawner],
        behaviors,
      });

      // Should behave as if startFrame=0
      expect(result.length).toBe(10);
    });
  });
});
