import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useNavigate, useParams } from "@remix-run/react";
import { useEffect } from "react";
import dummyAssets from "~/__mocks__/dummy-assets.json";
import dummyGame from "~/__mocks__/dummy-game.json";
import type { Game, GameEvent, Scene } from "~/schema";
import { useStore } from "~/stores";
import type { AssetDialogKeyType } from "./components/dialogs/asset";
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
import { SideBarSettings, getColorFromType } from "./constants";
import { useTimelineDrag } from "./hooks";

export const Editor = () => {
	const editorSlice = useStore.useSlice.editor();

	const navigate = useNavigate();
	const pathparams = useParams();

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
		editorSlice.initializeEditor(dummyGame as Game, dummyAssets);
	}, [editorSlice.initializeEditor]);

	const handleNavigateToScene = (sceneId: string) => {
		navigate(`/editor/${sceneId}`);
	};

	const handleNavigateToEvent = (eventId: string) => {
		navigate(`/editor/${selectedSceneId}/${eventId}`);
	};

	const handleNavigateToScenesList = () => {
		navigate("/editor");
	};

	const handleClickSceneEnding = () => {
		navigate(`/editor/${selectedSceneId}/ending`);
	};

	const handleAddScene = (
		sceneTitle: string,
		scene: Scene,
		choiceId?: string | null,
	) => {
		// TODO: 実装
		return editorSlice.addScene(sceneTitle, scene, choiceId);
	};

	const handleDeleteScene = () => {
		// TODO: 実装
		console.log("Delete scene clicked");
		if (!selectedSceneId) return;
		editorSlice.deleteScene(selectedSceneId);
		handleNavigateToScenesList();
	};

	const handleSaveProjectSettings = (data: ProjectSettingsFormData) => {
		// TODO: 実装
		console.log("Save settings", data);
		editorSlice.saveProjectSettings(data);
	};

	const handleSaveSceneSettings = (data: SceneSettingsFormData) => {
		// TODO: 実装
		console.log("Save scene settings", data);
		editorSlice.saveSceneSettings(data);
	};

	const handleDeleteEvent = () => {
		// TODO: 実装
		console.log("Delete event clicked");
		if (!selectedSceneId || !selectedEventId) return;
		editorSlice.deleteEvent(selectedEventId, selectedSceneId);
		handleNavigateToScene(selectedSceneId);
	};

	const handleSaveEvent = (event: GameEvent) => {
		// TODO: 実装
		console.log("Save event clicked");
		if (!selectedSceneId) return;
		editorSlice.saveEvent(event, selectedSceneId);
	};

	const handleAddCharacter = (name: string) => {
		// TODO: 実装
		editorSlice.addCharacter(name);
	};

	const handleCharacterNameChange = (characterId: string, name: string) => {
		// TODO: 実装
		console.log("Change character name", characterId, name);
		editorSlice.updateCharacterName(characterId, name);
	};

	const handleCharacterImage = (characterId: string, imageId: string) => {
		// TODO: 実装
		console.log("Delete image", characterId, imageId);
		editorSlice.deleteCharacterImage(characterId, imageId);
	};

	const handleDeleteCharacter = (characterId: string) => {
		// TODO: 実装
		console.log("Delete character", characterId);
		editorSlice.deleteCharacter(characterId);
	};

	const handleDeleteAsset = (assetId: string, type: AssetDialogKeyType) => {
		// TODO: 実装
		console.log("Delete asset", assetId, type);
		editorSlice.deleteAsset(assetId, type);
	};

	const handleSaveEnding = (endingScene: Game["scenes"][number]) => {
		console.log("Save ending", endingScene);
		editorSlice.saveEnding(endingScene);
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
		onAddEvent: editorSlice.addEvent,
		onMoveEvent: editorSlice.moveEvent,
	});

	return (
		<div className="w-full h-full flex flex-col overflow-hidden">
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
							<div className="p-2">
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
							onAddCharacter={handleAddCharacter}
							onCharacterNameChange={handleCharacterNameChange}
							onDeleteCharacter={handleDeleteCharacter}
							onDeleteImage={handleCharacterImage}
							onDeleteAsset={handleDeleteAsset}
						/>
					)}

					{!selectedEventId && !isOpenEnding && (
						<div className="w-full h-[calc(100dvh-40px)] sticky top-0">
							<Graph game={editorSlice.editingGame} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
