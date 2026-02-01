import React from 'react';
import { MatrixRain } from 'remotion-bits';

export const metadata = {
  name: 'Matrix Rain',
  description: 'Digital rain animation inspired by The Matrix',
  tags: ['text', 'matrix', 'code', 'background'],
  duration: 300,
  width: 1920,
  height: 1080,
  registry: {
    name: 'bit-matrix-rain',
    title: 'Matrix Rain',
    description: 'Digital rain animation inspired by The Matrix',
    type: 'bit' as const,
    add: 'when-needed' as const,
    registryDependencies: ['matrix-rain'],
    dependencies: [],
    files: [
      {
        path: 'docs/src/bits/examples/animated-text/MatrixRain.tsx',
      },
    ],
  },
};

export const props = {
  fontSize: 30,
  color: '#00FF41',
  speed: 1,
  density: 1,
  streamLength: 15,
};

export const controls = [
  { key: 'fontSize', type: 'number' as const, label: 'Font Size', min: 10, max: 100, step: 1 },
  { key: 'color', type: 'color' as const, label: 'Color' },
  { key: 'speed', type: 'number' as const, label: 'Speed', min: 0.1, max: 5, step: 0.1 },
  { key: 'density', type: 'number' as const, label: 'Density', min: 0, max: 1, step: 0.01 },
  { key: 'streamLength', type: 'number' as const, label: 'Stream Length', min: 5, max: 50, step: 1 },
];

export const Component: React.FC = () => (
  <MatrixRain
    fontSize={props.fontSize}
    color={props.color}
    speed={props.speed}
    density={props.density}
    streamLength={props.streamLength}
  />
);
