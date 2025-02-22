import { useState } from "react";
import { Player } from "~/features/player";
import { AnimatePresence } from "~/features/player/animatePresence";
import { player } from "~/stores/player";

export default function Debug() {
	return (
		<div className="w-full h-dvh flex pt-[64px] justify-center">
			{/* <Player /> */}
			<ExampleUsage />
		</div>
	);
}

export function ExampleUsage() {
	const [items, setItems] = useState(["A"]);

	const handleAdd = () => {
		const id = Math.random().toString(36).slice(2);
		setItems((prev) => [...prev, id]);
	};
	const handleRemove = () => {
		setItems((prev) => prev.slice(0, -1));
	};
	const handleCancelRequest = () => {
		player.addCancelRequest("test");
	};
	const handleSwap = () => {
		// index 0 の要素を強制的に別キーへ
		setItems((prev) => {
			if (!prev[0]) return prev;
			const id = Math.random().toString(36).slice(2);
			return [`SWAP-${id}`, ...prev.slice(1)];
		});
	};

	return (
		<div>
			<div>
				<button onClick={handleAdd} type="button">
					Add
				</button>
				<button onClick={handleRemove} type="button">
					Remove
				</button>
				<button onClick={handleSwap} type="button">
					Swap First
				</button>
				<button onClick={handleCancelRequest} type="button">
					Cancel Request
				</button>
			</div>
			<div
				className="relative w-[200px] h-[200px] bg-gray-200"
				// style={{ margin: "20px 0", border: "1px solid gray", minHeight: 200 }}
			>
				<AnimatePresence
					eventId="test"
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
						<div
							key={item}
							className="absolute w-[100px] h-[100px] bg-gray-400"
							style={{
								border: "1px solid red",
								margin: "8px",
								padding: "8px",
							}}
						>
							This is item: {item}
						</div>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
}
