import type {
	DragEndEvent,
	DragStartEvent,
	UniqueIdentifier,
} from "@dnd-kit/core";
import { MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useState } from "react";
import type { SidebarItem } from "~/features/editor/constants";
import type { GameEvent } from "~/schema";

export const useTimelineDrag = ({
	selectedSceneId,
	sceneEvents,
	onAddEvent,
	onMoveEvent,
}: {
	selectedSceneId: string | undefined;
	sceneEvents: GameEvent[] | undefined;
	onAddEvent: (index: number, item: SidebarItem, sceneId: string) => void;
	onMoveEvent: (oldIndex: number, newIndex: number, sceneId: string) => void;
}) => {
	const [activeSidebarItem, setActiveSidebarItem] =
		useState<SidebarItem | null>(null);
	const [activeEventId, setActiveEventId] = useState<string | null>(null);

	// ドラッグの感度設定
	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
	);

	const handleDragStart = (event: DragStartEvent) => {
		// サイドバーアイテムのドラッグの場合
		if (event.active.data.current?.from === "sidebar") {
			const item = event.active.data.current.item as SidebarItem;
			setActiveSidebarItem(item);
		} else {
			// タイムライン上の既存イベントのドラッグの場合
			const eventId = event.active.id as string;
			setActiveEventId(eventId);
		}
	};

	const calculateInsertionIndex = (
		overId: UniqueIdentifier,
		events: GameEvent[] | undefined,
	) => {
		if (!events) return 0;
		if (!overId) return events.length;
		const overIndex = events.findIndex((ev) => ev.id === overId);
		if (overIndex === -1) return events.length;
		return overIndex;
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { over } = event;
		if (!selectedSceneId) {
			resetDragState();
			return;
		}

		// サイドバーからのドラッグの場合：新規イベント追加
		if (activeSidebarItem) {
			if (over) {
				if (over.id === "event-timeline") {
					// タイムライン全体にドロップした場合は最後に追加
					onAddEvent(
						sceneEvents?.length ?? 0,
						activeSidebarItem,
						selectedSceneId,
					);
				} else {
					// 特定の位置にドロップした場合
					const dropIndex = calculateInsertionIndex(over.id, sceneEvents);
					onAddEvent(dropIndex, activeSidebarItem, selectedSceneId);
				}
			}
			setActiveSidebarItem(null);
			return;
		}

		// 既存イベントのドラッグの場合：並べ替え
		if (activeEventId && sceneEvents) {
			if (over) {
				const oldIndex = sceneEvents.findIndex((ev) => ev.id === activeEventId);
				const newIndex = sceneEvents.findIndex((ev) => ev.id === over.id);
				if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
					onMoveEvent(oldIndex, newIndex, selectedSceneId);
				}
			}
			setActiveEventId(null);
		}
	};

	// ドラッグキャンセル時の処理
	const handleDragCancel = () => {
		resetDragState();
	};

	// ドラッグ状態のリセット
	const resetDragState = () => {
		setActiveSidebarItem(null);
		setActiveEventId(null);
	};

	return {
		sensors,
		activeSidebarItem,
		activeEventId,
		handleDragStart,
		handleDragEnd,
		handleDragCancel,
	};
};
