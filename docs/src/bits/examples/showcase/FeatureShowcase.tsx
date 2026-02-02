import React, { useMemo } from 'react';
import { AbsoluteFill, useVideoConfig, Sequence, random } from 'remotion';
import {
  AnimatedText,
  AnimatedCounter,
  TypeWriter,
  CodeBlock,
  StaggeredMotion,
  Particles,
  Spawner,
  Behavior,
  useViewportRect,
  Scene3D,
  Step,
  Element3D,
  interpolate as interpolateUtil,
  Transform3D,
  Vector3,
  StepResponsive,
} from 'remotion-bits';

export const metadata = {
  name: "RemotionBits",
  description: "Promotional showcase for the RemotionBits library.",
  tags: ["showcase", "promo", "library"],
  duration: 1140,
  width: 1920,
  height: 1080,
  registry: {
    name: "bit-remotion-bits-promo",
    title: "RemotionBits",
    description: "A promotional showcase highlighting RemotionBits library capabilities.",
    type: "bit" as const,
    add: "when-needed" as const,
    registryDependencies: ["animated-text", "gradient-transition", "staggered-motion", "particle-system", "scene-3d", "use-viewport-rect"],
    dependencies: [],
    files: [
      {
        path: "docs/src/bits/examples/showcase/FeatureShowcase.tsx",
      },
    ],
  },
};


