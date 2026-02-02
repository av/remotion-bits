import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import { AnimatedCounter } from "../AnimatedCounter";
import { StepTimingContext } from "../../utils/StepContext";

let currentFrame = 0;

vi.mock("remotion", () => ({
  useCurrentFrame: () => currentFrame,
  useVideoConfig: () => ({ fps: 30, durationInFrames: 300 }),
  random: () => 0.5,
}));

describe("AnimatedCounter", () => {
  afterEach(() => {
    currentFrame = 0;
  });

  it("renders initial value", () => {
    currentFrame = 0;
    render(
      <AnimatedCounter transition={{ values: [0, 100], duration: 30 }} />
    );
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders final value", () => {
    currentFrame = 30; // End of duration
    render(
      <AnimatedCounter transition={{ values: [0, 100], duration: 30 }} />
    );
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("renders interpolated value", () => {
    currentFrame = 15; // Half of 30
    render(
      <AnimatedCounter transition={{ values: [0, 100], duration: 30 }} />
    );
    // Linear interpolation: 0 + (100-0) * 0.5 = 50
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("respects Step timing context", () => {
    const stepEnterFrame = 100;
    currentFrame = stepEnterFrame; // At start of step

    render(
      <StepTimingContext.Provider value={{
        stepConfig: {
           id: "s1", index: 0, enterFrame: stepEnterFrame, exitFrame: stepEnterFrame + 100
        }
      }}>
        <AnimatedCounter transition={{ values: [0, 100], duration: 30 }} />
      </StepTimingContext.Provider>
    );

    // Should be at start
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("advances relative to Step timing", () => {
    const stepEnterFrame = 100;
    currentFrame = stepEnterFrame + 15; // 15 frames into step

    render(
      <StepTimingContext.Provider value={{
        stepConfig: {
           id: "s1", index: 0, enterFrame: stepEnterFrame, exitFrame: stepEnterFrame + 100
        }
      }}>
        <AnimatedCounter transition={{ values: [0, 100], duration: 30 }} />
      </StepTimingContext.Provider>
    );

    // Duration is 30, we are at 15 relative. 50%.
    expect(screen.getByText("50")).toBeInTheDocument();
  });
});
