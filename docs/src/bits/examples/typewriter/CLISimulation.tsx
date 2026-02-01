import React from "react";
import { TypeWriter, useViewportRect } from "remotion-bits";

export const metadata = {
  name: "CLI Simulation",
  description: "Simulates a command-line interface with user typing and system output.",
  tags: ["text", "typewriter", "cli", "terminal"],
  duration: 450,
  width: 1920,
  height: 1080,
  registry: {
    name: "cli-simulation",
    title: "CLI Simulation",
    description: "Simulates a command-line interface with user typing and system output.",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["type-writer"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/typewriter/CLISimulation.tsx",
      },
    ],
  },
};

export const Component: React.FC = () => {
    const { vmin } = useViewportRect();

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                backgroundColor: '#1e1e1e',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                color: '#d4d4d4',
                padding: vmin * 10,
                fontSize: vmin * 3,
                lineHeight: 1.5,
                alignItems: 'flex-start',
                justifyContent: 'center',
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: vmin, width: '100%' }}>
                {/* Command 1: User typing slowly/normally */}
                <div style={{ display: 'flex' }}>
                    <span style={{ color: '#4ec9b0', marginRight: vmin * 1.5 }}>➜</span>
                    <span style={{ color: '#569cd6', marginRight: vmin * 1.5 }}>~</span>
                    <TypeWriter
                        text="npm install remotion-bits"
                        transition={{
                            duration: 100, // Explicit duration for intro if needed, but we use text timing
                            delay: 0,
                        }}
                        typeSpeed={3}
                        deleteSpeed={1}
                        cursor={true}
                        showCursorAfterComplete={false}
                        style={{ color: '#ce9178' }}
                    />
                </div>

                {/* System Output: Fast typing */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <TypeWriter
                        text={[
                            "✔ Package found\n",
                            "✔ Dependencies resolved\n",
                            "✔ Installing...\n",
                            "Done in 1.4s"
                        ]}
                        transition={{
                            delay: 90, // Wait for first command
                        }}
                        typeSpeed={0.5} // Very fast machine output
                        deleteSpeed={0} 
                        pauseAfterType={20}
                        pauseAfterDelete={0} 
                        loop={false}
                        cursor={false}
                        deleteBeforeNext={false}
                    />
                </div>
            </div>
        </div>
    );
};
