import { useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "~/components/shadcn/breadcrumb";
import { Button } from "~/components/shadcn/button";
import type { Game, GameEvent, GameResources, Scene } from "~/schema";
import { useDeleteConfirmationDialog } from "../dialogs/delete-confirmation-dialog";
import { EventList } from "./event-list";

export const SceneDetail = ({
	selectedScene,
	selectedEvent,
	game,
	resources,
	onNavigateToScenesList,
	onDeleteScene,
	onClickEvent,
	onClickSceneEnding,
}: {
	selectedEvent: GameEvent | undefined | null;
	selectedScene: Scene | undefined | null;
	game: Game | null;
	resources: GameResources | null;
	onNavigateToScenesList: () => void;
	onDeleteScene: () => void;
	onClickEvent: (eventId: string) => void;
	onClickSceneEnding: () => void;
}) => {
	const { setNodeRef } = useDroppable({
		id: "event-timeline",
	});

	const {
		ConfirmDialog: SceneDeleteDialog,
		setDeleteDialogOpen: setSceneDeleteDialogOpen,
		deleteDialogOpen: sceneDeleteDialogOpen,
	} = useDeleteConfirmationDialog();

	useEffect(() => {
		console.log("game", game);
	}, [game]);

	if (!selectedScene || !game || !resources) {
		return null;
	}

	return (
		<div className="p-2 h-full">
			<SceneDeleteDialog
				title={"シーン削除"}
				description={"このシーンを削除しますか？"}
				alertDescription={
					"この操作は元に戻せません。シーンは完全に削除されます。"
				}
				confirmDelete={() => {
					onDeleteScene();
					setSceneDeleteDialogOpen(false);
				}}
			/>

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

				<Button
					onClick={() => setSceneDeleteDialogOpen(true)}
					variant="destructive"
					size="sm"
				>
					シーン削除
				</Button>
			</div>

			<SortableContext
				items={selectedScene.events.map((event) => event.id)}
				strategy={verticalListSortingStrategy}
			>
				<div
					ref={setNodeRef}
					className="relative h-[calc(100vh-120px)] overflow-y-scroll"
				>
					<EventList
						selectedScene={selectedScene}
						selectedEvent={selectedEvent}
						game={game}
						resources={resources}
						onClickEvent={onClickEvent}
						onClickSceneEnding={onClickSceneEnding}
					/>
				</div>
			</SortableContext>
		</div>
	);
};
