import { useNavigate, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { Game, GameEvent, GameResources } from "~/schema";
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

import dummyAssets from "~/__mocks__/dummy-assets.json";
import dummyGame from "~/__mocks__/dummy-game.json";

export const Editor = () => {
	const [game, setGame] = useState<Game | null>(dummyGame as Game);
	const [resources, setResources] = useState<GameResources | null>(
		dummyAssets as GameResources,
	);

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

	const handleNavigateToScene = (sceneId: string) => {
		navigate(`/editor/${sceneId}`);
	};

	const handleNavigateToEvent = (eventId: string) => {
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

		if (!game) return;
		const newGame = {
			...game,
			scenes: game.scenes.map((scene) => {
				if (scene.id !== selectedSceneId) {
					return scene;
				}
				return {
					...scene,
					events: scene.events.map((e) => (e.id === event.id ? event : e)),
				};
			}),
		};

		setGame(newGame);
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
					{selectedSceneId === undefined ? (
						<ScenesList
							game={game}
							sideBarSettings={SideBarSettings}
							onSceneClick={handleNavigateToScene}
							onAddScene={handleAddScene}
						/>
					) : (
						<SceneEditor
							selectedEvent={selectedEvent}
							selectedScene={selectedScene}
							game={game}
							sideBarSettings={SideBarSettings}
							resources={resources}
							onNavigateToScenesList={handleNavigateToScenesList}
							onDeleteScene={handleDeleteScene}
							onClickEvent={handleNavigateToEvent}
						/>
					)}
				</div>

				<div className="col-span-4 flex justify-center items-center">
					{selectedScene && selectedSceneId && selectedEvent ? (
						<EventEditor
							key={selectedEvent.id}
							selectedScene={selectedScene}
							selectedEvent={selectedEvent}
							game={game}
							resources={resources}
							onDeleteEvent={handleDeleteEvent}
							onSaveEvent={handleSaveEvent}
							onClickAwayEvent={(e) => {
								if ((e.target as HTMLElement).closest(".event-editor")) return;
								handleNavigateToScene(selectedSceneId);
							}}
						/>
					) : (
						<div className="p-2 bg-slate-900 w-full h-full flex justify-center items-center select-none text-white">
							<div className="text-2xl">No event selected</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
