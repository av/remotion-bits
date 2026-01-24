import React from "react";
import { AbsoluteFill } from "remotion";

export type CenterProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

/**
 * Center component - Centers children using flexbox
 */
export const Center: React.FC<CenterProps> = ({ children, style, className }) => {
  return (
    <AbsoluteFill
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
