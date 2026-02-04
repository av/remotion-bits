import React from "react";
import { StaggeredMotion, useViewportRect } from "remotion-bits";

export const metadata = {
  name: "Grid Stagger",
  description: "A grid of elements staggering in from the center using scale and opacity.",
  tags: ["grid", "motion", "staggered-motion", "scale"],
  duration: 90,
  width: 1080,
  height: 1080,
  registry: {
    name: "bit-grid-stagger",
    title: "Grid Stagger Reveal",
    description: "A grid of elements staggering in from the center using scale and opacity.",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["staggered-motion"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/staggered-motion/GridStagger.tsx",
      },
    ],
  },
};

export const Component: React.FC = () => {
  const rect = useViewportRect();

  // Create a 4x4 grid
  const cols = 4;
  const rows = 4;
  const count = cols * rows;
  const gap = 20; // 20px gap

  // Calculate item size based on available width/height
  const padding = 60;
  const availableWidth = rect.width - (padding * 2) - (gap * (cols - 1));
  const availableHeight = rect.height - (padding * 2) - (gap * (rows - 1));

  // Use the smaller dimension to keep squares
  const itemSize = Math.min(availableWidth / cols, availableHeight / rows);

  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#09090b", // zinc-950
        color: "#e4e4e7", // zinc-200
        overflow: "hidden",
      }}
    >
      <StaggeredMotion
        transition={{
          scale: [0, 1],
          opacity: [0, 1],
          frames: [0, 45],
          stagger: 3,
          staggerDirection: "center",
          easing: "spring",
        }}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${itemSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${itemSize}px)`,
          gap: gap,
        }}
      >
        {items.map((i) => (
          <div
            key={i}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "var(--color-primary)",
              borderRadius: itemSize * 1,
              cornerShape: 'squircle',
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: itemSize * 0.3,
              fontWeight: "bold",
              color: "rgba(255,255,255,0.8)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            {i + 1}
          </div>
        ))}
      </StaggeredMotion>
    </div>
  );
};
