import React from "react";
import type { MotionTransitionProps } from "../MotionTransition";
import type { SpawnerConfig, SpawnerShape } from "../../utils/particles/types";

// We exclude 'id' from props because the Particles container will assign it or use index
export interface SpawnerProps extends Omit<SpawnerConfig, "id"> {
  // Override slightly for DX
  rate?: number; // per frame
  burst?: number; // count

  // Limits the maximum number of active particles from this spawner
  max?: number;

  // Optional ID if user wants explicit control
  id?: string;

  /**
   * Frame offset to start this spawner's simulation from.
   * When set, this spawner will begin as if it has been running for `startFrame` frames.
   * This value takes precedence over the Particles component's startFrame prop.
   *
   * @default Inherits from parent Particles component, or 0 if not set
   */
  startFrame?: number;

  children: React.ReactNode;
}

/**
 * Configuration component for defining a particle source.
 * Must be a direct child of <Particles>.
 */
export const Spawner: React.FC<SpawnerProps> = () => {
  return null;
};
