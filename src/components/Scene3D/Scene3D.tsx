import React, { useMemo, useCallback, useRef, useEffect } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { Scene3DProps, StepConfig, CameraState } from "./types";
import { Scene3DContext } from "./context";
import { isStepElement } from "./Step";
import { getEasingFunction, interpolateKeyframes } from "../../utils/motion";
import { Transform3D, Vector3 } from "../../utils/transform3d";
import { interpolateTransform, transformToCSS } from "../../utils/interpolate3d";

function stepConfigToCameraTransform(step: StepConfig, fitScale: number): Transform3D {
  const x = interpolateKeyframes(step.x ?? 0, 1);
  const y = interpolateKeyframes(step.y ?? 0, 1);
  const z = interpolateKeyframes(step.z ?? 0, 1);
  const rotateX = interpolateKeyframes(step.rotateX ?? 0, 1);
  const rotateY = interpolateKeyframes(step.rotateY ?? 0, 1);
  const rotateZ = interpolateKeyframes(step.rotateZ ?? 0, 1);
  const scale = interpolateKeyframes(step.scale ?? 1, 1);
  const scaleX = interpolateKeyframes(step.scaleX ?? 1, 1);
  const scaleY = interpolateKeyframes(step.scaleY ?? 1, 1);

  const degreesToRadians = Math.PI / 180;

  const forward = Transform3D.fromEuler(
    rotateX * degreesToRadians,
    rotateY * degreesToRadians,
    rotateZ * degreesToRadians,
    new Vector3(x, y, z),
    new Vector3(scale * scaleX, scale * scaleY, scale),
    (step.rotateOrder?.toUpperCase() as any) ?? 'XYZ'
  );

  const inverse = forward.inverse();
  inverse.position.multiplyScalar(fitScale);
  inverse.scale.multiplyScalar(fitScale);

  return inverse;
}

function stepConfigToCameraTarget(step: StepConfig): CameraState {
  return {
    x: interpolateKeyframes(step.x ?? 0, 1),
    y: interpolateKeyframes(step.y ?? 0, 1),
    z: interpolateKeyframes(step.z ?? 0, 1),
    rotateX: interpolateKeyframes(step.rotateX ?? 0, 1),
    rotateY: interpolateKeyframes(step.rotateY ?? 0, 1),
    rotateZ: interpolateKeyframes(step.rotateZ ?? 0, 1),
    scale: interpolateKeyframes(step.scale ?? 1, 1),
    scaleX: interpolateKeyframes(step.scaleX ?? 1, 1),
    scaleY: interpolateKeyframes(step.scaleY ?? 1, 1),
  };
}

