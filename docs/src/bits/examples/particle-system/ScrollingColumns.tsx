import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Particles, Spawner, useViewportRect, resolvePoint, Scene3D, Step } from "remotion-bits";

export const metadata = {
  name: "Scrolling Columns",
  description: "Four columns of images scrolling with different speeds in a panning 3D scene",
  tags: ["particles", "3d", "scrolling", "columns"],
  duration: 300,
  width: 1920,
  height: 1080,
};

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
    }}
  >
    {text}
  </div>
);

export const Component: React.FC = () => {
  const rect = useViewportRect();
  const { durationInFrames } = useVideoConfig();

  // Columns configuration
  const columns = [
    { x: rect.width * 0.2, speed: 4, color: "#ef4444", z: 50 },
    { x: rect.width * 0.4, speed: 7, color: "#3b82f6", z: 0 },
    { x: rect.width * 0.6, speed: 5, color: "#10b981", z: 100 },
    { x: rect.width * 0.8, speed: 6, color: "#f59e0b", z: -50 },
  ];

  const itemWidth = rect.width * 0.15;
  const itemHeight = itemWidth * 1.2;

  return (
    <AbsoluteFill style={{ backgroundColor: "#111827" }}>
      <Scene3D
        perspective={2000}
        transitionDuration={durationInFrames}
        activeStep={1} // We want to transition to step 1 (End) over the whole duration
      >
        {/* Start Position (Left) */}
        <Step id="start" x={0} y={0} z={0} enterFrame={0} exitFrame={0} />

        {/* End Position (Right) - Pans the camera */}
        <Step id="end" x={rect.width * 0.3} y={0} z={0} enterFrame={0} exitFrame={durationInFrames} />

        {/* Particles are "world" elements, not bound to specific steps, 
            so they look like they adhere to the world coordinate system 
            while the camera moves. 
        */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
             <Particles>
                {columns.map((col, i) => (
                    <Spawner
                        key={i}
                        rate={0.5} // Adjust rate as needed
                        // Spawn above view
                        position={{ x: col.x - itemWidth / 2, y: -itemHeight - 100, z: col.z }}
                        velocity={{ x: 0, y: col.speed, z: 0 }}
                        lifespan={durationInFrames + 200}
                        startFrame={100} // Pre-warm so columns are full at start
                    >
                        <ImagePlaceholder 
                            color={col.color} 
                            width={itemWidth} 
                            height={itemHeight} 
                            text={`Col ${i + 1}`} 
                        />
                        <ImagePlaceholder 
                            color={col.color} 
                            width={itemWidth} 
                            height={itemHeight} 
                            text={`Item B`} 
                        />
                         <ImagePlaceholder 
                            color={col.color} 
                            width={itemWidth} 
                            height={itemHeight} 
                            text={`Item C`} 
                        />
                    </Spawner>
                ))}
            </Particles>
        </div>
      </Scene3D>
    </AbsoluteFill>
  );
};
