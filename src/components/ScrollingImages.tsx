import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useViewportRect } from "../hooks/useViewportRect";

export type ScrollingColumnConfig = {
  images: string[];
  speed?: number; // Percentage of viewport height per second, or pixels per frame? Let's do pixels per frame for now, or maybe related to duration.
  // Actually, let's do speed factor.
  direction?: "up" | "down";
};

export type ScrollingColumnsProps = {
  columns: ScrollingColumnConfig[];
  height?: number | string; // Height of the images
  width?: number | string;
  gap?: number; // Gap between images in a column
  columnGap?: number; // Gap between columns
  className?: string;
  style?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
};

export const ScrollingColumns: React.FC<ScrollingColumnsProps> = ({
  columns,
  height = 300,
  width = "100%",
  gap = 20,
  columnGap = 20,
  className,
  style,
  imageStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps, height: videoHeight } = useVideoConfig();
  const rect = useViewportRect();

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: typeof width === "number" ? width : "100%",
        height: "100%",
        gap: columnGap,
        overflow: "hidden",
        ...style,
      }}
    >
      {columns.map((col, colIndex) => {
        const speed = col.speed ?? 100; // pixels per second?
        const direction = col.direction ?? "up";
        
        // Calculate total height of the column content
        // Assuming fixed height for images for now, or we rely on them loading.
        // To make it simpler, we can accept image aspect ratio or force a height.
        // Let's assume `height` prop applies to each image.
        
        const numericImageHeight = typeof height === "number" ? height : parseInt(height as string) || 300;
        const totalContentHeight = col.images.length * (numericImageHeight + gap);
        
        // Calculate offset based on time
        const offset = (frame / fps) * speed;
        
        // Direction multiplier
        const dirMult = direction === "down" ? 1 : -1;
        
        // Current scroll position
        let translateY = (offset * dirMult) % totalContentHeight;
        
        // If scrolling up (negative translateY), we want to start at 0 and go to -totalContentHeight
        // If scrolling down, we start at 0 and go to totalContentHeight.
        
        // However, we need to cover the viewport.
        // We need to render enough copies to cover the viewport height + buffer.
        // But simpler: render duplicate sets of images so we can loop seamlessly.
        
        // If we have [A, B, C] and total height is H.
        // We are at frame 0. translateY = 0.
        // We render [A, B, C, A, B, C ...] enough to fill screen.
        
        // Let's use a simpler approach for the "infinite" feel:
        // Render 2 or 3 copies of the list, and translate the container.
        // When translate reaches the height of one full set, it resets to 0.
        
        // Adjust translateY so it is always between 0 and -totalContentHeight (for up)
        // or -totalContentHeight and 0 (for down, visually) - actually depends on setup.
        
        // Standard infinite scroll:
        // Position = (offset % unitHeight).
        // If moving up, transform Y goes from 0 to -unitHeight.
        
        const effectiveTranslateY = direction === "up" 
            ? -(offset % totalContentHeight)
            : (offset % totalContentHeight) - totalContentHeight; 

        // We need to render enough items to fill the screen given the translation.
        // A simple strategy is to render the list repeated enough times to cover 
        // 2 * VideoHeight + TotalContentHeight just to be safe and simple.
        
        // Or just render 3 copies: 
        // 1. Above (for down scroll context or just buffer)
        // 2. Center/Current
        // 3. Below (for up scroll context)
        
        // Actually, if we just translate the whole container modulo totalContentHeight,
        // we just need two copies if totalContentHeight > videoHeight.
        // If totalContentHeight < videoHeight, we need more copies.
        
        const minCopies = Math.ceil(videoHeight / totalContentHeight) + 1;
        const copies = Array.from({ length: Math.max(2, minCopies) });

        return (
          <div
            key={colIndex}
            style={{
              flex: 1,
              position: "relative",
              height: "100%",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: gap,
                transform: `translateY(${effectiveTranslateY}px)`,
              }}
            >
              {copies.map((_, copyIndex) => (
                <div key={copyIndex} style={{ display: 'flex', flexDirection: 'column', gap }}>
                    {col.images.map((img, imgIndex) => (
                      <div
                        key={`${copyIndex}-${imgIndex}`}
                        style={{
                          height: numericImageHeight,
                          width: "100%",
                          overflow: "hidden",
                          borderRadius: 8, // Optional, make it nice
                          ...imageStyle,
                        }}
                      >
                        <img
                          src={img}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
