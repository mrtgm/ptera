import { ArrowUp, Pen, Split } from "lucide-react";
import { findFirstObjectValue } from "~/utils";
import type { SideBarSettings } from "./constants";
import { SpeechBubble } from "./speech-bubble";

export const EventTimeline = ({
	selectedScene,
	game,
	sideBarSettings,
	cache,
	onClickEvent,
}: {
	selectedScene: Scene;
	game: Game;
	sideBarSettings: typeof SideBarSettings;
	cache: ResourceCache;
	onClickEvent: (eventId: string) => void;
}) => {
	if (!selectedScene?.events || selectedScene.events.length === 0) {
		return (
			<div className="text-gray-500 mt-8 text-center">
				このシーンにはイベントがありません。
			</div>
		);
	}

	return (
		<div className="w-full h-full flex flex-col select-none overflow-y-scroll overflow-x-hidden">
			<div
				className="relative flex w-full min-h-full"
				style={{
					height: `${(selectedScene?.events.length ?? 0) * 80 + 40}px`,
				}}
			>
				<div className="absolute w-1 bg-gray-300 h-full left-[8px]" />

				<div className="flex-1 relative w-full flex flex-col gap-y-3 pt-2">
					{selectedScene?.events.map((event) => {
						const categoryColor =
							sideBarSettings[event.category]?.hex || "#6366F1";

						return (
							<SpeechBubble
								key={event.id}
								id={event.id}
								hex={categoryColor}
								title={
									sideBarSettings[event.category]?.items.find(
										(item) => item.type === event.type,
									)?.label || event.type
								}
								icon={
									sideBarSettings[event.category]?.items.find(
										(item) => item.type === event.type,
									)?.icon || <Pen />
								}
								onClick={() => onClickEvent(event.id)}
							>
								{renderEventContent(event, cache)}
							</SpeechBubble>
						);
					})}

					{renderSceneEnding(selectedScene, game)}
				</div>
			</div>
		</div>
	);
};

const renderEventContent = (event: GameEvent, cache: ResourceCache) => {
	if (event.type === "text") {
		return (event as TextRenderEvent).lines.join("\n");
	}

	if (
		event.type === "appearCharacter" ||
		event.type === "moveCharacter" ||
		event.type === "characterEffect" ||
		event.type === "hideCharacter"
	) {
		const characterEvent = event as
			| AppearCharacterEvent
			| MoveCharacterEvent
			| HideCharacterEvent
			| CharacterEffectEvent;

		const characterData = cache.characters[characterEvent.characterId];
		const imageUrl = findFirstObjectValue(characterData.images)?.url;

		return (
			<div className="flex items-center gap-2">
				<img
					className="w-[24px] h-[24px] rounded-lg object-cover"
					alt="character"
					src={imageUrl}
				/>
				{characterData.name}
			</div>
		);
	}

	if (event.type === "appearCG") {
		return <div>{(event as AppearCGEvent).imageId}</div>;
	}

	return null;
};

const renderSceneEnding = (selectedScene: Scene, game: Game) => {
	if (selectedScene?.sceneType === "end") {
		return (
			<SpeechBubble
				key="ending"
				id="ending"
				hex="#000000"
				title="ゲーム終了"
				icon={<Pen />}
			>
				エンディング
			</SpeechBubble>
		);
	}

	if (selectedScene?.sceneType === "choice") {
		return (
			<SpeechBubble
				key="choice"
				id="choice"
				hex="#000000"
				title="選択肢"
				icon={<Split />}
			>
				{selectedScene.choices.map((choice) => (
					<div key={choice.id}>{choice.text}</div>
				))}
			</SpeechBubble>
		);
	}

	if (selectedScene?.sceneType === "goto") {
		const nextScene = game.scenes.find(
			(scene) => scene.id === selectedScene.nextSceneId,
		);

		return (
			<SpeechBubble
				key="goto"
				id="goto"
				hex="#000000"
				title="次のシーン"
				icon={<ArrowUp />}
			>
				{nextScene?.title || "不明なシーン"}
			</SpeechBubble>
		);
	}

	return null;
};
