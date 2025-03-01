import { useNavigate, useParams } from "@remix-run/react";
import { useState } from "react";
import type {
	Character,
	Game,
	GameEvent,
	GameResources,
	GotoScene,
	Scene,
} from "~/schema";
import {
	SideBarSettings,
	type SidebarItem,
	createEventFromSidebarItem,
	getColorFromType,
} from "./constants";
import { EventDetail } from "./event-detail";
import { Header } from "./header";
import { SceneDetail } from "./scene-detail";
import type { SceneSettingsFormData } from "./scene-detail/scene-settings";
import { ScenesList } from "./scene-list";
import {
	ProjectSettings,
	type ProjectSettingsFormData,
} from "./scene-list/project-settings";
import { Sidebar, SidebarItemCore } from "./sidebar";

import dummyAssets from "~/__mocks__/dummy-assets.json";
import dummyGame from "~/__mocks__/dummy-game.json";
import type { AssetType } from "./dialogs/asset";
import { Graph } from "./graph";

import {
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	MouseSensor,
	type UniqueIdentifier,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	EndingEditor,
	isChoiceScene,
	isEndScene,
	isGotoScene,
} from "./scene-detail/ending-editor";

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

	const handleClickSceneEnding = () => {
		navigate(`/editor/${selectedSceneId}/ending`);
	};

	const handleAddScene = (
		sceneTitle: string,
		scene: Scene,
		choiceId?: string | null,
	) => {
		// TODO: 実装

		const newScene = {
			id: crypto.randomUUID(),
			title: sceneTitle,
			sceneType: "end",
			events: [],
		} as Scene;

		let fromScene = scene;

		if (!game) return "";

		if (isChoiceScene(fromScene)) {
			fromScene.choices = fromScene.choices.map((choice) => {
				if (choice.id === choiceId) {
					return {
						...choice,
						nextSceneId: newScene.id,
					};
				}
				return choice;
			});
		} else if (isGotoScene(fromScene)) {
			fromScene.nextSceneId = newScene.id;
		} else if (isEndScene(fromScene)) {
			fromScene = {
				...fromScene,
				sceneType: "goto",
				nextSceneId: newScene.id,
			} as GotoScene;
		}

		const newGame = {
			...game,
			scenes: [
				...game.scenes.map((s) => (s.id === fromScene.id ? fromScene : s)),
				newScene,
			],
		} as Game;

		setGame(newGame);

		return newScene.id;
	};

	const handleDeleteScene = () => {
		// TODO: 実装
		console.log("Delete scene clicked");

		if (!game) return;
		const newGame = {
			...game,
		};

		handleNavigateToScenesList();

		newGame.scenes = newGame.scenes.map((scene) => {
			if (isChoiceScene(scene)) {
				const foundIndex = scene.choices.findIndex(
					(choice) => choice.nextSceneId === selectedSceneId,
				);
				if (foundIndex !== -1) {
					scene.choices.splice(foundIndex, 1);
				}
			}
			if (isGotoScene(scene) && scene.nextSceneId === selectedSceneId) {
				return {
					...scene,
					sceneType: "end",
				};
			}
			return scene;
		});

		newGame.scenes = newGame.scenes.filter(
			(scene) => scene.id !== selectedSceneId,
		);

		setGame(newGame);
	};

	const handleSaveProjectSettings = (data: ProjectSettingsFormData) => {
		// TODO: 実装
		console.log("Save settings", data);
	};

	const handleSaveSceneSettings = (data: SceneSettingsFormData) => {
		// TODO: 実装
		console.log("Save scene settings", data);
	};

	const handleDeleteEvent = () => {
		// TODO: 実装
		console.log("Delete event clicked");

		if (!game || !selectedSceneId) return;
		const newGame = {
			...game,
			scenes: game.scenes.map((scene) => {
				if (scene.id !== selectedSceneId) {
					return scene;
				}
				return {
					...scene,
					events: scene.events.filter((e) => e.id !== selectedEventId),
				};
			}),
		};

		setGame(newGame);

		handleNavigateToScene(selectedSceneId);
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

	const [activeSidebarItem, setActiveSidebarItem] =
		useState<SidebarItem | null>(null);
	const [activeEventId, setActiveEventId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
	);

	const insertNewEvent = (index: number, item: SidebarItem) => {
		console.log("Insert new event", index, item);
		if (!resources) return;
		const newEvent = createEventFromSidebarItem(item, resources);
		setGame((prev) => {
			if (!prev) return prev;

			console.log("Insert new event", newEvent, index);
			const newScenes = prev.scenes.map((scene) => {
				if (scene.id === selectedSceneId) {
					const newEvents = [...scene.events];
					newEvents.splice(index, 0, newEvent);
					return { ...scene, events: newEvents };
				}
				return scene;
			});
			return { ...prev, scenes: newScenes };
		});
	};

	const moveExistingEvent = (oldIndex: number, newIndex: number) => {
		console.log("Move event", oldIndex, newIndex);
		setGame((prev) => {
			if (!prev) return prev;
			const newScenes = prev.scenes.map((scene) => {
				if (scene.id === selectedSceneId) {
					const newEvents = [...scene.events];
					const [movedEvent] = newEvents.splice(oldIndex, 1);
					newEvents.splice(newIndex, 0, movedEvent);
					return { ...scene, events: newEvents };
				}
				return scene;
			});
			return { ...prev, scenes: newScenes };
		});
	};

	const handleDragStart = (event: DragStartEvent) => {
		// サイドバーアイテムをドラッグしている場合
		if (event.active.data.current?.from === "sidebar") {
			const item = event.active.data.current.item as SidebarItem;
			setActiveSidebarItem(item);
		} else {
			// タイムライン上の既存イベントをドラッグしている場合
			const eventId = event.active.id as string;
			setActiveEventId(eventId);
		}
	};

	const calculateInsertionIndex = (
		overId: UniqueIdentifier,
		events: GameEvent[] | undefined,
	) => {
		if (!events) return 0;
		if (!overId) return events?.length ?? 0;
		const overIndex = events.findIndex((ev) => ev.id === overId);
		if (overIndex === -1) return events?.length;
		return overIndex;
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { over } = event;
		if (activeSidebarItem) {
			if (over) {
				if (over.id === "event-timeline") {
					// イベントタイムライン全体にドロップした場合
					insertNewEvent(selectedScene?.events.length ?? 0, activeSidebarItem);
				} else {
					const dropIndex = calculateInsertionIndex(
						over.id,
						selectedScene?.events,
					);
					insertNewEvent(dropIndex, activeSidebarItem);
				}
			}
			setActiveSidebarItem(null);
			return;
		}

		// 既存イベントの並び替えの場合
		if (activeEventId && selectedScene) {
			if (over) {
				const oldIndex = selectedScene.events.findIndex(
					(ev) => ev.id === activeEventId,
				);
				const newIndex = selectedScene.events.findIndex(
					(ev) => ev.id === over.id,
				);
				if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
					moveExistingEvent(oldIndex, newIndex);
				}
			}
			setActiveEventId(null);
		}
	};

	/**
	 * dnd kit の DragCancel ハンドラ
	 * (Escキーなどでドラッグ中断した場合)
	 */
	const handleDragCancel = () => {
		// 状態をリセット
		setActiveSidebarItem(null);
		setActiveEventId(null);
	};

	const handleSaveEnding = (endingScene: Game["scenes"][number]) => {
		if (!game) return;
		const newGame = {
			...game,
			scenes: game?.scenes.map((scene) =>
				scene.id === selectedSceneId ? endingScene : scene,
			),
		};

		setGame(newGame);
	};

	return (
		<div className="w-full h-full flex flex-col overflow-hidden">
			<Header />
			<div className="w-full h-[calc(100dvh-40px)] grid grid-cols-12">
				{/* 選択時 */}
				{selectedSceneId !== undefined && (
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
								game={game}
								resources={resources}
								onNavigateToScenesList={handleNavigateToScenesList}
								onDeleteScene={handleDeleteScene}
								onClickEvent={handleNavigateToEvent}
								onClickSceneEnding={handleClickSceneEnding}
							/>

							{selectedScene && selectedEventId === "ending" && (
								<EndingEditor
									selectedScene={selectedScene}
									game={game}
									onSaveEnding={handleSaveEnding}
									onNavigateToScene={handleNavigateToScene}
									onAddScene={handleAddScene}
								/>
							)}

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
				{selectedScene === undefined && (
					<>
						<div className="col-span-3 border-r-[1px] border-gray-200">
							<div className="p-2">
								<ProjectSettings
									game={game}
									onSaveSettings={handleSaveProjectSettings}
								/>
							</div>
						</div>
						<div className="col-span-5 flex flex-col bg-white text-black p-2">
							<ScenesList
								game={game}
								sideBarSettings={SideBarSettings}
								onSceneClick={handleNavigateToScene}
							/>
						</div>
					</>
				)}

				<div className="col-span-4 bg-[#EEEEEE]">
					{selectedScene &&
						selectedEvent &&
						selectedSceneId &&
						selectedSceneId !== "ending" && (
							<EventDetail
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
									if ((e.target as HTMLElement).closest(".event-editor"))
										return;
									handleNavigateToScene(selectedSceneId);
								}}
							/>
						)}

					{(!selectedEventId || selectedEventId === "ending") && (
						<div className="w-full h-[calc(100dvh-40px)] sticky top-0">
							<Graph game={game} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
