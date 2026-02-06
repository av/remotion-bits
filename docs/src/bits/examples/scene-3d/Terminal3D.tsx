import React from 'react';
import { Scene3D, Step, useViewportRect, TypeWriter, StaggeredMotion } from 'remotion-bits';

export const metadata = {
  name: '3D Terminal',
  description: 'A 3D scene with multiple terminal windows executing commands.',
  tags: ['3d', 'terminal', 'typewriter', 'code'],
  duration: 300,
  width: 1920,
  height: 1080,
  registry: {
    name: 'bit-terminal-3d',
    title: '3D Terminal',
    description: 'A 3D scene with multiple terminal windows executing commands.',
    type: 'bit' as const,
    add: 'when-needed' as const,
    registryDependencies: ['scene-3d', 'typewriter'],
    dependencies: [],
    files: [
      {
        path: 'docs/src/bits/examples/scene-3d/Terminal3D.tsx',
      },
    ],
  },
};

export const Component: React.FC = () => {
  const rect = useViewportRect();

  // Pre-calculate sizing based on viewport to be responsive
  const termWidth = rect.width * 0.4;
  const termHeight = rect.height * 0.5;

  const TerminalWindow = ({
    title,
    children,
    width,
    height,
    style,
  }: {
    title: string;
    children: React.ReactNode;
    width: number;
    height: number;
    style?: React.CSSProperties;
  }) => {
    const fontSize = width * 0.04;
    return (
      <div
        style={{
          ...style,
          width,
          height,
          backgroundColor: 'var(--color-surface-dark)',
          borderRadius: width * 0.02,
          overflow: 'hidden',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid var(--color-border-light)',
        }}
      >
        <div
          style={{
            height: width * 0.08,
            backgroundColor: 'var(--color-surface-light)',
            display: 'flex',
            alignItems: 'center',
            padding: `0 ${width * 0.02}px`,
            borderBottom: '1px solid var(--color-border-light)',
          }}
        >
          <div style={{ display: 'flex', gap: width * 0.015 }}>
            <div
              style={{
                width: width * 0.03,
                height: width * 0.03,
                borderRadius: '50%',
                backgroundColor: '#ff5f56',
              }}
            />
            <div
              style={{
                width: width * 0.03,
                height: width * 0.03,
                borderRadius: '50%',
                backgroundColor: '#ffbd2e',
              }}
            />
            <div
              style={{
                width: width * 0.03,
                height: width * 0.03,
                borderRadius: '50%',
                backgroundColor: '#27c93f',
              }}
            />
          </div>
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              color: 'currentColor',
              fontSize: fontSize * 0.8,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: width * 0.04,
            color: 'currentColor',
            fontSize,
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    );
  };

  return (
    <Scene3D
      perspective={1000}
      transitionDuration={40}
      stepDuration={60}
      easing="easeInOutCubic"
    >
      {/* Step 1: Main terminal */}
      <Step
        id="main"
      >
        <StaggeredMotion
          transition={{
            duration: 120,
            rotateY: [-5, 5],
            rotateX: [-5, 5],
            easing: 'easeInOutCubic',
          }}
          style={{
            transformStyle: 'preserve-3d',
            perspective: rect.width * 2,
          }}
        >
          <TerminalWindow title="user@dev:~/project" width={termWidth} height={termHeight}>
            <span style={{ color: '#4caf50' }}>➜</span> <span style={{ color: '#64b5f6' }}>~/project</span> <span style={{ color: '#f44336' }}>git</span> status
            {'\n'}
            <TypeWriter
              text={[
                "On branch main\nYour branch is up to date with 'origin/main'.\n\nworking tree clean",
              ]}
              typeSpeed={1}
              pauseAfterType={30}
              cursor={false}
            />
          </TerminalWindow>
        </StaggeredMotion>
      </Step>

      {/* Step 2: Side terminal */}
      <Step
        id="side"
        x={rect.width * 0.8}
        y={0}
        z={150}
        rotateY={-45}
      >
        <StaggeredMotion
          transition={{
            duration: 100,
            rotateY: [5, -5],
            rotateX: [5, -5],
            easing: 'easeInOutCubic',
          }}
          style={{
            transformStyle: 'preserve-3d',
            perspective: rect.width * 2
          }}
        >
          <TerminalWindow title="server-logs" width={termWidth} height={termHeight}>
            <div style={{ color: '#81c784' }}>
              [INFO] Server started on port 3000
            </div>
            <TypeWriter
              text={[
                "[INFO] Connected to database\n[WARN] High memory usage detected\n[INFO] Request handled in 23ms",
              ]}
              typeSpeed={2}
              pauseAfterType={10}
              cursor
            />
          </TerminalWindow>
        </StaggeredMotion>
      </Step>

      {/* Step 3: Top terminal */}
      <Step
        id="top"
        x={rect.width * 0.8}
        y={-rect.height * 0.8}
        z={150}
      >
        <StaggeredMotion
          transition={{
            duration: 100,
            rotateY: [5, -5],
            rotateX: [5, -5],
            easing: 'easeInOutCubic',
          }}
          style={{
            transformStyle: 'preserve-3d',
            perspective: rect.width * 2
          }}
        >
          <TerminalWindow title="build-process" width={termWidth} height={termHeight}>
            <TypeWriter
              text={[
                "> build project\n> transpile modules\n> optimize assets\n\nBuild successful! ✨",
              ]}
              typeSpeed={1}
              cursor
            />
          </TerminalWindow>
        </StaggeredMotion>
      </Step>
    </Scene3D>
  );
};
