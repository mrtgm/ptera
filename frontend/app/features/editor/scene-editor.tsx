import { useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "~/components/shadcn/breadcrumb";
import { Button } from "~/components/shadcn/button";
import type {
	Game,
	GameEvent,
	GameResources,
	ResourceCache,
	Scene,
} from "~/schema";
import type { SideBarSettings } from "./constants";
import { EventTimeline } from "./event-timeline";

export const SceneEditor = ({
	selectedScene,
	selectedEvent,
	game,
	resources,
	onNavigateToScenesList,
	onDeleteScene,
	onClickEvent,
}: {
	selectedEvent: GameEvent | undefined;
	selectedScene: Scene | undefined;
	game: Game | null;
	resources: GameResources | null;
	onNavigateToScenesList: () => void;
	onDeleteScene: () => void;
	onClickEvent: (eventId: string) => void;
}) => {
	if (!selectedScene || !game || !resources) {
		return null;
	}

	const { setNodeRef } = useDroppable({
		id: "event-timeline",
	});

	return (
		<>
			<div className="flex justify-between items-center mb-2">
				<Breadcrumb className="mb-2">
					<BreadcrumbList>
						<BreadcrumbItem
							onClick={onNavigateToScenesList}
							className="cursor-pointer"
						>
							シーン一覧
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>{selectedScene?.title}</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<Button onClick={onDeleteScene} variant="destructive" size="sm">
					シーン削除
				</Button>
			</div>

			<SortableContext
				items={selectedScene.events.map((event) => event.id)}
				strategy={verticalListSortingStrategy}
			>
				<div ref={setNodeRef} className="relative h-full">
					<EventTimeline
						selectedScene={selectedScene}
						selectedEvent={selectedEvent}
						game={game}
						resources={resources}
						onClickEvent={onClickEvent}
					/>
				</div>
			</SortableContext>
		</>
	);
};
