import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { ArrowUp, Pen, Split } from "lucide-react";
import { useCallback } from "react";
import type {
	AppearCGEvent,
	AppearCharacterEvent,
	CharacterEffectEvent,
	Game,
	GameEvent,
	GameResources,
	HideCharacterEvent,
	MoveCharacterEvent,
	ResourceCache,
	Scene,
	TextRenderEvent,
} from "~/schema";
import { findFirstObjectValue } from "~/utils";
import { SideBarSettings } from "./constants";
import { SpeechBubble } from "./speech-bubble";

export const EventTimeline = ({
	selectedScene,
	selectedEvent,
	game,
	resources,
	onClickEvent,
}: {
	selectedScene: Scene;
	selectedEvent: GameEvent | undefined;
	game: Game;
	resources: GameResources;
	onClickEvent: (eventId: string) => void;
}) => {
	if (!selectedScene?.events || selectedScene.events.length === 0) {
		return (
			<div className="text-gray-500 mt-8 text-center">
				このシーンにはイベントがありません。
				<br />
				ドラッグ＆ドロップでイベントを追加してください。
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
						return (
							<SortableEventItem
								key={event.id}
								event={event}
								resources={resources}
								selectedEvent={selectedEvent}
								onClickEvent={onClickEvent}
							/>
						);
					})}

					{renderSceneEnding(selectedScene, game)}
				</div>
			</div>
		</div>
	);
};

const SortableEventItem = ({
	event,
	resources,
	selectedEvent,
	onClickEvent,
}: {
	event: GameEvent;
	resources: GameResources;
	selectedEvent: GameEvent | undefined;
	onClickEvent: (eventId: string) => void;
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: event.id });

	const { setNodeRef: setDroppableNodeRef } = useDroppable({
		id: event.id,
	});

	const ref = useCallback(
		(node: HTMLElement | null) => {
			setNodeRef(node);
			setDroppableNodeRef(node);
		},
		[setNodeRef, setDroppableNodeRef],
	);

	const categoryColor = SideBarSettings[event.category]?.hex || "#6366F1";
	const title =
		SideBarSettings[event.category]?.items.find(
			(item) => item.type === event.type,
		)?.label || event.type;
	const icon = SideBarSettings[event.category]?.items.find(
		(item) => item.type === event.type,
	)?.icon || <Pen />;

	const style: React.CSSProperties = {
		transform: transform
			? `translate3d(${transform.x}px, ${transform.y}px, 0)`
			: undefined,
		transition,
		opacity: isDragging ? 0.5 : 1,
		cursor: "grab",
	};

	return (
		<div ref={ref} style={style} {...attributes} {...listeners}>
			<SpeechBubble
				key={event.id}
				id={event.id}
				hex={categoryColor}
				selected={selectedEvent?.id === event.id}
				title={title}
				icon={icon}
				onClick={() => onClickEvent(event.id)}
			>
				{renderEventContent(event, resources)}
			</SpeechBubble>
		</div>
	);
};

const renderEventContent = (event: GameEvent, resources: GameResources) => {
	if (event.type === "text") {
		return `${event.characterName ? `${event.characterName}:` : ""}${(event as TextRenderEvent).lines.join("\n")}`;
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

		const characterData = resources.characters[characterEvent.characterId];
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
		return <div>{(event as AppearCGEvent).cgImageId}</div>;
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
