import type {
	GameEvent,
	GameState,
	MessageHistory,
	ResourceCache,
	Stage,
} from "@/client/schema";
import { shake } from "@/client/utils/transition";
import { useEffect, useRef, useState } from "react";
import type { EventManager } from "../../utils/event";
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
	onTapScreen,
	onChoiceSelected,
	onChangeAutoMode,
	onChangeMute,
	stage,
	state,
	history,
	manager,
	resourceCache,
	currentEvent,
	isPreviewMode,
	className,
	style,
}: {
	onTapScreen: (e: React.MouseEvent) => void;
	onChoiceSelected: (choiceId: string) => void;
	onChangeAutoMode: (isAutoMode: boolean) => void;
	onChangeMute: (isMute: boolean) => void;
	stage: Stage;
	history: MessageHistory[];
	state: GameState;
	manager: EventManager;
	resourceCache: ResourceCache;
	currentEvent: GameEvent | null;
	isPreviewMode?: boolean;
	className?: string;
	style?: React.CSSProperties;
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
					manager,
					currentEvent.id,
					stage.effect.transitionDuration,
					screenRef.current,
				);
				break;
			default:
				promise = Promise.resolve();
		}
	}, [stage.effect, currentEvent, manager]);

	return (
		<div
			ref={screenRef}
			id="game-screen"
			className={`w-full h-full max-w-[1000px] min-w-[320px] min-h-[500px] relative bg-white overflow-hidden select-none ${className}`}
			onClick={onTapScreen}
			onKeyDown={() => {}}
		>
			<Ui
				onChangeAutoMode={onChangeAutoMode}
				onChangeMute={onChangeMute}
				openHistory={openHistory}
				manager={manager}
				isPreviewMode={isPreviewMode}
			/>
			<SoundPlayer resourceCache={resourceCache.bgms} sound={stage.bgm} />
			<SoundPlayer
				resourceCache={resourceCache.soundEffects}
				sound={stage.soundEffect}
			/>
			<Background
				manager={manager}
				background={stage.background}
				currentEvent={currentEvent}
				resourceCache={resourceCache.backgroundImages}
			/>
			<CharacterList
				resourceCache={resourceCache.characters}
				characters={stage.characters}
				currentEvent={currentEvent}
				manager={manager}
			/>
			<CG
				manager={manager}
				cg={stage.cg}
				currentEvent={currentEvent}
				resourceCache={resourceCache.cgImages}
			/>
			<FadeOutEffect
				manager={manager}
				effect={stage.effect}
				currentEvent={currentEvent}
			/>
			<Choice
				onChoiceSelected={onChoiceSelected}
				choices={stage.choices}
				currentEvent={currentEvent}
				manager={manager}
			/>
			<Dialog
				manager={manager}
				dialog={stage.dialog}
				currentEvent={currentEvent}
				state={state}
			/>

			{isHistoryOpen && (
				<History history={history} closeHistory={closeHistory} />
			)}
		</div>
	);
};
