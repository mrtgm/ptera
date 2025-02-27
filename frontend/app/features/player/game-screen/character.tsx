import { forwardRef, useEffect, useState } from "react";
import type { GameEvent, ResourceCache, Stage } from "~/schema";
import {
	blackOff,
	blackOn,
	bounce,
	flash,
	shake,
	sway,
	wobble,
} from "~/utils/transition";
import type { Player } from "../libs/engine";
import { AnimatePresence } from "./animate-presence";

const Character = forwardRef<
	HTMLDivElement,
	{
		key: string;
		character: Stage["characters"]["items"][0];
		resourceCache: ResourceCache["characters"];
		currentEvent: GameEvent;
		player: Player;
	}
>(({ character, key, resourceCache, player, currentEvent }, ref) => {
	const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
	const { id, imageId, position, scale, effect } = character;

	useEffect(() => {
		if (!imgElement || !effect) return;

		let promise: Promise<void>;
		switch (effect.type) {
			case "shake":
				promise = shake(player, id, effect.transitionDuration, imgElement);
				break;
			case "bounce":
				promise = bounce(player, id, effect.transitionDuration, imgElement);
				break;
			case "sway":
				promise = sway(player, id, effect.transitionDuration, imgElement);
				break;
			case "wobble":
				promise = wobble(player, id, effect.transitionDuration, imgElement);
				break;
			case "flash":
				promise = flash(player, id, effect.transitionDuration, imgElement);
				break;
			case "blackOn":
				promise = blackOn(player, id, effect.transitionDuration, imgElement);
				break;
			case "blackOff":
				promise = blackOff(player, id, effect.transitionDuration, imgElement);
				break;
			default:
				promise = Promise.resolve();
		}

		promise.then(() => {
			player.updateStage({
				characters: {
					...player.stage.characters,
					items: player.stage.characters.items.map((c) =>
						c.id === id ? { ...c, effect: null } : c,
					),
				},
			});
		});
	}, [effect, id, imgElement, player]);

	const resource = resourceCache[id];
	if (!resource) return null;

	return (
		<div
			ref={ref}
			id={id}
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
	player,
}: {
	characters: Stage["characters"];
	currentEvent: GameEvent | null;
	resourceCache: ResourceCache["characters"];
	player: Player;
}) => {
	if (!currentEvent) return null;

	return (
		<div id="character-container" className="w-full h-full absolute">
			<AnimatePresence
				eventId={currentEvent.id}
				player={player}
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
						key={character.imageId}
						character={character}
						resourceCache={resourceCache}
						currentEvent={currentEvent}
						player={player}
					/>
				))}
			</AnimatePresence>
		</div>
	);
};
