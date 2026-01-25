import { describe, it, expect } from "vitest";
import {
  parseGradient,
  normalizeColorStops,
  interpolateAngle,
  matchColorStopCount,
  interpolateGradients,
  gradientToCSS,
  interpolateGradientKeyframes,
  type ColorStop,
  type ParsedGradient,
} from "../gradient";
import { Easing } from "../interpolate";

describe("parseGradient", () => {
  describe("linear gradients", () => {
    it("should parse basic linear gradient", () => {
      const result = parseGradient("linear-gradient(90deg, red, blue)");
      expect(result).toEqual({
        type: "linear",
        angle: 90,
        stops: [{ color: "red" }, { color: "blue" }],
      });
    });

    it("should parse linear gradient with positioned stops", () => {
      const result = parseGradient("linear-gradient(180deg, red 0%, blue 50%, green 100%)");
      expect(result).toEqual({
        type: "linear",
        angle: 180,
        stops: [
          { color: "red", position: 0 },
          { color: "blue", position: 50 },
          { color: "green", position: 100 },
        ],
      });
    });

    it("should parse linear gradient without angle (default)", () => {
      const result = parseGradient("linear-gradient(red, blue)");
      expect(result).toEqual({
        type: "linear",
        angle: 180, // Default to bottom
        stops: [{ color: "red" }, { color: "blue" }],
      });
    });

    it("should parse linear gradient with 'to' direction", () => {
      const result = parseGradient("linear-gradient(to right, red, blue)");
      expect(result?.type).toBe("linear");
      expect(result?.angle).toBe(90);
    });

    it("should handle rgb() colors", () => {
      const result = parseGradient("linear-gradient(90deg, rgb(255, 0, 0), rgb(0, 0, 255))");
      expect(result?.stops[0].color).toBe("rgb(255, 0, 0)");
      expect(result?.stops[1].color).toBe("rgb(0, 0, 255)");
    });

    it("should handle rgba() colors", () => {
      const result = parseGradient(
        "linear-gradient(90deg, rgba(255, 0, 0, 0.5), rgba(0, 0, 255, 1))"
      );
      expect(result?.stops[0].color).toBe("rgba(255, 0, 0, 0.5)");
      expect(result?.stops[1].color).toBe("rgba(0, 0, 255, 1)");
    });

    it("should handle hex colors", () => {
      const result = parseGradient("linear-gradient(0deg, #ff0000, #0000ff)");
      expect(result?.stops[0].color).toBe("#ff0000");
      expect(result?.stops[1].color).toBe("#0000ff");
    });

    it("should handle negative angles", () => {
      const result = parseGradient("linear-gradient(-45deg, red, blue)");
      expect(result?.angle).toBe(-45);
    });
  });

  describe("radial gradients", () => {
    it("should parse basic radial gradient", () => {
      const result = parseGradient("radial-gradient(circle, red, blue)");
      expect(result).toEqual({
        type: "radial",
        shape: "circle",
        position: "center",
        stops: [{ color: "red" }, { color: "blue" }],
      });
    });

    it("should parse radial gradient with position", () => {
      const result = parseGradient("radial-gradient(circle at 50% 50%, red, blue)");
      expect(result?.position).toBe("50% 50%");
    });

    it("should parse radial gradient with ellipse shape", () => {
      const result = parseGradient("radial-gradient(ellipse at center, red, blue)");
      expect(result?.shape).toBe("ellipse");
    });

    it("should default to ellipse when shape not specified", () => {
      const result = parseGradient("radial-gradient(red, blue)");
      expect(result?.shape).toBe("ellipse");
    });

    it("should parse radial gradient with positioned stops", () => {
      const result = parseGradient("radial-gradient(circle, red 0%, blue 50%, green 100%)");
      expect(result?.stops).toEqual([
        { color: "red", position: 0 },
        { color: "blue", position: 50 },
        { color: "green", position: 100 },
      ]);
    });
  });

  describe("conic gradients", () => {
    it("should parse basic conic gradient", () => {
      const result = parseGradient("conic-gradient(red, yellow, green)");
      expect(result).toEqual({
        type: "conic",
        angle: 0,
        position: "center",
        stops: [{ color: "red" }, { color: "yellow" }, { color: "green" }],
      });
    });

    it("should parse conic gradient with 'from' angle", () => {
      const result = parseGradient("conic-gradient(from 90deg, red, blue)");
      expect(result?.angle).toBe(90);
    });

    it("should parse conic gradient with 'at' position", () => {
      const result = parseGradient("conic-gradient(from 0deg at 50% 50%, red, blue)");
      expect(result?.position).toBe("50% 50%");
    });

    it("should parse conic gradient with positioned stops", () => {
      const result = parseGradient("conic-gradient(red 0deg, yellow 120deg, green 240deg)");
      // Note: Our parser treats deg as position percentage for now
      expect(result?.stops.length).toBe(3);
    });
  });

  describe("edge cases", () => {
    it("should return null for invalid gradient", () => {
      const result = parseGradient("not-a-gradient");
      expect(result).toBeNull();
    });

    it("should return null for empty string", () => {
      const result = parseGradient("");
      expect(result).toBeNull();
    });

    it("should return null for gradient without closing paren", () => {
      const result = parseGradient("linear-gradient(90deg, red, blue");
      expect(result).toBeNull();
    });

    it("should handle gradient with many stops", () => {
      const result = parseGradient(
        "linear-gradient(90deg, red, orange, yellow, green, blue, purple)"
      );
      expect(result?.stops.length).toBe(6);
    });

    it("should handle whitespace variations", () => {
      const result = parseGradient("linear-gradient( 90deg , red , blue )");
      expect(result?.stops.length).toBe(2);
    });
  });
});

