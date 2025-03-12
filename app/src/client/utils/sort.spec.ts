import { describe, expect, it, vi } from "vitest";
import { sortByFractionalIndex } from "./sort";

const testCases = [
	{
		input: ["Zz", "a0"],
		expected: "Zz,a0",
	},
	{
		input: ["a0", "Zz"],
		expected: "Zz,a0",
	},
	{
		input: ["a1", "a0"],
		expected: "a0,a1",
	},
	{
		input: ["a1V", "a1"],
		expected: "a1,a1V",
	},
	{
		input: ["a3", "a1V"],
		expected: "a1V,a3",
	},
	{
		input: ["Zz", "A0"],
		expected: "A0,Zz",
	},
	{
		input: ["Z", "ZZ"],
		expected: "Z,ZZ",
	},
	{
		input: ["9", "a"],
		expected: "a,9",
	},
	{
		input: ["a3", "a1V", "Zz", "a1", "a0"],
		expected: "Zz,a0,a1,a1V,a3",
	},
];

describe("sortByFractionalIndex", () => {
	for (const testCase of testCases) {
		it(`should sort ${testCase.input.join(", ")} to ${testCase.expected}`, () => {
			const result = testCase.input.sort(sortByFractionalIndex);
			expect(result.join(",")).toBe(testCase.expected);
		});
	}
});
