import React from 'react';
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
}) => {
  return (
    <div className={`showcase-player ${className}`}>
      <Player
        component={Component}
        durationInFrames={duration}
        compositionWidth={width}
        compositionHeight={height}
        fps={fps}
        controls={controls}
        loop={loop}
        autoPlay={autoPlay}
        style={{
          width: '100%',
          aspectRatio: `${width} / ${height}`,
        }}
      />
    </div>
  );
};
