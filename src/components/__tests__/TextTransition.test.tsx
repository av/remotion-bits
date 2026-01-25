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
  it("renders text from children", () => {
    currentFrame = 0;
    render(
      <TextTransition transition={{ opacity: [0, 1] }}>
        Hello World
      </TextTransition>
    );

    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders cycling text at the start", () => {
    currentFrame = 0;
    render(
      <TextTransition
        transition={{
          opacity: [0, 1],
          cycle: {
            texts: ["One", "Two"],
            itemDuration: 30,
          },
        }}
      />
    );

    expect(screen.getByText("One")).toBeInTheDocument();
  });

  it("renders next cycling text after item duration", () => {
    currentFrame = 31;
    render(
      <TextTransition
        transition={{
          opacity: [0, 1],
          cycle: {
            texts: ["One", "Two"],
            itemDuration: 30,
          },
        }}
      />
    );

    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("splits text by words", () => {
    currentFrame = 0;
    const { container } = render(
      <TextTransition
        transition={{
          opacity: [0, 1],
          split: "word",
        }}
      >
        Hello World
      </TextTransition>
    );

    const spans = container.querySelectorAll("span span");
    expect(spans.length).toBeGreaterThan(1);
  });

  it("splits text by characters", () => {
    currentFrame = 0;
    const { container } = render(
      <TextTransition
        transition={{
          opacity: [0, 1],
          split: "character",
        }}
      >
        Hi
      </TextTransition>
    );

    const spans = container.querySelectorAll("span span");
    expect(spans.length).toBe(2);
  });

  it("splits text by custom separator", () => {
    currentFrame = 0;
    const { container } = render(
      <TextTransition
        transition={{
          opacity: [0, 1],
          split: "|",
        }}
      >
        One|Two|Three
      </TextTransition>
    );

    const spans = container.querySelectorAll("span span");
    expect(spans.length).toBe(3);
  });

  it("splits text by newline using custom separator", () => {
    currentFrame = 0;
    const { container } = render(
      <TextTransition
        transition={{
          opacity: [0, 1],
          split: "\n",
        }}
      >
        Line1{"\n"}Line2
      </TextTransition>
    );

    const spans = container.querySelectorAll("span span");
    expect(spans.length).toBe(2);
  });
});
