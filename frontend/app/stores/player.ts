import type { StateCreator } from "zustand";
import { handleEvent } from "~/features/player/libs";
import type { State } from ".";

export interface PlayerState {
	currentGame: Game | null;
	currentScene: Scene | null;
	currentResources: GameResources | null;
	currentEventIndex: number;

	stage: Stage;

	isAutoMode: boolean;
	isSkipMode: boolean;
	messageHistory: { text: string; characterName?: string }[];

	loadGame: (game: Game) => void;
	setScene: (sceneId: string) => void;
	setCurrentResources: (resources: GameResources) => void;
	runEvents: (events: GameEvent[]) => Promise<void>;
	nextEvent: () => void;
	toggleAutoMode: () => void;
	toggleSkipMode: () => void;
	addToHistory: (message: { text: string; characterName?: string }) => void;
}

export const createPlayerSlice: StateCreator<
	State,
	[["zustand/devtools", never], ["zustand/immer", never]],
	[],
	PlayerState
> = (_set, _get) => ({
	currentGame: null,
	currentScene: null,
	currentResources: null,
	currentEventIndex: 0,

	stage: {
		background: null,
		characters: [],
		dialog: {
			isVisible: false,
			lines: [],
			characterName: "",
		},
		soundEffect: null,
		bgm: null,
		effect: null,
	},

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

	runEvents: async (events: GameEvent[]) => {
		//イベントを順番に実行
		for (const event of events) {
			await runEvent(event);

			_set((state) => {
				state.currentEventIndex++;
			});
		}

		// runBranchingEvent(_get().currentScene);
	},

	nextEvent: () => {
		_set((state) => {
			state.currentEventIndex++;
		});
	},

	toggleAutoMode: () => _set((state) => ({ isAutoMode: !state.isAutoMode })),
	toggleSkipMode: () => _set((state) => ({ isSkipMode: !state.isSkipMode })),

	addToHistory: (message) =>
		_set((state) => ({ messageHistory: [...state.messageHistory, message] })),
});

const runEvent = async (event: GameEvent) => {
	switch (event.type) {
		case "text": {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			break;
		}
	}
};
