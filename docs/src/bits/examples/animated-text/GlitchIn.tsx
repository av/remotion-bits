import React, { useMemo } from "react";
import { AnimatedText } from "remotion-bits";
import { AbsoluteFill } from "remotion";
import { useViewportRect } from "remotion-bits";

export const metadata = {
    name: "Glitch In",
    description: "Text effect that glitches into existence from random characters",
    tags: ["text", "glitch", "transition"],
    duration: 90,
    width: 1920,
    height: 1080,
    registry: {
        name: "bit-glitch-in",
        title: "Glitch In",
        description: "Text effect that glitches into existence",
        type: "bit" as const,
        add: "when-needed" as const,
        registryDependencies: ["animated-text"],
        dependencies: [],
        files: [
            {
                path: "docs/src/bits/examples/animated-text/GlitchIn.tsx",
            },
        ],
    },
};

export const Component: React.FC = () => {
    return (
        <AnimatedText
            style={{
                fontFamily: 'monospace',
            }}
            transition={{
                glitch: [1, 0, 0.05, 0],
                duration: 45,
                opacity: [0, 1],
                frames: [0, 45]
            }}
        >
            SYSTEM ONLINE
        </AnimatedText>
    );
};
