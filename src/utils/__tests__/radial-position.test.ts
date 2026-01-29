import { describe, it, expect } from "vitest";
import { interpolateGradientKeyframes } from "../gradient";

describe("Radial Gradient Position Interpolation", () => {
  it("interpolates between center and top right", () => {
    const from = "radial-gradient(circle at center, #000 0%, #fff 100%)";
    const to = "radial-gradient(circle at top right, #000 0%, #fff 100%)";

    // 50% progress should be halfway between center (50% 50%) and top right (100% 0%)
    // x: 50 + (100-50)*0.5 = 75%
    // y: 50 + (0-50)*0.5 = 25%
    const result = interpolateGradientKeyframes([from, to], 0.5);

    expect(result).toContain("at 75% 25%");
  });

  it("interpolates between percentages", () => {
    const from = "radial-gradient(circle at 0% 0%, #000, #fff)";
    const to = "radial-gradient(circle at 100% 100%, #000, #fff)";

    const result = interpolateGradientKeyframes([from, to], 0.5);

    expect(result).toContain("at 50% 50%");
  });

  it("handles keywords mixed with percentages", () => {
    const from = "radial-gradient(circle at left 50%, #000, #fff)";
    // left 50% -> x=0, y=50
    const to = "radial-gradient(circle at right 50%, #000, #fff)";
    // right 50% -> x=100, y=50

    const result = interpolateGradientKeyframes([from, to], 0.5);

    expect(result).toContain("at 50% 50%");
  });
});
