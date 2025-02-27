import { useNavigate, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { Character, Game, GameEvent, GameResources } from "~/schema";
import { usePlayerInitialize } from "../player/hooks";
import {
	SideBarSettings,
	type SidebarItem,
	createEventFromSidebarItem,
	getColorFromType,
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
import { Sidebar, SidebarItemCore } from "./sidebar";

import dummyAssets from "~/__mocks__/dummy-assets.json";
import dummyGame from "~/__mocks__/dummy-game.json";
import type { AssetType } from "./dialogs/asset-dialog";
import { Graph } from "./graph";

import {
	type Collision,
	type CollisionDetection,
	DndContext,
	type DragEndEvent,
	type DragOverEvent,
	DragOverlay,
	type DragStartEvent,
	MouseSensor,
	type UniqueIdentifier,
	rectIntersection,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
	SortableContext,
	arrayMove,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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

	const [activeSidebarItem, setActiveSidebarItem] =
		useState<SidebarItem | null>(null);
	const [activeEventId, setActiveEventId] = useState<string | null>(null);

	// dnd kit センサー設定 (マウス/タッチ/PointerEventなど)
	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
	);

	/**
	 * 新規Eventを既存 events に挿入する
	 * @param index 挿入インデックス
	 * @param item サイドバーの SidebarItem
	 */
	const insertNewEvent = (index: number, item: SidebarItem) => {
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

	/**
	 * タイムライン上の既存イベントを並び替える
	 * @param oldIndex 移動前のインデックス
	 * @param newIndex 移動後のインデックス
	 */
	const moveExistingEvent = (oldIndex: number, newIndex: number) => {
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

	/**
	 * dnd kit の DragStart ハンドラ
	 */
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

	/**
	 * dnd kit の DragOver ハンドラ
	 * ドラッグ中、他の要素をまたいだ時に呼ばれる
	 */
	const handleDragOver = (event: DragOverEvent) => {
		// 特に新規挿入の場合のみ処理したい場合などはここで追加処理
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

	/**
	 * dnd kit の DragEnd ハンドラ
	 * ドラッグが終了したら、挿入・並び替えなどを行う
	 */
	const handleDragEnd = (event: DragEndEvent) => {
		const { over } = event; // over: ドロップ先
		// ドラッグ中の SidebarItem がある場合
		if (activeSidebarItem) {
			if (over) {
				// over.idには「挿入先のイベントID」や「リスト全体を表すID」が入る
				// SortableContextで設定したIDなどを元に挿入位置を計算します。

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
			// Drag終了後は state を初期化
			setActiveSidebarItem(null);
			return;
		}

		// 既存イベントの並び替えの場合
		if (activeEventId && selectedScene) {
			if (over) {
				// over.id から新しいインデックスを計算
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

	return (
		<div className="w-full h-full flex flex-col">
			<Header />
			<div className="w-full h-[calc(100dvh-40px)] grid grid-cols-12">
				{/* 選択時 */}
				{selectedSceneId !== undefined && (
					<DndContext
						sensors={sensors}
						onDragStart={handleDragStart}
						onDragOver={handleDragOver}
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
						<div className="col-span-5 flex flex-col justify-center bg-white text-black p-2">
							<SceneEditor
								selectedEvent={selectedEvent}
								selectedScene={selectedScene}
								game={game}
								resources={resources}
								onNavigateToScenesList={handleNavigateToScenesList}
								onDeleteScene={handleDeleteScene}
								onClickEvent={handleNavigateToEvent}
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
						<div className="col-span-5 flex flex-col justify-center bg-white text-black p-2">
							<ScenesList
								game={game}
								sideBarSettings={SideBarSettings}
								onSceneClick={handleNavigateToScene}
								onAddScene={handleAddScene}
							/>
						</div>
					</>
				)}

				<div className="col-span-4 bg-[#EEEEEE]">
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
