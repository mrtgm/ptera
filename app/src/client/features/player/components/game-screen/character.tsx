import type { GameEvent, ResourceCache, Stage } from "@/client/schema";
import {
	blackOff,
	blackOn,
	bounce,
	flash,
	shake,
	sway,
	wobble,
} from "@/client/utils/transition";
import { forwardRef, useEffect, useState } from "react";
import type { EventManager } from "../../utils/event";
import { AnimatePresence } from "./animate-presence";

const Character = forwardRef<
	HTMLDivElement,
	{
		key: string;
		character: Stage["characters"]["items"][0];
		resourceCache: ResourceCache["character"];
		currentEvent: GameEvent;
		manager: EventManager;
	}
>(({ character, key, resourceCache, manager }, ref) => {
	const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
	const { id, imageId, position, scale, effect } = character;

	useEffect(() => {
		if (!imgElement || !effect) return;

		let promise: Promise<void>;
		switch (effect.type) {
			case "shake":
				promise = shake(manager, id, effect.transitionDuration, imgElement);
				break;
			case "bounce":
				promise = bounce(manager, id, effect.transitionDuration, imgElement);
				break;
			case "sway":
				promise = sway(manager, id, effect.transitionDuration, imgElement);
				break;
			case "wobble":
				promise = wobble(manager, id, effect.transitionDuration, imgElement);
				break;
			case "flash":
				promise = flash(manager, id, effect.transitionDuration, imgElement);
				break;
			case "blackOn":
				promise = blackOn(manager, id, effect.transitionDuration, imgElement);
				break;
			case "blackOff":
				promise = blackOff(manager, id, effect.transitionDuration, imgElement);
				break;
			default:
				promise = Promise.resolve();
		}
	}, [effect, id, imgElement, manager]);

	const resource = resourceCache[id];
	if (!resource) return null;

	return (
		<div
			ref={ref}
			id={`${id}`}
			key={key}
			className="object-contain absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full select-none"
			style={{
				height: `${scale * 100}%`,
			}}
		>
			<img
				ref={setImgElement}
				src={resource.images[imageId].url}
				alt="character"
				className="h-full w-auto relative m-auto transition-[top,left]"
				style={{
					top: `${position[1] * 100}%`,
					left: `${position[0] * 100}%`,
				}}
			/>
		</div>
	);
});

export const CharacterList = ({
	characters,
	currentEvent,
	resourceCache,
	manager,
}: {
	characters: Stage["characters"];
	currentEvent: GameEvent | null;
	resourceCache: ResourceCache["character"];
	manager: EventManager;
}) => {
	if (!currentEvent) return null;

	return (
		<div id="character-container" className="w-full h-full absolute">
			<AnimatePresence
				eventId={currentEvent.id}
				manager={manager}
				config={{
					enter: {
						configs: {
							duration: characters.transitionDuration,
							easing: "easeInOutQuad",
						},
					},
					exit: {
						configs: {
							duration: characters.transitionDuration,
							easing: "easeInOutQuad",
						},
					},
				}}
			>
				{characters.items.map((character) => (
					<Character
						key={`${character.id}`}
						character={character}
						resourceCache={resourceCache}
						currentEvent={currentEvent}
						manager={manager}
					/>
				))}
			</AnimatePresence>
		</div>
	);
};