describe("normalizeColorStops", () => {
  it("should handle empty array", () => {
    const result = normalizeColorStops([]);
    expect(result).toEqual([]);
  });

  it("should handle single stop", () => {
    const result = normalizeColorStops([{ color: "red" }]);
    expect(result).toEqual([{ color: "red", position: 50 }]);
  });

  it("should add default positions to first and last stops", () => {
    const stops: ColorStop[] = [{ color: "red" }, { color: "blue" }];
    const result = normalizeColorStops(stops);
    expect(result[0].position).toBe(0);
    expect(result[1].position).toBe(100);
  });

  it("should auto-distribute middle stops without positions", () => {
    const stops: ColorStop[] = [{ color: "red" }, { color: "yellow" }, { color: "blue" }];
    const result = normalizeColorStops(stops);
    expect(result[0].position).toBe(0);
    expect(result[1].position).toBe(50);
    expect(result[2].position).toBe(100);
  });

  it("should preserve explicit positions", () => {
    const stops: ColorStop[] = [
      { color: "red", position: 0 },
      { color: "yellow", position: 30 },
      { color: "blue", position: 100 },
    ];
    const result = normalizeColorStops(stops);
    expect(result).toEqual(stops);
  });

  it("should handle mixed explicit and implicit positions", () => {
    const stops: ColorStop[] = [
      { color: "red", position: 0 },
      { color: "yellow" }, // Should be 50
      { color: "blue", position: 100 },
    ];
    const result = normalizeColorStops(stops);
    expect(result[0].position).toBe(0);
    expect(result[1].position).toBe(50);
    expect(result[2].position).toBe(100);
  });

  it("should distribute multiple undefined positions evenly", () => {
    const stops: ColorStop[] = [
      { color: "red", position: 0 },
      { color: "orange" },
      { color: "yellow" },
      { color: "green" },
      { color: "blue", position: 100 },
    ];
    const result = normalizeColorStops(stops);
    expect(result[0].position).toBe(0);
    expect(result[1].position).toBe(25);
    expect(result[2].position).toBe(50);
    expect(result[3].position).toBe(75);
    expect(result[4].position).toBe(100);
  });
});

