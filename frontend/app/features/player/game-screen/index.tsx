import { useEffect, useRef, useState } from "react";
import { player } from "~/features/player/libs/engine";
import type {
	GameEvent,
	GameState,
	MessageHistory,
	ResourceCache,
	Stage,
} from "~/schema";
import { shake } from "~/utils/transition";
import { Background } from "./background";
import { CG } from "./cg";
import { CharacterList } from "./character";
import { Choice } from "./choice";
import { Dialog } from "./dialog";
import { FadeOutEffect } from "./fadeout-effect";
import { History } from "./history";
import { SoundPlayer } from "./sound-player";
import { Ui } from "./ui";

export const GameScreen = ({
	handleTapScreen,
	stage,
	state,
	history,
	resourceCache,
	currentEvent,
	isPreviewMode,
}: {
	handleTapScreen: (e: React.MouseEvent) => void;
	stage: Stage;
	history: MessageHistory[];
	state: GameState;
	resourceCache: ResourceCache;
	currentEvent: GameEvent | null;
	isPreviewMode?: boolean;
}) => {
	const screenRef = useRef<HTMLDivElement | null>(null);

	const [isHistoryOpen, setIsHistoryOpen] = useState(false);

	const openHistory = () => setIsHistoryOpen(true);
	const closeHistory = () => setIsHistoryOpen(false);

	useEffect(() => {
		if (!currentEvent || !stage.effect || !screenRef.current) return;

		let promise: Promise<void>;
		switch (stage.effect.type) {
			case "shake":
				promise = shake(
					currentEvent.id,
					stage.effect.transitionDuration,
					screenRef.current,
				);
				break;
			default:
				promise = Promise.resolve();
		}
		promise.then(() => {
			if (stage.effect?.type === "shake") player.updateStage({ effect: null });
		});
	}, [stage.effect, currentEvent]);

	return (
		<div
			ref={screenRef}
			id="game-screen"
			className="w-dvw h-[calc(100dvh-64px)] max-w-[1000px] min-w-[320px] min-h-[500px] relative bg-white overflow-hidden select-none"
			onClick={handleTapScreen}
			onKeyDown={() => {}}
		>
			<Ui openHistory={openHistory} />
			<SoundPlayer resourceCache={resourceCache.bgms} sound={stage.bgm} />
			<SoundPlayer
				resourceCache={resourceCache.soundEffects}
				sound={stage.soundEffect}
			/>
			<Background
				background={stage.background}
				currentEvent={currentEvent}
				resourceCache={resourceCache.backgroundImages}
			/>
			<CharacterList
				resourceCache={resourceCache.characters}
				characters={stage.characters}
				currentEvent={currentEvent}
			/>
			<CG
				cg={stage.cg}
				currentEvent={currentEvent}
				resourceCache={resourceCache.cgImages}
			/>
			<FadeOutEffect effect={stage.effect} currentEvent={currentEvent} />
			<Choice choices={stage.choices} currentEvent={currentEvent} />
			<Dialog dialog={stage.dialog} currentEvent={currentEvent} state={state} />

			{isHistoryOpen && (
				<History history={history} closeHistory={closeHistory} />
			)}
		</div>
	);
};
