import type { SceneSettingsFormData } from "@/client/features/editor/components/scene-detail/scene-settings";
import type { SidebarItem } from "@/client/features/editor/constants";
import { isChoiceScene, isEndScene, isGotoScene } from "@/client/schema";

import { generateKeyBetween } from "fractional-indexing";
import type { StateCreator } from "zustand";

import {
	type AssetType,
	type MediaAsset,
	createAsset,
	createCharacter,
} from "@/schemas/assets/domain/resoucres";
import type { CharacterResponse } from "@/schemas/assets/dto";
import { createEvent } from "@/schemas/games/domain/event";
import { createEndScene } from "@/schemas/games/domain/scene";
import type {
	EventResponse,
	GameDetailResponse,
	ResourceResponse,
	SceneResponse,
	UpdateGameRequest,
} from "@/schemas/games/dto";
import { api } from "../api";
import type { AssetDialogKeyType } from "../features/editor/components/dialogs";
import { performUpdate } from "../utils/optimistic-update";
import type { State } from "./";

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
		sceneTitle: string,
		fromScene?: SceneResponse,
		choiceId?: number | null,
	) => SceneResponse | null;
	deleteScene: (sceneId: number) => void;
	saveSceneSettings: (data: SceneSettingsFormData) => void;
	saveEnding: (endingScene: SceneResponse) => void;

	addEvent: (
		index: number,
		item: SidebarItem,
		selectedSceneId: number,
	) => EventResponse | null;
	moveEvent: (
		oldIndex: number,
		newIndex: number,
		selectedSceneId: number,
	) => void;
	deleteEvent: (eventId: number, selectedSceneId: number) => void;
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
	addScene: (sceneTitle, fromScene, choiceId) => {
		const { editingGame, editingResources, markAsDirty } = get();
		if (!editingGame || !editingResources) return null;

		const newScene: SceneResponse = createEndScene({ name: sceneTitle });
		newScene.events = [
			createEvent(
				"textRender",
				generateKeyBetween(null, null),
				editingResources,
			),
		];

		let updatedScene = fromScene;
		let updatedScenes = [...editingGame.scenes];

		if (fromScene) {
			if (isChoiceScene(fromScene)) {
				updatedScene = {
					...fromScene,
					choices: fromScene.choices.map((choice) => {
						if (choice.id === choiceId) {
							return {
								...choice,
								nextSceneId: newScene.id,
							};
						}
						return choice;
					}),
				};
			} else if (isGotoScene(fromScene)) {
				updatedScene = {
					...fromScene,
					nextSceneId: newScene.id,
				};
			} else if (isEndScene(fromScene)) {
				updatedScene = {
					...fromScene,
					sceneType: "goto",
					nextSceneId: newScene.id,
				};
			}

			updatedScenes = updatedScenes.map((s) =>
				s.id === updatedScene?.id ? updatedScene : s,
			);
		}

		set({
			editingGame: {
				...editingGame,
				scenes: [...updatedScenes, newScene],
			},
		});

		markAsDirty();
		return newScene;
	},

	// シーン削除
	deleteScene: (sceneId) => {
		const { editingGame, markAsDirty } = get();
		if (!editingGame) return;

		if (editingGame.initialSceneId === sceneId) {
			throw new Error("初期シーンは削除不能");
		}

		// 依存関係の更新（他シーンからの参照を削除）
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

		markAsDirty();
	},

	// エンディング設定保存
	saveEnding: (endingScene) => {
		const { editingGame, markAsDirty } = get();
		if (!editingGame) return;

		const updatedScenes = editingGame.scenes.map((scene) =>
			scene.id === endingScene.id ? endingScene : scene,
		);

		set({
			editingGame: {
				...editingGame,
				scenes: updatedScenes,
			},
		});

		markAsDirty();
	},

	// イベント追加
	addEvent: (index, item, selectedSceneId) => {
		const { editingGame, editingResources, markAsDirty } = get();
		if (!editingGame || !editingResources) return null;

		const newEvent = createEvent(item.type, "a0", editingResources);

		const updatedScenes = editingGame.scenes.map((scene) => {
			if (scene.id === selectedSceneId) {
				const newEvents = [...scene.events];
				newEvents.splice(index, 0, newEvent);

				newEvents[index] = {
					...newEvents[index],
					orderIndex: generateKeyBetween(
						newEvents[index - 1]?.orderIndex ?? null,
						newEvents[index + 1]?.orderIndex ?? null,
					),
				};

				return { ...scene, events: newEvents };
			}
			return scene;
		});

		set({
			editingGame: {
				...editingGame,
				scenes: updatedScenes,
			},
		});

		markAsDirty();
		return newEvent;
	},

	// イベント移動
	moveEvent: (oldIndex, newIndex, selectedSceneId) => {
		const { editingGame, markAsDirty } = get();
		if (!editingGame) return;

		const updatedScenes = editingGame.scenes.map((scene) => {
			if (scene.id === selectedSceneId) {
				const newEvents = [...scene.events];
				const [movedEvent] = newEvents.splice(oldIndex, 1);
				newEvents.splice(newIndex, 0, movedEvent);

				newEvents[newIndex] = {
					...newEvents[newIndex],
					orderIndex: generateKeyBetween(
						newEvents[newIndex - 1]?.orderIndex ?? null,
						newEvents[newIndex + 1]?.orderIndex ?? null,
					),
				};

				return { ...scene, events: newEvents };
			}

			return scene;
		});

		set({
			editingGame: {
				...editingGame,
				scenes: updatedScenes,
			},
		});

		markAsDirty();
	},

	// イベント削除
	deleteEvent: (eventId, selectedSceneId) => {
		const { editingGame, markAsDirty } = get();
		if (!editingGame) return;

		const currentScene = editingGame.scenes.find(
			(scene) => scene.id === selectedSceneId,
		);

		if (!currentScene) return;

		if (currentScene.events.length === 1) {
			throw new Error("最後のイベントは削除不能");
		}

		const updatedScenes = editingGame.scenes.map((scene) => {
			if (scene.id === selectedSceneId) {
				return {
					...scene,
					events: scene.events.filter((event) => event.id !== eventId),
				};
			}
			return scene;
		});

		set({
			editingGame: {
				...editingGame,
				scenes: updatedScenes,
			},
		});

		markAsDirty();
	},

	// イベント保存
	saveEvent: (event, selectedSceneId) => {
		const { editingGame, markAsDirty } = get();
		if (!editingGame) return;

		const updatedScenes = editingGame.scenes.map((scene) => {
			if (scene.id === selectedSceneId) {
				return {
					...scene,
					events: scene.events.map((e) => (e.id === event.id ? event : e)),
				};
			}
			return scene;
		});

		set({
			editingGame: {
				...editingGame,
				scenes: updatedScenes as SceneResponse[],
			},
		});

		markAsDirty();
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
	saveSceneSettings: (data) => {
		console.log("Scene settings saved", data);
		// TODO: 実装
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
