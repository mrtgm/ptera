import { player } from "~/features/player/libs/engine";
import { type EasingType, easing } from "~/utils/easing";

type Keyframe = {
	offset: number; // 0 to 1
	value: number | string;
};

export type PropertyAnimation = {
	property: string;
	keyframes: Keyframe[];
	unit?: string;
};

type TransitionTarget = {
	element: HTMLElement;
	properties: PropertyAnimation[];
};

export type TransitionConfig = {
	targets: TransitionTarget[];
	duration?: number;
	eventId: string;
	easing?: EasingType;
	onComplete?: (elements: HTMLElement[]) => void;
};

type Interpolator<T> = (from: T, to: T, progress: number) => number | string;

type NumberInterpolator = Interpolator<number>;
type TransformInterpolator = Interpolator<string>;

export const numberInterpolator: NumberInterpolator = (from, to, progress) => {
	return from + (to - from) * progress;
};

export const parseTransform = (transform: string) => {
	const funcMatch = transform.match(/(\w+)\((.*?)\)/);
	if (!funcMatch) return null;

	const [, funcName, value] = funcMatch;

	const numMatch = value.match(/-?\d+\.?\d*/);
	if (!numMatch) return null;

	const unitMatch = value.match(/(?:[a-z%]+)$/i);
	const unit = unitMatch ? unitMatch[0] : "";

	return {
		funcName,
		value: Number.parseFloat(numMatch[0]),
		unit,
	};
};

export const transformInterpolator: TransformInterpolator = (
	from,
	to,
	progress,
) => {
	const fromInfo = parseTransform(from);
	const toInfo = parseTransform(to);

	if (!fromInfo || !toInfo) return from;
	if (fromInfo.funcName !== toInfo.funcName) return from;

	const unit = toInfo.unit || fromInfo.unit;
	const current = fromInfo.value + (toInfo.value - fromInfo.value) * progress;

	return `${fromInfo.funcName}(${current}${unit})`;
};

const interpolateKeyframes = (
	keyframes: Keyframe[],
	progress: number,
): number | string => {
	if (progress <= keyframes[0].offset) return keyframes[0].value;
	if (progress >= keyframes[keyframes.length - 1].offset)
		return keyframes[keyframes.length - 1].value;

	for (let i = 0; i < keyframes.length - 1; i++) {
		const current = keyframes[i];
		const next = keyframes[i + 1];

		if (progress >= current.offset && progress <= next.offset) {
			const segmentProgress =
				(progress - current.offset) / (next.offset - current.offset);

			if (typeof current.value === "string" && typeof next.value === "string") {
				return transformInterpolator(
					current.value,
					next.value,
					segmentProgress,
				);
			}
			if (typeof current.value === "number" && typeof next.value === "number") {
				return numberInterpolator(current.value, next.value, segmentProgress);
			}

			return current.value;
		}
	}

	return keyframes[0].value;
};

type SupportedStyleProperties = keyof Pick<
	CSSStyleDeclaration,
	"transform" | "opacity"
>;

export class Transition {
	private config: TransitionConfig;
	private startTime: number | null = null;
	private animationFrame: number | null = null;

	constructor(config: TransitionConfig) {
		this.config = {
			easing: "linear",
			...config,
		};
	}

	start(): Promise<void> {
		return new Promise((resolve) => {
			const animate = (currentTime: number) => {
				if (!this.startTime) this.startTime = currentTime;
				const elapsed = currentTime - this.startTime;

				// トランジションをスキップ
				if (player.checkIfEventIsCanceled(this.config.eventId)) {
					this.complete(resolve);
					return;
				}

				const progress = easing.getProgress(elapsed, {
					duration: this.config.duration ?? 0,
					easing: this.config.easing ?? "linear",
				});

				if (progress < 1) {
					this.update(progress);
					this.animationFrame = requestAnimationFrame(animate);
				} else {
					this.complete(resolve);
				}
			};

			this.animationFrame = requestAnimationFrame(animate);
		});
	}

	private update(progress: number) {
		for (const target of this.config.targets) {
			for (const prop of target.properties) {
				const value = interpolateKeyframes(prop.keyframes, progress);
				const formattedValue = prop.unit ? `${value}${prop.unit}` : value;
				target.element.style[prop.property as SupportedStyleProperties] =
					String(formattedValue);
			}
		}
	}

	private complete(resolve: () => void) {
		if (this.animationFrame) {
			cancelAnimationFrame(this.animationFrame);
		}

		for (const target of this.config.targets) {
			for (const prop of target.properties) {
				const finalValue = prop.keyframes[prop.keyframes.length - 1].value;
				const formattedValue = prop.unit
					? `${finalValue}${prop.unit}`
					: finalValue;
				target.element.style[prop.property as SupportedStyleProperties] =
					String(formattedValue);
			}
		}

		if (this.config.onComplete) {
			this.config.onComplete(this.config.targets.map((t) => t.element));
		}

		resolve();
	}
}

