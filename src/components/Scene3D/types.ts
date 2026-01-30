import type { EasingFunction, EasingName } from "../../utils";
import type { AnimatedValue, TransformProps, VisualProps, TimingProps } from "../../utils/motion";
import type { StaggerDirection } from "../StaggeredMotion";

export type RotateOrder = "xyz" | "xzy" | "yxz" | "yzx" | "zxy" | "zyx";

export interface Position3D {
  x?: AnimatedValue;
  y?: AnimatedValue;
  z?: AnimatedValue;
}

export interface Rotation3D {
  rotateX?: AnimatedValue;
  rotateY?: AnimatedValue;
  rotateZ?: AnimatedValue;
  rotateOrder?: RotateOrder;
}

export interface Scale3D {
  scale?: AnimatedValue;
  scaleX?: AnimatedValue;
  scaleY?: AnimatedValue;
}

export interface Transform3D extends Position3D, Rotation3D, Scale3D {}

export type TransitionConfig = TransformProps &
  VisualProps &
  TimingProps & {
    stagger?: number;
    staggerDirection?: StaggerDirection;
  };

export interface StepConfig extends Transform3D {
  id?: string;
  index: number;
  enterFrame: number;
  exitFrame: number;
}

export interface CameraState {
  x: number;
  y: number;
  z: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
  scaleX: number;
  scaleY: number;
}

export interface Scene3DContextValue {
  camera: CameraState;
  activeStepIndex: number;
  activeStepId: string | undefined;
  transitionProgress: number;
  steps: StepConfig[];
  registerStep: (config: Omit<StepConfig, "index">) => number;
}

export interface Scene3DProps {
  perspective?: number;
  transitionDuration?: number;
  easing?: EasingFunction | EasingName;
  activeStep?: number | string;
  stepDuration?: number;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface StepProps extends Transform3D {
  id?: string;
  transition?: TransitionConfig;
  exitTransition?: TransitionConfig;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface Element3DProps extends Transform3D {
  fixed?: boolean;
  transition?: TransitionConfig;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
