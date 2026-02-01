import React from "react";
import { TypeWriter, useViewportRect } from "remotion-bits";

export const metadata = {
    name: "Multi-Text Typewriter",
    description: "Typing multiple sentences in sequence with deleting phase.",
    tags: ["text", "typewriter", "sequence", "loop"],
    duration: 300,
    width: 1920,
    height: 1080,
    registry: {
        name: "multitext-typewriter",
        title: "Multi-Text Typewriter",
        description: "Typing multiple sentences in sequence with deleting phase",
        type: "bit" as const,
        add: "when-needed" as const,
        registryDependencies: ["type-writer"],
        dependencies: [],
        files: [
            {
                path: "docs/src/bits/examples/typewriter/MultiTextTypewriter.tsx",
            },
        ],
    },
};

export const Component: React.FC = () => {
    const { vmin } = useViewportRect();

    return (
        <TypeWriter
            text={[
                "First sentence.",
                "Second longer sentence.",
                "Looping..."
            ]}
            style={{
                fontSize: vmin * 7,
                fontWeight: 'bold',
                fontFamily: 'monospace',
            }}
            typeSpeed={3}
            deleteSpeed={1}
            pauseAfterType={40}
            pauseAfterDelete={20}
            loop
        />
    );
};
