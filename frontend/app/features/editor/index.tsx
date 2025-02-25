import { useNavigate, useParams } from "@remix-run/react";
import { useEffect } from "react";
import { usePlayerInitialize } from "../player/hooks";
import {
	SideBarSettings,
	type SidebarItem,
	createEventFromSidebarItem,
} from "./constants";
import { EventEditor } from "./event-editor";
import { Header } from "./header";
import {
	ProjectSettings,
	type ProjectSettingsFormData,
} from "./project-settings";
import { SceneEditor } from "./scene-editor";
import type { SceneSettingsFormData } from "./scene-settings";
import { ScenesList } from "./scenes-list";
import { Sidebar } from "./sidebar";

export const Editor = () => {
	const { game, state, cache, setGame } = usePlayerInitialize();

	const navigate = useNavigate();
	const pathparams = useParams();

	const selectedSceneId = pathparams.sceneId;
	const selectedScene = game?.scenes.find(
		(scene) => scene.id === selectedSceneId,
	);

	const selectedEventId = pathparams.eventId;
	const selectedEvent = selectedScene?.events.find(
		(event) => event.id === selectedEventId,
	);

	const handleClickScene = (sceneId: string) => {
		navigate(`/editor/${sceneId}`);
	};

	const handleClickEvent = (eventId: string) => {
		navigate(`/editor/${selectedSceneId}/${eventId}`);
	};

	const handleNavigateToScenesList = () => {
		navigate("/editor");
	};

	const handleAddScene = () => {
		// TBD: 実装
		console.log("Add scene clicked");
	};

	const handleDeleteScene = () => {
		// TBD: 実装
		console.log("Delete scene clicked");
	};

	const handleSaveProjectSettings = (data: ProjectSettingsFormData) => {
		// TBD: 実装
		console.log("Save settings", data);
	};

	const handleSaveSceneSettings = (data: SceneSettingsFormData) => {
		// TBD: 実装
		console.log("Save scene settings", data);
	};

	const handleSidebarItemClick = (item: SidebarItem) => {
		// TBD: 実装
		console.log("Sidebar item clicked", item);
		const newEvent = createEventFromSidebarItem(item);
		console.log("Created event", newEvent);
	};

	const handleDeleteEvent = () => {
		// TBD: 実装
		console.log("Delete event clicked");
	};

	const handleSaveEvent = (event: GameEvent) => {
		// TBD: 実装
		console.log("Save event clicked");
		setGame((prev) => {
			if (!prev) {
				return prev;
			}
			const newGame = {
				...prev,
				scenes: prev.scenes.map((scene) => {
					if (scene.id !== selectedSceneId) {
						return scene;
					}
					return {
						...scene,
						events: scene.events.map((e) => (e.id === event.id ? event : e)),
					};
				}),
			};
			return newGame;
		});
	};

	return (
		<div className="w-full h-full flex flex-col">
			<Header />
			<div className="w-full h-[calc(100dvh-40px)] grid grid-cols-12">
				{/* Left panel */}
				<div className="col-span-3 border-r-[1px] border-gray-200">
					{selectedSceneId ? (
						<Sidebar
							selectedScene={selectedScene}
							sideBarSettings={SideBarSettings}
							onItemClick={handleSidebarItemClick}
							onSaveSettings={handleSaveSceneSettings}
						/>
					) : (
						<div className="p-2">
							<ProjectSettings
								game={game}
								onSaveSettings={handleSaveProjectSettings}
							/>
						</div>
					)}
				</div>

				<div className="col-span-5 flex flex-col justify-center bg-white text-black p-2">
					{state === "loading" || !game ? (
						<div className="w-full h-full flex justify-center items-center select-none">
							<div className="text-2xl">読み込み中...</div>
						</div>
					) : selectedSceneId === undefined ? (
						<ScenesList
							game={game}
							sideBarSettings={SideBarSettings}
							onSceneClick={handleClickScene}
							onAddScene={handleAddScene}
						/>
					) : (
						<SceneEditor
							selectedScene={selectedScene}
							game={game}
							sideBarSettings={SideBarSettings}
							cache={cache}
							onNavigateToScenesList={handleNavigateToScenesList}
							onDeleteScene={handleDeleteScene}
							onClickEvent={handleClickEvent}
						/>
					)}
				</div>

				<div className="col-span-4 flex justify-center items-center">
					{selectedEvent ? (
						<EventEditor
							selectedEvent={selectedEvent}
							game={game}
							cache={cache}
							onDeleteEvent={handleDeleteEvent}
							onSaveEvent={handleSaveEvent}
						/>
					) : (
						<div className="p-2">
							<div className="text-2xl">No event selected</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
