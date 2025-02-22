import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export const waitMs = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const debounce = (func: () => void, wait: number): (() => void) => {
	let timeout: NodeJS.Timeout | number | null = null;
	return () => {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(() => {
			func();
		}, wait);
	};
};

export const updateOrAppend = <T, K extends keyof T>(
	array: T[],
	newItem: T,
	key: K,
): T[] => {
	return array.some((item) => item[key] === newItem[key])
		? array.map((item) => (item[key] === newItem[key] ? newItem : item))
		: [...array, newItem];
};
