import React, { createContext, useContext } from "react";
import type { Scene3DContextValue, CameraState } from "./types";

const defaultCamera: CameraState = {
  x: 0,
  y: 0,
  z: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
};

const defaultContext: Scene3DContextValue = {
  camera: defaultCamera,
  activeStepIndex: 0,
  activeStepId: undefined,
  transitionProgress: 0,
  transitionDuration: 30,
  steps: [],
  registerStep: () => 0,
};

export const Scene3DContext = createContext<Scene3DContextValue>(defaultContext);

export function useScene3D(): Scene3DContextValue {
  const context = useContext(Scene3DContext);
  if (context === defaultContext) {
    throw new Error("useScene3D must be used within a Scene3D component");
  }
  return context;
}

export function useCamera(): CameraState {
  const { camera } = useScene3D();
  return camera;
}

export function useActiveStep(): { index: number; id: string | undefined; progress: number } {
  const { activeStepIndex, activeStepId, transitionProgress } = useScene3D();
  return { index: activeStepIndex, id: activeStepId, progress: transitionProgress };
}