export const Component: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const rect = useViewportRect();
  const { vmin, vmax } = rect;

  const revealBaseDelay = 20;
  const revealStagger = 30;
  const revealDuration = 20;

  const fontSize = vmin * 10;

  const positions = useMemo(() => {
    const base = Transform3D.identity();
    const initialIconBase = base.translate(-vmin * 40, -vmin * 1, 0);

    const elementsBase = base.translate(0, -vmin * 120, 0).rotateX(15);
    const elementsIconBase = elementsBase.translate(0, 0, 0).scaleBy(2.0).rotateZ(-240);

    const transitionsBase = base.translate(vmin * 200, vmin * 50, 0).rotateY(-15);
    const transitionsIconBase = transitionsBase.translate(0, vmin * -20, 0).scaleBy(2.0);

    const scenesBase = base.translate(-vmin * 120, vmin * 70, 0).rotateY(15);
    const scenesIconBase = scenesBase.scaleBy(2.0);

    const sceneItems = {
      hero: base.translate(vmin * 28, vmin * -5, vmin * 5).rotateY(-10),
      dash: base.translate(vmin * -80, vmin * -30, 0).rotateY(5),
      notif: base.translate(vmin * -70, vmin * 0, vmin * 10),
      code: base.translate(vmin * 50, vmin * -30),
      player: base.translate(vmin * -17, vmin * 18),
    };

    const getScatteredTransform = (t: Transform3D, seed: string) => {
      const r = 50 * vmin;
      const x = (random(seed + 'x') - 0.5) * 2 * r;
      const y = (random(seed + 'y') - 0.5) * 2 * r;
      return t.translate(x, y, 0);
    };

    const triangleOffset = new Vector3(0, -vmin * 2, 0);
    const squareOffset = new Vector3(-vmin * 2, vmin * 2, 0);
    const circleOffset = new Vector3(vmin * 2, vmin * 2, 0);

    const titleTransforms = {
      baseShift: base.translate(vmin * 7, 0, 0),
      elementsShift: elementsBase.translate(vmin * 7, 0, 0),
      transitionsShift: transitionsBase.translate(vmin * 23, 0, 0),
      scenesShift: scenesBase.translate(vmin * 23, 0, 0),
    };

    const titleTransformsUp = {
      elementsShift: titleTransforms.elementsShift.translate(0, -vmin * 10, 0),
      transitionsShift: titleTransforms.transitionsShift.translate(0, -vmin * 10, 0),
      scenesShift: titleTransforms.scenesShift.translate(0, -vmin * 10, 0),
    };

    const iconTransforms = {
      triangle: {
        introFrom: initialIconBase.translate(triangleOffset.clone().multiplyScalar(4.0)),
        introTo: initialIconBase.translate(triangleOffset),
        elementsUp: elementsIconBase.translate(0, -vmin * 10, 0),
      },
      square: {
        introFrom: initialIconBase.translate(squareOffset.clone().multiplyScalar(4)),
        introTo: initialIconBase.translate(squareOffset),
        scenesUp: scenesIconBase.translate(0, -vmin * 10, 0).rotateZ(180),
      },
      circle: {
        introFrom: initialIconBase.translate(circleOffset.clone().multiplyScalar(4)),
        introTo: initialIconBase.translate(circleOffset),
        transitionsUp: transitionsIconBase.translate(0, -vmin * 10, 0),
      },
    };

    const cardW = vmin * 70;
    const cardH = vmin * 40;

    // Row 1
    const elementsParticles = elementsBase.translate(-cardW, -cardH, 0).rotateY(15).rotateX(10);
    const elementsAnimatedText = elementsBase.translate(0, -cardH - vmin * 10, vmin * 10).rotateX(10);
    const elementsCounter = elementsBase.translate(cardW, -cardH, 0).rotateY(-15).rotateX(10);

    // Row 2
    const elementsTypeWriter = elementsBase.translate(-cardW, 0, vmin * 5).rotateY(15);
    const elementsCodeBlock = elementsBase.translate(0, 0, vmin * 10);
    const elementsGlitchCycle = elementsBase.translate(cardW, 0, vmin * 5).rotateY(-15);

    // Row 3
    const elementsSlideIn = elementsBase.translate(-cardW, cardH, 0).rotateY(15).rotateX(-10);
    const elementsCarousel = elementsBase.translate(0, cardH + vmin * 10, vmin * 10).rotateX(-10);
    const elementsTypewriterRewrite = elementsBase.translate(cardW, cardH, 0).rotateY(-15).rotateX(-10);

    return {
      base,
      offsets: {
        triangle: triangleOffset,
        square: squareOffset,
        circle: circleOffset,
      },
      intro: {
        title: [base, titleTransforms.baseShift],
        icons: {
          triangle: [
            initialIconBase.clone().rotateZ(0),
            initialIconBase.clone().rotateZ(180),
            initialIconBase.clone().translate(triangleOffset.multiplyScalar(2.5))
          ],
          square: [
            initialIconBase.clone().rotateZ(0),
            initialIconBase.clone().rotateZ(180),
            initialIconBase.clone().translate(squareOffset.multiplyScalar(2.5))
          ],
          circle: [
            initialIconBase.clone(),
            initialIconBase.clone().rotateX(180),
            initialIconBase.clone().translate(circleOffset.multiplyScalar(2.5))
          ],
        },
      },
      elements: {
        base: elementsBase,
        iconBase: elementsIconBase,
        items: {
          particles: elementsParticles,
          animatedText: elementsAnimatedText,
          counter: elementsCounter,
          typeWriter: elementsTypeWriter,
          codeBlock: elementsCodeBlock,
          glitchCycle: elementsGlitchCycle,
          slideIn: elementsSlideIn,
          carousel: elementsCarousel,
          typewriterRewrite: elementsTypewriterRewrite,
        },
        title: {
          intro: [elementsBase.translate(0, vmin * 10, 0)],
          elements: [elementsBase.translate(0, vmin * 10, 0)],
          transitions: [elementsBase.translate(0, vmin * 10, 0)],
        },
        icons: {
          triangle: {
            elements: elementsIconBase.translate(0, vmin * -7, 0),
          },
        },
      },
      transitions: {
        base: transitionsBase,
        iconBase: transitionsIconBase,
        title: {
          intro: [transitionsBase],
          elements: [transitionsBase],
          transitions: [
            transitionsBase,
          ],
          scenes: [titleTransformsUp.transitionsShift, transitionsBase],
        },
      },
      scenes: {
        base: scenesBase,
        iconBase: scenesIconBase,
        items: {
          hero: [
            sceneItems.hero.translate(0, vmin * 20, 0),
            sceneItems.hero,
          ],
          dash: [
            sceneItems.dash.translate(0, vmin * 15, 0),
            sceneItems.dash,
          ],
          notif: [
            sceneItems.notif.scaleBy(0).translate(0, vmin * 10, 0),
            sceneItems.notif,
          ],
          code: [
            sceneItems.code.translate(0, vmin * 15, 0),
            sceneItems.code,
          ],
          player: [sceneItems.player],
        },
        title: {
          intro: [scenesBase],
          transitions: [scenesBase],
          scenes: [
            scenesBase.translate(0, vmin * 5.0, 0),
          ],
          outro: [
            titleTransformsUp.scenesShift,
            scenesBase
          ],
        },
        icons: {
          square: {
            scenes: [scenesIconBase, iconTransforms.square.scenesUp],
          },
        },
      },
      outro: {
        title: [
          titleTransforms.baseShift,
          titleTransforms.baseShift,
          titleTransforms.baseShift,
          titleTransforms.baseShift,
          base
        ],
        icons: {
          triangle: [
            initialIconBase.clone().translate(triangleOffset.clone()),
            initialIconBase.clone().rotateZ(180),
            initialIconBase.clone().rotateZ(0),
          ],
          square: [
            initialIconBase.clone().translate(squareOffset.clone()),
            initialIconBase.clone().rotateZ(180),
            initialIconBase.clone().rotateZ(0),
          ],
          circle: [
            initialIconBase.clone().translate(circleOffset.clone()),
            initialIconBase.clone().rotateX(180),
            initialIconBase.clone().rotateX(0),
          ],
        },
      },
    };
  }, [rect.width, rect.height]);

  const ShapeIcon = ({
    size,
    variant,
    style,
    className,
  }: {
    size: number;
    variant: 'triangle' | 'square' | 'circle';
    style?: React.CSSProperties;
    className?: string;
  }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill='none'
        stroke="var(--color-primary-hover)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
      >
        {variant === "triangle" && (
          <path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        )}
        {variant === "square" && <rect width="18" height="18" x="3" y="3" rx="2" />}
        {variant === "circle" && <circle cx="12" cy="12" r="10" />}
      </svg>
    );
  };

  const FloatingCard = ({ children }) => (
    <div
      style={{
        position: 'relative',
        width: vmin * 60,
        height: vmin * 30,
        background: 'rgba(20, 20, 30, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--color-primary-hover)',
        borderRadius: vmin * 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(0,0,0,0.2)',
        // transform: 'translate(-50%, -50%)',
      }}
    >
      {children}
    </div>
  );

  const mapElementSteps = (props: any) => ({
    'elements': props,
    'element-particles': props,
    'element-animated-text': props,
    'element-counter': props,
    'element-type-writer': props,
    'element-code-block': props,
    'element-glitch-cycle': props,
    'element-slide-in': props,
    'element-carousel': props,
    'element-typewriter-rewrite': props,
  });

  const gridData = useMemo(() => {
    const items = [];
    const rows = 10;
    const cols = 25;
    const size = 10 * vmin;
    const gap = 1 * vmin;
    const totalW = cols * size + (cols - 1) * gap;
    const totalH = rows * size + (rows - 1) * gap;

    const palette = [
      '#fb4934', '#b8bb26', '#fabd2f', '#83a598',
      '#d3869b', '#8ec07c', '#fe8019', '#d5c4a1'
    ];

    const gradients = [
      'linear-gradient(to right, #100f0f55, transparent)',
      'linear-gradient(to left, #100f0f55, transparent)',
      'linear-gradient(to bottom, #100f0f55, transparent)',
      'linear-gradient(to top, #100f0f55, transparent)',
      'radial-gradient(circle at 50% 50%, #100f0f33, transparent)',
    ]

    const getVariants = () => [
      () => ({ scale: [0, 1] }),
      () => ({ x: [size, 0] }),
      () => ({ x: [-size, 0] }),
      () => ({ y: [size, 0] }),
      () => ({ y: [-size, 0] }),
      () => ({ rotate: [90, 0] }),
      () => ({ rotate: [-90, 0] }),
      () => ({ blur: [0, 0] }),
      () => ({ borderRadius: [size / 2, 4] }),
      () => ({ duration: 30 }),
    ];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Procedural generation
        const seed = `grid-${r}-${c}`;

        // Wave from center
        const cx = (cols - 1) / 2;
        const cy = (rows - 1) / 2;
        const dist = Math.sqrt(Math.pow(r - cy, 2) + Math.pow(c - cx, 2));
        const delayBase = 30 + dist * 2;
        const duration = 40;

        const transitionProps: any = {
          opacity: [0, 1],
          duration,
          delay: delayBase,
          easing: 'easeOutCubic',
          borderRadius: 4,
        };

        const count = Math.floor(random(seed + 'count') * 4) + 2; // 2 to 5
        const variants = getVariants();

        for (let i = 0; i < count; i++) {
          const pick = Math.floor(random(seed + 'pick' + i) * variants.length);
          Object.assign(transitionProps, variants[pick]());
        }

        const colorIndex = Math.floor(random(seed + 'color') * palette.length);
        const gradientIndex = Math.floor(random(seed + 'gradient') * gradients.length);

        const baseStyle: React.CSSProperties = {
          width: size,
          height: size,
          background: `${gradients[gradientIndex]}, ${palette[colorIndex]}`,
          borderRadius: 0,
        };

        items.push(
          <div key={`${r}-${c}`} style={{ position: 'absolute', left: c * (size + gap), top: r * (size + gap), width: size, height: size, transformStyle: 'preserve-3d' }}>
            <StaggeredMotion transition={transitionProps}>
              <div style={{ width: '100%', height: '100%', ...baseStyle }} />
            </StaggeredMotion>
          </div>
        );
      }
    }
    return { items, width: totalW, height: totalH };
  }, [vmin]);

  return (
    <AbsoluteFill
      style={{
        background: 'var(--color-background-dark)',
        color: 'var(--color-primary-hover)',
        position: 'relative',
      }}
    >
      <Scene3D
        perspective={1000}
        stepDuration={60}
        transitionDuration={60}
      >
        <Step
          id="intro"
          {...positions.base.toProps()}
        ></Step>

        <Step
          id="elements"
          {...positions.elements.base.toProps()}
        ></Step>

        <Step
          id="element-particles"
          {...positions.elements.items.particles.toProps()}
          transition={{ opacity: [0, 1], blur: [10, 0] }}
        >
          <FloatingCard>
            <Particles style={{ position: 'absolute', inset: 0, opacity: 0.6 }}>
              <Spawner
                rate={2}
                max={100}
                lifespan={80}
                velocity={{ x: 0, y: -0.6, varianceX: 0.4, varianceY: 0.2 }}
                area={{ width: rect.width, height: rect.height }}
              >
                <div
                  style={{
                    width: vmin * 2,
                    height: vmin * 2,
                    borderRadius: '50%',
                    background: 'var(--color-primary-hover)',
                  }}
                />
              </Spawner>
              <Behavior
                drag={0.96}
                wiggle={{ magnitude: 0.6, frequency: 0.25 }}
                opacity={[1, 0]}
                scale={{ start: 1, end: 0.4, startVariance: 0.2, endVariance: 0.1 }}
              />
            </Particles>
            <span style={{ position: 'relative', zIndex: 1, fontWeight: 'bold', fontSize: vmin * 3, fontFamily: 'monospace' }}>Particles</span>
          </FloatingCard>
        </Step>

        <Step
          id="element-animated-text"
          {...positions.elements.items.animatedText.toProps()}
          transition={{ opacity: [0, 1], blur: [10, 0] }}
        >
          <FloatingCard>
            <AnimatedText
              style={{ fontSize: vmin * 3, fontWeight: 'bold', fontFamily: 'monospace' }}
              transition={{
                delay: 20,
                y: [10, 0],
                opacity: [0, 1],
                blur: [2, 0],
                split: 'character',
                splitStagger: 1,
                duration: 10,
                easing: 'easeInOutCubic',
              }}
            >
              Text Effects
            </AnimatedText>
          </FloatingCard>
        </Step>

        <Step
          id="element-counter"
          {...positions.elements.items.counter.toProps()}
          transition={{ opacity: [0, 1], blur: [10, 0] }}
        >
          <FloatingCard>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: vmin * 1 }}>
              <AnimatedCounter
                transition={{
                  delay: 20,
                  values: [0, 1000],
                  duration: revealDuration,
                }}
                postfix="+"
                style={{ fontSize: vmin * 4, fontWeight: 'bold', fontFamily: 'monospace' }}
              />
              <span style={{ fontSize: vmin * 2, fontFamily: 'monospace', opacity: 0.8 }}>Counter</span>
            </div>
          </FloatingCard>
        </Step>

        <Step
          id="element-type-writer"
          {...positions.elements.items.typeWriter.toProps()}
          transition={{ opacity: [0, 1], blur: [10, 0] }}
        >
          <FloatingCard>
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: vmin * 2,
                fontFamily: 'monospace',
              }}
            >
              <Sequence layout="none" from={20}>
                <TypeWriter
                  text={
                    "import { TypeWriter } from 'remotion-bits';\n\n<TypeWriter\n  text=\"Hello Remotion\"\n  typeSpeed={2}\n  pauseAfterType={20}\n/>"
                  }
                  typeSpeed={2}
                  deleteSpeed={1}
                  pauseAfterType={60}
                  cursor="▋"
                  style={{
                    fontSize: vmin * 1.7,
                    lineHeight: 1.25,
                    whiteSpace: 'pre',
                    opacity: 0.9,
                  }}
                />
              </Sequence>
            </div>
          </FloatingCard>
        </Step>

        <Step
          id="element-code-block"
          {...positions.elements.items.codeBlock.toProps()}
          transition={{ opacity: [0, 1], blur: [10, 0] }}
        >
          <FloatingCard>
            <CodeBlock
              code={
                "import { AnimatedText, useViewportRect } from 'remotion-bits';\n\nconst rect = useViewportRect();\n\n<AnimatedText\n  style={{ fontSize: vmin * 4 }}\n  transition={{ split: 'character', splitStagger: 2 }}\n>\n  Remotion Bits\n</AnimatedText>"
              }
              language="tsx"
              showLineNumbers={false}
              fontSize={vmin * 1.15}
              padding={vmin * 1.2}
              transition={{
                duration: revealDuration,
                delay: 20,
                lineStagger: 2,
                opacity: [0, 1],
                y: [8, 0],
                blur: [10, 0],
              }}
            />
          </FloatingCard>
        </Step>

        <Step
          id="element-glitch-cycle"
          {...positions.elements.items.glitchCycle.toProps()}
          transition={{ opacity: [0, 1], blur: [10, 0] }}
        >
          <FloatingCard>
            <AnimatedText
              style={{
                fontFamily: 'monospace',
                fontSize: vmin * 2.5,
                fontWeight: 'bold',
              }}
              transition={{
                glitch: [0.6, 0],
                frames: [0, 180],
                duration: revealDuration,
                cycle: {
                  texts: ["INITIALIZING", "LOADING", "ONLINE", "READY"],
                  itemDuration: revealDuration * 2,
                },
                delay: 20,
              }}
            />
          </FloatingCard>
        </Step>

        <Step
          id="element-slide-in"
          {...positions.elements.items.slideIn.toProps()}
          transition={{ opacity: [0, 1], blur: [10, 0] }}
        >
          <FloatingCard>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: vmin * 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: vmin * 2,
                fontSize: vmin * 2.5,
                fontWeight: 'bold',
              }}
            >
              <AnimatedText
                transition={{
                  delay: 20,
                  y: [-30, 0],
                  opacity: [0, 1],
                  duration: revealDuration,
                }}
              >
                Top
              </AnimatedText>
              <AnimatedText
                transition={{
                  delay: 25,
                  x: [30, 0],
                  opacity: [0, 1],
                  duration: revealDuration,
                }}
              >
                Right
              </AnimatedText>
              <AnimatedText
                transition={{
                  delay: 30,
                  y: [30, 0],
                  opacity: [0, 1],
                  duration: revealDuration,
                }}
              >
                Bottom
              </AnimatedText>
              <AnimatedText
                transition={{
                  delay: 35,
                  x: [-30, 0],
                  opacity: [0, 1],
                  duration: revealDuration,
                }}
              >
                Left
              </AnimatedText>
            </div>
          </FloatingCard>
        </Step>

        <Step
          id="element-carousel"
          {...positions.elements.items.carousel.toProps()}
          transition={{ opacity: [0, 1], blur: [10, 0] }}
        >
          <FloatingCard>
            <AnimatedText
              style={{
                fontSize: vmin * 3,
                fontWeight: 'bold',
                fontFamily: 'monospace',
              }}
              transition={{
                delay: 20,
                opacity: [0, 1, 1, 0],
                y: [10, 0, 0, -10],
                duration: revealDuration,
                cycle: {
                  texts: ["Design", "Build", "Animate", "Create"],
                  itemDuration: revealDuration,
                },
              }}
            />
          </FloatingCard>
        </Step>

        <Step
          id="element-typewriter-rewrite"
          {...positions.elements.items.typewriterRewrite.toProps()}
          transition={{ opacity: [0, 1], blur: [10, 0] }}
        >
          <FloatingCard>
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: vmin * 2,
                fontFamily: 'monospace',
              }}
            >
              <Sequence layout="none" from={20}>
                <TypeWriter
                  text="Build amazing videos with Remotion"
                  typeSpeed={2}
                  deleteSpeed={3}
                  pauseAfterType={40}
                  pauseAfterDelete={10}
                  loop
                  cursor="▋"
                  style={{
                    fontSize: vmin * 2,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                />
              </Sequence>
            </div>
          </FloatingCard>
        </Step>

        <Step
          id="transitions"
          duration={120}
          exitTransition={{
            blur: [0, 10],
            opacity: [1, 0],
          }}
          {...positions.transitions.base.toProps()}
        >
          <Element3D
            centered
            style={{ width: gridData.width, height: gridData.height }}
          >
            {gridData.items}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 50%, #100f0f88, transparent 30%)',
                zIndex: 100,
                transform: `translateZ(0px)`,
              }}
            >
            </div>
          </Element3D>
        </Step>

        <Step
          id="scenes"
          duration={120}
          {...positions.scenes.base.toProps()}
          style={{
            transformStyle: 'preserve-3d',
          }}
          exitTransition={{
            transform: [
              positions.scenes.base,
              positions.scenes.base.translate(0, vmin * 20, 0),
            ]
          }}
        >
          {/* Scene 1: Marketing Hero (Top Right) */}
          <Element3D
            centered
            style={{ width: vmin * 32, height: vmin * 24 }}
            transition={{
              delay: 10,
              opacity: [0, 1],
              duration: 35,
              transform: positions.scenes.items.hero,
              easing: 'easeInOutCubic',
            }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)',
              borderRadius: vmin * 1.5,
              overflow: 'hidden',
            }}>
              <div style={{ 
                position: 'absolute',
                bottom: vmin * 3, left: vmin * 2.5, right: vmin * 2.5 
              }}>
                <div style={{
                  background: 'white',
                  color: 'black',
                  padding: '0.4em 0.8em',
                  borderRadius: 99,
                  display: 'inline-block',
                  fontSize: vmin * 1.2,
                  fontWeight: 'bold',
                }}>
                  NEW ARRIVAL
                </div>
                <AnimatedText
                  style={{ color: '#fff', fontSize: vmin * 4, lineHeight: 0.9, fontWeight: 900, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
                  transition={{ 
                    delay: 20, duration: 20, split: 'word', splitStagger: 5, y: [10, 0], opacity: [0, 1],
                    easing: 'easeInOutCubic',
                  }}
                >
                  SUMMER VIBES
                </AnimatedText>
              </div>
            </div>
          </Element3D>

          {/* Scene 2: Dashboard/Data (Top Left) */}
          <Element3D
            centered
            style={{ width: vmin * 36, height: vmin * 16 }}
            transition={{
              delay: 20,
              opacity: [0, 1],
              duration: 35,
              transform: positions.scenes.items.dash,
              easing: 'easeInOutCubic',
            }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              background: '#1a1a2e',
              borderRadius: vmin * 1.2,
              padding: vmin * 2.5,
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column',
              lineHeight: '1rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: vmin }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: vmin }}>
                  <div style={{ width: vmin, height: vmin, borderRadius: '50%', background: '#e94560' }} />
                  <span style={{ color: '#fff', fontWeight: 'bold', fontSize: vmin * 1.5 }}>Revenue</span>
                </div>
                <span style={{ color: '#ffffff66', fontSize: vmin * 1.2 }}>This Week</span>
              </div>
              <div style={{ marginBottom: vmin }}>
                <AnimatedCounter
                  transition={{ delay: 20, values: [0, 8492], duration: 45, easing: 'easeOutQuart' }}
                  postfix="$"
                  style={{ color: '#fff', fontSize: vmin * 4, fontWeight: 'bold' }}
                />
              </div>
            </div>
          </Element3D>

          {/* Scene 3: Notification (Bottom Left) */}
          <Element3D
            centered
            style={{ width: vmin * 30 }}
            transition={{
              delay: 30,
              opacity: [0, 1],
              duration: 20,
              transform: positions.scenes.items.notif,
              easing: 'easeOutCubic',
            }}
          >
            <div style={{
              width: '100%',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: vmin * 1.2,
              padding: vmin * 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: vmin * 1.5,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}>
              <div style={{
                width: vmin * 5,
                height: vmin * 5,
                background: '#10B981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width={vmin * 2.5} height={vmin * 2.5} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <div style={{ color: '#111', fontWeight: 'bold', fontSize: vmin * 1.4, lineHeight: 1.2 }}>Render Complete</div>
                <div style={{ color: '#666', fontSize: vmin * 1.1 }}>video_final_v2.mp4</div>
              </div>
            </div>
          </Element3D>

          {/* Scene 4: Code Editor (Bottom Right) */}
          <Element3D
            centered
            style={{ width: vmin * 28, height: vmin * 18 }}
            transition={{
              delay: 40,
              opacity: [0, 1],
              duration: 35,
              easing: 'easeOutCubic',
              transform: positions.scenes.items.code
            }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              background: '#282c34',
              borderRadius: vmin * 1,
              padding: vmin * 1.5,
              boxShadow: '0 15px 30px rgba(0,0,0,0.4)',
              border: '1px solid #3e4451',
              fontFamily: 'monospace',
              fontSize: vmin * 1.2,
              color: '#abb2bf',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', gap: vmin / 2, marginBottom: vmin }}>
                <div style={{ width: vmin, height: vmin, borderRadius: '50%', background: '#e06c75' }} />
                <div style={{ width: vmin, height: vmin, borderRadius: '50%', background: '#e5c07b' }} />
                <div style={{ width: vmin, height: vmin, borderRadius: '50%', background: '#98c379' }} />
              </div>
              <div>
                <span style={{ color: '#c678dd' }}>const</span> <span style={{ color: '#e5c07b' }}>Video</span> = () ={'>'} {'{'}
              </div>
              <div style={{ paddingLeft: vmin * 2 }}>
                <span style={{ color: '#e06c75' }}>return</span> (
              </div>
              <div style={{ paddingLeft: vmin * 4 }}>
                &lt;<span style={{ color: '#e5c07b' }}>Composition</span> /&gt;
              </div>
              <div style={{ paddingLeft: vmin * 2 }}>
                );
              </div>
              <div>{'}'};</div>
            </div>
          </Element3D>
          {/* Scene 5: Player (Left) */}
          <Element3D
            centered
            style={{ width: vmin * 25, height: vmin * 15 }}
            transition={{
              delay: 25,
              opacity: [0, 1],
              duration: 35,
              easing: 'easeOutCubic',
              transform: positions.scenes.items.player
            }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              background: '#000',
              borderRadius: vmin * 1,
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              border: '1px solid #333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(45deg, #111, #222)',
                opacity: 0.5
              }} />

              {/* Play button */}
              <div style={{
                width: vmin * 6,
                height: vmin * 6,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(5px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.2)',
                zIndex: 10
              }}>
                <div style={{
                  width: 0,
                  height: 0,
                  borderTop: `${vmin * 1.5}px solid transparent`,
                  borderBottom: `${vmin * 1.5}px solid transparent`,
                  borderLeft: `${vmin * 2.5}px solid white`,
                  marginLeft: vmin * 0.5
                }} />
              </div>

              {/* Progress bar */}
              <div style={{
                position: 'absolute',
                bottom: vmin * 1.5,
                left: vmin * 1.5,
                right: vmin * 1.5,
                height: vmin * 0.5,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: vmin
              }}>
                <div style={{
                  width: '60%',
                  height: '100%',
                  background: 'var(--color-primary-hover)',
                  borderRadius: vmin,
                  boxShadow: '0 0 10px var(--color-primary-hover)'
                }} />
              </div>
            </div>
          </Element3D>
        </Step>

        <Step
          id="outro"
          {...positions.base.toProps()}
          duration={120}
        />

        {/* --- TITLES --- */}

        <StepResponsive
          centered
          style={{
            fontSize,
            width: vmin * 70,
            position: 'absolute',
          }}
          steps={{
            'intro': {
              transform: positions.intro.title,
            },
            'outro': {
              transform: positions.outro.title,
              duration: 'step',
              easing: 'easeInOutCubic',
            }
          }}
        >
          <h1>Remotion Bits</h1>
        </StepResponsive>

        <StepResponsive
          centered
          style={{
            fontSize,
            width: 'max-content',
            position: 'absolute',
          }}
          steps={{
            'intro': {
              transform: positions.elements.title.intro,
            },
            ...mapElementSteps({
              transform: positions.elements.title.elements,
            }),
            'transitions': {
              transform: positions.elements.title.transitions,
            }
          }}
        >
          <h1>Elements</h1>
        </StepResponsive>

        <StepResponsive
          centered
          style={{
            fontSize,
            width: 'max-content',
            position: 'absolute',
            textShadow: '0 0 10px rgba(0,0,0,0.5)',
          }}
          steps={{
            'intro': {
              transform: positions.transitions.title.intro,
            },
            ...mapElementSteps({
              transform: positions.transitions.title.elements,
            }),
            'transitions': {
              transform: positions.transitions.title.transitions,
            },
            'scenes': {
              transform: positions.transitions.title.transitions,
            }
          }}
        >
          <h1>Transitions</h1>
        </StepResponsive>

        <StepResponsive
          centered
          style={{
            fontSize,
            width: 'max-content',
            position: 'absolute',
          }}
          steps={{
            'intro': { transform: positions.scenes.title.intro },
            'transitions': { transform: positions.scenes.title.transitions },
            'scenes': {
              transform: positions.scenes.title.scenes,
            },
            'outro': {
              transform: positions.scenes.title.outro,
              duration: 'step',
            }
          }}
        >
          <h1>Scenes</h1>
        </StepResponsive>

        {/* --- ICONS --- */}

        <StepResponsive
          centered
          style={{ position: 'absolute' }}
          steps={{
            'intro': {
              opacity: [0, 1],
              transform: positions.intro.icons.triangle,
            },
            ...mapElementSteps({
              transform: positions.elements.icons.triangle.elements,
            }),
            'outro': {
              transform: positions.outro.icons.triangle,
              opacity: [1, 1, 1, 0],
              duration: "step",
              easing: 'easeInOutCubic',
            }

          }}
        >
          <ShapeIcon
            size={vmin * 10}
            variant="triangle"
          />
        </StepResponsive>
        <StepResponsive
          style={{ position: 'absolute' }}
          centered
          steps={{
            'intro': {
              opacity: [0, 1],
              transform: positions.intro.icons.square,
            },
            'scenes': {
              transform: positions.scenes.icons.square.scenes,
            },
            'outro': {
              transform: positions.outro.icons.square,
              opacity: [1, 1, 1, 0],
              duration: "step",
              easing: 'easeInOutCubic',
            }
          }}
        >
          <ShapeIcon
            size={vmin * 10}
            variant="square"
          />
        </StepResponsive>
        <StepResponsive
          style={{ position: 'absolute' }}
          centered
          steps={{
            'intro': {
              opacity: [0, 1],
              transform: positions.intro.icons.circle,
            },
            'transitions': {
              transform: positions.transitions.iconBase,
            },
            'outro': {
              transform: positions.outro.icons.circle,
              opacity: [1, 1, 1, 0],
              duration: "step",
              easing: 'easeInOutCubic',
            }
          }}
        >
          <ShapeIcon
            size={vmin * 10}
            variant="circle"
          />
        </StepResponsive>

      </Scene3D>
    </AbsoluteFill>
  );
};
