import { describe, expect, test } from "vitest";
import { randomFloat, randomInt } from "../random";

describe("randomFloat", () => {
    test("returns value within range", () => {
        const val = randomFloat("seed1", 0, 10);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(10);
    });

    test("works with negative range", () => {
        const val = randomFloat("seed2", -10, -5);
        expect(val).toBeGreaterThanOrEqual(-10);
        expect(val).toBeLessThan(-5);
    });

    test("works with mixed sign range", () => {
        const val = randomFloat("seed3", -5, 5);
        expect(val).toBeGreaterThanOrEqual(-5);
        expect(val).toBeLessThan(5);
    });

    test("is deterministic", () => {
        expect(randomFloat("seed", 0, 10)).toBe(randomFloat("seed", 0, 10));
    });
});

describe("randomInt", () => {
    test("returns integers within range inclusive", () => {
        const val = randomInt("seed1", 0, 10);
        expect(Number.isInteger(val)).toBe(true);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(10);
    });

    test("works with negative range", () => {
        const val = randomInt("seed2", -10, -5);
        expect(Number.isInteger(val)).toBe(true);
        expect(val).toBeGreaterThanOrEqual(-10);
        expect(val).toBeLessThanOrEqual(-5);
    });

    test("works with mixed sign range", () => {
         const val = randomInt("seed3", -5, 5);
         expect(Number.isInteger(val)).toBe(true);
         expect(val).toBeGreaterThanOrEqual(-5);
         expect(val).toBeLessThanOrEqual(5);
    });
});
