import { useNavigate, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { Character, Game, GameEvent, GameResources } from "~/schema";
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
import type { AssetType } from "./dialogs/asset-dialog";
import { Graph } from "./graph";

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
		// TODO: 実装
		console.log("Add scene clicked");
	};

	const handleDeleteScene = () => {
		// TODO: 実装
		console.log("Delete scene clicked");
	};

	const handleSaveProjectSettings = (data: ProjectSettingsFormData) => {
		// TODO: 実装
		console.log("Save settings", data);
	};

	const handleSaveSceneSettings = (data: SceneSettingsFormData) => {
		// TODO: 実装
		console.log("Save scene settings", data);
	};

	const handleSidebarItemClick = (item: SidebarItem) => {
		// TODO: 実装
		console.log("Sidebar item clicked", item);
		const newEvent = createEventFromSidebarItem(item);
		console.log("Created event", newEvent);
	};

	const handleDeleteEvent = () => {
		// TODO: 実装
		console.log("Delete event clicked");
	};

	const handleSaveEvent = (event: GameEvent) => {
		// TODO: 実装
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

	const handleAddCharacter = (name: string) => {
		// TODO: 実装
		const newCharacter = {
			id: crypto.randomUUID(),
			name,
			images: {},
		} as Character;

		if (!resources) return;
		const newResources = {
			...resources,
			characters: {
				...resources.characters,
				[newCharacter.id]: newCharacter,
			},
		};
		setResources(newResources);
	};

	const handleCharacterNameChange = (characterId: string, name: string) => {
		// TODO: 実装
		console.log("Change character name", characterId, name);

		if (!resources) return;
		const newResources = {
			...resources,
			characters: {
				...resources.characters,
				[characterId]: {
					...resources.characters[characterId],
					name,
				},
			},
		};
		setResources(newResources);
	};

	const handleDeleteImage = (characterId: string, imageId: string) => {
		// TODO: 実装
		console.log("Delete image", characterId, imageId);

		if (!resources) return;
		const newResources = {
			...resources,
			characters: {
				...resources.characters,
				[characterId]: {
					...resources.characters[characterId],
					images: Object.fromEntries(
						Object.entries(resources.characters[characterId].images).filter(
							([id, _]) => id !== imageId,
						),
					),
				},
			},
		};
		setResources(newResources);
	};

	const handleDeleteCharacter = (characterId: string) => {
		// TODO: 実装
		console.log("Delete character", characterId);

		if (!resources) return;
		const newResources = {
			...resources,
			characters: Object.fromEntries(
				Object.entries(resources.characters).filter(
					([id, _]) => id !== characterId,
				),
			),
		};

		setResources(newResources);
	};

	const handleDeleteAsset = (assetId: string, type: AssetType) => {
		// TODO: 実装
		console.log("Delete asset", assetId, type);

		if (!resources) return;
		const newResources = {
			...resources,
			[type]: Object.fromEntries(
				Object.entries(resources[type]).filter(([id, _]) => id !== assetId),
			),
		};
		console.log("New resources", newResources);
		setResources(newResources);
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

				<div className="col-span-4 bg-[#a4b2c6]">
					{selectedScene && selectedSceneId && selectedEvent ? (
						<EventEditor
							key={selectedEvent.id}
							selectedScene={selectedScene}
							selectedEvent={selectedEvent}
							game={game}
							resources={resources}
							onDeleteEvent={handleDeleteEvent}
							onSaveEvent={handleSaveEvent}
							onAddCharacter={handleAddCharacter}
							onCharacterNameChange={handleCharacterNameChange}
							onDeleteCharacter={handleDeleteCharacter}
							onDeleteImage={handleDeleteImage}
							onDeleteAsset={handleDeleteAsset}
							onClickAwayEvent={(e) => {
								if ((e.target as HTMLElement).closest(".event-editor")) return;
								handleNavigateToScene(selectedSceneId);
							}}
						/>
					) : (
						<div className="w-full h-[calc(100dvh-40px)] sticky top-0">
							<Graph game={game} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
