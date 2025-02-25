import type { GameEvent, ResourceCache, Stage } from "~/schema";
import { resourceManager } from "~/utils/preloader";
import { AnimatePresence } from "./animate-presence";

export const Background = ({
	background,
	currentEvent,
	resourceCache,
}: {
	background: Stage["background"] | null;
	currentEvent: GameEvent | null;
	resourceCache: ResourceCache["backgroundImages"];
}) => {
	if (!background || !currentEvent) return null;

	return (
		<AnimatePresence
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
