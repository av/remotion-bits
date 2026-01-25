import React from "react";
import { AbsoluteFill } from "remotion";
import { BackgroundTransition } from "remotion-bits";
import { Center } from "./Center";

const textStyle = {
  fontSize: "6rem",
  fontWeight: 700,
  color: "#ffffff",
  fontFamily: "Inter, ui-sans-serif, system-ui",
  textAlign: "center" as const,
  textShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
};

export const LinearGradientShowcase: React.FC = () => (
  <BackgroundTransition
    gradient={[
      "linear-gradient(0deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(180deg, #f093fb 0%, #f5576c 100%)",
    ]}
    duration={90}
  >
    <Center style={{ padding: "4rem", ...textStyle }}>
      Linear Gradient Transition
    </Center>
  </BackgroundTransition>
);

export const RadialGradientShowcase: React.FC = () => (
  <BackgroundTransition
    gradient={[
      "radial-gradient(circle, #ff6b6b 0%, #4ecdc4 100%)",
      "radial-gradient(circle, #feca57 0%, #48dbfb 100%)",
    ]}
    duration={90}
    easing="easeInOut"
  >
    <Center style={{ padding: "4rem", ...textStyle }}>
      Radial Gradient Transition
    </Center>
  </BackgroundTransition>
);

export const ConicGradientShowcase: React.FC = () => (
  <BackgroundTransition
    gradient={[
      "conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
      "conic-gradient(from 180deg, #ff00ff, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000, #ff00ff)",
    ]}
    duration={120}
  >
    <Center style={{ padding: "4rem", ...textStyle }}>
      Conic Rainbow
    </Center>
  </BackgroundTransition>
);

export const MultiStopGradientShowcase: React.FC = () => (
  <BackgroundTransition
    gradient={[
      "linear-gradient(45deg, #fa709a 0%, #fee140 50%, #30cfd0 100%)",
      "linear-gradient(225deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)",
    ]}
    duration={120}
    easing="easeInOutCubic"
  >
    <Center style={{ padding: "4rem", ...textStyle }}>
      Multi-Stop Gradients
    </Center>
  </BackgroundTransition>
);

export const AngleInterpolationShowcase: React.FC = () => (
  <BackgroundTransition
    gradient={[
      "linear-gradient(0deg, #f12711 0%, #f5af19 100%)",
      "linear-gradient(90deg, #c21500 0%, #ffc500 100%)",
      "linear-gradient(180deg, #f12711 0%, #f5af19 100%)",
      "linear-gradient(270deg, #c21500 0%, #ffc500 100%)",
      "linear-gradient(360deg, #f12711 0%, #f5af19 100%)",
    ]}
    duration={150}
  >
    <Center style={{ padding: "4rem", ...textStyle }}>
      Angle Rotation
    </Center>
  </BackgroundTransition>
);

export const TypeTransitionShowcase: React.FC = () => (
  <BackgroundTransition
    gradient={[
      "linear-gradient(90deg, #8e2de2 0%, #4a00e0 100%)",
      "radial-gradient(circle, #fa8bff 0%, #2bd2ff 50%, #2bff88 100%)",
      "conic-gradient(from 0deg, #00c9ff, #92fe9d, #00c9ff)",
      "linear-gradient(45deg, #ff512f 0%, #dd2476 100%)",
    ]}
    duration={180}
    easing="easeInOut"
  >
    <Center style={{ padding: "4rem", ...textStyle }}>
      Gradient Type Transitions
    </Center>
  </BackgroundTransition>
);

export const ComplexGradientShowcase: React.FC = () => (
  <BackgroundTransition
    gradient={[
      "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
      "linear-gradient(225deg, #f093fb 0%, #f5576c 25%, #ffd89b 50%, #19547b 75%, #667eea 100%)",
    ]}
    duration={120}
  >
    <Center style={{ padding: "4rem", ...textStyle }}>
      Complex Multi-Stop
    </Center>
  </BackgroundTransition>
);

export const ShortestPathAngleShowcase: React.FC = () => (
  <BackgroundTransition
    gradient={[
      "linear-gradient(350deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(10deg, #30cfd0 0%, #330867 100%)",
    ]}
    duration={90}
  >
    <Center style={{ padding: "4rem", ...textStyle }}>
      Shortest Path (350° → 10°)
    </Center>
  </BackgroundTransition>
);
