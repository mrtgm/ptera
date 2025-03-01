import type { GameEvent, ResourceCache, Stage } from "~/schema";
import type { Player } from "../../utils/engine";
import { AnimatePresence } from "./animate-presence";

export const CG = ({
	player,
	cg,
	currentEvent,
	resourceCache,
}: {
	player: Player;
	cg: Stage["cg"];
	currentEvent: GameEvent | null;
	resourceCache: ResourceCache["cgImages"];
}) => {
	if (!currentEvent) return null;

	return (
		<AnimatePresence
			player={player}
			eventId={currentEvent.id}
			config={{
				enter: {
					configs: {
						duration: cg.transitionDuration,
						easing: "easeInOutQuad",
					},
				},
				exit: {
					configs: {
						duration: cg.transitionDuration,
						easing: "easeInOutQuad",
					},
				},
			}}
		>
			{cg.item && (
				<div id="cg" className="w-full h-full absolute" key={cg.item.id}>
					<img
						src={resourceCache[cg.item.id]?.url}
						alt=""
						className="w-full h-full object-cover"
					/>
					{JSON.stringify(resourceCache)}
					{cg.item.id}
				</div>
			)}
		</AnimatePresence>
	);
};
