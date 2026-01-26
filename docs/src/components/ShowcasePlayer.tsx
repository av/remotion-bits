import React, { useRef, useState, useEffect } from 'react';
import { Player } from '@remotion/player';

interface ShowcasePlayerProps {
  component: React.ComponentType;
  duration: number;
  fps?: number;
  width?: number;
  height?: number;
  controls?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  className?: string;
  autoResize?: boolean;
}

export const ShowcasePlayer: React.FC<ShowcasePlayerProps> = ({
  component: Component,
  duration,
  fps = 30,
  width = 1920,
  height = 1080,
  controls = true,
  loop = true,
  autoPlay = true,
  className = '',
  autoResize = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width, height });

  useEffect(() => {
    if (!autoResize || !containerRef.current) return;

    // Initial measurement
    const initialRect = containerRef.current.getBoundingClientRect();
    setSize({ width: initialRect.width, height: initialRect.height });

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [autoResize]);

  // Use props if autoResize is false, otherwise use measured size (with prop fallbacks for initial render)
  const compositionWidth = autoResize ? (size.width || width) : width;
  const compositionHeight = autoResize ? (size.height || height) : height;

  return (
    <div
      ref={containerRef}
      className={`showcase-player ${className}`}
      style={autoResize ? { width: '100%', height: '100%' } : undefined}
    >
      <Player
        component={Component}
        durationInFrames={duration}
        compositionWidth={Math.floor(compositionWidth)}
        compositionHeight={Math.floor(compositionHeight)}
        fps={fps}
        controls={controls}
        loop={loop}
        autoPlay={autoPlay}
        style={{
          width: '100%',
          height: autoResize ? '100%' : undefined,
          // aspectRatio: `${width} / ${height}`,
        }}
      />
    </div>
  );
};
