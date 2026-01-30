import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { simulateParticles } from "../../utils/particles/simulator";
import { getBehaviorHandlersFromProps, Behavior, type BehaviorProps } from "./Behavior";
import { Spawner, type SpawnerProps } from "./Spawner";
import type { SpawnerConfig, BehaviorConfig } from "../../utils/particles/types";
import { StaggeredMotion } from "../StaggeredMotion";

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

        // Extract children as variants
        const childrenArray = React.Children.toArray(props.children);
        const hasMultipleVariants = childrenArray.length > 1;

        extractedSpawners.push({
          ...props,
          id: props.id || `spawner-${spawnerCount++}`,
          // Merge startFrame: spawner's startFrame takes precedence over Particles' startFrame
          startFrame: props.startFrame !== undefined ? props.startFrame : startFrame,
          children: props.children, // Keep original for single child case
          childrenVariants: hasMultipleVariants ? childrenArray : undefined
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

        // Select variant based on particle seed for determinism
        let childToRender: React.ReactNode;
        if (spawner.childrenVariants && spawner.childrenVariants.length > 0) {
          // Use particle seed to deterministically select a variant
          const variantIndex = Math.floor(p.seed * spawner.childrenVariants.length);
          childToRender = spawner.childrenVariants[variantIndex];
        } else {
          // Single child case
          childToRender = spawner.children;
        }

        // simulateParticles() already filters particles outside their lifecycle
        // "Macro" styles from behaviors
        const particleStyle: React.CSSProperties = {
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate3d(${p.position.x}px, ${p.position.y}px, ${p.position.z}px) rotate(${p.rotation}deg) scale(${p.scale})`,
          opacity: p.opacity,
        };

        // Calculate particle age for transition timing
        // The simulator uses (frame + startFrame) as the timeline
        const spawnerStartFrame = spawner.startFrame || 0;
        const currentSpawnerFrame = frame + spawnerStartFrame;
        const age = currentSpawnerFrame - p.birthFrame;

        let content = childToRender;

        if (React.isValidElement(content) && content.type === StaggeredMotion) {
          const props = content.props as any;
          content = React.cloneElement(content, {
            cycleOffset: age,
            transition: {
              duration: p.lifespan,
              ...props.transition,
            },
          } as any);
        }

        if (spawner.transition) {
          content = (
            <StaggeredMotion transition={spawner.transition} cycleOffset={age}>
              {content}
            </StaggeredMotion>
          );
        }

        return (
          <div key={p.id} style={particleStyle}>
            {content}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
