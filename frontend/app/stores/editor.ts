import type { StateCreator } from "zustand";
import {
	type SidebarItem,
	createEventFromSidebarItem,
} from "~/features/editor/constants";
import type { SceneSettingsFormData } from "~/features/editor/scene-detail/scene-settings";
import type { ProjectSettingsFormData } from "~/features/editor/scene-list/project-settings";
import { isChoiceScene, isEndScene, isGotoScene } from "~/schema";
import type {
	Character,
	Game,
	GameEvent,
	GameResources,
	GotoScene,
	Scene,
} from "~/schema";
import type { State } from ".";

export interface EditorState {
	editingGame: Game | null;
	editingResources: GameResources | null;
	selectedSceneId: string | null;
	selectedEventId: string | null;
	isEndingEditorOpen: boolean;
	isDirty: boolean;

	selectedScene: Scene | null;
	selectedEvent: GameEvent | null;

	initializeEditor: (game: Game, resources: GameResources) => void;

	selectScene: (sceneId: string | null) => void;
	selectEvent: (eventId: string | null) => void;
	openEndingEditor: () => void;
	closeEndingEditor: () => void;

	addScene: (
		sceneTitle: string,
		fromScene?: Scene,
		choiceId?: string | null,
	) => string;
	deleteScene: (sceneId: string) => void;
	saveSceneSettings: (data: SceneSettingsFormData) => void;
	saveEnding: (endingScene: Scene) => void;

	addEvent: (item: SidebarItem, index: number) => void;
	moveEvent: (oldIndex: number, newIndex: number) => void;
	deleteEvent: (eventId: string) => void;
	saveEvent: (event: GameEvent) => void;

	saveProjectSettings: (data: ProjectSettingsFormData) => void;

	addCharacter: (name: string) => void;
	updateCharacterName: (characterId: string, name: string) => void;
	deleteCharacter: (characterId: string) => void;
	deleteCharacterImage: (characterId: string, imageId: string) => void;

	deleteAsset: (assetId: string, type: keyof GameResources) => void;

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
	selectedSceneId: null,
	selectedEventId: null,
	isEndingEditorOpen: false,
	isDirty: false,
	selectedScene: null,
	selectedEvent: null,

	initializeEditor: (game, resources) => {
		set({
			editingGame: game,
			editingResources: resources,
			selectedSceneId: null,
			selectedEventId: null,
			isEndingEditorOpen: false,
			isDirty: false,
		});
	},

	// シーン選択
	selectScene: (sceneId) => {
		const { editingGame } = get();
		const selectedScene = sceneId
			? editingGame?.scenes.find((scene) => scene.id === sceneId) || null
			: null;

		set({
			selectedSceneId: sceneId,
			selectedScene,
			selectedEventId: null,
			selectedEvent: null,
			isEndingEditorOpen: false,
		});
	},

	// イベント選択
	selectEvent: (eventId) => {
		const { selectedScene } = get();
		const selectedEvent =
			eventId && selectedScene
				? selectedScene.events.find((event) => event.id === eventId) || null
				: null;

		set({
			selectedEventId: eventId,
			selectedEvent,
			isEndingEditorOpen: eventId === "ending",
		});
	},

	// エンディングエディタ表示制御
	openEndingEditor: () => {
		set({
			isEndingEditorOpen: true,
			selectedEventId: "ending",
			selectedEvent: null,
		});
	},

	closeEndingEditor: () => {
		set({
			isEndingEditorOpen: false,
			selectedEventId: null,
			selectedEvent: null,
		});
	},

	// シーン追加
	addScene: (sceneTitle, fromScene, choiceId) => {
		const { editingGame, markAsDirty } = get();
		if (!editingGame) return "";

		const newSceneId = crypto.randomUUID();
		const newScene: Scene = {
			id: newSceneId,
			title: sceneTitle,
			sceneType: "end",
			events: [],
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
		return newSceneId;
	},

	// シーン削除
	deleteScene: (sceneId) => {
		const { editingGame, selectScene, markAsDirty } = get();
		if (!editingGame) return;

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

		selectScene(null);
		markAsDirty();
	},

	// エンディング設定保存
	saveEnding: (endingScene) => {
		const { editingGame, selectedSceneId, markAsDirty } = get();
		if (!editingGame || !selectedSceneId) return;

		const updatedScenes = editingGame.scenes.map((scene) =>
			scene.id === selectedSceneId ? endingScene : scene,
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
	addEvent: (item, index) => {
		const { editingGame, editingResources, selectedSceneId, markAsDirty } =
			get();
		if (!editingGame || !editingResources || !selectedSceneId) return;

		const newEvent = createEventFromSidebarItem(item, editingResources);

		const updatedScenes = editingGame.scenes.map((scene) => {
			if (scene.id === selectedSceneId) {
				const newEvents = [...scene.events];
				newEvents.splice(index, 0, newEvent);
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

	// イベント移動
	moveEvent: (oldIndex, newIndex) => {
		const { editingGame, selectedSceneId, markAsDirty } = get();
		if (!editingGame || !selectedSceneId) return;

		const updatedScenes = editingGame.scenes.map((scene) => {
			if (scene.id === selectedSceneId) {
				const newEvents = [...scene.events];
				const [movedEvent] = newEvents.splice(oldIndex, 1);
				newEvents.splice(newIndex, 0, movedEvent);
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
	deleteEvent: (eventId) => {
		const { editingGame, selectedSceneId, markAsDirty } = get();
		if (!editingGame || !selectedSceneId) return;

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
			selectedEventId: null,
			selectedEvent: null,
		});

		markAsDirty();
	},

	// イベント保存
	saveEvent: (event) => {
		const { editingGame, selectedSceneId, markAsDirty } = get();
		if (!editingGame || !selectedSceneId) return;

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
});
