import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Particles, Spawner, useViewportRect, Scene3D, Step } from "remotion-bits";

export const metadata = {
  name: "Scrolling Columns",
  description: "Four columns of images scrolling with different speeds in a panning 3D scene",
  tags: ["particles", "3d", "scrolling", "columns"],
  duration: 300,
  width: 1920,
  height: 1080,
};

export const Component: React.FC = () => {
  const rect = useViewportRect();
  const { durationInFrames } = useVideoConfig();

  const columns = [
    { x: -rect.width * 0.3, speed: 4, color: "#ef4444", z: 50 },
    { x: -rect.width * 0.1, speed: 7, color: "#3b82f6", z: 0 },
    { x: rect.width * 0.1, speed: 5, color: "#10b981", z: 100 },
    { x: rect.width * 0.3, speed: 6, color: "#f59e0b", z: -50 },
  ];

  const itemWidth = rect.width * 0.15;
  const itemHeight = itemWidth * 1.2;
  const gap = 30;

  const wrapperStyle: React.CSSProperties = {
    position: 'absolute',
    width: rect.width,
    height: rect.height,
    left: -rect.width / 2,
    top: -rect.height / 2,
  };

  const cardColors = [
    "#ef4444", "#f87171", "#fca5a5",
    "#3b82f6", "#60a5fa", "#93c5fd",
    "#10b981", "#34d399", "#6ee7b7",
    "#f59e0b", "#fbbf24", "#fcd34d",
    "#8b5cf6", "#a78bfa", "#c4b5fd",
  ];

  const ImagePlaceholder: React.FC<{
    color: string;
    width: number;
    height: number;
    text: string;
  }> = ({ color, width, height, text }) => (
    <div
      style={{
        width,
        height,
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: width * 0.2,
        borderRadius: width * 0.05,
        boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
        border: "2px solid rgba(255,255,255,0.1)",
      }}
    >
      {text}
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#111827" }}>
      <Scene3D
        perspective={2000}
        transitionDuration={durationInFrames}
        stepDuration={1}
        activeStep={1}
      >
        <Step
          id="start"
          x={-rect.width * 0.2}
          y={rect.height * 1.5}
          scale={0.85}
        />
        <Step
          id="end"
          x={rect.width * 0.5}
          y={rect.height * 1.2}
          scale={1.0}
        />
        <div style={wrapperStyle}>
          <Particles>
            {columns.map((col, i) => {
              const rate = col.speed / (itemHeight + gap);
              return (
                <Spawner
                  key={i}
                  rate={rate}
                  position={{
                    x: col.x + rect.width / 2 - itemWidth / 2,
                    y: -rect.height * 0.15,
                    z: col.z
                  }}
                  velocity={{ x: 0, y: col.speed, z: 0 }}
                  lifespan={durationInFrames + 200}
                  startFrame={150}
                >
                  {cardColors.map((color, idx) => (
                    <ImagePlaceholder
                      key={idx}
                      color={color}
                      width={itemWidth}
                      height={itemHeight}
                      text={String((idx % 9) + 1)}
                    />
                  ))}
                </Spawner>
              );
            })}
          </Particles>
        </div>
      </Scene3D>
    </AbsoluteFill>
  );
};
