export const fadeIn = (
	duration: number,
	element: HTMLElement,
): Promise<void> => {
	return new Promise((resolve) => {
		let start: number | null = null;
		const animate = (currentTime: number, element: HTMLElement) => {
			if (!start) start = currentTime;
			const progress = (currentTime - start) / duration;

			if (progress < 1) {
				element.style.opacity = String(Math.min(progress, 1));
				requestAnimationFrame((time) => animate(time, element));
			} else {
				element.style.opacity = String(1);
				resolve();
			}
		};
		requestAnimationFrame((time) => animate(time, element));
	});
};

export const fadeOut = (
	duration: number,
	element: HTMLElement,
): Promise<void> => {
	return new Promise((resolve) => {
		let start: number | null = null;
		const animate = (currentTime: number, element: HTMLElement) => {
			if (!start) start = currentTime;
			const progress = (currentTime - start) / duration;

			if (progress < 1) {
				element.style.opacity = String(1 - Math.min(progress, 1));
				requestAnimationFrame((time) => animate(time, element));
			} else {
				element.style.opacity = String(0);
				resolve();
			}
		};
		requestAnimationFrame((time) => animate(time, element));
	});
};

export const crossFade = (
	elementOut: HTMLElement,
	elementIn: HTMLElement,
	duration = 500,
): Promise<void> => {
	return new Promise((resolve) => {
		let start: number | null = null;

		elementIn.style.opacity = "0";
		elementOut.style.opacity = "1";

		const animate = (currentTime: number) => {
			if (!start) start = currentTime;
			const progress = (currentTime - start) / duration;

			if (progress < 1) {
				elementOut.style.opacity = String(1 - Math.min(progress, 1));
				elementIn.style.opacity = String(Math.min(progress, 1));
				requestAnimationFrame(animate);
			} else {
				elementOut.style.opacity = "0";
				elementIn.style.opacity = "1";
				resolve();
			}
		};

		requestAnimationFrame(animate);
	});
};
