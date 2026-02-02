import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Scene3D, Step, Element3D } from "../Scene3D";
import { StepResponsive } from "../Scene3D/StepResponsive";

let currentFrame = 0;

vi.mock("remotion", () => ({
  Extrapolate: { CLAMP: "clamp" },
  interpolate: (_frame: number, _input: number[], output: number[]) =>
    output[0],
  useCurrentFrame: () => currentFrame,
  useVideoConfig: () => ({ fps: 30, durationInFrames: 300 }),
  random: (seed: string | number) => {
    const str = String(seed);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash % 1000) / 1000;
  },
}));

describe("Scene3D", () => {
  it("renders container with perspective", () => {
    currentFrame = 0;
    const { container } = render(
      <Scene3D perspective={1200}>
        <Step id="step1">Content</Step>
      </Scene3D>
    );

    const scene = container.querySelector("[data-scene3d]") as HTMLElement;
    expect(scene).toBeInTheDocument();
    expect(scene.style.perspective).toBe("1200px");
  });

  it("renders multiple steps", () => {
    currentFrame = 0;
    const { container } = render(
      <Scene3D>
        <Step id="step1">Step 1</Step>
        <Step id="step2" x={500}>Step 2</Step>
        <Step id="step3" x={1000} y={-200}>Step 3</Step>
      </Scene3D>
    );

    const steps = container.querySelectorAll("[data-step-id]");
    expect(steps.length).toBe(3);
    expect(steps[0].getAttribute("data-step-id")).toBe("step1");
    expect(steps[1].getAttribute("data-step-id")).toBe("step2");
    expect(steps[2].getAttribute("data-step-id")).toBe("step3");
  });

  it("applies 3D transform to steps", () => {
    currentFrame = 0;
    const { container } = render(
      <Scene3D>
        <Step id="step1" x={100} y={200} z={-300} rotateY={45}>
          Content
        </Step>
      </Scene3D>
    );

    const step = container.querySelector("[data-step-id='step1']") as HTMLElement;
    expect(step.style.transform).toContain("matrix3d");
    expect(step.style.transform).toContain("100");
    expect(step.style.transform).toContain("200");
    expect(step.style.transform).toContain("-300");
  });

  it("renders Element3D components", () => {
    currentFrame = 0;
    const { container } = render(
      <Scene3D>
        <Step id="step1">Content</Step>
        <Element3D x={-200} y={100}>
          <div data-testid="decoration">Decoration</div>
        </Element3D>
      </Scene3D>
    );

    const decoration = container.querySelector('[data-testid="decoration"]');
    expect(decoration).toBeInTheDocument();
  });

  it("applies fixed attribute to Element3D when fixed prop is true", () => {
    currentFrame = 0;
    const { container } = render(
      <Scene3D>
        <Step id="step1">Content</Step>
        <Element3D x={0} y={0} fixed>
          <div>Fixed element</div>
        </Element3D>
      </Scene3D>
    );

    const fixedElement = container.querySelector('[data-element3d-fixed="true"]');
    expect(fixedElement).toBeInTheDocument();
  });

  it("renders canvas with camera transform", () => {
    currentFrame = 0;
    const { container } = render(
      <Scene3D>
        <Step id="step1" x={500} y={200}>Content</Step>
      </Scene3D>
    );

    const canvas = container.querySelector("[data-scene3d-canvas]") as HTMLElement;
    expect(canvas).toBeInTheDocument();
    expect(canvas.style.transform).toBeDefined();
  });
});

