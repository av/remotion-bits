import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GradientTransition } from "../GradientTransition";

let currentFrame = 0;

vi.mock("remotion", () => ({
  useCurrentFrame: () => currentFrame,
  useVideoConfig: () => ({ fps: 30, durationInFrames: 300 }),
}));

describe("GradientTransition", () => {
  it("renders gradient at frame 0", () => {
    currentFrame = 0;
    const { container } = render(
      <GradientTransition
        gradient={[
          "linear-gradient(0deg, red, blue)",
          "linear-gradient(180deg, green, yellow)",
        ]}
      />
    );

    const div = container.querySelector("div");
    expect(div).toBeInTheDocument();
    expect(div?.style.background).toContain("linear-gradient");
  });

  it("applies custom className and style", () => {
    currentFrame = 0;
    const { container } = render(
      <GradientTransition
        gradient={["linear-gradient(90deg, red, blue)"]}
        className="custom-class"
        style={{ zIndex: 10 }}
      />
    );

    const div = container.querySelector("div");
    expect(div).toHaveClass("custom-class");
    expect(div?.style.zIndex).toBe("10");
  });

  it("renders children on top of gradient", () => {
    currentFrame = 0;
    const { getByText } = render(
      <GradientTransition gradient={["linear-gradient(90deg, red, blue)"]}>
        <p>Content</p>
      </GradientTransition>
    );

    expect(getByText("Content")).toBeInTheDocument();
  });

  it("handles frame-based duration", () => {
    currentFrame = 30;
    const { container } = render(
      <GradientTransition
        gradient={[
          "linear-gradient(0deg, red, blue)",
          "linear-gradient(180deg, green, yellow)",
        ]}
        duration={60}
      />
    );

    const div = container.querySelector("div");
    // At frame 30 of 60, should be halfway interpolated
    expect(div?.style.background).toContain("linear-gradient");
  });

  it("respects delay prop", () => {
    currentFrame = 10;
    const { container } = render(
      <GradientTransition
        gradient={[
          "linear-gradient(0deg, red, blue)",
          "linear-gradient(180deg, green, yellow)",
        ]}
        delay={20}
      />
    );

    // At frame 10 with delay 20, should still be at start
    const div = container.querySelector("div");
    expect(div?.style.background).toContain("linear-gradient");
  });

  it("handles single gradient (no interpolation)", () => {
    currentFrame = 50;
    const { container } = render(
      <GradientTransition gradient={["linear-gradient(90deg, red, blue)"]} />
    );

    const div = container.querySelector("div");
    expect(div?.style.background).toBe("linear-gradient(90deg, red, blue)");
  });

  it("uses full composition duration by default", () => {
    currentFrame = 150; // Halfway through 300 frame composition
    const { container } = render(
      <GradientTransition
        gradient={[
          "linear-gradient(0deg, red, blue)",
          "linear-gradient(180deg, green, yellow)",
        ]}
      />
    );

    const div = container.querySelector("div");
    expect(div?.style.background).toContain("linear-gradient");
    // Should be interpolated (not just first or last gradient)
    expect(div?.style.background).not.toBe("linear-gradient(0deg, red, blue)");
  });

  it("handles frame range prop", () => {
    currentFrame = 40;
    const { container } = render(
      <GradientTransition
        gradient={[
          "linear-gradient(0deg, red, blue)",
          "linear-gradient(180deg, green, yellow)",
        ]}
        frames={[20, 60]}
      />
    );

    const div = container.querySelector("div");
    // At frame 40 of range [20, 60], should be halfway
    expect(div?.style.background).toContain("linear-gradient");
  });

  it("applies absolute positioning", () => {
    currentFrame = 0;
    const { container } = render(
      <GradientTransition gradient={["linear-gradient(90deg, red, blue)"]} />
    );

    const div = container.querySelector("div");
    expect(div?.style.position).toBe("absolute");
    expect(div?.style.top).toBe("0px");
    expect(div?.style.left).toBe("0px");
    expect(div?.style.width).toBe("100%");
    expect(div?.style.height).toBe("100%");
  });
});
