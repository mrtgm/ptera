import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { player } from "~/features/player/utils/engine";
import {
	Transition,
	numberInterpolator,
	parseTransform,
	transformInterpolator,
} from "./transition";

describe("Animation functions", () => {
	let element: HTMLElement;
	let elementIn: HTMLElement;
	let elementOut: HTMLElement;

	beforeEach(() => {
		element = document.createElement("div");
		elementIn = document.createElement("div");
		elementOut = document.createElement("div");

		element.style.opacity = "0";
		elementIn.style.opacity = "0";
		elementOut.style.opacity = "1";

		vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
			setTimeout(() => cb(performance.now()), 0);
			return 1;
		});

		vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe("fadeIn", () => {
		it("スタイルを変更できるか", async () => {
			const duration = 100;
			const eventId = "test-fade-in";

			const transiton = new Transition({
				targets: [
					{
						element,
						properties: [
							{
								property: "opacity",
								keyframes: [
									{ offset: 0, value: 0 },
									{ offset: 1, value: 1 },
								],
							},
						],
					},
				],
				duration,
				eventId,
			});

			expect(element.style.opacity).toBe("0");

			await transiton.start();

			expect(element.style.opacity).toBe("1");
		});

		it("トランジションが途中でキャンセル可能か", async () => {
			const duration = 100;
			const eventId = "test-fade-in-cancel";

			const transiton = new Transition({
				targets: [
					{
						element,
						properties: [
							{
								property: "opacity",
								keyframes: [
									{ offset: 0, value: 0 },
									{ offset: 1, value: 1 },
								],
							},
						],
					},
				],
				duration,
				eventId,
			});

			player.addCancelRequest(eventId);

			expect(player.cancelTransitionRequests).toContain(eventId);

			const now = performance.now();

			await transiton.start();

			expect(performance.now() - now).toBeLessThan(duration);
			expect(element.style.opacity).toBe("1");
			expect(player.cancelTransitionRequests).not.toContain(eventId);
		});
	});

	describe("crossFade", () => {
		it("複数の要素のスタイルを同時に変更できるか", async () => {
			const duration = 100;
			const eventId = "test-cross-fade";

			const transition = new Transition({
				targets: [
					{
						element: elementOut,
						properties: [
							{
								property: "opacity",
								keyframes: [
									{ offset: 0, value: 1 },
									{ offset: 1, value: 0 },
								],
							},
						],
					},
					{
						element: elementIn,
						properties: [
							{
								property: "opacity",
								keyframes: [
									{ offset: 0, value: 0 },
									{ offset: 1, value: 1 },
								],
							},
						],
					},
				],
				duration,
				eventId,
			});

			expect(elementOut.style.opacity).toBe("1");
			expect(elementIn.style.opacity).toBe("0");

			await transition.start();

			expect(elementOut.style.opacity).toBe("0");
			expect(elementIn.style.opacity).toBe("1");
		});
	});
});

describe("Interpolation functions", () => {
	describe("numberInterpolator", () => {
		it("number を正しく補完できるか", () => {
			const from = 0;
			const to = 100;
			const progress = 0.5;

			const result = numberInterpolator(from, to, progress);
			expect(result).toBe(50);
		});
	});

	describe("parseTransform", () => {
		it("unit があるとき", () => {
			const info = parseTransform("translateY(-20px)");
			expect(info).toEqual({
				funcName: "translateY",
				value: -20,
				unit: "px",
			});
		});

		it("unit がないとき", () => {
			const info = parseTransform("translateY(-20)");
			expect(info).toEqual({
				funcName: "translateY",
				value: -20,
				unit: "",
			});
		});

		it("deg", () => {
			const info = parseTransform("rotate(45deg)");
			expect(info).toEqual({
				funcName: "rotate",
				value: 45,
				unit: "deg",
			});
		});
	});

	describe("transformInterpolator", () => {
		it("transform を正しく補完できるか", () => {
			const from = "translateX(0px)";
			const to = "translateX(100px)";
			const progress = 0.5;

			const result = transformInterpolator(from, to, progress);
			expect(result).toBe("translateX(50px)");
		});

		it("不適切な値を扱えるか", () => {
			const from = "invalid";
			const to = "also-invalid";
			const progress = 0.5;

			const result = transformInterpolator(from, to, progress);
			expect(result).toBe("invalid");
		});
	});
});

vi.mock("~/stores/player", () => {
	const cancelTransitionRequests = new Set<string>();

	return {
		player: {
			addCancelRequest: vi.fn((eventId: string) => {
				cancelTransitionRequests.add(eventId);
			}),
			removeCancelRequest: vi.fn((eventId: string) => {
				cancelTransitionRequests.delete(eventId);
			}),
			checkIfEventIsCanceled: vi.fn((eventId: string) =>
				cancelTransitionRequests.has(eventId),
			),
			cancelTransitionRequests,
		},
	};
});