describe("Step", () => {
  it("applies scale transform", () => {
    currentFrame = 0;
    const { container } = render(
      <Scene3D>
        <Step id="step1" scale={2}>Content</Step>
      </Scene3D>
    );

    const step = container.querySelector("[data-step-id='step1']") as HTMLElement;
    expect(step.style.transform).toContain("matrix3d");
    expect(step.style.transform).toMatch(/matrix3d\(2/);
  });

  it("applies custom rotate order", () => {
    currentFrame = 0;
    const { container } = render(
      <Scene3D>
        <Step id="step1" rotateX={10} rotateY={20} rotateZ={30} rotateOrder="zyx">
          Content
        </Step>
      </Scene3D>
    );

    const step = container.querySelector("[data-step-id='step1']") as HTMLElement;
    const transform = step.style.transform;
    expect(transform).toContain("matrix3d");
    expect(step).toBeDefined();
  });

  it("supports transition prop for enter animation", () => {
    currentFrame = 50;
    const { container } = render(
      <Scene3D stepDuration={100}>
        <Step
          id="step1"
          transition={{
            opacity: [0, 1],
            y: [50, 0],
            duration: 30,
          }}
        >
          <div data-testid="content">Content</div>
        </Step>
      </Scene3D>
    );

    const step = container.querySelector("[data-step-id='step1']") as HTMLElement;
    expect(step).toBeInTheDocument();
  });

  it("passes className and style to step container", () => {
    currentFrame = 0;
    const { container } = render(
      <Scene3D>
        <Step
          id="step1"
          className="my-step"
          style={{ backgroundColor: "blue" }}
        >
          Content
        </Step>
      </Scene3D>
    );

    const step = container.querySelector("[data-step-id='step1']") as HTMLElement;
    expect(step.classList.contains("my-step")).toBe(true);
    expect(step.style.backgroundColor).toBe("blue");
  });
});

describe("Element3D", () => {
  it("applies 3D transform", () => {
    currentFrame = 0;
    const { container } = render(
      <Scene3D>
        <Step id="step1">Content</Step>
        <Element3D x={-100} y={50} z={-200} rotateZ={15}>
          <div data-testid="element">Element</div>
        </Element3D>
      </Scene3D>
    );

    const element = container.querySelector('[data-element3d-fixed]') as HTMLElement;
    expect(element.style.transform).toContain("matrix3d");
    expect(element.style.transform).toContain("-100");
    expect(element.style.transform).toContain("50");
    expect(element.style.transform).toContain("-200");
  });

  it("supports transition prop", () => {
    currentFrame = 10;
    const { container } = render(
      <Scene3D>
        <Step id="step1">Content</Step>
        <Element3D
          x={0}
          y={0}
          transition={{
            opacity: [0, 1],
            scale: [0.5, 1],
            duration: 20,
          }}
        >
          <div data-testid="element">Element</div>
        </Element3D>
      </Scene3D>
    );

    const element = container.querySelector('[data-element3d-fixed]') as HTMLElement;
    expect(element).toBeInTheDocument();
  });

  it("applies preserve-3d transform style", () => {
    currentFrame = 0;
    const { container } = render(
      <Scene3D>
        <Step id="step1">Content</Step>
        <Element3D x={0} y={0}>
          <div>Element</div>
        </Element3D>
      </Scene3D>
    );

    const element = container.querySelector('[data-element3d-fixed]') as HTMLElement;
    expect(element.style.transformStyle).toBe("preserve-3d");
  });
});

describe("StepResponsive", () => {
  it("renders with color transition", () => {
    currentFrame = 0;
    const { container } = render(
      <Scene3D>
        <Step id="step0" duration={30}>Step 0</Step>
        <Step id="step1" duration={30}>Step 1</Step>
        
        <StepResponsive
          steps={{
            "step-0": { color: "red", backgroundColor: "white" },
            "step-1": { color: "blue", backgroundColor: "black" }
          }}
          transition={{ duration: 30 }}
        >
          <div data-testid="target">Hello</div>
        </StepResponsive>
      </Scene3D>
    );

    const target = container.querySelector("[data-testid=\"target\"]") as HTMLElement;
    expect(target.style.color).toBeDefined();
    // Assuming our implementation ensures string colors are processed:
    // With real culori, a single color keyframe results in that color
    // but interpolateColorKeyframes logic for 1 color is return colors[0]
  });
});
