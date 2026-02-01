import React from "react";
import { TypeWriter, useViewportRect } from "remotion-bits";

export const metadata = {
    name: "Variable Speed & Typos",
    description: "Advanced typewriter with variable speed curves and error simulation.",
    tags: ["text", "typewriter", "speed", "errors"],
    duration: 400,
    width: 1920,
    height: 1080,
    registry: {
        name: "variable-speed-typewriter",
        title: "Variable Speed & Typos",
        description: "Advanced typewriter with variable speed curves and error simulation",
        type: "bit" as const,
        add: "when-needed" as const,
        registryDependencies: ["type-writer"],
        dependencies: [],
        files: [
            {
                path: "docs/src/bits/examples/typewriter/VariableSpeedTypewriter.tsx",
            },
        ],
    },
};

export const Component: React.FC = () => {
    const { vmin } = useViewportRect();

    return (
        <TypeWriter
            text="Typing with errors and variable speed..."
            style={{
                fontSize: vmin * 6,
                fontFamily: 'monospace',
                color: '#ff6b6b',
                fontWeight: 'bold',
            }}
            // Simulate slowing down at the end
            typeSpeed={[2, 10, 2]}
            errorRate={0.1}
            errorCorrectDelay={10}
            cursor={<span>_</span>}
            blinkSpeed={20}
        />
    );
};
