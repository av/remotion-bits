import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { MotionTransition } from "../../../src/components/MotionTransition";
import { Center } from "./Center";

const Bg = ({ children }: { children: React.ReactNode }) => (
  <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
    <Center style={{ padding: "4rem" }}>{children}</Center>
  </AbsoluteFill>
);

const boxStyle: React.CSSProperties = {
  width: 256,
  height: 256,
  backgroundColor: "#3b82f6",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "2rem",
  fontWeight: 700,
  color: "white",
  margin: "10px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "2.5rem",
  fontWeight: 600,
  opacity: 0.2,
  color: "#94a3b8",
  marginBottom: "4rem",
  fontFamily: "Inter, ui-sans-serif, system-ui",
};

// Shape components
const Circle: React.FC<{ style?: React.CSSProperties; color?: string }> = ({ style, color = "#3b82f6" }) => (
  <div style={{ ...boxStyle, backgroundColor: color, ...style }}>
    <svg width="120" height="120" viewBox="0 0 60 60">
      <circle cx="30" cy="30" r="25" fill="white" />
    </svg>
  </div>
);

const Triangle: React.FC<{ style?: React.CSSProperties; color?: string }> = ({ style, color = "#ef4444" }) => (
  <div style={{ ...boxStyle, backgroundColor: color, ...style }}>
    <svg width="120" height="120" viewBox="0 0 60 60">
      <polygon points="30,10 55,50 5,50" fill="white" />
    </svg>
  </div>
);

const RoundedSquare: React.FC<{ style?: React.CSSProperties; color?: string }> = ({ style, color = "#10b981" }) => (
  <div style={{ ...boxStyle, backgroundColor: color, ...style }}>
    <svg width="120" height="120" viewBox="0 0 60 60">
      <rect x="10" y="10" width="40" height="40" rx="8" fill="white" />
    </svg>
  </div>
);

const Star: React.FC<{ style?: React.CSSProperties; color?: string }> = ({ style, color = "#f59e0b" }) => (
  <div style={{ ...boxStyle, backgroundColor: color, ...style }}>
    <svg width="120" height="120" viewBox="0 0 60 60">
      <path d="M30 5 L37 23 L56 23 L41 35 L48 53 L30 41 L12 53 L19 35 L4 23 L23 23 Z" fill="white" />
    </svg>
  </div>
);

const Cross: React.FC<{ style?: React.CSSProperties; color?: string }> = ({ style, color = "#8b5cf6" }) => (
  <div style={{ ...boxStyle, backgroundColor: color, ...style }}>
    <svg width="120" height="120" viewBox="0 0 60 60">
      <path d="M30 10 L30 25 L45 25 L45 35 L30 35 L30 50 L20 50 L20 35 L5 35 L5 25 L20 25 L20 10 Z" fill="white" />
    </svg>
  </div>
);

export const FadeInStaggerShowcase: React.FC = () => {
  return (
    <Bg>
      <div style={labelStyle}>Stagger (Forward)</div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        <MotionTransition
          transition={{
            opacity: [0, 1],
            y: [300, 0],
            duration: 30,
            stagger: 5,
            staggerDirection: "forward",
            easing: "easeOutCubic",
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "4rem",
          }}
        >
          <Circle color="#3b82f6" />
          <Triangle color="#ef4444" />
          <RoundedSquare color="#10b981" />
          <Star color="#f59e0b" />
          <Cross color="#8b5cf6" />
        </MotionTransition>
      </div>
    </Bg>
  );
};

export const ReverseStaggerShowcase: React.FC = () => {
  return (
    <Bg>
      <div style={labelStyle}>Stagger (Reverse)</div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        <MotionTransition
          transition={{
            opacity: [0, 1],
            y: [300, 0],
            duration: 30,
            stagger: 5,
            staggerDirection: "reverse",
            easing: "easeOutCubic",
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "4rem",
          }}
        >
          <Circle color="#3b82f6" />
          <Triangle color="#ef4444" />
          <RoundedSquare color="#10b981" />
          <Star color="#f59e0b" />
          <Cross color="#8b5cf6" />
        </MotionTransition>
      </div>
    </Bg>
  );
};

