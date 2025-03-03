import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useNavigate, useParams } from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "sonner";
import dummyAssets from "~/__mocks__/dummy-assets.json";
import dummyGame from "~/__mocks__/dummy-game.json";
import emptyGame from "~/__mocks__/empty-game.json";
import { Toaster } from "~/components/shadcn/sonner";
import { type Game, type GameEvent, type Scene, gameSchema } from "~/schema";
import { useStore } from "~/stores";
import {
	AdjustSizeDialogContainer,
	CharacterDialogContainer,
	PreviewDialogContainer,
} from "./components/dialogs";
import {
	AssetDialogContainer,
	type AssetDialogKeyType,
} from "./components/dialogs/asset";
import { EventDetail } from "./components/event-detail";
import { Graph } from "./components/graph";
import { Header } from "./components/header";
import { SceneDetail } from "./components/scene-detail";
import { EndingEditor } from "./components/scene-detail/ending-editor";
import type { SceneSettingsFormData } from "./components/scene-detail/scene-settings";
import { ScenesList } from "./components/scene-list";
import {
	ProjectSettings,
	type ProjectSettingsFormData,
} from "./components/scene-list/project-settings";
import { Sidebar, SidebarItemCore } from "./components/sidebar";
import {
	SideBarSettings,
	type SidebarItem,
	getColorFromType,
} from "./constants";
import { useTimelineDrag } from "./hooks/use-timeline-drag";

