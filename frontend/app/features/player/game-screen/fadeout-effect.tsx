import { useEffect } from "react";
import { AnimatePresence } from "./animate-presence";

export const FadeOutEffect = ({
	effect,
	currentEvent,
}: { effect: Stage["effect"]; currentEvent: GameEvent | null }) => {
	if (!currentEvent || !effect) return null;

	return (
		<AnimatePresence
			eventId={currentEvent.id}
			config={{
				enter: {
					configs: {
						duration: effect.transitionDuration,
						easing: "easeInOutQuad",
					},
				},
				exit: {
					configs: {
						duration: effect.transitionDuration,
						easing: "easeInOutQuad",
					},
				},
			}}
		>
			{effect?.type === "fadeOut" && (
				<div
					id="effect-container"
					className="opacity-0 w-full h-full absolute select-none pointer-events-none bg-black"
				/>
			)}
		</AnimatePresence>
	);
};
