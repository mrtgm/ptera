import type { GameEvent, Stage } from "~/schema";
import type { Player } from "../libs/engine";
import { AnimatePresence } from "./animate-presence";

export const FadeOutEffect = ({
	player,
	effect,
	currentEvent,
}: {
	player: Player;
	effect: Stage["effect"];
	currentEvent: GameEvent | null;
}) => {
	if (!currentEvent || !effect) return null;

	return (
		<AnimatePresence
			player={player}
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
