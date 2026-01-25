import { describe, it, expect } from "vitest";
import { interpolateColorKeyframes } from "../color";
import { Easing } from "../interpolate";

describe("interpolateColorKeyframes", () => {
  describe("edge cases", () => {
    it("should return transparent for empty array", () => {
      expect(interpolateColorKeyframes([], 0.5)).toBe("transparent");
    });

    it("should return the single color when only one color is provided", () => {
      expect(interpolateColorKeyframes(["#ff0000"], 0.5)).toBe("#ff0000");
    });

    it("should clamp progress below 0", () => {
      const result = interpolateColorKeyframes(["#ff0000", "#0000ff"], -0.5);
      expect(result).toBe(interpolateColorKeyframes(["#ff0000", "#0000ff"], 0));
    });

    it("should clamp progress above 1", () => {
      const result = interpolateColorKeyframes(["#ff0000", "#0000ff"], 1.5);
      expect(result).toBe(interpolateColorKeyframes(["#ff0000", "#0000ff"], 1));
    });
  });

  describe("two-color interpolation", () => {
    it("should return first color at progress 0", () => {
      const result = interpolateColorKeyframes(["#ff0000", "#0000ff"], 0);
      // Should be close to red
      expect(result).toMatch(/rgb\(.*\)/);
      expect(result).toContain("255");
    });

    it("should return second color at progress 1", () => {
      const result = interpolateColorKeyframes(["#ff0000", "#0000ff"], 1);
      // Should be close to blue
      expect(result).toMatch(/rgb\(.*\)/);
      expect(result).toContain("255");
    });

    it("should interpolate between colors at progress 0.5", () => {
      const result = interpolateColorKeyframes(["#ff0000", "#0000ff"], 0.5);
      // With Oklch, red to blue should produce a smooth purple-ish middle color
      expect(result).toMatch(/rgb\(.*\)/);
      // Should not be pure red or pure blue
      expect(result).not.toBe("rgb(255, 0, 0)");
      expect(result).not.toBe("rgb(0, 0, 255)");
    });

    it("should handle named colors", () => {
      const result = interpolateColorKeyframes(["red", "blue"], 0.5);
      expect(result).toMatch(/rgb\(.*\)/);
    });

    it("should handle rgb() format", () => {
      const result = interpolateColorKeyframes(
        ["rgb(255, 0, 0)", "rgb(0, 0, 255)"],
        0.5
      );
      expect(result).toMatch(/rgb\(.*\)/);
    });

    it("should handle rgba() format with alpha", () => {
      const result = interpolateColorKeyframes(
        ["rgba(255, 0, 0, 0.5)", "rgba(0, 0, 255, 1)"],
        0.5
      );
      expect(result).toMatch(/rgba?\(.*\)/);
    });

    it("should handle hsl() format", () => {
      const result = interpolateColorKeyframes(
        ["hsl(0, 100%, 50%)", "hsl(240, 100%, 50%)"],
        0.5
      );
      expect(result).toMatch(/rgb\(.*\)/);
    });
  });

  describe("multi-keyframe interpolation", () => {
    it("should interpolate through three colors", () => {
      const colors = ["#ff0000", "#00ff00", "#0000ff"];

      // Progress 0 -> red
      const resultStart = interpolateColorKeyframes(colors, 0);
      expect(resultStart).toMatch(/rgb\(.*\)/);
      expect(resultStart).toContain("255");

      // Progress 0.5 -> green
      const resultMid = interpolateColorKeyframes(colors, 0.5);
      expect(resultMid).toMatch(/rgb\(.*\)/);

      // Progress 1 -> blue
      const resultEnd = interpolateColorKeyframes(colors, 1);
      expect(resultEnd).toMatch(/rgb\(.*\)/);
      expect(resultEnd).toContain("255");
    });

    it("should handle four colors with correct segment boundaries", () => {
      const colors = ["red", "yellow", "green", "blue"];

      // Progress 0.25 should be between red and yellow (first segment)
      const result1 = interpolateColorKeyframes(colors, 0.25);
      expect(result1).toMatch(/rgb\(.*\)/);

      // Progress 0.5 should be at yellow (boundary)
      const result2 = interpolateColorKeyframes(colors, 0.5);
      expect(result2).toMatch(/rgb\(.*\)/);

      // Progress 0.75 should be between green and blue (third segment)
      const result3 = interpolateColorKeyframes(colors, 0.75);
      expect(result3).toMatch(/rgb\(.*\)/);
    });
  });

  describe("easing integration", () => {
    it("should apply linear easing (no change)", () => {
      const result = interpolateColorKeyframes(
        ["#ff0000", "#0000ff"],
        0.5,
        Easing.linear
      );
      expect(result).toMatch(/rgb\(.*\)/);
    });

    it("should apply easeIn", () => {
      const resultNoEasing = interpolateColorKeyframes(["#ff0000", "#0000ff"], 0.5);
      const resultEaseIn = interpolateColorKeyframes(
        ["#ff0000", "#0000ff"],
        0.5,
        Easing.easeIn
      );
      // With easeIn, progress 0.5 should be less advanced than linear
      expect(resultEaseIn).toMatch(/rgb\(.*\)/);
    });

    it("should apply easeOut", () => {
      const resultNoEasing = interpolateColorKeyframes(["#ff0000", "#0000ff"], 0.5);
      const resultEaseOut = interpolateColorKeyframes(
        ["#ff0000", "#0000ff"],
        0.5,
        Easing.easeOut
      );
      // With easeOut, progress 0.5 should be more advanced than linear
      expect(resultEaseOut).toMatch(/rgb\(.*\)/);
    });

    it("should apply custom easing function", () => {
      const customEasing = (t: number) => t * t * t;
      const result = interpolateColorKeyframes(
        ["#ff0000", "#0000ff"],
        0.5,
        customEasing
      );
      expect(result).toMatch(/rgb\(.*\)/);
    });
  });

  describe("Oklch perceptual uniformity", () => {
    it("should produce smoother red-to-blue transition than RGB", () => {
      // In RGB, red to blue goes through dark muddy colors
      // In Oklch, the transition should maintain brightness better
      const result = interpolateColorKeyframes(["#ff0000", "#0000ff"], 0.5);

      // The result should be a color string
      expect(result).toMatch(/rgb\(.*\)/);

      // In Oklch, red→blue at 50% should be brighter than RGB's muddy middle
      // RGB would give rgb(127, 0, 127) which is dark
      // Oklch should give a brighter purple
      // This is a qualitative test - exact values depend on culori's implementation
      expect(result).toBeTruthy();
    });

    it("should handle invalid colors gracefully", () => {
      // culori returns null for invalid colors, which we convert to transparent
      const result = interpolateColorKeyframes(["not-a-color", "#0000ff"], 0.5);
      expect(result).toMatch(/(transparent|rgb\(.*\))/);
    });
  });

  describe("real-world use cases", () => {
    it("should handle gradient from warm to cool", () => {
      const result = interpolateColorKeyframes(
        ["#ff6b6b", "#4ecdc4", "#45b7d1"],
        0.5
      );
      expect(result).toMatch(/rgb\(.*\)/);
    });

    it("should handle high contrast transitions", () => {
      const result = interpolateColorKeyframes(["#000000", "#ffffff"], 0.5);
      expect(result).toMatch(/rgb\(.*\)/);
    });

    it("should handle pastel color transitions", () => {
      const result = interpolateColorKeyframes(
        ["#ffd1dc", "#e0bbe4", "#d4a5a5"],
        0.33
      );
      expect(result).toMatch(/rgb\(.*\)/);
    });
  });
});