export const Scene3D: React.FC<Scene3DProps> = ({
  perspective = 1000,
  transitionDuration = 30,
  easing = "easeInOutCubic",
  activeStep,
  stepDuration,
  width,
  height,
  className,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width: videoWidth, height: videoHeight } = useVideoConfig();

  const fitScale = useMemo(() => {
    const designWidth = width ?? videoWidth;
    const designHeight = height ?? videoHeight;
    const xScale = videoWidth / designWidth;
    const yScale = videoHeight / designHeight;
    return Math.min(xScale, yScale);
  }, [width, height, videoWidth, videoHeight]);

  const stepsRef = useRef<StepConfig[]>([]);
  const stepIndexRef = useRef(0);

  const childArray = React.Children.toArray(children);

  const stepChildren = useMemo(
    () => childArray.filter(isStepElement),
    [childArray]
  );

  const nonStepChildren = useMemo(
    () => childArray.filter((child) => !isStepElement(child)),
    [childArray]
  );

  const steps = useMemo(() => {
    const stepConfigs: StepConfig[] = [];
    let currentFrame = 0;

    stepChildren.forEach((child, index) => {
      const props = child.props;
      const duration = props.duration ?? stepDuration ?? Math.floor(durationInFrames / stepChildren.length);
      const enterFrame = currentFrame;
      const exitFrame = currentFrame + duration;

      stepConfigs.push({
        id: props.id ?? `step-${index}`,
        index,
        x: props.x ?? 0,
        y: props.y ?? 0,
        z: props.z ?? 0,
        scale: props.scale ?? 1,
        scaleX: props.scaleX ?? 1,
        scaleY: props.scaleY ?? 1,
        rotateX: props.rotateX ?? 0,
        rotateY: props.rotateY ?? 0,
        rotateZ: props.rotateZ ?? 0,
        rotateOrder: props.rotateOrder ?? "xyz",
        enterFrame,
        exitFrame,
      });

      currentFrame = exitFrame;
    });

    stepsRef.current = stepConfigs;
    return stepConfigs;
  }, [stepChildren, stepDuration, durationInFrames]);

  const registerStep = useCallback((config: Omit<StepConfig, "index">) => {
    const index = stepIndexRef.current;
    stepIndexRef.current += 1;
    return index;
  }, []);

  const { activeStepIndex, transitionProgress, camera, cameraTransform } = useMemo(() => {
    if (steps.length === 0) {
      return {
        activeStepIndex: 0,
        transitionProgress: 0,
        camera: { x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, scaleX: 1, scaleY: 1 },
        cameraTransform: Transform3D.identity(),
      };
    }

    let currentStepIndex: number;

    if (activeStep !== undefined) {
      if (typeof activeStep === "number") {
        currentStepIndex = Math.max(0, Math.min(activeStep, steps.length - 1));
      } else {
        const foundIndex = steps.findIndex((s) => s.id === activeStep);
        currentStepIndex = foundIndex >= 0 ? foundIndex : 0;
      }
    } else {
      currentStepIndex = steps.findIndex(
        (step) => frame >= step.enterFrame && frame < step.exitFrame
      );
      if (currentStepIndex < 0) {
        currentStepIndex = frame >= steps[steps.length - 1].exitFrame ? steps.length - 1 : 0;
      }
    }

    const currentStep = steps[currentStepIndex];
    const prevStep = currentStepIndex > 0 ? steps[currentStepIndex - 1] : null;

    const transitionStartFrame = currentStep.enterFrame;
    const transitionEndFrame = transitionStartFrame + transitionDuration;

    let progress: number;
    if (frame < transitionStartFrame) {
      progress = 0;
    } else if (frame >= transitionEndFrame) {
      progress = 1;
    } else {
      progress = (frame - transitionStartFrame) / transitionDuration;
    }

    const easingFn = getEasingFunction(easing);
    const easedProgress = easingFn ? easingFn(progress) : progress;

    const targetCamera = stepConfigToCameraTarget(currentStep);
    const targetTransform = stepConfigToCameraTransform(currentStep, fitScale);

    let cameraState: CameraState;
    let cameraTransformState: Transform3D;

    if (prevStep && progress < 1) {
      const fromCamera = stepConfigToCameraTarget(prevStep);
      const fromTransform = stepConfigToCameraTransform(prevStep, fitScale);

      cameraTransformState = interpolateTransform(
        fromTransform,
        targetTransform,
        easedProgress,
        easingFn
      );

      cameraState = {
        x: fromCamera.x + (targetCamera.x - fromCamera.x) * easedProgress,
        y: fromCamera.y + (targetCamera.y - fromCamera.y) * easedProgress,
        z: fromCamera.z + (targetCamera.z - fromCamera.z) * easedProgress,
        rotateX: fromCamera.rotateX + (targetCamera.rotateX - fromCamera.rotateX) * easedProgress,
        rotateY: fromCamera.rotateY + (targetCamera.rotateY - fromCamera.rotateY) * easedProgress,
        rotateZ: fromCamera.rotateZ + (targetCamera.rotateZ - fromCamera.rotateZ) * easedProgress,
        scale: fromCamera.scale + (targetCamera.scale - fromCamera.scale) * easedProgress,
        scaleX: fromCamera.scaleX + (targetCamera.scaleX - fromCamera.scaleX) * easedProgress,
        scaleY: fromCamera.scaleY + (targetCamera.scaleY - fromCamera.scaleY) * easedProgress,
      };
    } else {
      cameraState = targetCamera;
      cameraTransformState = targetTransform;
    }

    return {
      activeStepIndex: currentStepIndex,
      transitionProgress: easedProgress,
      camera: cameraState,
      cameraTransform: cameraTransformState,
    };
  }, [steps, frame, activeStep, transitionDuration, easing, fitScale]);

  const activeStepId = steps[activeStepIndex]?.id;

  const contextValue = useMemo(
    () => ({
      camera,
      activeStepIndex,
      activeStepId,
      transitionProgress,
      steps,
      registerStep,
    }),
    [camera, activeStepIndex, activeStepId, transitionProgress, steps, registerStep]
  );

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    perspective: `${perspective}px`,
    ...style,
  };

  const canvasStyle: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    transformStyle: "preserve-3d",
    transform: transformToCSS(cameraTransform),
    transformOrigin: "center center",
  };

  const worldOriginStyle: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transformStyle: "preserve-3d",
  };

  const doFrame = () => {
    if (!scheduled) return;

    document.querySelectorAll('[data-scene3d-canvas] *').forEach((el) => {
      const hel = el as HTMLElement;

      // Multiple aggressive reflow triggers
      hel.style.contain = 'strict';
      hel.style.isolation = 'isolate';
      hel.style.textRendering = 'optimizeElegibility';
      

      // Force multiple layout calculations
      hel.offsetHeight;
      hel.offsetWidth;
      hel.getBoundingClientRect();
      hel.getClientRects();

      // Reset for next frame
      hel.style.imageRendering = 'crisp-edges';
    });

    requestAnimationFrame(doFrame);
  }

  return (
    <Scene3DContext.Provider value={contextValue}>
      <div className={className} style={containerStyle} data-scene3d>
        <div style={canvasStyle} data-scene3d-canvas>
          <div style={worldOriginStyle} data-scene3d-world>
            {stepChildren}
            {nonStepChildren}
          </div>
        </div>
      </div>
    </Scene3DContext.Provider>
  );
};
