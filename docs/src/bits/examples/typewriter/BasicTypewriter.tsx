import React from "react";
import { TypeWriter, useViewportRect } from "remotion-bits";

export const metadata = {
    name: "Basic Typewriter",
    description: "Simple typing animation with cursor.",
    tags: ["text", "typewriter", "basic"],
    duration: 150,
    width: 1920,
    height: 1080,
    registry: {
        name: "basic-typewriter",
        title: "Basic Typewriter",
        description: "Simple typing animation with cursor",
        type: "bit" as const,
        add: "when-needed" as const,
        registryDependencies: ["type-writer"],
        dependencies: [],
        files: [
            {
                path: "docs/src/bits/examples/typewriter/BasicTypewriter.tsx",
            },
        ],
    },
};

export const Component: React.FC = () => {
    const { vmin } = useViewportRect();

    return (
        <TypeWriter
            text="Ah, those sunny days!"
            style={{
                fontSize: vmin * 8,
            }}
            cursor={true}
        />
    );
};
