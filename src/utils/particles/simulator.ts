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
    let totalBorn = 0;
    let birthFn: (index: number) => number; // Returns birth frame for index I

    if (spawner.burst) {
      // All spawned at frame 0 (relative to parent container usually, but here we assume absolute)
      // If we want burst at specific time, we'd add logic. Assuming t=0 for now.
      totalBorn = frame >= 0 ? spawner.burst : 0;
      birthFn = () => 0;
    } else {
      // Continuous emission
      const rate = spawner.rate || 1;
      totalBorn = Math.floor(Math.max(0, frame) * rate);
      birthFn = (i) => i / rate;
    }

    // ------------------------------------------------------------------------
    // 2. Iterate Potential Candidates
    //    Optimization: Start from the newest (highest index) and go back
    //    Stop when particle is too old.
    // ------------------------------------------------------------------------
    for (let i = totalBorn - 1; i >= 0; i--) {
      const birthFrame = birthFn(i);
      const age = frame - birthFrame;

      // Calculate specific lifespan for this particle
      // We seed based on spawner+index to keep it consistent
      const seed = random(`${spawner.id}-${i}`);
      const variance = spawner.lifespanVariance || 0;
      const baseLifespan = spawner.lifespan || 60;
      const actualLifespan = baseLifespan + (random(`life-${seed}`) - 0.5) * 2 * variance;

      // If dead, since we iterate backwards, older particles will also be dead.
      // (Exception: high variance might keep some older ones alive, but we can usually optimized)
      // For safety with high variance, we might want to check a bit deeper,
      // but for now, strict cutoff if age is WAY past base lifespan.
      if (age >= actualLifespan) {
         // Optimization: if variance is small, we can break.
         // If variance is huge, we continue.
         if(variance < baseLifespan * 0.5) break;
         continue;
      }

      if (age < 0) continue; // Should not happen with current logic but safe guard

      // ----------------------------------------------------------------------
      // 3. Initialize Particle State (Birth)
      // ----------------------------------------------------------------------

      // Initial Position
      const spawnerPos = spawner.position || { x: 0, y: 0 };
      const area = spawner.area || { width: 0, height: 0 };

      // Random position within area (Rect by default)
      const posX = spawnerPos.x + (random(`x-${seed}`) - 0.5) * area.width;
      const posY = spawnerPos.y + (random(`y-${seed}`) - 0.5) * area.height;

      // Initial Velocity
      const velConfig = spawner.velocity || { x: 0, y: 0 };
      const vVarX = velConfig.varianceX || 0;
      const vVarY = velConfig.varianceY || 0;

      const velX = velConfig.x + (random(`vx-${seed}`) - 0.5) * 2 * vVarX;
      const velY = velConfig.y + (random(`vy-${seed}`) - 0.5) * 2 * vVarY;

      const particle: Particle = {
        id: `${spawner.id}-${i}`,
        index: i,
        seed,
        birthFrame,
        lifespan: actualLifespan,
        spawnerId: spawner.id,
        position: { x: posX, y: posY },
        velocity: { x: velX, y: velY },
        acceleration: { x: 0, y: 0 },
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
            behavior.handler(particle, t, { frame, fps });
        }
        // Apply standard physics (velocity -> position)
        movement(particle, t, { frame, fps });
      }

      // Add INTERPOLATION?
      // If frame is 10.5, we constructed state at 10.
      // We could add partial step. For now, we assume integer frames.

      activeParticles.push(particle);
    }
  }

  // Sort by birth (oldest first? or newest on top?)
  // Usually newer on top -> Painter's algorithm
  return activeParticles.sort((a,b) => a.birthFrame - b.birthFrame);
}
