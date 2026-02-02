import React from "react";
import { AbsoluteFill } from "remotion";
import { CodeBlock, useViewportRect } from "remotion-bits";

export const metadata = {
    name: "Basic Code Block",
    description: "Syntax highlighted code with line-by-line reveal",
    tags: ["text", "code", "animation"],
    duration: 120,
};

export const Component: React.FC = () => {
    const rect = useViewportRect();
    const code = `function hello() {
  console.log("Hello World");
  return true;
}`;

    return (
        <CodeBlock
            code={code}
            language="typescript"
            showLineNumbers
            transition={{
                duration: 30,
                lineStagger: 5,
                opacity: [0, 1],
                y: [10, 0],
            }}
            fontSize={rect.width * 0.025}
        />
    );
};