describe("interpolateAngle", () => {
  it("should interpolate angles normally when not crossing 0", () => {
    expect(interpolateAngle(0, 90, 0.5)).toBe(45);
    expect(interpolateAngle(90, 180, 0.5)).toBe(135);
  });

  it("should take shortest path when crossing 0 degrees", () => {
    // 350 -> 10 should go through 0 (20 degree path), not through 180 (340 degree path)
    const result = interpolateAngle(350, 10, 0.5);
    expect(result).toBeCloseTo(0, 1);
  });

  it("should take shortest path when crossing 360 degrees", () => {
    // 10 -> 350 should go through 0 (20 degree path backwards)
    const result = interpolateAngle(10, 350, 0.5);
    expect(result).toBeCloseTo(0, 1);
  });

  it("should handle progress 0 and 1", () => {
    expect(interpolateAngle(45, 135, 0)).toBe(45);
    expect(interpolateAngle(45, 135, 1)).toBe(135);
  });

  it("should normalize negative angles", () => {
    const result = interpolateAngle(-45, 45, 0.5);
    expect(result).toBeCloseTo(0, 1);
  });

  it("should normalize angles > 360", () => {
    const result = interpolateAngle(370, 380, 0.5);
    expect(result).toBeCloseTo(15, 1); // 370 = 10, 380 = 20
  });

  it("should handle 180 degree difference (ambiguous)", () => {
    // Either direction is valid for 180 degree difference
    const result = interpolateAngle(0, 180, 0.5);
    expect([90, 270]).toContain(result);
  });
});

describe("matchColorStopCount", () => {
  it("should return same stops if count matches", () => {
    const stops: ColorStop[] = [
      { color: "red", position: 0 },
      { color: "blue", position: 100 },
    ];
    const result = matchColorStopCount(stops, 2);
    expect(result).toEqual(stops);
  });

  it("should pad by duplicating last stop", () => {
    const stops: ColorStop[] = [
      { color: "red", position: 0 },
      { color: "blue", position: 100 },
    ];
    const result = matchColorStopCount(stops, 4);
    expect(result.length).toBe(4);
    expect(result[2].color).toBe("blue");
    expect(result[3].color).toBe("blue");
  });

  it("should resample when target count is smaller", () => {
    const stops: ColorStop[] = [
      { color: "red", position: 0 },
      { color: "yellow", position: 50 },
      { color: "blue", position: 100 },
    ];
    const result = matchColorStopCount(stops, 2);
    expect(result.length).toBe(2);
    expect(result[0].position).toBe(0);
    expect(result[1].position).toBe(100);
  });
});

