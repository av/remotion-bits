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
    gravity?: { x?: number; y?: number };
    drag?: number;
    wiggle?: { magnitude: number; frequency?: number };
    scale?: { start: number; end: number };
    opacity?: { frames: number[], values?: number[] } | number[]; // Simplify to just array of values [1, 0] for opacity over life

    // Custom
    handler?: ParticleBehaviorHandler;
}

/**
 * Configuration component for defining particle physics/logic.
 * Must be a direct child of <Particles>.
 */
export const Behavior: React.FC<BehaviorProps> = () => {
  return null;
};

// Helper to convert props to handlers
export function getBehaviorHandlersFromProps(props: BehaviorProps): ParticleBehaviorHandler[] {
    const handlers: ParticleBehaviorHandler[] = [];

    if (props.gravity) handlers.push(createGravity(props.gravity));
    if (props.drag) handlers.push(createDrag(props.drag));
    if (props.wiggle) handlers.push(createWiggle(props.wiggle.magnitude, props.wiggle.frequency));
    if (props.scale) handlers.push(createScaleOverLife(props.scale.start, props.scale.end));

    if (props.opacity) {
        // Handle array shorthand [1, 0]
        if (Array.isArray(props.opacity)) {
             handlers.push(createOpacityOverLife(props.opacity));
        } else {
             // Handle complex object if needed, but for now assuming simple array is enough
             // or matching the type definition
        }
    }

    if (props.handler) handlers.push(props.handler);

    return handlers;
}
