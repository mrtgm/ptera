import { forwardRef, useEffect, useRef } from "react";
import { player } from "~/features/player/libs/engine";
import { resourceManager } from "~/utils/preloader";
import { bounce, flash, shake, sway, wobble } from "~/utils/transition";
import { AnimatePresence } from "./animate-presence";

const Character = forwardRef<
	HTMLDivElement,
	{
		key: string;
		character: Stage["characters"]["items"][0];
		resourceCache: ResourceCache["characters"];
	}
>(({ character, key, resourceCache }, ref) => {
	const imgRef = useRef<HTMLImageElement | null>(null);
	const { id, imageId, position, scale, effect } = character;

	useEffect(() => {
		if (!imgRef.current || !effect) return;

		let promise: Promise<void>;
		switch (effect.type) {
			case "shake":
				promise = shake(id, effect.transitionDuration, imgRef.current);
				break;
			case "bounce":
				promise = bounce(id, effect.transitionDuration, imgRef.current);
				break;
			case "sway":
				promise = sway(id, effect.transitionDuration, imgRef.current);
				break;
			case "wobble":
				promise = wobble(id, effect.transitionDuration, imgRef.current);
				break;
			case "flash":
				promise = flash(id, effect.transitionDuration, imgRef.current);
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
	}, [effect, id]);

	const resource = resourceCache[id];
	if (!resource) return null;

	return (
		<div
			ref={ref}
			id={id}
			key={key}
			className="object-contain absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 max-w-max w-full select-none"
			style={{
				height: `${scale * 100}%`,
			}}
		>
			<img
				ref={imgRef}
				src={resource.images[imageId].url}
				alt="character"
				className="h-full w-auto relative m-auto"
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
}: {
	characters: Stage["characters"];
	currentEvent: GameEvent | null;
	resourceCache: ResourceCache["characters"];
}) => {
	if (!currentEvent) return null;

	return (
		<div id="character-container" className="w-full h-full absolute">
			<AnimatePresence
				eventId={currentEvent.id}
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
					/>
				))}
			</AnimatePresence>
		</div>
	);
};
