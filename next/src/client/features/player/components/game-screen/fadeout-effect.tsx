import type { Stage } from "@/client/schema";
import type { EventResponse } from "@ptera/schema";
import type { EventManager } from "../../utils/event";
import { AnimatePresence } from "./animate-presence";

export const FadeOutEffect = ({
	manager,
	effect,
	currentEvent,
}: {
	manager: EventManager;
	effect: Stage["effect"];
	currentEvent: EventResponse | null;
}) => {
	if (!currentEvent || !effect) return null;

	return (
		<AnimatePresence
			manager={manager}
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
