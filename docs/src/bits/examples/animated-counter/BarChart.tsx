import React from "react";
import { StaggeredMotion, AnimatedCounter, useViewportRect } from "remotion-bits";

export const metadata = {
  name: "Bar Chart",
  description: "Horizontal bar chart growing in with staggered bars and counting values.",
  tags: ["chart", "data", "stats", "counter", "staggered-motion", "ui"],
  duration: 120,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-bar-chart",
    title: "Bar Chart",
    description: "Horizontal bar chart growing in with staggered bars and counting values.",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["staggered-motion", "animated-counter", "use-viewport-rect"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/animated-counter/BarChart.tsx",
      },
    ],
  },
};

export const Component: React.FC = () => {
  const rect = useViewportRect();
  const vmin = rect.vmin;

  const rows = [
    { label: "TypeScript", value: 84 },
    { label: "Rust", value: 67 },
    { label: "Python", value: 58 },
    { label: "Go", value: 41 },
    { label: "Zig", value: 23 },
  ];

  const maxValue = Math.max(...rows.map((row) => row.value));
  const chartWidth = rect.vw * 60;
  const labelWidth = rect.vw * 14;
  const barHeight = vmin * 7;
  const gap = vmin * 3;
  const stagger = 8;
  const barDuration = 45;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-background-dark)",
        fontFamily: "sans-serif",
        color: "white",
      }}
    >
      <StaggeredMotion
        transition={{
          opacity: [0, 1],
          y: [vmin * 2, 0],
          duration: 30,
          easing: "easeOutCubic",
        }}
      >
        <div
          style={{
            fontSize: vmin * 4.5,
            fontWeight: 700,
            marginBottom: gap * 1.5,
            alignSelf: "flex-start",
            marginLeft: labelWidth,
          }}
        >
          Weekly commits by language
        </div>
      </StaggeredMotion>

      <div style={{ display: "flex", flexDirection: "column", gap }}>
        {rows.map((row, index) => {
          const barWidth = (row.value / maxValue) * chartWidth;
          const delay = 15 + index * stagger;

          return (
            <div
              key={row.label}
              style={{
                display: "flex",
                alignItems: "center",
                height: barHeight,
                gap: vmin * 2,
              }}
            >
              <StaggeredMotion
                transition={{
                  opacity: [0, 1],
                  x: [-vmin * 3, 0],
                  delay,
                  duration: 25,
                  easing: "easeOutCubic",
                }}
                style={{
                  width: labelWidth,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <span
                  style={{
                    fontSize: vmin * 3,
                    fontWeight: 500,
                    color: "var(--color-primary-hover)",
                  }}
                >
                  {row.label}
                </span>
              </StaggeredMotion>

              <div
                style={{
                  width: chartWidth,
                  display: "flex",
                  alignItems: "center",
                  gap: vmin * 2,
                }}
              >
                <StaggeredMotion
                  transition={{
                    scaleX: [0, 1],
                    delay,
                    duration: barDuration,
                    easing: "easeOutQuart",
                  }}
                >
                  <div
                    style={{
                      width: barWidth,
                      height: barHeight,
                      borderRadius: vmin,
                      transformOrigin: "left center",
                      background:
                        "linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)",
                    }}
                  />
                </StaggeredMotion>

                <StaggeredMotion
                  transition={{
                    opacity: [0, 1],
                    delay,
                    duration: 15,
                  }}
                >
                  <AnimatedCounter
                    transition={{
                      values: [0, row.value],
                      delay,
                      duration: barDuration,
                      easing: "easeOutQuart",
                    }}
                    style={{
                      fontSize: vmin * 3.2,
                      fontWeight: 700,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  />
                </StaggeredMotion>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
