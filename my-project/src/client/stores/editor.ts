import type { SceneSettingsFormData } from "@/client/features/editor/components/scene-detail/scene-settings.jsx";
import type { ProjectSettingsFormData } from "@/client/features/editor/components/scene-list/project-settings.jsx";
import {
	type SidebarItem,
	createEventFromSidebarItem,
} from "@/client/features/editor/constants";
import { isChoiceScene, isEndScene, isGotoScene } from "@/client/schema.js";
import type {
	Character,
	Game,
	GameEvent,
	GameResources,
	GotoScene,
	MediaAsset,
	Scene,
} from "@/client/schema.js";
import { generateKeyBetween } from "fractional-indexing";
import type { StateCreator } from "zustand";

import type { State } from "./index.js";

export interface EditorState {
	editingGame: Game | null;
	editingResources: GameResources | null;
	isDirty: boolean;

	initializeEditor: (game: Game, resources: GameResources) => void;

	createGame: (title: string, description: string) => Promise<string>; // Returns gameId
	deleteGame: (gameId: string) => Promise<boolean>;
	publishGame: (gameId: string, isPublic: boolean) => Promise<boolean>;

	addScene: (
		sceneTitle: string,
		fromScene?: Scene,
		choiceId?: string | null,
	) => Scene | null;
	deleteScene: (sceneId: string) => void;
	saveSceneSettings: (data: SceneSettingsFormData) => void;
	saveEnding: (endingScene: Scene) => void;

	addEvent: (
		index: number,
		item: SidebarItem,
		selectedSceneId: string,
	) => GameEvent | null;
	moveEvent: (
		oldIndex: number,
		newIndex: number,
		selectedSceneId: string,
	) => void;
	deleteEvent: (eventId: string, selectedSceneId: string) => void;
	saveEvent: (event: GameEvent, selectedSceneId: string) => void;

	saveProjectSettings: (data: ProjectSettingsFormData) => void;

	addCharacter: (name: string) => void;
	updateCharacterName: (characterId: string, name: string) => void;
	deleteCharacter: (characterId: string) => void;
	uploadCharacterImage: (characterId: string, file: File) => void;
	deleteCharacterImage: (characterId: string, imageId: string) => void;

	deleteAsset: (assetId: string, type: keyof GameResources) => void;
	uploadAsset: (file: File, type: keyof GameResources) => void;

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
		const { editingGame, markAsDirty } = get();
		if (!editingGame) return null;

		const newSceneId = crypto.randomUUID();
		const newScene: Scene = {
			id: newSceneId,
			title: sceneTitle,
			sceneType: "end",
			events: [
				{
					id: crypto.randomUUID(),
					type: "text",
					category: "message",
					order: generateKeyBetween(null, null),
					text: "新しいシーン",
				},
			],
		};

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
								nextSceneId: newSceneId,
							};
						}
						return choice;
					}),
				};
			} else if (isGotoScene(fromScene)) {
				updatedScene = {
					...fromScene,
					nextSceneId: newSceneId,
				};
			} else if (isEndScene(fromScene)) {
				updatedScene = {
					...fromScene,
					sceneType: "goto",
					nextSceneId: newSceneId,
				} as GotoScene;
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
			} as Game,
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

		const newEvent = createEventFromSidebarItem(item, editingResources);

		const updatedScenes = editingGame.scenes.map((scene) => {
			if (scene.id === selectedSceneId) {
				const newEvents = [...scene.events];
				newEvents.splice(index, 0, newEvent);

				newEvents[index] = {
					...newEvents[index],
					order: generateKeyBetween(
						newEvents[index - 1]?.order ?? null,
						newEvents[index + 1]?.order ?? null,
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
					order: generateKeyBetween(
						newEvents[newIndex - 1]?.order ?? null,
						newEvents[newIndex + 1]?.order ?? null,
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
				scenes: updatedScenes,
			},
		});

		markAsDirty();
	},

	// キャラクター追加
	addCharacter: (name) => {
		const { editingResources, markAsDirty } = get();
		if (!editingResources) return;

		const newCharacter: Character = {
			id: crypto.randomUUID(),
			name,
			images: {},
		};

		set({
			editingResources: {
				...editingResources,
				characters: {
					...editingResources.characters,
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
				characters: {
					...editingResources.characters,
					[characterId]: {
						...editingResources.characters[characterId],
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

		const character = editingResources.characters[characterId];
		if (!character) return;

		const newImageId = crypto.randomUUID();
		const newImage: MediaAsset = {
			id: newImageId,
			filename: file.name,
			url: URL.createObjectURL(file),
			metadata: {
				mimeType: file.type,
				size: file.size,
			},
		};

		set({
			editingResources: {
				...editingResources,
				characters: {
					...editingResources.characters,
					[characterId]: {
						...character,
						images: {
							...character.images,
							[newImage.id]: newImage,
						},
					},
				},
			},
		});
	},

	// キャラクター削除
	deleteCharacter: (characterId) => {
		const { editingResources, markAsDirty } = get();
		if (!editingResources) return;

		const { [characterId]: _, ...remainingCharacters } =
			editingResources.characters;

		set({
			editingResources: {
				...editingResources,
				characters: remainingCharacters,
			},
		});

		markAsDirty();
	},

	// キャラクター画像削除
	deleteCharacterImage: (characterId, imageId) => {
		const { editingResources, markAsDirty } = get();
		if (!editingResources) return;

		const character = editingResources.characters[characterId];
		if (!character) return;

		const { [imageId]: _, ...remainingImages } = character.images;

		set({
			editingResources: {
				...editingResources,
				characters: {
					...editingResources.characters,
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

		const newAsset: MediaAsset = {
			id: crypto.randomUUID(),
			filename: file.name,
			url: URL.createObjectURL(file),
			metadata: {
				mimeType: file.type,
				size: file.size,
			},
		};

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
		get().markAsDirty();
		// TODO: 実装
	},

	// プロジェクト設定保存
	saveProjectSettings: (data) => {
		console.log("Project settings saved", data);
		get().markAsDirty();
		// TODO: 実装
	},

	// 変更フラグ設定
	markAsDirty: () => {
		set({ isDirty: true });
	},

	markAsClean: () => {
		set({ isDirty: false });
	},

	createGame: async (title, description) => {
		console.log("Creating game", title, description);

		const INITIAL_GAME: Game = {
			id: crypto.randomUUID(),
			title,
			description,
			author: "anonymous",
			initialSceneId: "opening",
			coverImageUrl: undefined,
			schemaVersion: "0.1",
			status: "draft",
			createdAt: Date.now(),
			updatedAt: Date.now(),
			playCount: 0,
			likeCount: 0,
			scenes: [
				{
					id: "opening",
					title: "オープニング",
					sceneType: "end",
					events: [
						{
							id: "opening-event",
							type: "text",
							category: "message",
							order: "a0",
							text: "これはオープニングです。",
						},
					],
				},
			],
		};

		set({
			editingGame: INITIAL_GAME,
			editingResources: {
				characters: {},
				backgroundImages: {},
				cgImages: {},
				soundEffects: {},
				bgms: {},
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
