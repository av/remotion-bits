import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Backgrounds } from "../Backgrounds";

let currentFrame = 0;

vi.mock("remotion", () => ({
  interpolate: (_frame: number, _input: number[], output: number[]) =>
    output[0],
  useCurrentFrame: () => currentFrame,
}));

describe("Backgrounds", () => {
  it("renders a default linear gradient background", () => {
    currentFrame = 0;
    const { container } = render(<Backgrounds />);

    const element = container.firstChild as HTMLElement;
    expect(element.style.backgroundImage).toContain("linear-gradient");
    expect(element.style.backgroundColor).toBe("rgb(15, 23, 42)");
  });

  it("renders a radial gradient when variant is radial", () => {
    currentFrame = 0;
    const { container } = render(
      <Backgrounds
        variant="radial"
        colors={["#111827", "#1f2937", "#4f46e5"]}
      />,
    );

    const element = container.firstChild as HTMLElement;
    expect(element.style.backgroundImage).toContain("radial-gradient");
  });

  it("renders a solid background and optional blur", () => {
    currentFrame = 0;
    const { container } = render(
      <Backgrounds variant="solid" colors={["#0f172a"]} blur={8} />,
    );

    const element = container.firstChild as HTMLElement;
    expect(element.style.backgroundImage).toBe("");
    expect(element.style.filter).toBe("blur(8px)");
    expect(element.style.transform).toBe("");
  });
});
