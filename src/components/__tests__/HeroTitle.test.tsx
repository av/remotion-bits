import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HeroTitle } from "../HeroTitle";

vi.mock("remotion", () => ({
  interpolate: (_frame: number, _input: number[], output: number[]) =>
    output[0],
  useCurrentFrame: () => 0,
}));

describe("HeroTitle", () => {
  it("renders title, accent, and subtitle", () => {
    render(<HeroTitle title="Hello" accent="World" subtitle="Subtitle" />);

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("World")).toBeInTheDocument();
    expect(screen.getByText("Subtitle")).toBeInTheDocument();
  });
});
