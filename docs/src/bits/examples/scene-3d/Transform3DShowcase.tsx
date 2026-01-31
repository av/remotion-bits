import React from "react";
import {
  Scene3D,
  Step,
  Element3D,
  useViewportRect,
  Transform3D,
  Vector3,
  interpolateTransform,
  StaggeredMotion,
  Matrix4,
} from "remotion-bits";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export const metadata = {
  name: "Transform3D Showcase",
  description: "Demonstrates chainable Transform3D API with matrix-based interpolation, relative transforms, and smooth quaternion rotations",
  tags: ["3d", "transform", "matrix", "quaternion", "chainable"],
  duration: 500,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-transform3d-showcase",
    title: "Transform3D Showcase",
    description: "Demonstrates chainable Transform3D API with matrix-based interpolation",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["scene-3d", "use-viewport-rect", "transform3d"],
    dependencies: ["three"],
    files: [
      {
        path: "docs/src/bits/examples/scene-3d/Transform3DShowcase.tsx",
      },
    ],
  },
};

export const Component: React.FC = () => {
  const rect = useViewportRect();
  const frame = useCurrentFrame();
  const fontSize = rect.vmin * 4;

  const baseTransform = React.useMemo(() => {
    return Transform3D.identity()
      .translate(0, rect.vmin * -10, 0)
      .rotateZ(Math.PI / 8)
  }, [rect.vmin]);

  const createSatelliteTransform = (angle: number, distance: number, height: number) => {
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;

    return Transform3D.identity()
      .translate(x, height, z)
      .rotateY(angle + Math.PI / 2);
  };

  // Demonstrate smooth matrix-based interpolation between keyframes
  const orbitProgress = (frame % 100) / 100;
  const orbit1 = createSatelliteTransform(orbitProgress * Math.PI * 2, rect.vmin * 40, rect.vmin * 5);
  const orbit2 = createSatelliteTransform((orbitProgress + 0.33) * Math.PI * 2, rect.vmin * 40, rect.vmin * 5);
  const orbit3 = createSatelliteTransform((orbitProgress + 0.66) * Math.PI * 2, rect.vmin * 40, rect.vmin * 5);

  // Demonstrate keyframe interpolation
  const keyframes = React.useMemo(() => [
    Transform3D.fromEuler(0, 0, 0, new Vector3(0, 0, 0)),
    Transform3D.fromEuler(Math.PI / 2, 0, 0, new Vector3(0, rect.vmin * 30, rect.vmin * 50)),
    Transform3D.fromEuler(Math.PI, Math.PI / 2, 0, new Vector3(rect.vmin * 60, rect.vmin * 15, rect.vmin * 30)),
    Transform3D.fromEuler(0, Math.PI, Math.PI / 2, new Vector3(rect.vmin * 60, rect.vmin * -15, 0)),
  ], [rect.vmin]);

  const cubeSize = rect.vmin * 8;
  const orbitSize = rect.vmin * 5;
  const enterExit = {
    transition: { blur: [20, 0] },
    exitTransition: { blur: [0, 20] },
  }

  const relativeStep = Transform3D.identity()
    .translate(rect.vmin * 200, rect.vmin * 20, rect.vmin * -50)
    .rotateX(10)
    .scaleBy(0.5, 0.5, 0.5);

  const relativeTransform = Transform3D.identity()
    .translate(rect.vmin * 25, rect.vmin * -7, 0)
    .rotateX(-5)

  const nestedTransform = Transform3D.identity()
    .translate(rect.vmin * 10, 0, 0)
    .rotateX(frame * 0.05)
    // .rotateY(frame * 0.25)
    // .rotateZ(frame * 0.25)
    .scaleBy(1.1);

  const chainableBase = Transform3D.identity()
    .translate(rect.vmin * 40, -rect.vmin * 35, 0);

  return (
    <AbsoluteFill
      style={{
        background: 'var(--color-background-dark)',
      }}
    >
      <Scene3D
        perspective={1200}
        transitionDuration={60}
        stepDuration={80}
        easing="easeInOutCubic"
      >
        <Step id="intro"
          {...baseTransform.toProps()}
          {...enterExit}
        >
          <div style={{
            fontSize: fontSize * 1.5,
            color: "var(--color-primary-hover)",
            textAlign: "center",
            padding: `${rect.vmin * 2}px ${rect.vmin * 4}px`,
            borderRadius: `${rect.vmin * 1}px`,
            width: rect.width * 0.8,
          }}>
            <h1 style={{ margin: 0, fontSize: fontSize * 1.5 }}>Transform3D API</h1>
            <p style={{ margin: `${rect.vmin * 2}px 0 0`, fontSize, opacity: 0.8 }}>
              Chainable • Matrix-based • Quaternion SLERP
            </p>
          </div>
        </Step>

        <Step id="chainable"
          {...baseTransform.translate(rect.vmin * 100, 0, 0).rotateY(-15).toProps()}
          {...enterExit}
          duration={120}
        >
          <div style={{
            background: "rgba(0,0,0,0.15)",
            padding: `${rect.vmin * 3}px`,
            borderRadius: `${rect.vmin * 1}px`,
            border: `${rect.vmin * 0.3}px solid var(--color-border-light)`,
            width: rect.vmin * 45,
            transform: "translateX(-50%)",
          }}>
            <h2 style={{ fontSize, color: "var(--color-primary-hover)", margin: `0 0 ${rect.vmin * 2}px` }}>
              Chainable Transforms
            </h2>
            <pre style={{
              fontSize: fontSize * 0.6,
              color: "var(--color-primary-hover)",
              margin: 0,
              lineHeight: 1.6,
            }}>
              {`Transform3D.identity()
  .translate(x, y, z)
  .rotateZ(Math.PI / 8)
  .scaleBy(1.5, 1.5, 1.5)`}
            </pre>
          </div>

          <StaggeredMotion
            transition={{
              delay: 20,
              duration: 80,
              transform: [
                chainableBase,
                chainableBase.translate(rect.vmin * 20, 0, 0).rotateZ(90),
                chainableBase.translate(rect.vmin * 20, rect.vmin * 20, 0).scaleBy(0.5),
                chainableBase.translate(0, rect.vmin * 20, 0).rotateY(180),
                chainableBase,
              ],
              easing: "easeInOutCubic",
            }}
          >
            <div style={{
              width: cubeSize,
              height: cubeSize,
              border: `${rect.vmin * 1}px solid var(--color-primary-hover)`,
              transformStyle: "preserve-3d",
            }} />
          </StaggeredMotion>
        </Step>

        <Step id="relative"
          {...relativeStep.toProps()}
          {...enterExit}
          style={{
            position: 'absolute',
            perspective: '1000px',
          }}
        >
          <div style={{
            background: "rgba(0,0,0,0.15)",
            padding: `${rect.vmin * 3}px`,
            borderRadius: `${rect.vmin * 1}px`,
            border: `${rect.vmin * 0.3}px solid var(--color-border-light)`,
            transform: "translateY(-50%)",
          }}>
            <h2 style={{ fontSize, color: "var(--color-primary-hover)", margin: `0 0 ${rect.vmin * 2}px` }}>
              Relative Positioning
            </h2>
            <pre style={{
              fontSize: fontSize * 0.6,
              color: "var(--color-primary)",
              margin: 0,
              lineHeight: 1.6,
            }}>
              {`// Satellites orbit parent
const orbit = Transform3D.identity()
  .translate(x, y, z)
  .rotateY(angle)`}
            </pre>
          </div>

          {/* Central cube */}
          <Element3D
            {...relativeTransform.toProps()}
          >
            <div style={{
              width: cubeSize,
              height: cubeSize,
              border: `${rect.vmin}px solid var(--color-primary-hover)`,
            }} />
          </Element3D>

          {/* Orbiting satellites */}
          <Element3D
            {...relativeTransform.toProps()}
          >
            <div style={{
              position: "absolute",
              width: orbitSize,
              height: orbitSize,
              border: `${rect.vmin}px solid var(--color-primary-hover)`,
              borderRadius: "50%",
              transform: orbit1.toCSSMatrix3D(),
            }} />
          </Element3D>

          <Element3D
            {...relativeTransform.toProps()}
          >
            <div style={{
              position: "absolute",
              width: orbitSize,
              height: orbitSize,
              border: `${rect.vmin}px solid var(--color-primary-hover)`,
              borderRadius: "50%",
              transform: orbit2.toCSSMatrix3D(),
            }} />
          </Element3D>

          <Element3D
            {...relativeTransform.toProps()}
          >
            <div style={{
              position: "absolute",
              width: orbitSize,
              height: orbitSize,
              border: `${rect.vmin}px solid var(--color-primary-hover)`,
              borderRadius: "50%",
              transform: orbit3.toCSSMatrix3D(),
            }} />
          </Element3D>
        </Step>

        <Step id="interpolation"
          x={rect.vmin * 300} y={rect.vmin * -20} z={rect.vmin * 30} rotateY={25}
          {...enterExit}
        >
          <div style={{
            background: "rgba(0,0,0,0.15)",
            padding: `${rect.vmin * 3}px`,
            borderRadius: `${rect.vmin * 1}px`,
            border: `${rect.vmin * 0.3}px solid var(--color-border-light)`,
          }}>
            <h2 style={{ fontSize, color: "var(--color-primary-hover)" }}>
              Smooth Interpolation
            </h2>
            <pre style={{
              fontSize: fontSize * 0.6,
              color: "var(--color-primary)",
              margin: 0,
              lineHeight: 1.6,
            }}>
              {`// Quaternion SLERP - no gimbal lock!
interpolateTransform(
  from, to, progress, easing
)`}
            </pre>
            <p style={{
              fontSize: fontSize * 0.7,
              color: "var(--color-surface-light)",
              margin: `${rect.vmin * 2}px 0 0`,
            }}>
              ✓ Natural rotation paths<br />
              ✓ No gimbal lock artifacts<br />
              ✓ Single matrix operation
            </p>
          </div>
        </Step>

        <Step id="composition" x={rect.vmin * 400} y={0} z={0} rotateY={-10}
          {...enterExit}
        >
          <div style={{
            background: "rgba(0,0,0,0.15)",
            padding: `${rect.vmin * 3}px`,
            borderRadius: `${rect.vmin * 1}px`,
            border: `${rect.vmin * 0.3}px solid var(--color-border-light)`,
            width: rect.vmin * 80,
            transform: "translateY(-20%)",
          }}>
            <h2 style={{ fontSize, color: "var(--color-primary-hover)", margin: `0 0 ${rect.vmin * 2}px` }}>
              Transform Composition
            </h2>
            <pre style={{
              fontSize: fontSize * 0.6,
              color: "var(--color-primary)",
              margin: 0,
              lineHeight: 1.6,
            }}>
              {`// Combine transforms
const combined = parent
  .multiply(child)
  
// Apply to points
const worldPos = transform
  .apply(localPos)`}
            </pre>
          </div>

          <Element3D
            x={rect.vmin * -10}
            scale={1.5}
          >
            <Element3D
              {...nestedTransform.toProps()}
              style={{
                width: cubeSize,
                height: cubeSize,
                border: `${rect.vmin * 0.3}px solid var(--color-primary-hover)`,
                transformStyle: "preserve-3d",
              }}
            >
              <Element3D
                {...nestedTransform.toProps()}
                style={{
                  width: cubeSize,
                  height: cubeSize,
                  border: `${rect.vmin * 0.3}px solid var(--color-primary-hover)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <Element3D
                  {...nestedTransform.toProps()}
                  style={{
                    width: cubeSize,
                    height: cubeSize,
                    border: `${rect.vmin * 0.3}px solid var(--color-primary-hover)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <Element3D
                    {...nestedTransform.toProps()}
                    style={{
                      width: cubeSize,
                      height: cubeSize,
                      border: `${rect.vmin * 0.3}px solid var(--color-primary-hover)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                  </Element3D>
                </Element3D>
              </Element3D>
            </Element3D>
          </Element3D>
        </Step>

        <Step id="outro"
          x={rect.vmin * 400} y={rect.vmin * 200} z={0} rotateY={-10}
          {...enterExit}
        />
      </Scene3D >

    </AbsoluteFill>
  );
};
