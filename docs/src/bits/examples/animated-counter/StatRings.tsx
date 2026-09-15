import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { StaggeredMotion, AnimatedCounter, useViewportRect } from "remotion-bits";

export const metadata = {
  name: "Stat Rings",
  description: "Circular progress rings filling up with percentage counters in the center.",
  tags: ["chart", "data", "stats", "counter", "progress", "svg", "ui"],
  duration: 120,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-stat-rings",
    title: "Stat Rings",
    description: "Circular progress rings filling up with percentage counters in the center.",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["staggered-motion", "animated-counter", "use-viewport-rect"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/animated-counter/StatRings.tsx",
      },
    ],
  },
};

export const Component: React.FC = () => {
  const rect = useViewportRect();
  const frame = useCurrentFrame();
  const vmin = rect.vmin;

  const stats = [
    { label: "Uptime", value: 99.9, toFixed: 1 },
    { label: "Test coverage", value: 87, toFixed: 0 },
    { label: "Cache hits", value: 64, toFixed: 0 },
  ];

  const ringSize = vmin * 34;
  const strokeWidth = vmin * 2.6;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const stagger = 12;
  const fillDuration = 60;
  const startFrame = 20;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: vmin * 8,
        backgroundColor: "var(--color-background-dark)",
        fontFamily: "sans-serif",
        color: "white",
      }}
    >
      <StaggeredMotion
        transition={{
          opacity: [0, 1],
          scale: [0.6, 1],
          delay: 5,
          duration: 30,
          stagger,
          easing: "spring",
        }}
        style={{ display: "flex", gap: vmin * 8 }}
      >
        {stats.map((stat, index) => {
          const delay = startFrame + index * stagger;
          const fill = interpolate(
            frame,
            [delay, delay + fillDuration],
            [0, stat.value / 100],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }
          );

          return (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: vmin * 3,
              }}
            >
              <div style={{ position: "relative", width: ringSize, height: ringSize }}>
                <svg
                  width={ringSize}
                  height={ringSize}
                  viewBox={`0 0 ${ringSize} ${ringSize}`}
                  style={{ transform: "rotate(-90deg)" }}
                >
                  <circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--color-surface-light)"
                    strokeWidth={strokeWidth}
                  />
                  <circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - fill)}
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AnimatedCounter
                    transition={{
                      values: [0, stat.value],
                      delay,
                      duration: fillDuration,
                      easing: "easeOutCubic",
                    }}
                    toFixed={stat.toFixed}
                    postfix={
                      <span
                        style={{
                          position: "absolute",
                          left: "100%",
                          top: 0,
                          marginLeft: vmin * 0.5,
                          fontSize: vmin * 3,
                          color: "var(--color-primary-hover)",
                        }}
                      >
                        %
                      </span>
                    }
                    style={{
                      position: "relative",
                      fontSize: vmin * 7,
                      fontWeight: 700,
                      fontVariantNumeric: "tabular-nums",
                      lineHeight: 1,
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  fontSize: vmin * 3,
                  fontWeight: 500,
                  color: "var(--color-primary-hover)",
                  letterSpacing: vmin * 0.1,
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </StaggeredMotion>
    </div>
  );
};
