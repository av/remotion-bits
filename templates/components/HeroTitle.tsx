import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export type HeroTitleProps = {
  title: string;
  subtitle?: string;
  accent?: string;
  align?: "left" | "center" | "right";
  className?: string;
  style?: React.CSSProperties;
};

export const HeroTitle: React.FC<HeroTitleProps> = ({
  title,
  subtitle,
  accent,
  align = "center",
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1]);
  const translate = interpolate(frame, [0, 20], [16, 0]);

  return (
    <div
      className={className}
      style={{
        textAlign: align,
        color: "#f8fafc",
        fontFamily: "Inter, ui-sans-serif, system-ui",
        ...style,
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "clamp(2.5rem, 6vw, 5rem)",
          fontWeight: 700,
          lineHeight: 1.05,
          opacity,
          transform: `translateY(${translate}px)`,
        }}
      >
        {title}
        {accent ? (
          <span
            style={{
              display: "block",
              background: "linear-gradient(90deg, #38bdf8, #6366f1)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            {accent}
          </span>
        ) : null}
      </h1>
      {subtitle ? (
        <p
          style={{
            marginTop: "1rem",
            fontSize: "clamp(1rem, 2vw, 1.5rem)",
            opacity: 0.8,
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
};
