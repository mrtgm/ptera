import {
	Children,
	type ReactElement,
	type ReactNode,
	cloneElement,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	type PropertyAnimation,
	Transition,
	type TransitionConfig,
} from "~/utils/transition";
type TransitionType = "enter" | "exit";

export interface CustomPresenceConfig {
	enter?: { configs: Omit<TransitionConfig, "targets" | "eventId"> } & {
		properties?: PropertyAnimation[];
	};
	exit?: { configs: Omit<TransitionConfig, "targets" | "eventId"> } & {
		properties?: PropertyAnimation[];
	};
}

type ChildItem = {
	key: string;
	element: ReactElement;
	phase: "entering" | "present" | "exiting" | "swapping";
};

export const AnimatePresence = ({
	eventId,
	children,
	config,
}: {
	eventId: string;
	children: ReactNode;
	config?: CustomPresenceConfig;
}) => {
	const childArray = useMemo(
		() => Children.toArray(children) as React.ReactElement[],
		[children],
	);
	const prevChildArray = useRef(childArray);

	const [items, setItems] = useState<ChildItem[]>(() => {
		return childArray.map((elem) => ({
			key: String(elem.key),
			element: elem,
			phase: "entering",
		}));
	});

	const refMap = useRef(new Map<string, HTMLElement>());

	const attachRef = useCallback((key: string) => {
		return (el: HTMLElement | null) => {
			if (el) {
				refMap.current.set(key, el);
			} else {
				refMap.current.delete(key);
			}
		};
	}, []);

	// 子要素の変更検知
	useEffect(() => {
		const newKeys = childArray.map((c) => String(c.key));
		const oldKeys = prevChildArray.current.map((c) => String(c.key));
		prevChildArray.current = childArray;

		// 追加されたキー (enter)
		let addedKeys = newKeys.filter((k) => !oldKeys.includes(k));
		// 削除されたキー (exit)
		let removedKeys = oldKeys.filter((k) => !newKeys.includes(k));

		const swapOps: { oldKey: string; newKey: string }[] = [];
		for (let i = 0; i < childArray.length; i++) {
			const newKey = newKeys[i];
			const oldKey = oldKeys[i];
			if (newKey && oldKey && newKey !== oldKey) {
				// swap認定
				swapOps.push({ oldKey, newKey });

				addedKeys = addedKeys.filter((k) => k !== newKey);
				removedKeys = removedKeys.filter((k) => k !== oldKey);
			}
		}

		if (
			addedKeys.length === 0 &&
			removedKeys.length === 0 &&
			swapOps.length === 0
		) {
			return;
		}

		setItems((prevItems) => {
			let updated = [...prevItems];

			for (const k of addedKeys) {
				const elem = childArray.find((c) => String(c.key) === k);
				if (elem) {
					updated.push({
						key: k,
						element: elem,
						phase: "entering",
					});
				}
			}

			for (const k of removedKeys) {
				const index = updated.findIndex((i) => i.key === k);
				if (index !== -1) {
					updated[index] = { ...updated[index], phase: "exiting" };
				}
			}

			if (swapOps.length > 0) {
				for (const { oldKey, newKey } of swapOps) {
					const oldIndex = updated.findIndex((i) => i.key === oldKey);
					const newElem = childArray.find((c) => String(c.key) === newKey);
					if (oldIndex !== -1 && newElem) {
						const oldElem = updated[oldIndex].element;

						updated[oldIndex] = {
							key: newKey,
							element: newElem,
							phase: "entering",
						};

						updated = [
							...updated.slice(0, oldIndex + 1),
							{
								key: oldKey,
								phase: "exiting",
								element: oldElem,
							},
							...updated.slice(oldIndex + 1),
						];
					}
				}
			}

			return updated;
		});
	}, [childArray]);

	const runningTransitions = useRef(new Map<string, Transition>());

	// アニメーション処理
	useLayoutEffect(() => {
		for (const item of items) {
			if (
				item.phase === "entering" &&
				!runningTransitions.current.has(item.key)
			) {
				runTransition("enter", item.key);
			} else if (
				item.phase === "exiting" &&
				!runningTransitions.current.has(item.key)
			) {
				runTransition("exit", item.key);
			}
		}
	}, [items]);

	const runTransition = (type: TransitionType, key: string) => {
		const el = refMap.current.get(key);
		if (!el) return;

		const transitionBase = config?.[type]?.configs;
		const propertyAnimation =
			config?.[type]?.properties || buildPropertyAnimation(type);

		const transitionCfg: TransitionConfig = {
			...transitionBase, // duration, easing, onComplete などの設定を継承
			eventId,
			targets: [
				{
					element: el,
					properties: propertyAnimation,
				},
			],
			onComplete: (elements) => {
				if (transitionBase?.onComplete) {
					transitionBase.onComplete(elements);
				}
				runningTransitions.current.delete(key);
				finalizeTransition(type, key);
			},
		};

		const transition = new Transition(transitionCfg);
		runningTransitions.current.set(key, transition);

		transition.start();
	};

	const finalizeTransition = (type: TransitionType, key: string) => {
		setItems((prev) => {
			const idx = prev.findIndex((p) => p.key === key);
			if (idx === -1) return prev;

			const item = prev[idx];

			if (type === "enter") {
				if (item.phase === "entering") {
					const updatedItem = { ...item, phase: "present" };
					return Object.assign([...prev], { [idx]: updatedItem });
				}
			} else if (type === "exit") {
				return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
			}
			return prev;
		});
	};

	const buildPropertyAnimation = (type: TransitionType) => {
		switch (type) {
			case "enter":
				return [
					{
						property: "opacity",
						keyframes: [
							{ offset: 0, value: 0 },
							{ offset: 1, value: 1 },
						],
					},
				];
			case "exit":
				return [
					{
						property: "opacity",
						keyframes: [
							{ offset: 0, value: 1 },
							{ offset: 1, value: 0 },
						],
					},
				];

			default:
				return [];
		}
	};

	return (
		<>
			{items.map((item) => {
				return cloneElement(item.element, {
					key: item.key,
					ref: attachRef(item.key),
				});
			})}
		</>
	);
};