export const Editor = () => {
	const editorSlice = useStore.useSlice.editor();
	const modalSlice = useStore.useSlice.modal();

	const navigate = useNavigate();
	const pathparams = useParams();

	const gameId = pathparams.gameId;
	const selectedSceneId = pathparams.sceneId;
	const selectedEventId = pathparams.eventId;

	const isOpenEnding = selectedEventId === "ending";
	const selectedScene = editorSlice.editingGame?.scenes.find(
		(scene) => scene.id === selectedSceneId,
	);
	const selectedEvent = selectedScene?.events.find(
		(event) => event.id === selectedEventId,
	);

	useEffect(() => {
		// TODO: ロード
		const game = gameSchema.parse(emptyGame);
		editorSlice.initializeEditor(game, dummyAssets);
	}, [editorSlice.initializeEditor]);

	const handleNavigateToScene = (sceneId: string) => {
		navigate(`/dashboard/games/${gameId}/edit/scenes/${sceneId}`);
	};

	const handleNavigateToEvent = (eventId: string) => {
		navigate(
			`/dashboard/games/${gameId}/edit/scenes/${selectedSceneId}/events/${eventId}`,
		);
	};

	const handleNavigateToScenesList = () => {
		navigate(`/dashboard/games/${gameId}/edit`);
	};

	const handleClickSceneEnding = () => {
		navigate(
			`/dashboard/games/${gameId}/edit/scenes/${selectedSceneId}/events/ending`,
		);
	};

	const handleAddScene = (
		sceneTitle: string,
		scene: Scene,
		choiceId?: string | null,
	) => {
		// TODO: 実装
		toast.success("シーンを追加しました");
		return editorSlice.addScene(sceneTitle, scene, choiceId);
	};

	const handleDeleteScene = () => {
		// TODO: 実装
		console.log("Delete scene clicked");
		if (!selectedSceneId) return;
		editorSlice.deleteScene(selectedSceneId);
		handleNavigateToScenesList();
		toast.success("シーンを削除しました");
	};

	const handleSaveProjectSettings = (data: ProjectSettingsFormData) => {
		// TODO: 実装
		console.log("Save settings", data);
		editorSlice.saveProjectSettings(data);
		toast.success("プロジェクト設定を保存しました");
	};

	const handleSaveSceneSettings = (data: SceneSettingsFormData) => {
		// TODO: 実装
		console.log("Save scene settings", data);
		editorSlice.saveSceneSettings(data);
		toast.success("シーン設定を保存しました");
	};

	const handleDeleteEvent = () => {
		// TODO: 実装
		console.log("Delete event clicked");
		if (!selectedSceneId || !selectedEventId) return;
		editorSlice.deleteEvent(selectedEventId, selectedSceneId);
		handleNavigateToScene(selectedSceneId);
		toast.success("イベントを削除しました");
	};

	const handleSaveEvent = (event: GameEvent) => {
		// TODO: 実装
		console.log("Save event clicked");
		if (!selectedSceneId) return;
		editorSlice.saveEvent(event, selectedSceneId);
		toast.success("イベントを保存しました");
	};

	const handleAddCharacter = (name: string) => {
		// TODO: 実装
		editorSlice.addCharacter(name);
		toast.success("キャラクターを追加しました");
	};

	const handleCharacterNameChange = (characterId: string, name: string) => {
		// TODO: 実装
		console.log("Change character name", characterId, name);
		editorSlice.updateCharacterName(characterId, name);
		toast.success("キャラクター名を変更しました");
	};

	const handleUploadCharacterImage = (characterId: string, file: File) => {
		console.log("Upload image", characterId, file);
		editorSlice.uploadCharacterImage(characterId, file);
		toast.success("キャラクター画像をアップロードしました");
	};

	const handleDeleteCharacterImage = (characterId: string, imageId: string) => {
		// TODO: 実装
		console.log("Delete image", characterId, imageId);
		editorSlice.deleteCharacterImage(characterId, imageId);
		toast.success("キャラクター画像を削除しました");
	};

	const handleDeleteCharacter = (characterId: string) => {
		// TODO: 実装
		console.log("Delete character", characterId);
		editorSlice.deleteCharacter(characterId);
		toast.success("キャラクターを削除しました");
	};

	const handleDeleteAsset = (assetId: string, type: AssetDialogKeyType) => {
		// TODO: 実装
		console.log("Delete asset", assetId, type);
		editorSlice.deleteAsset(assetId, type);
		toast.success("アセットを削除しました");
	};

	const handleUploadAsset = (file: File, type: AssetDialogKeyType) => {
		console.log("Upload asset", file, type);
		editorSlice.uploadAsset(file, type);
		toast.success("アセットをアップロードしました");
	};

	const handleSaveEnding = (endingScene: Game["scenes"][number]) => {
		// TODO: 実装
		console.log("Save ending", endingScene);
		editorSlice.saveEnding(endingScene);
		toast.success("シーン終了設定を保存しました");
	};

	const handleAddEvent = (
		index: number,
		item: SidebarItem,
		sceneId: string,
	) => {
		// TODO: 実装
		console.log("Add event", index, item, sceneId);
		editorSlice.addEvent(index, item, sceneId);
		toast.success("イベントを追加しました");
	};

	const handleMoveEvent = (
		oldIndex: number,
		newIndex: number,
		sceneId: string,
	) => {
		// TODO: 実装
		console.log("Move event", oldIndex, newIndex, sceneId);
		editorSlice.moveEvent(oldIndex, newIndex, sceneId);
		toast.success("イベントを移動しました");
	};

	const {
		sensors,
		activeSidebarItem,
		handleDragStart,
		handleDragEnd,
		handleDragCancel,
	} = useTimelineDrag({
		selectedSceneId,
		sceneEvents: selectedScene?.events,
		onAddEvent: handleAddEvent,
		onMoveEvent: handleMoveEvent,
	});

	return (
		<div className="w-full h-full flex flex-col overflow-hidden">
			<Toaster />

			<CharacterDialogContainer
				game={editorSlice.editingGame}
				resources={editorSlice.editingResources}
				onCharacterNameChange={handleCharacterNameChange}
				onAddCharacter={handleAddCharacter}
				onDeleteCharacter={handleDeleteCharacter}
				onDeleteImage={handleDeleteCharacterImage}
				onUploadImage={handleUploadCharacterImage}
			/>
			<AdjustSizeDialogContainer resources={editorSlice.editingResources} />
			<AssetDialogContainer
				game={editorSlice.editingGame}
				resources={editorSlice.editingResources}
				onDeleteAsset={handleDeleteAsset}
				onUploadAsset={handleUploadAsset}
				onNavigateToScene={handleNavigateToScene}
			/>
			<PreviewDialogContainer
				game={editorSlice.editingGame}
				resources={editorSlice.editingResources}
			/>

			<Header />
			<div className="w-full h-[calc(100dvh-40px)] grid grid-cols-12">
				{/* エンディング編集 */}
				{isOpenEnding && selectedScene && (
					<>
						<div className="col-span-3 border-r-[1px] border-gray-200">
							<Sidebar
								selectedScene={selectedScene}
								sideBarSettings={SideBarSettings}
								onSaveSettings={handleSaveSceneSettings}
							/>
						</div>
						<div className="col-span-9 w-full h-full relative">
							<EndingEditor
								selectedScene={selectedScene}
								game={editorSlice.editingGame}
								onSaveEnding={handleSaveEnding}
								onNavigateToScene={handleNavigateToScene}
								onAddScene={handleAddScene}
							/>
						</div>
					</>
				)}

				{/* 選択時 */}
				{selectedSceneId !== undefined && !isOpenEnding && (
					<DndContext
						sensors={sensors}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
						onDragCancel={handleDragCancel}
					>
						<div className="col-span-3 border-r-[1px] border-gray-200">
							<Sidebar
								selectedScene={selectedScene}
								sideBarSettings={SideBarSettings}
								onSaveSettings={handleSaveSceneSettings}
							/>
						</div>
						<div className="col-span-5 flex flex-col justify-center bg-white text-black relative">
							<SceneDetail
								selectedEvent={selectedEvent}
								selectedScene={selectedScene}
								game={editorSlice.editingGame}
								resources={editorSlice.editingResources}
								onNavigateToScenesList={handleNavigateToScenesList}
								onDeleteScene={handleDeleteScene}
								onClickEvent={handleNavigateToEvent}
								onClickSceneEnding={handleClickSceneEnding}
							/>

							<DragOverlay>
								{activeSidebarItem && (
									<SidebarItemCore
										item={activeSidebarItem}
										color={getColorFromType(activeSidebarItem.type)}
									/>
								)}
							</DragOverlay>
						</div>
					</DndContext>
				)}

				{/*　未選択時 */}
				{selectedSceneId === undefined && (
					<>
						<div className="col-span-3 border-r-[1px] border-gray-200">
							<div className="p-4">
								<ProjectSettings
									game={editorSlice.editingGame}
									onSaveSettings={handleSaveProjectSettings}
								/>
							</div>
						</div>
						<div className="col-span-5 flex flex-col bg-white text-black p-2">
							<ScenesList
								game={editorSlice.editingGame}
								sideBarSettings={SideBarSettings}
								onSceneClick={handleNavigateToScene}
							/>
						</div>
					</>
				)}

				<div className="col-span-4 bg-[#EEEEEE]">
					{selectedScene && selectedEvent && !isOpenEnding && (
						<EventDetail
							key={selectedEventId}
							selectedScene={selectedScene}
							selectedEvent={selectedEvent}
							game={editorSlice.editingGame}
							resources={editorSlice.editingResources}
							onDeleteEvent={handleDeleteEvent}
							onSaveEvent={handleSaveEvent}
						/>
					)}

					{!selectedEventId && !isOpenEnding && (
						<div className="w-full h-[calc(100dvh-40px)] sticky top-0">
							<Graph
								game={editorSlice.editingGame}
								onNavigateToScene={handleNavigateToScene}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
