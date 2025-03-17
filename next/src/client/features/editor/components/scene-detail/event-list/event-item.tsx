import { SideBarSettings } from "@/client/features/editor/constants";

import { findFirstObjectValue } from "@/client/utils";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import type {
	AppearCGEvent,
	AppearCharacterEvent,
	CharacterEffectEvent,
	EventResponse,
	HideCharacterEvent,
	MoveCharacterEvent,
	ResourceResponse,
	TextRenderEvent,
} from "@ptera/schema";
import { Pen } from "lucide-react";
import { useCallback } from "react";
import { SpeechBubble } from "../../speech-bubble";

export const EventItem = ({
	event,
	resources,
	selectedEvent,
	onClickEvent,
}: {
	event: EventResponse;
	resources: ResourceResponse;
	selectedEvent: EventResponse | undefined | null;
	onClickEvent: (eventId: number) => void;
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
			(item) => item.type === event.eventType,
		)?.label || event.eventType;
	const icon = SideBarSettings[event.category]?.items.find(
		(item) => item.type === event.eventType,
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

const renderEventContent = (
	event: EventResponse,
	resources: ResourceResponse,
) => {
	if (event.eventType === "textRender") {
		return `${event.characterName ? `${event.characterName}:` : ""}${(event as TextRenderEvent).text}`;
	}

	if (
		event.eventType === "appearCharacter" ||
		event.eventType === "moveCharacter" ||
		event.eventType === "characterEffect" ||
		event.eventType === "hideCharacter"
	) {
		const characterEvent = event as
			| AppearCharacterEvent
			| MoveCharacterEvent
			| HideCharacterEvent
			| CharacterEffectEvent;

		const characterData = resources.character[characterEvent.characterId];
		const imageUrl = findFirstObjectValue(characterData.images ?? {})?.url;

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

	if (event.eventType === "appearCG") {
		return <div>{(event as AppearCGEvent).cgImageId}</div>;
	}

	return null;
};
