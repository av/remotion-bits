import React from "react";
import { AnimatedText } from "remotion-bits";

export const metadata = {
    name: "Glitch Cycle",
    description: "Cycling text with glitch transition effects between words",
    tags: ["text", "glitch", "cycle"],
    duration: 240,
    width: 1920,
    height: 1080,
    registry: {
        name: "bit-glitch-cycle",
        title: "Glitch Cycle",
        description: "Cycling text with glitch transitions",
        type: "bit" as const,
        add: "when-needed" as const,
        registryDependencies: ["animated-text"],
        dependencies: [],
        files: [
            {
                path: "docs/src/bits/examples/animated-text/GlitchCycle.tsx",
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
                glitch: [1, 0, 0, 0.1, 0, 0, 1],
                duration: 60,
                cycle: {
                    texts: ["INITIALIZING", "LOADING ASSETS", "SYSTEM ONLINE", "WELCOME USER"],
                    itemDuration: 60
                }
            }}
        />
    );
};
