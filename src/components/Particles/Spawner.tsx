import React from "react";
import type { MotionTransitionProps } from "../../utils/motion";
import type { SpawnerConfig, SpawnerShape } from "../../utils/particles/types";

// We exclude 'id' from props because the Particles container will assign it or use index
export interface SpawnerProps extends Omit<SpawnerConfig, "id"> {
  // Override slightly for DX
  rate?: number; // per frame
  burst?: number; // count

  // Optional ID if user wants explicit control
  id?: string;

  children?: React.ReactNode;
}

/**
 * Configuration component for defining a particle source.
 * Must be a direct child of <Particles>.
 */
export const Spawner: React.FC<SpawnerProps> = () => {
  return null;
};
