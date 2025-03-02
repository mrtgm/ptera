import type { GameEvent, ResourceCache, Stage } from "~/schema";
import type { Player } from "../../utils/engine";
import { AnimatePresence } from "./animate-presence";

export const Background = ({
	player,
	background,
	currentEvent,
	resourceCache,
}: {
	player: Player;
	background: Stage["background"] | null;
	currentEvent: GameEvent | null;
	resourceCache: ResourceCache["backgroundImages"];
}) => {
	if (!background || !currentEvent) return null;

	return (
		<AnimatePresence
			player={player}
			eventId={currentEvent.id}
			config={{
				enter: {
					configs: {
						duration: background.transitionDuration,
						easing: "easeInOutQuad",
					},
				},
				exit: {
					configs: {
						duration: background.transitionDuration,
						easing: "easeInOutQuad",
					},
				},
			}}
		>
			{background && (
				<div
					id="background"
					className="w-full h-full absolute"
					key={background.id}
				>
					<img
						src={resourceCache[background.id]?.url}
						alt=""
						className="w-full h-full object-cover"
					/>
				</div>
			)}
		</AnimatePresence>
	);
};
