import type { GameEvent, ResourceCache, Stage } from "@/client/schema";
import type { EventManager } from "../../utils/event";
import { AnimatePresence } from "./animate-presence";

export const Background = ({
	manager,
	background,
	currentEvent,
	resourceCache,
}: {
	manager: EventManager;
	background: Stage["background"] | null;
	currentEvent: GameEvent | null;
	resourceCache: ResourceCache["backgroundImage"];
}) => {
	if (!background || !currentEvent) return null;

	return (
		<AnimatePresence
			manager={manager}
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
