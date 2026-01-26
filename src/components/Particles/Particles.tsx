import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { simulateParticles } from "../../utils/particles/simulator";
import { getBehaviorHandlersFromProps, Behavior, type BehaviorProps } from "./Behavior";
import { Spawner, type SpawnerProps } from "./Spawner";
import type { SpawnerConfig, BehaviorConfig } from "../../utils/particles/types";
import { MotionTransition } from "../MotionTransition";

export interface ParticlesProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  /**
   * Frame offset to start the simulation from. This makes the simulation
   * appear as if it has been running for `startFrame` frames already.
   *
   * For example, if `startFrame={30}`, the simulation at frame 0 will
   * display the particle state as it would appear at frame 30.
   *
   * @default 0
   */
  startFrame?: number;
}

export const Particles: React.FC<ParticlesProps> = ({
  children,
  style,
  className,
  startFrame = 0
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --------------------------------------------------------------------------
  // 1. Parse Configuration from Children
  // --------------------------------------------------------------------------
  const { spawners, behaviors } = useMemo(() => {
    const extractedSpawners: SpawnerConfig[] = [];
    const extractedBehaviors: BehaviorConfig[] = [];

    let spawnerCount = 0;
    let behaviorCount = 0;

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;

      // Identify Spawners
      // @ts-ignore - Check for type name or specific prop
      if (child.type === Spawner) {
         const props = child.props as SpawnerProps;
         extractedSpawners.push({
             ...props,
             id: props.id || `spawner-${spawnerCount++}`,
             // Merge startFrame: spawner's startFrame takes precedence over Particles' startFrame
             startFrame: props.startFrame !== undefined ? props.startFrame : startFrame,
             children: props.children // Keep reference to render later
         } as SpawnerConfig);
      }

      // Identify Behaviors
      // @ts-ignore
      else if (child.type === Behavior) {
         const props = child.props as BehaviorProps;
         const handlers = getBehaviorHandlersFromProps(props);
         handlers.forEach(h => {
             extractedBehaviors.push({
                 id: `behavior-${behaviorCount++}`,
                 handler: h
             });
         });
      }
    });

    return { spawners: extractedSpawners, behaviors: extractedBehaviors };
  }, [children, startFrame]);

  // --------------------------------------------------------------------------
  // 2. Run Simulation
  // --------------------------------------------------------------------------
  // This runs every single frame to determine the list of active particles
  // and their current state.
  const activeParticles = useMemo(() => {
    // Each spawner now has its own startFrame offset already merged in the config
    // No need to apply a global offset here
    return simulateParticles({
      frame,
      fps,
      spawners,
      behaviors
    });
  }, [frame, fps, spawners, behaviors]);

  // --------------------------------------------------------------------------
  // 3. Render
  // --------------------------------------------------------------------------
  return (
    <AbsoluteFill style={style} className={className}>
      {activeParticles.map((p) => {
        const spawner = spawners.find(s => s.id === p.spawnerId);
        if (!spawner) return null;

        // simulateParticles() already filters particles outside their lifecycle
        // "Macro" styles from behaviors
        const particleStyle: React.CSSProperties = {
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate(${p.position.x}px, ${p.position.y}px) rotate(${p.rotation}deg) scale(${p.scale})`,
          opacity: p.opacity,
        };

        return (
          <div key={p.id} style={particleStyle}>
            {spawner.transition ? (
              <MotionTransition transition={spawner.transition}>
                {spawner.children}
              </MotionTransition>
            ) : (
              spawner.children
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
