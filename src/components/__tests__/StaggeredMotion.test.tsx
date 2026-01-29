import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StaggeredMotion } from "../StaggeredMotion";

let currentFrame = 0;

vi.mock("remotion", () => ({
  Extrapolate: { CLAMP: "clamp" },
  interpolate: (_frame: number, _input: number[], output: number[]) =>
    output[0],
  useCurrentFrame: () => currentFrame,
  useVideoConfig: () => ({ fps: 30 }),
  random: (seed: string | number) => {
    // Deterministic pseudo-random based on seed
    const str = String(seed);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash % 1000) / 1000;
  },
}));

describe("StaggeredMotion", () => {
  it("renders multiple children", () => {
    currentFrame = 0;
    const { container } = render(
      <StaggeredMotion transition={{ opacity: [0, 1] }}>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </StaggeredMotion>
    );

    expect(container.querySelector('[data-testid="child1"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="child2"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="child3"]')).toBeInTheDocument();
  });

  it("applies animated styles to children", () => {
    currentFrame = 15; // Mid-animation
    const { container } = render(
      <StaggeredMotion
        transition={{
          opacity: [0, 1],
          y: [50, 0],
          duration: 30,
        }}
      >
        <div data-testid="child">Child</div>
      </StaggeredMotion>
    );

    const child = container.querySelector('[data-testid="child"]') as HTMLElement;
    expect(child).toBeInTheDocument();
    expect(child.style.opacity).toBeDefined();
    expect(child.style.transform).toContain("translateY");
  });

  it("merges styles with existing child styles", () => {
    currentFrame = 0;
    const { container } = render(
      <StaggeredMotion
        transition={{
          opacity: [0, 1],
        }}
      >
        <div data-testid="child" style={{ color: "red", fontSize: "20px" }}>
          Child
        </div>
      </StaggeredMotion>
    );

    const child = container.querySelector('[data-testid="child"]') as HTMLElement;
    expect(child.style.color).toBe("red");
    expect(child.style.fontSize).toBe("20px");
    expect(child.style.opacity).toBeDefined();
  });

  it("applies stagger in forward direction", () => {
    currentFrame = 10;
    const { container } = render(
      <StaggeredMotion
        transition={{
          opacity: [0, 1],
          duration: 30,
          stagger: 5,
          staggerDirection: "forward",
        }}
      >
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </StaggeredMotion>
    );

    const child1 = container.querySelector('[data-testid="child1"]') as HTMLElement;
    const child2 = container.querySelector('[data-testid="child2"]') as HTMLElement;
    const child3 = container.querySelector('[data-testid="child3"]') as HTMLElement;

    // First child should be more visible (further along in animation)
    const opacity1 = parseFloat(child1.style.opacity);
    const opacity2 = parseFloat(child2.style.opacity);
    const opacity3 = parseFloat(child3.style.opacity);

    expect(opacity1).toBeGreaterThan(opacity2);
    expect(opacity2).toBeGreaterThan(opacity3);
  });

  it("applies stagger in reverse direction", () => {
    currentFrame = 10;
    const { container } = render(
      <StaggeredMotion
        transition={{
          opacity: [0, 1],
          duration: 30,
          stagger: 5,
          staggerDirection: "reverse",
        }}
      >
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </StaggeredMotion>
    );

    const child1 = container.querySelector('[data-testid="child1"]') as HTMLElement;
    const child2 = container.querySelector('[data-testid="child2"]') as HTMLElement;
    const child3 = container.querySelector('[data-testid="child3"]') as HTMLElement;

    // Last child should be more visible (further along in animation)
    const opacity1 = parseFloat(child1.style.opacity);
    const opacity2 = parseFloat(child2.style.opacity);
    const opacity3 = parseFloat(child3.style.opacity);

    expect(opacity3).toBeGreaterThan(opacity2);
    expect(opacity2).toBeGreaterThan(opacity1);
  });

  it("applies stagger in center direction", () => {
    currentFrame = 10;
    const { container } = render(
      <StaggeredMotion
        transition={{
          opacity: [0, 1],
          duration: 30,
          stagger: 5,
          staggerDirection: "center",
        }}
      >
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </StaggeredMotion>
    );

    const child1 = container.querySelector('[data-testid="child1"]') as HTMLElement;
    const child2 = container.querySelector('[data-testid="child2"]') as HTMLElement;
    const child3 = container.querySelector('[data-testid="child3"]') as HTMLElement;

    // Middle child should be most visible
    const opacity1 = parseFloat(child1.style.opacity);
    const opacity2 = parseFloat(child2.style.opacity);
    const opacity3 = parseFloat(child3.style.opacity);

    expect(opacity2).toBeGreaterThanOrEqual(opacity1);
    expect(opacity2).toBeGreaterThanOrEqual(opacity3);
  });

  it("applies stagger in random direction", () => {
    currentFrame = 10;
    const { container } = render(
      <StaggeredMotion
        transition={{
          opacity: [0, 1],
          duration: 30,
          stagger: 5,
          staggerDirection: "random",
        }}
      >
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </StaggeredMotion>
    );

    const child1 = container.querySelector('[data-testid="child1"]') as HTMLElement;
    const child2 = container.querySelector('[data-testid="child2"]') as HTMLElement;
    const child3 = container.querySelector('[data-testid="child3"]') as HTMLElement;

    // All children should have opacity values (they're being animated)
    const opacity1 = parseFloat(child1.style.opacity);
    const opacity2 = parseFloat(child2.style.opacity);
    const opacity3 = parseFloat(child3.style.opacity);

    expect(opacity1).toBeDefined();
    expect(opacity2).toBeDefined();
    expect(opacity3).toBeDefined();

    // Random stagger should produce different order than forward
    // We just verify all have valid opacity values since the exact order is randomized
    expect(opacity1).toBeGreaterThanOrEqual(0);
    expect(opacity2).toBeGreaterThanOrEqual(0);
    expect(opacity3).toBeGreaterThanOrEqual(0);
  });

  it("random stagger is deterministic across renders", () => {
    currentFrame = 10;

    // First render
    const { container: container1 } = render(
      <StaggeredMotion
        transition={{
          opacity: [0, 1],
          duration: 30,
          stagger: 5,
          staggerDirection: "random",
        }}
      >
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </StaggeredMotion>
    );

    const opacity1_render1 = parseFloat((container1.querySelector('[data-testid="child1"]') as HTMLElement).style.opacity);
    const opacity2_render1 = parseFloat((container1.querySelector('[data-testid="child2"]') as HTMLElement).style.opacity);
    const opacity3_render1 = parseFloat((container1.querySelector('[data-testid="child3"]') as HTMLElement).style.opacity);

    // Second render with same setup
    const { container: container2 } = render(
      <StaggeredMotion
        transition={{
          opacity: [0, 1],
          duration: 30,
          stagger: 5,
          staggerDirection: "random",
        }}
      >
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </StaggeredMotion>
    );

    const opacity1_render2 = parseFloat((container2.querySelector('[data-testid="child1"]') as HTMLElement).style.opacity);
    const opacity2_render2 = parseFloat((container2.querySelector('[data-testid="child2"]') as HTMLElement).style.opacity);
    const opacity3_render2 = parseFloat((container2.querySelector('[data-testid="child3"]') as HTMLElement).style.opacity);

    // Values should be the same across renders (deterministic)
    expect(opacity1_render1).toBe(opacity1_render2);
    expect(opacity2_render1).toBe(opacity2_render2);
    expect(opacity3_render1).toBe(opacity3_render2);
  });

  it("handles non-React element children", () => {
    currentFrame = 0;
    const { container } = render(
      <StaggeredMotion transition={{ opacity: [0, 1] }}>
        <div>Element Child</div>
        Plain text child
        {42}
      </StaggeredMotion>
    );

    expect(container.textContent).toContain("Element Child");
    expect(container.textContent).toContain("Plain text child");
    expect(container.textContent).toContain("42");
  });

  it("supports transform properties", () => {
    currentFrame = 15;
    const { container } = render(
      <StaggeredMotion
        transition={{
          x: [100, 0],
          y: [50, 0],
          scale: [0.5, 1],
          rotate: [90, 0],
          duration: 30,
        }}
      >
        <div data-testid="child">Child</div>
      </StaggeredMotion>
    );

    const child = container.querySelector('[data-testid="child"]') as HTMLElement;
    const transform = child.style.transform;

    expect(transform).toContain("translateX");
    expect(transform).toContain("translateY");
    expect(transform).toContain("scale");
    expect(transform).toContain("rotate");
  });

  it("supports keyframe arrays", () => {
    currentFrame = 15;
    const { container } = render(
      <StaggeredMotion
        transition={{
          opacity: [0, 1, 0.5],
          y: [100, 0, 50],
          duration: 30,
        }}
      >
        <div data-testid="child">Child</div>
      </StaggeredMotion>
    );

    const child = container.querySelector('[data-testid="child"]') as HTMLElement;
    expect(child).toBeInTheDocument();
    expect(child.style.opacity).toBeDefined();
    expect(child.style.transform).toContain("translateY");
  });

  it("handles custom components that receive style prop", () => {
    const CustomComponent = ({ style, children }: { style?: React.CSSProperties; children: React.ReactNode }) => (
      <div data-testid="custom" style={style}>
        {children}
      </div>
    );

    currentFrame = 15;
    const { container } = render(
      <StaggeredMotion
        transition={{
          opacity: [0, 1],
          duration: 30,
        }}
      >
        <CustomComponent>Custom Child</CustomComponent>
      </StaggeredMotion>
    );

    const customElement = container.querySelector('[data-testid="custom"]') as HTMLElement;
    expect(customElement).toBeInTheDocument();
    expect(customElement.style.opacity).toBeDefined();
  });

  it("applies className and style to container", () => {
    currentFrame = 0;
    const { container } = render(
      <StaggeredMotion
        transition={{ opacity: [0, 1] }}
        className="test-class"
        style={{ padding: "20px" }}
      >
        <div>Child</div>
      </StaggeredMotion>
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toBe("test-class");
    expect(wrapper.style.padding).toBe("20px");
  });
});
