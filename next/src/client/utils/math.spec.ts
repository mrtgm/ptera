import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { minMax } from "./math";

describe("Math", () => {
  it("minMax", () => {
    expect(minMax(10, 0, 100)).toBe(10);
    expect(minMax(-10, 0, 100)).toBe(0);
    expect(minMax(110, 0, 100)).toBe(100);
  });
});
