import { useMemo } from 'react';
import { useVideoConfig } from 'remotion';
import { createRect, Rect } from '../utils/geometry';

/**
 * Returns a Rect representing the current video composition's viewport.
 * Uses useVideoConfig() internally.
 */
export const useViewportRect = (): Rect => {
  const { width, height } = useVideoConfig();

  return useMemo(() => {
    return createRect(width, height);
  }, [width, height]);
};
