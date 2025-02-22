import type { StateCreator } from "zustand";
import type { State } from ".";

export interface EditorState {
	editingGame: Game | null;
	selectedSceneId: string | null;
	selectedEventId: string | null;
	isDirty: boolean;
	resources: GameResources;

	createNewGame: () => void;
	loadGameToEdit: (game: Game) => void;
	updateGameDetails: (details: Partial<Game>) => void;
	addScene: (scene: Scene) => void;
	updateScene: (sceneId: string, updates: Partial<Scene>) => void;
	deleteScene: (sceneId: string) => void;
	addEvent: (sceneId: string, event: GameEvent) => void;
	updateEvent: (
		sceneId: string,
		eventId: string,
		updates: Partial<Event>,
	) => void;
	deleteEvent: (sceneId: string, eventId: string) => void;
	setSelectedScene: (sceneId: string | null) => void;
	setSelectedEvent: (eventId: string | null) => void;
	// uploadResource: (resourceType: keyof GameResources, resource: any) => void;
	saveGame: () => Promise<void>;
}

export const createEditorSlice: StateCreator<
	State,
	[["zustand/devtools", never], ["zustand/immer", never]],
	[],
	EditorState
> = (_set, _get) => ({
	editingGame: null,
	selectedSceneId: null,
	selectedEventId: null,
	isDirty: false,
	resources: {
		characters: {},
		backgroundImages: {},
		soundEffects: {},
		bgms: {},
	},

	createNewGame: () =>
		_set({
			editingGame: {
				id: crypto.randomUUID(),
				title: "New Game",
				author: "",
				description: "",
				scenes: [],
				version: "0.1",
			},
			selectedSceneId: null,
			selectedEventId: null,
			isDirty: true,
		}),

	loadGameToEdit: (game: Game) =>
		_set({
			editingGame: game,
			selectedSceneId: null,
			selectedEventId: null,
			isDirty: false,
		}),

	updateGameDetails: (details: Partial<Game>) =>
		_set((state: EditorState) => {
			if (state.editingGame) {
				Object.assign(state.editingGame, details);
				state.isDirty = true;
			}
		}),

	addScene: (scene: Scene) =>
		_set((state: EditorState) => {
			if (state.editingGame) {
				state.editingGame.scenes.push(scene);
				state.isDirty = true;
			}
		}),

	updateScene: (sceneId: string, updates: Partial<Scene>) =>
		_set((state: EditorState) => {
			if (state.editingGame) {
				const scene = state.editingGame.scenes.find((s) => s.id === sceneId);
				if (scene) {
					Object.assign(scene, updates);
					state.isDirty = true;
				}
			}
		}),

	deleteScene: (sceneId: string) =>
		_set((state: EditorState) => {
			if (state.editingGame) {
				state.editingGame.scenes = state.editingGame.scenes.filter(
					(s) => s.id !== sceneId,
				);
				if (state.selectedSceneId === sceneId) {
					state.selectedSceneId = null;
					state.selectedEventId = null;
				}
				state.isDirty = true;
			}
		}),

	addEvent: (sceneId: string, event: GameEvent) =>
		_set((state: EditorState) => {
			if (state.editingGame) {
				const scene = state.editingGame.scenes.find((s) => s.id === sceneId);
				if (scene) {
					scene.events.push(event);
					state.isDirty = true;
				}
			}
		}),

	updateEvent: (sceneId: string, eventId: string, updates: Partial<Event>) =>
		_set((state: EditorState) => {
			if (state.editingGame) {
				const scene = state.editingGame.scenes.find((s) => s.id === sceneId);
				if (scene) {
					const event = scene.events.find((e) => e.id === eventId);
					if (event) {
						Object.assign(event, updates);
						state.isDirty = true;
					}
				}
			}
		}),

	deleteEvent: (sceneId: string, eventId: string) =>
		_set((state: EditorState) => {
			if (state.editingGame) {
				const scene = state.editingGame.scenes.find((s) => s.id === sceneId);
				if (scene) {
					scene.events = scene.events.filter((e) => e.id !== eventId);
					if (state.selectedEventId === eventId) {
						state.selectedEventId = null;
					}
					state.isDirty = true;
				}
			}
		}),

	setSelectedScene: (sceneId: string | null) =>
		_set({ selectedSceneId: sceneId, selectedEventId: null }),

	setSelectedEvent: (eventId: string | null) =>
		_set({ selectedEventId: eventId }),

	// TBD: ここで実際のアップロード処理を実装
	// uploadResource: (resourceType: keyof GameResources, resource: any) =>
	// 	_set((state: EditorState) => {
	// 		state.resources[resourceType][resource.id] = resource;
	// 	}),

	saveGame: async () => {
		const state = _get();
		if (state.editingGame) {
			// TBD: ここで実際のAPI呼び出しを実装
			// await api.saveGame(state.editingGame);
			_set({ isDirty: false });
		}
	},
});