describe("interpolateGradients", () => {
  it("should interpolate linear gradients", () => {
    const from: ParsedGradient = {
      type: "linear",
      angle: 0,
      stops: [
        { color: "#ff0000", position: 0 },
        { color: "#0000ff", position: 100 },
      ],
    };
    const to: ParsedGradient = {
      type: "linear",
      angle: 180,
      stops: [
        { color: "#00ff00", position: 0 },
        { color: "#ffff00", position: 100 },
      ],
    };

    const result = interpolateGradients(from, to, 0.5);

    expect(result.type).toBe("linear");
    expect(result.angle).toBe(90); // Halfway between 0 and 180
    expect(result.stops.length).toBe(2);
    expect(result.stops[0].position).toBe(0);
    expect(result.stops[1].position).toBe(100);
  });

  it("should interpolate colors using Oklch", () => {
    const from: ParsedGradient = {
      type: "linear",
      angle: 90,
      stops: [{ color: "#ff0000", position: 0 }],
    };
    const to: ParsedGradient = {
      type: "linear",
      angle: 90,
      stops: [{ color: "#0000ff", position: 0 }],
    };

    const result = interpolateGradients(from, to, 0.5);
    expect(result.stops[0].color).toMatch(/rgb\(.*\)/);
  });

  it("should handle gradients with different stop counts", () => {
    const from: ParsedGradient = {
      type: "linear",
      angle: 0,
      stops: [
        { color: "red", position: 0 },
        { color: "blue", position: 100 },
      ],
    };
    const to: ParsedGradient = {
      type: "linear",
      angle: 0,
      stops: [
        { color: "green", position: 0 },
        { color: "yellow", position: 50 },
        { color: "orange", position: 100 },
      ],
    };

    const result = interpolateGradients(from, to, 0.5);
    expect(result.stops.length).toBe(3); // Matched to max count
  });

  it("should transition gradient types at 0.5", () => {
    const from: ParsedGradient = {
      type: "linear",
      angle: 0,
      stops: [{ color: "red", position: 0 }],
    };
    const to: ParsedGradient = {
      type: "radial",
      shape: "circle",
      stops: [{ color: "blue", position: 0 }],
    };

    const result1 = interpolateGradients(from, to, 0.4);
    expect(result1.type).toBe("linear");

    const result2 = interpolateGradients(from, to, 0.6);
    expect(result2.type).toBe("radial");
  });

  it("should apply easing function", () => {
    const from: ParsedGradient = {
      type: "linear",
      angle: 0,
      stops: [{ color: "red", position: 0 }],
    };
    const to: ParsedGradient = {
      type: "linear",
      angle: 180,
      stops: [{ color: "blue", position: 0 }],
    };

    const result = interpolateGradients(from, to, 0.5, Easing.easeIn);
    // With easeIn, progress 0.5 becomes 0.25, so angle should be closer to 0
    expect(result.angle!).toBeLessThan(90);
  });

  it("should interpolate radial gradient properties", () => {
    const from: ParsedGradient = {
      type: "radial",
      shape: "circle",
      position: "center",
      stops: [{ color: "red", position: 0 }],
    };
    const to: ParsedGradient = {
      type: "radial",
      shape: "ellipse",
      position: "top left",
      stops: [{ color: "blue", position: 0 }],
    };

    const result1 = interpolateGradients(from, to, 0.3);
    expect(result1.shape).toBe("circle");
    expect(result1.position).toBe("center");

    const result2 = interpolateGradients(from, to, 0.7);
    expect(result2.shape).toBe("ellipse");
    expect(result2.position).toBe("top left");
  });

  it("should interpolate conic gradient angles", () => {
    const from: ParsedGradient = {
      type: "conic",
      angle: 0,
      stops: [{ color: "red", position: 0 }],
    };
    const to: ParsedGradient = {
      type: "conic",
      angle: 90,
      stops: [{ color: "blue", position: 0 }],
    };

    const result = interpolateGradients(from, to, 0.5);
    expect(result.angle).toBe(45);
  });
});

describe("gradientToCSS", () => {
  it("should convert linear gradient to CSS", () => {
    const gradient: ParsedGradient = {
      type: "linear",
      angle: 90,
      stops: [
        { color: "red", position: 0 },
        { color: "blue", position: 100 },
      ],
    };
    const result = gradientToCSS(gradient);
    expect(result).toBe("linear-gradient(90deg, red 0%, blue 100%)");
  });

  it("should handle stops without positions", () => {
    const gradient: ParsedGradient = {
      type: "linear",
      angle: 180,
      stops: [{ color: "red" }, { color: "blue" }],
    };
    const result = gradientToCSS(gradient);
    expect(result).toBe("linear-gradient(180deg, red, blue)");
  });

  it("should convert radial gradient to CSS", () => {
    const gradient: ParsedGradient = {
      type: "radial",
      shape: "circle",
      position: "center",
      stops: [
        { color: "red", position: 0 },
        { color: "blue", position: 100 },
      ],
    };
    const result = gradientToCSS(gradient);
    expect(result).toBe("radial-gradient(circle at center, red 0%, blue 100%)");
  });

  it("should convert conic gradient to CSS", () => {
    const gradient: ParsedGradient = {
      type: "conic",
      angle: 45,
      position: "50% 50%",
      stops: [
        { color: "red", position: 0 },
        { color: "blue", position: 100 },
      ],
    };
    const result = gradientToCSS(gradient);
    expect(result).toBe("conic-gradient(from 45deg at 50% 50%, red 0%, blue 100%)");
  });

  it("should use default values when properties missing", () => {
    const gradient: ParsedGradient = {
      type: "linear",
      stops: [{ color: "red" }],
    };
    const result = gradientToCSS(gradient);
    expect(result).toBe("linear-gradient(180deg, red)");
  });
});

