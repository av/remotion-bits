import React from "react";
import { StaggeredMotion, useViewportRect } from "remotion-bits";

export const metadata = {
  name: "List Reveal",
  description: "A vertical list of items scaling and finding their place.",
  tags: ["list", "motion", "staggered-motion", "ui"],
  duration: 90,
  width: 1080,
  height: 1080,
  registry: {
    name: "bit-list-reveal",
    title: "List Reveal",
    description: "A vertical list of items scaling and finding their place.",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["staggered-motion"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/staggered-motion/ListReveal.tsx",
      },
    ],
  },
};

export const Component: React.FC = () => {
  const { width } = useViewportRect();

  const items = [
    { title: "Dashboard", icon: "📊" },
    { title: "Analytics", icon: "📈" },
    { title: "Settings", icon: "⚙️" },
    { title: "Profile", icon: "👤" },
    { title: "Messages", icon: "💬" },
    { title: "Notifications", icon: "🔔" },
  ];

  const itemWidth = Math.min(width * 0.8, 600);
  const itemHeight = 80;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#09090b", // zinc-950
      }}
    >
      <StaggeredMotion
        transition={{
          y: [200, -100],
          easing: 'easeInOutCubic',
        }}
      >
        <StaggeredMotion
          transition={{
            y: [50, 0],
            opacity: [0, 1],
            scale: [0.9, 1],
            frames: [0, 40],
            stagger: 3,
            staggerDirection: "forward",
            easing: "easeOutCubic",
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            width: itemWidth,
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                width: "100%",
                height: itemHeight,
                backgroundColor: "#27272a", // zinc-800
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                padding: "0 24px",
                gap: 16,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ fontSize: 24 }}>{item.icon}</div>
              <div
                style={{
                  fontSize: 20,
                  color: "#f4f4f5", // zinc-100
                  fontWeight: 500,
                  flex: 1,
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#52525b", // zinc-600
                }}
              />
            </div>
          ))}
        </StaggeredMotion>
      </StaggeredMotion>
    </div>
  );
};
