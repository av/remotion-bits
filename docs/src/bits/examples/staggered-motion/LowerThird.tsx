import React from "react";
import { StaggeredMotion, hold, useViewportRect } from "remotion-bits";

export const metadata = {
  name: "Lower Third",
  description: "Broadcast-style name and title card that slides in, holds, and slides out.",
  tags: ["lower-third", "title", "broadcast", "text", "staggered-motion", "ui"],
  duration: 150,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-lower-third",
    title: "Lower Third",
    description: "Broadcast-style name and title card that slides in, holds, and slides out.",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["staggered-motion", "use-viewport-rect"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/staggered-motion/LowerThird.tsx",
      },
    ],
  },
};

export const Component: React.FC = () => {
  const rect = useViewportRect();
  const vmin = rect.vmin;

  const name = "Ada Lovelace";
  const title = "Analytical Engine Programmer";

  const total = 150;
  const enter = 25;
  const exit = 20;
  const holdFrames = total - enter - exit;
  const barWidth = vmin * 1.6;
  const cardHeight = vmin * 18;
  const shift = vmin * 6;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "var(--color-surface-dark)",
        backgroundImage:
          "radial-gradient(circle at 70% 30%, var(--color-surface-light) 0%, var(--color-surface-dark) 60%)",
        fontFamily: "sans-serif",
        color: "white",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: rect.vw * 6,
          bottom: rect.vh * 10,
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <StaggeredMotion
          transition={{
            scaleY: [0, 1, hold(holdFrames), 0],
            duration: total,
            easing: "easeInOutCubic",
          }}
          style={{ display: "flex", alignItems: "stretch" }}
        >
          <div
            style={{
              width: barWidth,
              minHeight: cardHeight,
              borderRadius: barWidth,
              backgroundColor: "var(--color-primary)",
              transformOrigin: "center top",
            }}
          />
        </StaggeredMotion>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: vmin * 1.2,
            padding: `${vmin * 1.5}px 0 ${vmin * 1.5}px ${vmin * 3}px`,
          }}
        >
          <StaggeredMotion
            transition={{
              x: [-shift, 0, hold(holdFrames - 8), -shift],
              opacity: [0, 1, hold(holdFrames - 8), 0],
              delay: 6,
              duration: total - 6,
              easing: "easeOutCubic",
            }}
          >
            <div
              style={{
                fontSize: vmin * 6.5,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: -vmin * 0.1,
              }}
            >
              {name}
            </div>
          </StaggeredMotion>

          <StaggeredMotion
            transition={{
              x: [-shift, 0, hold(holdFrames - 16), -shift],
              opacity: [0, 1, hold(holdFrames - 16), 0],
              delay: 12,
              duration: total - 12,
              easing: "easeOutCubic",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: vmin * 1.5,
                fontSize: vmin * 2.8,
                fontWeight: 500,
                color: "var(--color-primary-hover)",
                textTransform: "uppercase",
                letterSpacing: vmin * 0.25,
              }}
            >
              <span
                style={{
                  width: vmin * 1,
                  height: vmin * 1,
                  borderRadius: "50%",
                  backgroundColor: "var(--color-primary)",
                }}
              />
              {title}
            </div>
          </StaggeredMotion>
        </div>
      </div>
    </div>
  );
};
