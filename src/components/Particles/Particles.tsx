import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { simulateParticles } from "../../utils/particles/simulator";
import { getBehaviorHandlersFromProps, Behavior, type BehaviorProps } from "./Behavior";
import { Spawner, type SpawnerProps } from "./Spawner";
import type { SpawnerConfig, BehaviorConfig } from "../../utils/particles/types";
import { MotionTransition } from "../MotionTransition";

export interface ParticlesProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const Particles: React.FC<ParticlesProps> = ({ children, style, className }) => {
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
  }, [children]);

  // --------------------------------------------------------------------------
  // 2. Run Simulation
  // --------------------------------------------------------------------------
  // This runs every single frame to determine the list of active particles
  // and their current state.
  const activeParticles = simulateParticles({
    frame,
    fps,
    spawners,
    behaviors
  });

  // --------------------------------------------------------------------------
  // 3. Render
  // --------------------------------------------------------------------------
  return (
    <AbsoluteFill style={style} className={className}>
      {activeParticles.map((p) => {
        const spawner = spawners.find(s => s.id === p.spawnerId);
        if (!spawner) return null;

        // "Macro" styles from behaviors
        const particleStyle: React.CSSProperties = {
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate(${p.position.x}px, ${p.position.y}px) rotate(${p.rotation}deg) scale(${p.scale})`,
          opacity: p.opacity,
          // Optimization: If opacity is 0, maybe don't render?
          // But simulateParticles checks death. Opacity behavior might fade it early though.
        };

        return (
          <Sequence
            key={p.id}
            from={p.birthFrame}
            duration={Math.ceil(p.lifespan)} // Ceil just in case
            layout="none"
            // layout="none" is CRITICAL so Sequence doesn't wrap in AbsoluteFill
            // allowing our positioning to work
          >
            <div style={particleStyle}>
                {spawner.transition ? (
                  <MotionTransition transition={spawner.transition}>
                    {spawner.children}
                  </MotionTransition>
                ) : (
                  spawner.children
                )}
            </div>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
