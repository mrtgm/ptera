import type { StateCreator } from "zustand";
import type { State } from ".";

export interface PlayerState {
	currentGame: Game | null;
	currentScene: Scene | null;
	currentResources: GameResources | null;
	currentEventIndex: number;
	isAutoMode: boolean;
	isSkipMode: boolean;
	messageHistory: { text: string; characterName?: string }[];

	loadGame: (game: Game) => void;
	setScene: (sceneId: string) => void;
	setCurrentResources: (resources: GameResources) => void;
	nextEvent: () => void;
	toggleAutoMode: () => void;
	toggleSkipMode: () => void;
	addToHistory: (message: { text: string; characterName?: string }) => void;
}

export const createPlayerSlice: StateCreator<
	State,
	[["zustand/devtools", never]],
	[],
	PlayerState
> = (_set, _get) => ({
	currentGame: null,
	currentScene: null,
	currentResources: null,
	currentEventIndex: 0,

	isAutoMode: false,
	isSkipMode: false,

	messageHistory: [],

	loadGame: (game: Game) =>
		_set({ currentGame: game, currentScene: game.scenes[0] }),

	setScene: (sceneId: string) => {
		const scene =
			_get().currentGame?.scenes.find((s) => s.id === sceneId) ?? null;
		if (scene) {
			_set({ currentScene: scene, currentEventIndex: 0 });
		}
	},

	setCurrentResources: (resources: GameResources) => {
		_set({ currentResources: resources });
	},

	nextEvent: () =>
		_set((state: PlayerState) => {
			if (!state.currentScene || !state.currentGame) return state;
			if (state.currentEventIndex >= state.currentScene.events.length)
				return state;
			return { currentEventIndex: state.currentEventIndex + 1 };
		}),

	toggleAutoMode: () => _set((state) => ({ isAutoMode: !state.isAutoMode })),
	toggleSkipMode: () => _set((state) => ({ isSkipMode: !state.isSkipMode })),

	addToHistory: (message) =>
		_set((state) => ({ messageHistory: [...state.messageHistory, message] })),
});