export const fadeIn = (
	eventId: string,
	duration: number,
	element: HTMLElement,
): Promise<void> => {
	const transition = new Transition({
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

	return transition.start();
};

export const fadeOut = (
	eventId: string,
	duration: number,
	element: HTMLElement,
): Promise<void> => {
	const transition = new Transition({
		targets: [
			{
				element,
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
		],
		duration,
		eventId,
	});

	return transition.start();
};

export const crossFade = (
	eventId: string,
	duration: number,
	elementOut: HTMLElement,
	elementIn: HTMLElement,
): Promise<void> => {
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

	return transition.start();
};

export const shake = (
	eventId: string,
	duration: number,
	element: HTMLElement,
): Promise<void> => {
	const transition = new Transition({
		targets: [
			{
				element,
				properties: [
					{
						property: "transform",
						keyframes: [
							{ offset: 0, value: "translateX(0px)" },
							{ offset: 0.1, value: "translateX(-1px)" },
							{ offset: 0.2, value: "translateX(2px)" },
							{ offset: 0.3, value: "translateX(-4px)" },
							{ offset: 0.4, value: "translateX(4px)" },
							{ offset: 0.5, value: "translateX(-4px)" },
							{ offset: 0.6, value: "translateX(4px)" },
							{ offset: 0.7, value: "translateX(-4px)" },
							{ offset: 0.8, value: "translateX(2px)" },
							{ offset: 0.9, value: "translateX(-1px)" },
							{ offset: 1, value: "translateX(0px)" },
						],
					},
				],
			},
		],
		duration,
		eventId,
	});

	return transition.start();
};

export const flash = (
	eventId: string,
	duration: number,
	element: HTMLElement,
): Promise<void> => {
	const transition = new Transition({
		targets: [
			{
				element,
				properties: [
					{
						property: "opacity",
						keyframes: [
							{ offset: 0, value: 1 },
							{ offset: 0.5, value: 0 },
							{ offset: 1, value: 1 },
						],
					},
				],
			},
		],
		duration,
		eventId,
	});

	return transition.start();
};

export const wobble = (
	eventId: string,
	duration: number,
	element: HTMLElement,
): Promise<void> => {
	const transition = new Transition({
		targets: [
			{
				element,
				properties: [
					{
						property: "transform",
						keyframes: [
							{ offset: 0, value: "rotate(0deg)" },
							{ offset: 0.25, value: "rotate(-5deg)" },
							{ offset: 0.75, value: "rotate(5deg)" },
							{ offset: 1, value: "rotate(0deg)" },
						],
					},
				],
			},
		],
		duration,
		eventId,
	});

	return transition.start();
};

export const bounce = (
	eventId: string,
	duration: number,
	element: HTMLElement,
): Promise<void> => {
	const transition = new Transition({
		targets: [
			{
				element,
				properties: [
					{
						property: "transform",
						keyframes: [
							{ offset: 0, value: "translateY(0)" },
							{ offset: 0.5, value: "translateY(-20px)" },
							{ offset: 1, value: "translateY(0)" },
						],
					},
				],
			},
		],
		duration,
		eventId,
		easing: "easeInOutExpo",
	});

	return transition.start();
};

export const sway = (
	eventId: string,
	duration: number,
	element: HTMLElement,
): Promise<void> => {
	const transition = new Transition({
		targets: [
			{
				element,
				properties: [
					{
						property: "transform",
						keyframes: [
							{ offset: 0, value: "translateX(0)" },
							{ offset: 0.25, value: "translateX(-10px)" },
							{ offset: 0.75, value: "translateX(10px)" },
							{ offset: 1, value: "translateX(0)" },
						],
					},
				],
			},
		],
		duration,
		eventId,
	});

	return transition.start();
};

export const blackOn = (
	eventId: string,
	duration: number,
	element: HTMLElement,
): Promise<void> => {
	const transition = new Transition({
		targets: [
			{
				element,
				properties: [
					{
						property: "filter",
						keyframes: [
							{ offset: 0, value: "brightness(1)" },
							{ offset: 1, value: "brightness(0)" },
						],
					},
					{
						property: "mixBlendMode",
						keyframes: [{ offset: 0, value: "luminosity" }],
					},
				],
			},
		],
		duration,
		eventId,
	});

	return transition.start();
};

export const blackOff = (
	eventId: string,
	duration: number,
	element: HTMLElement,
): Promise<void> => {
	const transition = new Transition({
		targets: [
			{
				element,
				properties: [
					{
						property: "filter",
						keyframes: [
							{ offset: 0, value: "brightness(0)" },
							{ offset: 1, value: "brightness(1)" },
						],
					},
					{
						property: "mixBlendMode",
						keyframes: [{ offset: 0, value: "luminosity" }],
					},
				],
			},
		],
		duration,
		eventId,
	});

	return transition.start();
};