export const CenterStaggerShowcase: React.FC = () => {
  return (
    <Bg>
      <div style={labelStyle}>Stagger (Center)</div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        <MotionTransition
          transition={{
            opacity: [0, 1],
            y: [300, 0],
            duration: 30,
            stagger: 5,
            staggerDirection: "center",
            easing: "easeOutCubic",
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "4rem",
          }}
        >
          <Circle color="#3b82f6" />
          <Triangle color="#ef4444" />
          <RoundedSquare color="#10b981" />
          <Star color="#f59e0b" />
          <Cross color="#8b5cf6" />
        </MotionTransition>
      </div>
    </Bg>
  );
};

export const CustomComponentShowcase: React.FC = () => {
  return (
    <Bg>
      <div style={labelStyle}>Custom Components with Style Prop</div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        <MotionTransition
          transition={{
            opacity: [0, 1],
            y: [50, 0],
            rotate: [15, 0],
            duration: 70,
            stagger: 6,
            easing: "easeOutCubic",
          }}
        >
          <Circle color="#3b82f6" />
          <Triangle color="#ef4444" />
          <RoundedSquare color="#10b981" />
          <Star color="#f59e0b" />
          <Cross color="#8b5cf6" />
        </MotionTransition>
      </div>
    </Bg>
  );
};

export const ComplexMotionShowcase: React.FC = () => {
  return (
    <Bg>
      <div style={labelStyle}>Complex Multi-Property Animation</div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        <MotionTransition
          transition={{
            opacity: [0, 1, 1, 0.8],
            y: [100, -20, 0, 0],
            scale: [0.5, 1.1, 1, 1],
            rotate: [0, 0, 360, 360],
            duration: 90,
            stagger: 8,
            staggerDirection: "forward",
            easing: "easeInOutCubic",
          }}
        >
          <Circle color="#3b82f6" />
          <Triangle color="#ef4444" />
          <RoundedSquare color="#10b981" />
          <Star color="#f59e0b" />
        </MotionTransition>
      </div>
    </Bg>
  );
};

export const NestedElementsShowcase: React.FC = () => {
  return (
    <Bg>
      <div style={labelStyle}>Component Style Forwarding</div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        <MotionTransition
          transition={{
            opacity: [0, 1],
            y: [80, 0],
            duration: 80,
            stagger: 10,
            easing: "easeOutQuart",
          }}
        >
          <Circle color="#3b82f6" />
          <Triangle color="#ef4444" />
          <RoundedSquare color="#10b981" />
          <Star color="#f59e0b" />
          <Cross color="#8b5cf6" />
        </MotionTransition>
      </div>
    </Bg>
  );
};

export const RandomGridShowcase: React.FC = () => {
  // Create 24 grid items using the shape components (4 rows x 6 columns)
  const shapes = [Circle, Triangle, RoundedSquare, Star, Cross];
  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

  const gridItems = Array.from({ length: 48 }, (_, i) => {
    const ShapeComponent = shapes[i % shapes.length];
    const color = colors[i % colors.length];
    return <ShapeComponent key={i} color={color} />;
  });

  return (
    <Bg>
      <MotionTransition
        transition={{
          y: [200, -200],
          duration: 120,
        }}
      >

        <MotionTransition
          transition={{
            opacity: [0, 1],
            scale: [0.5, 1],
            duration: 10,
            stagger: 1,
            staggerDirection: "random",
            easing: "easeOutCubic",
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "1rem",
          }}
        >
          {gridItems}
        </MotionTransition>
      </MotionTransition>
    </Bg>
  );
};

export const MotionTransitionShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <Sequence from={0} durationInFrames={90}>
        <FadeInStaggerShowcase />
      </Sequence>

      <Sequence from={90} durationInFrames={90}>
        <ReverseStaggerShowcase />
      </Sequence>

      <Sequence from={180} durationInFrames={90}>
        <CenterStaggerShowcase />
      </Sequence>

      <Sequence from={270} durationInFrames={100}>
        <CustomComponentShowcase />
      </Sequence>

      <Sequence from={370} durationInFrames={120}>
        <ComplexMotionShowcase />
      </Sequence>

      <Sequence from={490} durationInFrames={110}>
        <NestedElementsShowcase />
      </Sequence>

      <Sequence from={600} durationInFrames={100}>
        <RandomGridShowcase />
      </Sequence>
    </AbsoluteFill>
  );
};