describe("interpolateGradientKeyframes", () => {
  it("should return empty string for empty array", () => {
    const result = interpolateGradientKeyframes([], 0.5);
    expect(result).toBe("");
  });

  it("should return single gradient unchanged", () => {
    const gradient = "linear-gradient(90deg, red, blue)";
    const result = interpolateGradientKeyframes([gradient], 0.5);
    expect(result).toBe(gradient);
  });

  it("should interpolate between two gradients", () => {
    const gradients = [
      "linear-gradient(0deg, red, blue)",
      "linear-gradient(180deg, green, yellow)",
    ];
    const result = interpolateGradientKeyframes(gradients, 0.5);
    expect(result).toContain("linear-gradient");
    expect(result).toContain("90deg"); // Halfway between 0 and 180
  });

  it("should handle three gradients", () => {
    const gradients = [
      "linear-gradient(0deg, red, blue)",
      "linear-gradient(90deg, green, yellow)",
      "linear-gradient(180deg, purple, orange)",
    ];

    // Progress 0.5 should be at second gradient
    const result = interpolateGradientKeyframes(gradients, 0.5);
    expect(result).toContain("90deg");
  });

  it("should clamp progress to [0, 1]", () => {
    const gradients = ["linear-gradient(0deg, red, blue)", "linear-gradient(180deg, green, yellow)"];

    const result1 = interpolateGradientKeyframes(gradients, -0.5);
    // When clamped to 0, should be first gradient (with normalized stops)
    expect(result1).toContain("0deg");

    const result2 = interpolateGradientKeyframes(gradients, 1.5);
    const parsed = parseGradient(result2);
    expect(parsed?.angle).toBe(180);
  });

  it("should apply easing function", () => {
    const gradients = ["linear-gradient(0deg, red, blue)", "linear-gradient(180deg, green, yellow)"];
    const result = interpolateGradientKeyframes(gradients, 0.5, Easing.easeIn);
    const parsed = parseGradient(result);
    // With easeIn, angle should be less than 90
    expect(parsed?.angle!).toBeLessThan(90);
  });

  it("should handle parse failures gracefully", () => {
    const gradients = ["not-a-gradient", "linear-gradient(90deg, red, blue)"];
    const result = interpolateGradientKeyframes(gradients, 0.5);
    // Should return one of the originals
    expect([gradients[0], gradients[1]]).toContain(result);
  });

  it("should transition between different gradient types", () => {
    const gradients = [
      "linear-gradient(90deg, red, blue)",
      "radial-gradient(circle, green, yellow)",
    ];
    const result1 = interpolateGradientKeyframes(gradients, 0.3);
    expect(result1).toContain("linear-gradient");

    const result2 = interpolateGradientKeyframes(gradients, 0.7);
    expect(result2).toContain("radial-gradient");
  });

  it("should work with complex real-world gradients", () => {
    const gradients = [
      "linear-gradient(45deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)",
      "linear-gradient(225deg, #5f27cd 0%, #341f97 50%, #0abde3 100%)",
    ];
    const result = interpolateGradientKeyframes(gradients, 0.5);
    expect(result).toMatch(/linear-gradient\(.+\)/);
  });
});
