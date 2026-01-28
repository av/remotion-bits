import { random } from "remotion";
import { type Particle, type SpawnerConfig, type BehaviorConfig } from "./types";
import { movement } from "./behaviors";

interface SimulationConfig {
  frame: number;
  fps: number;
  spawners: SpawnerConfig[];
  behaviors: BehaviorConfig[];
}

/**
 * Deterministically simulates particles for the current frame.
 *
 * Strategy:
 * 1. For each spawner, calculate how many particles *would have been born* by now.
 * 2. Filter out those that would have died by now.
 * 3. For the survivors, re-simulate their state from birth to current frame.
 *    (This "replay" ensures determinism without storing state).
 */
export function simulateParticles({
  frame,
  fps,
  spawners,
  behaviors,
}: SimulationConfig): Particle[] {
  const activeParticles: Particle[] = [];

  for (const spawner of spawners) {
    // ------------------------------------------------------------------------
    // 1. Determine Particle Count
    // ------------------------------------------------------------------------
    // Apply spawner-specific startFrame offset
    // This makes this spawner appear as if it has been running for startFrame frames
    const spawnerStartFrame = spawner.startFrame || 0;
    const spawnerFrame = frame + spawnerStartFrame;

    let totalBorn = 0;
    let birthFn: (index: number) => number; // Returns birth frame for index I

    // burst and rate are non-exclusive - they can both be active
    const burst = spawner.burst || 0;
    const rate = spawner.rate || 0;

    // Calculate total particles: burst (all at frame 0) + rate-based particles
    const burstParticles = spawnerFrame >= 0 ? burst : 0;
    const rateParticles = rate > 0 ? Math.floor(Math.max(0, spawnerFrame) * rate) : 0;
    totalBorn = burstParticles + rateParticles;

    // Birth function:
    // - Particles with index < burst are born at frame 0 (burst particles)
    // - Particles with index >= burst are born based on rate
    birthFn = (i) => {
      if (i < burst) {
        return 0; // Burst particles born at frame 0
      }
      return (i - burst) / rate; // Rate-based particles
    };

    // ------------------------------------------------------------------------
    // 2. Iterate Potential Candidates
    //    Optimization: Start from the newest (highest index) and go back
    //    Stop when particle is too old.
    // ------------------------------------------------------------------------

    // Calculate the maximum possible lifespan for any particle from this spawner
    // This allows us to safely break the loop when age exceeds this maximum
    const variance = spawner.lifespanVariance || 0;
    const baseLifespan = spawner.lifespan || 60;
    const maxPossibleLifespan = baseLifespan + variance;

    // Track active particle count for max limit enforcement
    let activeCount = 0;
    const maxLimit = spawner.max;

    for (let i = totalBorn - 1; i >= 0; i--) {
      const birthFrame = birthFn(i);
      const age = spawnerFrame - birthFrame;

      // Early exit optimization: Since we iterate backwards (newest to oldest),
      // if this particle's age exceeds the maximum possible lifespan, all older
      // particles must also be dead. Safe to break.
      if (age > maxPossibleLifespan) {
        break;
      }

      // Calculate specific lifespan for this particle
      // We seed based on spawner+index to keep it consistent
      const seed = random(`${spawner.id}-${i}`);
      const actualLifespan = baseLifespan + (random(`life-${seed}`) - 0.5) * 2 * variance;

      // Skip this particle if it's dead
      if (age >= actualLifespan) {
        continue;
      }

      if (age < 0) continue; // Should not happen with current logic but safe guard

      // ----------------------------------------------------------------------
      // 3. Initialize Particle State (Birth)
      // ----------------------------------------------------------------------

      // Initial Position
      const spawnerPos = spawner.position || {};
      const spawnerX = spawnerPos.x || 0;
      const spawnerY = spawnerPos.y || 0;
      const spawnerZ = spawnerPos.z || 0;

      const area = spawner.area || { width: 0, height: 0 };
      const areaWidth = area.width || 0;
      const areaHeight = area.height || 0;
      const areaDepth = area.depth || 0;

      // Random position within area (Rect by default)
      const posX = spawnerX + (random(`x-${seed}`) - 0.5) * areaWidth;
      const posY = spawnerY + (random(`y-${seed}`) - 0.5) * areaHeight;
      const posZ = spawnerZ + (random(`z-${seed}`) - 0.5) * areaDepth;

      // Initial Velocity
      const velConfig = spawner.velocity || { x: 0, y: 0 };
      const vVarX = velConfig.varianceX || 0;
      const vVarY = velConfig.varianceY || 0;
      const vVarZ = velConfig.varianceZ || 0;

      const velX = velConfig.x + (random(`vx-${seed}`) - 0.5) * 2 * vVarX;
      const velY = velConfig.y + (random(`vy-${seed}`) - 0.5) * 2 * vVarY;
      const velZ = (velConfig.z || 0) + (random(`vz-${seed}`) - 0.5) * 2 * vVarZ;

      const particle: Particle = {
        id: `${spawner.id}-${i}`,
        index: i,
        seed,
        birthFrame,
        lifespan: actualLifespan,
        spawnerId: spawner.id,
        position: { x: posX, y: posY, z: posZ },
        velocity: { x: velX, y: velY, z: velZ },
        acceleration: { x: 0, y: 0, z: 0 },
        scale: 1,
        rotation: 0,
        opacity: 1,
      };

      // ----------------------------------------------------------------------
      // 4. Run Simulation Loop (Replay)
      //    Run 1 step for each frame of age.
      // ----------------------------------------------------------------------
      // Note: We use integer steps for consistency.
      const steps = Math.floor(age);

      // Optimization: If NO custom movement behaviors, we can use closed form.
      // But we always enabled behaviors for now.

      for (let t = 0; t <= steps; t++) {
        // Apply all configured behaviors
        for (const behavior of behaviors) {
            behavior.handler(particle, t, { frame: spawnerFrame, fps });
        }
        // Apply standard physics (velocity -> position)
        movement(particle, t, { frame: spawnerFrame, fps });
      }

      // Add INTERPOLATION?
      // If frame is 10.5, we constructed state at 10.
      // We could add partial step. For now, we assume integer frames.

      // Check max limit before adding particle
      if (maxLimit !== undefined && activeCount >= maxLimit) {
        // Skip this particle if we've reached the max limit
        // Since we iterate from newest to oldest, this ensures we keep the newest particles
        continue;
      }

      activeParticles.push(particle);
      activeCount++;
    }
  }

  // Sort by birth (oldest first? or newest on top?)
  // Usually newer on top -> Painter's algorithm
  return activeParticles.sort((a,b) => a.birthFrame - b.birthFrame);
}
