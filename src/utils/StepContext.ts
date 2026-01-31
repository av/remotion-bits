import { createContext, useContext } from "react";
import type { StepConfig } from "../components/Scene3D/types";

/**
 * Context value provided by Scene3D.Step components
 * Allows nested components to access Step timing information
 */
export interface StepTimingContextValue {
  stepConfig: StepConfig;
}

/**
 * Context for Step timing information
 * Provides enterFrame and exitFrame boundaries to nested components
 * Undefined when not inside a Step component
 */
export const StepTimingContext = createContext<StepTimingContextValue | undefined>(
  undefined
);

/**
 * Hook to access Step timing information (enterFrame, exitFrame)
 * Returns undefined when not used within a Step component
 * Safe to call from any component - no error is thrown when outside Step
 *
 * @example
 * ```typescript
 * const stepTiming = useStepTiming();
 * if (stepTiming?.stepConfig) {
 *   const { enterFrame, exitFrame } = stepTiming.stepConfig;
 * }
 * ```
 */
export function useStepTiming(): StepTimingContextValue | undefined {
  return useContext(StepTimingContext);
}
