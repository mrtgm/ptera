import type { Meta, StoryObj } from "@storybook/react";
import { forwardRef, useState } from "react";
import { EventManager } from "../../utils/event";
import { AnimatePresence } from "./animate-presence";

const eventManager = new EventManager();
export function Debug() {
	const [items, setItems] = useState(["A"]);

	const handleAdd = () => {
		const id = Math.random().toString(36).slice(2);
		setItems((prev) => [...prev, id]);
	};
	const handleRemove = () => {
		setItems((prev) => prev.slice(0, -1));
	};
	const handleCancelRequest = () => {
		eventManager.addCancelRequest("test");
	};
	const handleSwap = () => {
		setItems((prev) => {
			if (!prev[0]) return prev;
			const id = Math.random().toString(36).slice(2);
			return [`SWAP-${id}`, ...prev.slice(1)];
		});
	};

	const Box = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
		({ children }, ref) => (
			<div
				ref={ref}
				className="absolute w-[100px] h-[100px] bg-gray-400"
				style={{
					border: "1px solid red",
					margin: "8px",
					padding: "8px",
				}}
			>
				{children}
			</div>
		),
	);

	return (
		<div>
			<div className="flex space-x-4 gap-2" style={{ marginBottom: "1rem" }}>
				<button
					onClick={handleAdd}
					type="button"
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					追加
				</button>
				<button
					onClick={handleRemove}
					type="button"
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					削除
				</button>
				<button
					onClick={handleSwap}
					type="button"
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					交換
				</button>
				<button
					onClick={handleCancelRequest}
					type="button"
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					途中終了
				</button>
			</div>
			<div className="relative w-[200px] h-[200px] bg-gray-200 pt-4">
				<AnimatePresence
					eventId="test"
					manager={eventManager}
					config={{
						enter: {
							configs: { duration: 800, easing: "easeInOutQuad" },
							properties: [
								{
									property: "opacity",
									keyframes: [
										{ offset: 0, value: 0 },
										{ offset: 1, value: 1 },
									],
								},
								{
									property: "transform",
									keyframes: [
										{ offset: 0, value: "translateY(200%)" },
										{ offset: 1, value: "translateY(0%)" },
									],
								},
							],
						},
						exit: { configs: { duration: 800, easing: "easeInOutQuad" } },
					}}
				>
					{items.map((item) => (
						<Box key={item}>This is item: {item}</Box>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
}

// Storybook メタデータ
const meta: Meta<typeof Debug> = {
	title: "Animation/AnimatePresence",
	component: Debug,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof Debug>;
