import { describe, it, expect } from "vitest";
import { interpolate, Easing, resolveInterpolateValue } from "../interpolate";

describe("interpolate", () => {
  it("should perform basic linear interpolation", () => {
    expect(interpolate(5, [0, 10], [0, 100])).toBe(50);
    expect(interpolate(0, [0, 10], [0, 100])).toBe(0);
    expect(interpolate(10, [0, 10], [0, 100])).toBe(100);
  });

  it("should handle non-monotonic input ranges", () => {
    expect(interpolate(0.5, [0, 1, 0], [-100, -200, -300])).toBe(-150);
    expect(interpolate(0.5, [1, 0], [-200, -300])).toBe(-250);
  });

  it("should handle duplicate values for hold frames", () => {
    expect(interpolate(30, [0, 30, 30, 60], [5, 5, 10, 10])).toBe(5);
    expect(interpolate(45, [0, 30, 30, 60], [5, 5, 10, 10])).toBe(10);
  });

  it("should extrapolate with extend by default", () => {
    expect(interpolate(-5, [0, 10], [0, 100])).toBe(-50);
    expect(interpolate(15, [0, 10], [0, 100])).toBe(150);
  });

  it("should clamp with extrapolate clamp option", () => {
    expect(
      interpolate(-5, [0, 10], [0, 100], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    ).toBe(0);
    expect(
      interpolate(15, [0, 10], [0, 100], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    ).toBe(100);
  });

  it("should return identity with extrapolate identity option", () => {
    expect(
      interpolate(-5, [0, 10], [0, 100], { extrapolateLeft: "identity" })
    ).toBe(-5);
    expect(
      interpolate(15, [0, 10], [0, 100], { extrapolateRight: "identity" })
    ).toBe(15);
  });

  it("should apply easing functions", () => {
    const result = interpolate(5, [0, 10], [0, 100], { easing: "easeInQuad" });
    expect(result).toBe(25); // (5/10)^2 * 100 = 0.25 * 100 = 25
  });

  it("should apply custom easing functions", () => {
    const customEasing = (t: number) => t * t * t; // cubic
    const result = interpolate(5, [0, 10], [0, 100], { easing: customEasing });
    expect(result).toBe(12.5); // (5/10)^3 * 100 = 0.125 * 100 = 12.5
  });

  it("should throw error for mismatched input/output range lengths", () => {
    expect(() => interpolate(5, [0, 10], [0, 100, 200])).toThrow(
      "inputRange and outputRange must have the same length"
    );
  });

  it("should throw error for input range with less than 2 elements", () => {
    expect(() => interpolate(5, [0], [0])).toThrow(
      "inputRange must have at least 2 elements"
    );
  });
});

describe("Easing", () => {
  it("should have linear easing that returns the same value", () => {
    expect(Easing.linear(0.5)).toBe(0.5);
    expect(Easing.linear(0)).toBe(0);
    expect(Easing.linear(1)).toBe(1);
  });

  it("should have easeIn that starts slow", () => {
    expect(Easing.easeIn(0.5)).toBe(0.25);
  });

  it("should have easeOut that ends slow", () => {
    expect(Easing.easeOut(0.5)).toBe(0.75);
  });

  it("should have easeInOut", () => {
    expect(Easing.easeInOut(0.25)).toBe(0.125);
    expect(Easing.easeInOut(0.75)).toBe(0.875);
  });
});

describe("resolveInterpolateValue", () => {
  it("should return static number values as-is", () => {
    expect(resolveInterpolateValue(42, 10)).toBe(42);
    expect(resolveInterpolateValue(0, 100)).toBe(0);
    expect(resolveInterpolateValue(-5, 50)).toBe(-5);
  });

  it("should interpolate array values at the given frame", () => {
    const value: [number[], number[]] = [[0, 10], [0, 100]];
    expect(resolveInterpolateValue(value, 5)).toBe(50);
    expect(resolveInterpolateValue(value, 0)).toBe(0);
    expect(resolveInterpolateValue(value, 10)).toBe(100);
  });

  it("should support interpolate array with options", () => {
    const value: [number[], number[], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }] = [
      [0, 10],
      [0, 100],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    ];
    expect(resolveInterpolateValue(value, -5)).toBe(0);
    expect(resolveInterpolateValue(value, 15)).toBe(100);
  });

  it("should support easing in interpolate arrays", () => {
    const value: [number[], number[], { easing: "easeInQuad" }] = [
      [0, 10],
      [0, 100],
      { easing: "easeInQuad" }
    ];
    expect(resolveInterpolateValue(value, 5)).toBe(25);
  });

  it("should handle complex animation ranges", () => {
    const fadeInOut: [number[], number[]] = [
      [0, 20, 80, 100],
      [0, 1, 1, 0]
    ];
    expect(resolveInterpolateValue(fadeInOut, 0)).toBe(0);
    expect(resolveInterpolateValue(fadeInOut, 20)).toBe(1);
    expect(resolveInterpolateValue(fadeInOut, 50)).toBe(1);
    expect(resolveInterpolateValue(fadeInOut, 80)).toBe(1);
    expect(resolveInterpolateValue(fadeInOut, 100)).toBe(0);
  });
});
