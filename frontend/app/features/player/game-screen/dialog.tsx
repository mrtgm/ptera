import { AnimatePresence } from "./animate-presence";

export const Dialog = ({
	state,
	dialog,
	currentEvent,
}: {
	state: GameState;
	dialog: Stage["dialog"];
	currentEvent: GameEvent | null;
}) => {
	if (!currentEvent) return null;

	return (
		<AnimatePresence
			eventId={currentEvent.id}
			config={{
				enter: {
					configs: {
						duration: dialog.transitionDuration,
						easing: "easeInOutQuad",
					},
				},
				exit: {
					configs: {
						duration: dialog.transitionDuration,
						easing: "easeInOutQuad",
					},
				},
			}}
		>
			{dialog.isVisible && (
				<div
					id="dialog"
					className="opacity-0 bg-gray-900 bg-opacity-90 absolute bottom-1 w-[calc(100%-16px)] h-[200px] m-auto left-0 right-0 text-white p-4"
				>
					{dialog.characterName && (
						<div className="text-lg absolute -top-12 left-0 bg-opacity-90 bg-gray-900 p-2">
							{dialog.characterName}
						</div>
					)}
					<span>{dialog.text}</span>

					{state === "idle" && (
						<span className="text-white text-sm animate-bounce inline-block ml-2">
							▼
						</span>
					)}
				</div>
			)}
		</AnimatePresence>
	);
};
