import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { useViewportRect } from '../hooks/useViewportRect';
import { random } from 'remotion';

export interface MatrixRainProps {
  fontSize?: number;
  color?: string;
  speed?: number;
  density?: number;
  streamLength?: number;
  charset?: string;
}

const DEFAULT_CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';

export const MatrixRain: React.FC<MatrixRainProps> = ({
  fontSize = 20,
  color = '#00FF00',
  speed = 1,
  density = 1,
  streamLength = 20,
  charset = DEFAULT_CHARSET,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useViewportRect();

  const cols = Math.floor(width / fontSize);
  const rows = Math.ceil(height / fontSize);

  const streams = useMemo(() => {
    return new Array(cols).fill(0).map((_, i) => {
      // Deterministic randomness based on column index
      const seed = i; 
      
      // Determine if this column has a stream based on density
      // We can use a property of the random value to gate it
      // But user asked for "density (how many drops)". Maybe probability?
      // If density is 1, all cols. If 0.5, half cols.
      const isVisible = random(seed) < Math.min(Math.max(density, 0), 1);
      
      const columnSpeed = speed * (0.5 + random(seed + 1) * 1.5); // Random speed between 0.5x and 2x base speed
      const offset = random(seed + 2) * (height + streamLength * fontSize); // Start position offset

      return {
        isVisible,
        speed: columnSpeed,
        offset,
        seed,
      };
    });
  }, [cols, density, height, speed, streamLength, fontSize]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        fontFamily: 'monospace',
        fontSize,
        lineHeight: 1,
        overflow: 'hidden',
      }}
    >
      {streams.map((stream, colIndex) => {
        if (!stream.isVisible) return null;

        const effectiveHeight = height + streamLength * fontSize;
        // Calculate head position in pixels
        // (frame * speed + offset) % total_loop_distance
        // note: speed is per frame.
        // We probably want speed in pixels/frame?
        // Default speed=1 is distinct. Let's say default is fontSize/2 per frame?
        const speedPx = stream.speed * (fontSize); 
        
        const headY = (frame * speedPx + stream.offset) % effectiveHeight;
        
        // We only render characters that are currently visible
        // Optimization: calculate start and end row indices
        // Visible area is [0, height]
        // Stream occupies [headY - streamLength*fontSize, headY] (wrapping handled via logic or just letting it flow)
        
        // Actually, let's just iterate rows for simplicity as in the prompt plan
        // "Render characters in the column if their Y position is between head and head - streamLength"
        
        const chars = [];
        
        // Optimization: instead of iterating all rows (which might be many), 
        // we can iterate the stream length? 
        // But the head might be offscreen. 
        // Iterating rows [0...rows] is safer for correctness with small row count.
        
        for (let r = 0; r < rows; r++) {
          const y = r * fontSize;
          
          // Check distance to head
          // We need to handle the wrap around case visually? 
          // The formula for head implies it moves linearly and wraps.
          // So if headY is 100, and streamLength is 5 chars (100px), 
          // chars at 80, 60, 40, 20, 0 are active.
          
          // distance from head
          const dist = headY - y;
          const distInChars = dist / fontSize;
          
          if (distInChars >= 0 && distInChars < streamLength) {
             // It is in the stream
             
             // Is it the head?
             const isHead = distInChars < 1;
             
             // Character selection
             // Change randomly every few frames
             // Use frame, col, row
             const charSeed = stream.seed * 1000 + r * 100 + Math.floor(frame / 4);
             // We can use remotion random
             const charIndex = Math.floor(random(charSeed) * charset.length);
             const char = charset[charIndex];
             
             // Brightness / Color
             let charColor = color;
             let opacity = 1;
             
             if (isHead) {
               charColor = '#FFFFFF';
               // Add a glow effect? CSS text-shadow
             } else {
               // Fade out tail
               opacity = 1 - (distInChars / streamLength);
             }
             
             chars.push(
               <div
                 key={r}
                 style={{
                   position: 'absolute',
                   top: y,
                   left: colIndex * fontSize,
                   color: charColor,
                   opacity,
                   textShadow: isHead ? '0 0 8px white' : undefined,
                   fontWeight: isHead ? 'bold' : 'normal',
                 }}
               >
                 {char}
               </div>
             );
          }
        }
        
        return <React.Fragment key={colIndex}>{chars}</React.Fragment>;
      })}
    </AbsoluteFill>
  );
};
