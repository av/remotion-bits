import type { MotionTransitionProps } from "../../components/MotionTransition";

// ============================================================================
// CORE DATA STRUCTURES
// ============================================================================

export interface Vector2 {
  x: number;
  y: number;
}

export interface Particle {
  // Immutable identity
  id: string;
  index: number; // The Nth particle spawned
  seed: number;  // Seed derived from index

  // Lifecycle
  birthFrame: number;
  lifespan: number;

  // Physics State (Mutable during simulation step)
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;

  // visual overrides (Mutable during simulation step)
  scale: number;
  rotation: number;
  opacity: number;

  // Linkage
  spawnerId: string;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export type SpawnerShape = "point" | "rect" | "circle";

export interface SpawnerConfig {
  id: string; // Internal ID assigned by parent

  // Timing
  rate?: number; // Particles per frame. Mutually exclusive with burst.
  burst?: number; // Particles to spawn at start.
  startFrame?: number; // Frame offset for this spawner's simulation

  // Limits
  max?: number; // Maximum number of active particles from this spawner

  // Shape & Position
  position?: Vector2; // Offset of the spawner itself
  area?: { width: number; height: number }; // For rect/circle

  // Initial Physics
  velocity?: { x: number; y: number; varianceX?: number; varianceY?: number };
  lifespan?: number;
  lifespanVariance?: number;

  // Render
  transition?: MotionTransitionProps;
  children: React.ReactNode;
}

export type ParticleBehaviorHandler = (
  particle: Particle,
  time: number, // Particle age in frames
  ctx: { frame: number; fps: number } // Global context
) => void;

export interface BehaviorConfig {
  id: string;
  handler: ParticleBehaviorHandler;
}
