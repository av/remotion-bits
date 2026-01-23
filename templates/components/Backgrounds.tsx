import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export type BackgroundsProps = {
  variant?: "gradient" | "radial" | "solid";
  colors?: string[];
  className?: string;
  style?: React.CSSProperties;
  blur?: number;
};

export const Backgrounds: React.FC<BackgroundsProps> = ({
  variant = "gradient",
  colors = ["#0f172a", "#1e293b", "#6366f1"],
  className,
  style,
  blur = 0,
}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 120], [0, 1]);

  const backgroundImage = (() => {
    if (variant === "solid") {
      return "";
    }
    if (variant === "radial") {
      return `radial-gradient(circle at ${30 + drift * 20}% ${40 + drift * 10}%, ${
        colors[0]
      }, ${colors[1]}, ${colors[2]})`;
    }
    return `linear-gradient(135deg, ${colors[0]}, ${colors[1]} 45%, ${colors[2]})`;
  })();

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: colors[0],
        backgroundImage,
        filter: blur ? `blur(${blur}px)` : undefined,
        transform: variant === "solid" ? undefined : `scale(1.05)`,
        ...style,
      }}
    />
  );
};
