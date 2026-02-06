import React from 'react';
import { AnimatedCounter } from 'remotion-bits';

export const metadata = {
    name: "Basic Counter",
    description: "Animated counter interpolating between numbers.",
    tags: ["text", "counter", "numbers"],
    duration: 120,
    width: 1920,
    height: 1080,
    registry: {
        name: "bit-basic-counter",
        title: "Basic Counter Animation",
        description: "Animated counter that interpolates between values.",
        type: "bit" as const,
        add: "when-needed" as const,
        registryDependencies: ["animated-counter"],
        dependencies: [],
        files: [
            {
                path: "docs/src/bits/examples/animated-counter/BasicCounter.tsx",
            },
        ],
    },
};

export const Component: React.FC = () => {
    return (
        <AnimatedCounter
            style={{ width: '300px' }}
            transition={{
                values: [0, 10, 10, 50, 10],
                duration: 120,
            }}
            prefix={<span style={{ color: 'currentColor'}}>width:&nbsp;</span>}
            postfix={<span style={{ color: 'currentColor'}}>px</span>}
        />
    );
};
