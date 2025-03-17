import type { SidebarItem } from "@/client/features/editor/constants";
import { isChoiceScene, isGotoScene } from "@/client/schema";
import {
	type CharacterResponse,
	type CreateSceneRequest,
	EventNotFoundError,
	type EventResponse,
	type GameDetailResponse,
	type GameEvent,
	LastEventCannotBeDeletedError,
	type MediaAsset,
	type ResourceResponse,
	SceneNotFoundError,
	type SceneResponse,
	type UpdateGameRequest,
	type UpdateSceneSettingRequest,
	createAsset,
	createCharacter,
	createEvent,
	gameEventSchema,
} from "@ptera/schema";
import { generateKeyBetween } from "fractional-indexing";
import type { StateCreator } from "zustand";
import type { State } from ".";
import { api } from "../api";
import type { AssetDialogKeyType } from "../features/editor/components/dialogs";
import { ResourceValidator } from "../features/editor/utils/resource-validator";
import { performUpdate } from "../utils/optimistic-update";

export interface EditorState {
	editingGame: GameDetailResponse | null;
	editingResources: ResourceResponse | null;
	isDirty: boolean;

	initializeEditor: (
		game: GameDetailResponse,
		resources: ResourceResponse,
	) => void;

	createGame: (title: string, description: string) => Promise<string>; // Returns gameId
	deleteGame: (gameId: number) => Promise<boolean>;
	publishGame: (gameId: number, isPublic: boolean) => Promise<boolean>;

	addScene: (
		data: CreateSceneRequest,
	) => Promise<SceneResponse | null | undefined>;
	deleteScene: (sceneId: number) => Promise<void>;
	saveSceneSettings: (
		sceneId: number,
		data: UpdateSceneSettingRequest,
	) => Promise<void>;
	saveEnding: (endingScene: SceneResponse) => Promise<void>;

	addEvent: (
		index: number,
		item: SidebarItem,
		selectedSceneId: number,
	) => Promise<EventResponse | null>;
	moveEvent: (
		oldIndex: number,
		newIndex: number,
		selectedSceneId: number,
	) => void;
	deleteEvent: (eventId: number, selectedSceneId: number) => Promise<void>;
	saveEvent: (event: EventResponse, selectedSceneId: number) => void;

	saveProjectSettings: (data: UpdateGameRequest) => void;

	addCharacter: (name: string) => void;
	updateCharacterName: (characterId: number, name: string) => void;
	deleteCharacter: (characterId: number) => void;
	uploadCharacterImage: (characterId: number, file: File) => void;
	deleteCharacterImage: (characterId: number, imageId: number) => void;

	deleteAsset: (assetId: number, type: AssetDialogKeyType) => void;
	uploadAsset: (file: File, type: AssetDialogKeyType) => void;

	markAsDirty: () => void;
	markAsClean: () => void;
}

export const createEditorSlice: StateCreator<
	State,
	[["zustand/devtools", never], ["zustand/immer", never]],
	[],
	EditorState
