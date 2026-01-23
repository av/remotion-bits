import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TextTransition } from "../TextTransition";

let currentFrame = 0;

vi.mock("remotion", () => ({
  Extrapolate: { CLAMP: "clamp" },
  interpolate: (_frame: number, _input: number[], output: number[]) =>
    output[0],
  useCurrentFrame: () => currentFrame,
  useVideoConfig: () => ({ fps: 30 }),
}));

describe("TextTransition", () => {
  it("renders the first text at the start", () => {
    currentFrame = 0;
    render(<TextTransition texts={["One", "Two"]} itemDurationInFrames={30} />);

    expect(screen.getByText("One")).toBeInTheDocument();
  });

  it("renders the next text after one item duration", () => {
    currentFrame = 31;
    render(<TextTransition texts={["One", "Two"]} itemDurationInFrames={30} />);

    expect(screen.getByText("Two")).toBeInTheDocument();
  });
});
