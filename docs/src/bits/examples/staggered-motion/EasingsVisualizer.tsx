import React from "react";
import { StaggeredMotion, useViewportRect, steps, type EasingName, type EasingFunction } from "remotion-bits";

export const metadata = {
  name: "Easings Visualizer",
  description: "Visualizes different easing functions with sliding squares.",
  tags: ["easing", "motion", "staggered-motion"],
  duration: 90,
  width: 1080,
  height: 1080,
  registry: {
    name: "bit-easings-visualizer",
    title: "Easings Visualizer",
    description: "Visualizes different easing functions with sliding squares.",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["staggered-motion"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/staggered-motion/EasingsVisualizer.tsx",
      },
    ],
  },
};

export const Component: React.FC = () => {
  type EasingItem = { label: string; value: EasingName | EasingFunction };
  
  const EASINGS: EasingItem[] = [
    { label: "linear", value: "linear" },
    { label: "easeInQuad", value: "easeInQuad" },
    { label: "easeOutQuad", value: "easeOutQuad" },
    { label: "easeInOutQuad", value: "easeInOutQuad" },
    { label: "easeInCubic", value: "easeInCubic" },
    { label: "easeOutCubic", value: "easeOutCubic" },
    { label: "easeInOutCubic", value: "easeInOutCubic" },
    { label: "spring", value: "spring" },
    { label: "steps(5)", value: steps(5) },
  ];

  const { width, height } = useViewportRect();
  
  // Calculate responsive dimensions
  // Reserve space for labels (approx 20% or fixed min)
  const labelWidth = Math.max(width * 0.2, 120);
  const trackWidth = width - labelWidth - 40; // 40px padding
  
  const verticalPadding = 40;
  const availableHeight = height - (verticalPadding * 2);
  const itemHeight = availableHeight / EASINGS.length;
  const squareSize = Math.min(itemHeight * 0.6, 40);
  
  const travelDistance = trackWidth - squareSize;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: `${verticalPadding}px 20px`,
        backgroundColor: "#09090b", // zinc-950
        color: "#e4e4e7", // zinc-200
        fontFamily: "monospace",
        overflow: "hidden",
      }}
    >
      {EASINGS.map((item, i) => (
        <div
          key={item.label}
          style={{
            display: "flex",
            alignItems: "center",
            height: itemHeight,
            borderBottom: i < EASINGS.length - 1 ? "1px solid #27272a" : "none", // zinc-800
          }}
        >
          <div
            style={{
              width: labelWidth,
              paddingRight: 10,
              fontSize: Math.min(itemHeight * 0.4, 16),
              opacity: 0.8,
            }}
          >
            {item.label}
          </div>
          <div style={{ flex: 1, position: "relative" }}>
            <StaggeredMotion
              transition={{
                x: [0, travelDistance],
                frames: [0, 60],
                duration: 60,
                easing: item.value,
                cycleOffset: 0, 
              }}
            >
              <div
                style={{
                  width: squareSize,
                  height: squareSize,
                  backgroundColor: "#3b82f6", // blue-500
                  borderRadius: 4,
                  boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
                }}
              />
            </StaggeredMotion>
          </div>
        </div>
      ))}
      <div 
        style={{
          position: "absolute",
          bottom: 10,
          right: 20,
          fontSize: 12,
          opacity: 0.5
        }}
      >
        Duration: 60 frames
      </div>
    </div>
  );
};