> = (set, get) => ({
	editingGame: null,
	editingResources: null,
	isDirty: false,

	initializeEditor: (game, resources) => {
		set({
			editingGame: game,
			editingResources: resources,
			isDirty: false,
		});
	},

	// シーン追加
	addScene: async ({ name, fromScene, choiceId }) => {
		const { editingGame, editingResources } = get();
		if (!editingGame || !editingResources) return;

		const res = await performUpdate({
			api: () =>
				api.games.scenes.create(editingGame.id, {
					name,
					fromScene,
					choiceId,
				}),
			onSuccess: async (newScene) => {
				if (newScene) {
					const savedFromScene = await api.games.scenes.get(
						editingGame.id,
						fromScene.id,
					);
					if (!savedFromScene) {
						throw new SceneNotFoundError(fromScene.id);
					}
					set({
						editingGame: {
							...editingGame,
							scenes: [
								...editingGame.scenes.map((scene) =>
									scene.id === fromScene.id ? savedFromScene : scene,
								),
								newScene,
							],
						},
					});
				}
			},
		});

		return res;
	},

	// シーン削除
	deleteScene: async (sceneId) => {
		const { editingGame } = get();
		if (!editingGame) return;

		if (editingGame.initialSceneId === sceneId) {
			throw new Error("初期シーンは削除不能");
		}

		await performUpdate({
			api: () => api.games.scenes.delete(editingGame.id, sceneId),
			optimisticUpdate: () => {
				const updatedScenes = editingGame.scenes.map((scene) => {
					if (isChoiceScene(scene)) {
						const updatedChoices = scene.choices.filter(
							(choice) => choice.nextSceneId !== sceneId,
						);
						return {
							...scene,
							choices: updatedChoices,
						};
					}

					if (isGotoScene(scene) && scene.nextSceneId === sceneId) {
						return {
							...scene,
							sceneType: "end",
						};
					}

					return scene;
				});

				// シーン削除
				const filteredScenes = updatedScenes.filter(
					(scene) => scene.id !== sceneId,
				);

				set({
					editingGame: {
						...editingGame,
						scenes: filteredScenes,
					} as GameDetailResponse,
				});
			},
		});
	},

	// エンディング設定保存
	saveEnding: async (endingScene) => {
		const { editingGame, markAsDirty } = get();
		if (!editingGame) return;

		await performUpdate({
			api: () =>
				api.games.scenes.update(editingGame.id, endingScene.id, endingScene),
			optimisticUpdate: () => {
				set({
					editingGame: {
						...editingGame,
						scenes: editingGame.scenes.map((scene) =>
							scene.id === endingScene.id ? endingScene : scene,
						),
					},
				});
			},
		});

		markAsDirty();
	},

	// イベント追加
	addEvent: async (index, item, selectedSceneId) => {
		const { editingGame, editingResources } = get();
		if (!editingGame || !editingResources) return null;

		const targetScene = editingGame.scenes.find(
			(scene) => scene.id === selectedSceneId,
		);

		if (!targetScene) {
			throw new SceneNotFoundError(selectedSceneId);
		}

		const newEvents = [...targetScene.events];
		const newEvent = createEvent(item.type, "a0", editingResources);
		newEvents.splice(index, 0, newEvent);
		newEvents[index] = {
			...newEvents[index],
			orderIndex: generateKeyBetween(
				newEvents[index - 1]?.orderIndex ?? null,
				newEvents[index + 1]?.orderIndex ?? null,
			),
		};

		await performUpdate({
			api: () =>
				api.games.scenes.events.create(editingGame.id, selectedSceneId, {
					type: item.type,
					orderIndex: newEvents[index].orderIndex,
				}),
			optimisticUpdate: () => {
				set({
					editingGame: {
						...editingGame,
						scenes: editingGame.scenes.map((scene) =>
							scene.id === selectedSceneId
								? { ...scene, events: newEvents }
								: scene,
						),
					},
				});
			},
			rollback: () => {
				set({
					editingGame: {
						...editingGame,
						scenes: editingGame.scenes.map((scene) =>
							scene.id === selectedSceneId
								? {
										...scene,
										events: newEvents.filter((e) => e.id !== newEvent.id),
									}
								: scene,
						),
					},
				});
			},
			onSuccess: (event) => {
				newEvents[index] = event as GameEvent;
				if (event) {
					set({
						editingGame: {
							...editingGame,
							scenes: editingGame.scenes.map((scene) =>
								scene.id === selectedSceneId
									? { ...scene, events: newEvents }
									: scene,
							),
						},
					});
				}
			},
		});

		return newEvent;
	},

	// イベント移動
	moveEvent: async (oldIndex, newIndex, selectedSceneId) => {
		const { editingGame, markAsDirty } = get();
		if (!editingGame) return;

		const targetScene = editingGame.scenes.find(
			(scene) => scene.id === selectedSceneId,
		);

		if (!targetScene) {
			throw new SceneNotFoundError(selectedSceneId);
		}

		const newEvents = [...targetScene.events];
		const [movedEvent] = newEvents.splice(oldIndex, 1);
		newEvents.splice(newIndex, 0, movedEvent);

		newEvents[newIndex] = {
			...newEvents[newIndex],
			orderIndex: generateKeyBetween(
				newEvents[newIndex - 1]?.orderIndex ?? null,
				newEvents[newIndex + 1]?.orderIndex ?? null,
			),
		};

		await performUpdate({
			api: () =>
				api.games.scenes.events.move(editingGame.id, selectedSceneId, {
					eventId: movedEvent.id,
					newOrderIndex: newEvents[newIndex].orderIndex,
				}),
			optimisticUpdate: () => {
				set({
					editingGame: {
						...editingGame,
						scenes: editingGame.scenes.map((scene) =>
							scene.id === selectedSceneId
								? { ...scene, events: newEvents }
								: scene,
						),
					},
				});
			},
		});
	},

	// イベント削除
	deleteEvent: async (eventId, selectedSceneId) => {
		const { editingGame } = get();
		if (!editingGame) return;

		const currentScene = editingGame.scenes.find(
			(scene) => scene.id === selectedSceneId,
		);

		if (!currentScene) return;

		if (currentScene.events.length === 1) {
			throw new LastEventCannotBeDeletedError(selectedSceneId);
		}

		const deletedEvent = currentScene.events.find((e) => e.id === eventId);
		if (!deletedEvent) {
			throw new EventNotFoundError(eventId);
		}

		await performUpdate({
			api: () =>
				api.games.scenes.events.delete(
					editingGame.id,
					selectedSceneId,
					eventId,
				),
			optimisticUpdate: () => {
				set({
					editingGame: {
						...editingGame,
						scenes: editingGame.scenes.map((scene) =>
							scene.id === selectedSceneId
								? {
										...scene,
										events: scene.events.filter((e) => e.id !== eventId),
									}
								: scene,
						),
					},
				});
			},
		});

		const res = ResourceValidator.getAssetFromEvent(deletedEvent);
		if (
			res &&
			ResourceValidator.canDeleteAsset(res.type, res.id, editingGame)
		) {
			await api.assets.unlinkGame(res.id, editingGame.id);
		}
	},

	// イベント保存
	saveEvent: async (event, selectedSceneId) => {
		const { editingGame } = get();
		if (!editingGame) return;

		try {
			gameEventSchema.parse(event);
		} catch (err) {
			console.error("Failed to save event:", err);
			return;
		}

		await performUpdate({
			api: () =>
				api.games.scenes.events.update(
					editingGame.id,
					selectedSceneId,
					event.id,
					event as GameEvent,
				),
			optimisticUpdate: () => {
				set({
					editingGame: {
						...editingGame,
						scenes: editingGame.scenes.map((scene) =>
							scene.id === selectedSceneId
								? {
										...scene,
										events: scene.events.map((e) =>
											e.id === event.id ? (event as GameEvent) : e,
										),
									}
								: scene,
						),
					},
				});
			},
		});
	},

	// キャラクター追加
	addCharacter: (name) => {
		const { editingResources, markAsDirty } = get();
		if (!editingResources) return;

		const newCharacter = createCharacter(name);

		set({
			editingResources: {
				...editingResources,
				character: {
					...editingResources.character,
					[newCharacter.id]: newCharacter,
				},
			},
		});

		markAsDirty();
	},

	// キャラクター名更新
	updateCharacterName: (characterId, name) => {
		const { editingResources, markAsDirty } = get();
		if (!editingResources) return;

		set({
			editingResources: {
				...editingResources,
				character: {
					...editingResources.character,
					[characterId]: {
						...editingResources.character[characterId],
						name,
					},
				},
			},
		});

		markAsDirty();
	},

	uploadCharacterImage: (characterId, file) => {
		const { editingResources, markAsDirty } = get();
		if (!editingResources) return;

		const character = editingResources.character[characterId];
		if (!character) return;

		const newImage = createAsset(
			"characterImage",
			file.name,
			URL.createObjectURL(file),
		);

		set({
			editingResources: {
				...editingResources,
				character: {
					...editingResources.character,
					[characterId]: {
						...character,
						images: {
							...character.images,
							[newImage.id]: newImage,
						},
					} as CharacterResponse,
				},
			},
		});
	},

	// キャラクター削除
	deleteCharacter: (characterId) => {
		const { editingResources, markAsDirty } = get();
		if (!editingResources) return;

		const { [characterId]: _, ...remainingCharacters } =
			editingResources.character;

		set({
			editingResources: {
				...editingResources,
				character: remainingCharacters,
			},
		});

		markAsDirty();
	},

	// キャラクター画像削除
	deleteCharacterImage: (characterId, imageId) => {
		const { editingResources, markAsDirty } = get();
		if (!editingResources) return;

		const character = editingResources.character[characterId];
		if (!character) return;

		const imageKey = imageId.toString();
		const removedImage = character.images?.[imageKey];
		const remainingImages = Object.fromEntries(
			Object.entries(character.images || {}).filter(
				([key]) => key !== imageKey,
			),
		);

		set({
			editingResources: {
				...editingResources,
				character: {
					...editingResources.character,
					[characterId]: {
						...character,
						images: remainingImages,
					},
				},
			},
		});

		markAsDirty();
	},

	// アセット削除
	deleteAsset: (assetId, type) => {
		const { editingResources, markAsDirty } = get();
		if (!editingResources) return;

		const assets = editingResources[type];
		const { [assetId]: _, ...remainingAssets } = assets;

		set({
			editingResources: {
				...editingResources,
				[type]: remainingAssets,
			},
		});

		markAsDirty();
	},

	// アセットアップロード
	uploadAsset: (file, type) => {
		const { editingResources, markAsDirty } = get();
		if (!editingResources) return;

		const newAsset: MediaAsset = createAsset(
			type,
			file.name,
			URL.createObjectURL(file),
		);

		set({
			editingResources: {
				...editingResources,
				[type]: {
					...editingResources[type],
					[newAsset.id]: newAsset,
				},
			},
		});
		markAsDirty();
	},

	// シーン設定保存
	saveSceneSettings: async (sceneId, data) => {
		const { editingGame } = get();
		if (!editingGame) return;

		await performUpdate({
			api: () => api.games.scenes.updateSetting(editingGame.id, sceneId, data),
			optimisticUpdate: () => {
				set({
					editingGame: {
						...editingGame,
						scenes: editingGame.scenes.map((scene) =>
							scene.id === sceneId ? { ...scene, ...data } : scene,
						),
					},
				});
			},
		});
	},

	// プロジェクト設定保存
	saveProjectSettings: async (data) => {
		const { editingGame } = get();
		if (!editingGame) return;

		await performUpdate({
			api: () => api.games.update(editingGame.id, data),
			onSuccess: (updatedGame) => {
				if (updatedGame) {
					set({
						editingGame: {
							...editingGame,
							...updatedGame,
						},
					});
				}
			},
		});
	},

	// 変更フラグ設定
	markAsDirty: () => {
		set({ isDirty: true });
	},

	markAsClean: () => {
		set({ isDirty: false });
	},

	createGame: async (name, description) => {
		const { editingGame, editingResources } = get();

		// ゲーム作成

		set({
			editingGame: editingGame,
			editingResources: {
				character: {},
				backgroundImage: {},
				cgImage: {},
				soundEffect: {},
				bgm: {},
			},
			isDirty: false,
		});

		return "gameId";
	},

	deleteGame: async (gameId) => {
		console.log("Deleting game", gameId);
		return true;
	},

	publishGame: async (gameId, isPublic) => {
		console.log("Publishing game", gameId, isPublic);
		return true;
	},
});
