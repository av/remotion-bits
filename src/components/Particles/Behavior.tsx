import React from "react";
import type { ParticleBehaviorHandler } from "../../utils/particles/types";
import {
    createGravity,
    createDrag,
    createWiggle,
    createScaleOverLife,
    createOpacityOverLife
} from "../../utils/particles/behaviors";

export interface BehaviorProps {
    // Standard Presets
    gravity?: { x?: number; y?: number; z?: number; varianceX?: number; varianceY?: number; varianceZ?: number };
    drag?: number;
    dragVariance?: number;
    wiggle?: { magnitude: number; frequency?: number };
    wiggleVariance?: number;
    scale?: { start: number; end: number; startVariance?: number; endVariance?: number };
    opacity?: { frames: number[], values?: number[] } | number[]; // Simplify to just array of values [1, 0] for opacity over life
    opacityStartVariance?: number;
    opacityEndVariance?: number;

    // Custom
    handler?: ParticleBehaviorHandler;
}

/**
 * Configuration component for defining particle physics/logic.
 * Must be a direct child of <Particles>.
 *
 * @example
 * // Basic behaviors
 * <Behavior gravity={{ y: 0.5 }} />
 * <Behavior drag={0.95} />
 *
 * @example
 * // With variance for more natural motion
 * <Behavior gravity={{ y: 0.5, varianceY: 0.1 }} />
 * <Behavior drag={0.95} dragVariance={0.02} />
 * <Behavior wiggle={{ magnitude: 0.5, frequency: 0.3 }} wiggleVariance={0.15} />
 *
 * @example
 * // Scale and opacity with variance
 * <Behavior
 *   scale={{ start: 1, end: 0, startVariance: 0.2, endVariance: 0.1 }}
 *   opacity={[1, 0]}
 *   opacityStartVariance={0.1}
 * />
 */
export const Behavior: React.FC<BehaviorProps> = () => {
  return null;
};

// Helper to convert props to handlers
export function getBehaviorHandlersFromProps(props: BehaviorProps): ParticleBehaviorHandler[] {
    const handlers: ParticleBehaviorHandler[] = [];

    if (props.gravity) handlers.push(createGravity(props.gravity));
    if (props.drag !== undefined) handlers.push(createDrag(props.drag, props.dragVariance));
    if (props.wiggle) handlers.push(createWiggle(props.wiggle.magnitude, props.wiggle.frequency, props.wiggleVariance));

    if (props.scale) {
        handlers.push(createScaleOverLife(
            props.scale.start,
            props.scale.end,
            props.scale.startVariance,
            props.scale.endVariance
        ));
    }

    if (props.opacity) {
        // Handle array shorthand [1, 0]
        if (Array.isArray(props.opacity)) {
             handlers.push(createOpacityOverLife(
                 props.opacity,
                 props.opacityStartVariance,
                 props.opacityEndVariance
             ));
        } else {
             // Handle complex object if needed, but for now assuming simple array is enough
             // or matching the type definition
        }
    }

    if (props.handler) handlers.push(props.handler);

    return handlers;
}
