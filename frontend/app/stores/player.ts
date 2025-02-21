import type { StateCreator } from "zustand";
import { handleEvent } from "~/features/player/libs";
import { useStore } from "~/stores";
import { waitMs } from "~/utils";
import type { State } from ".";

export interface PlayerState {
	currentGame: Game | null;
	currentScene: Scene | null;
	currentResources: GameResources | null;
	currentEventIndex: number;

	stage: Stage;

	isAutoMode: boolean;
	isSkipMode: boolean;
	isTextSkip: boolean;

	messageHistory: { text: string; characterName?: string }[];

	loadGame: (game: Game) => void;
	setScene: (sceneId: string) => void;
	setCurrentResources: (resources: GameResources) => void;
	setIsTextSkip: (isTextSkip: boolean) => void;

	runEvents: (events: GameEvent[]) => Promise<void>;
	updateStage: (updates: Partial<Stage>) => void;
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
			text: "",
			characterName: "",
		},
		soundEffect: null,
		bgm: null,
		effect: null,
	},

	isAutoMode: false,
	isSkipMode: false,
	isTextSkip: false,

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

	setIsTextSkip: (isTextSkip: boolean) => {
		_set({ isTextSkip });
	},

	updateStage: (updates: Partial<Stage>) => {
		_set((state) => {
			state.stage = { ...state.stage, ...updates };
		});
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
	const { stage, addToHistory, updateStage, isAutoMode } = useStore.getState();

	switch (event.type) {
		case "text": {
			for (const line of event.lines) {
				await animateLine(line, (text) => {
					updateStage({
						dialog: {
							...stage.dialog,
							text,
						},
					});
				});

				addToHistory({ text: line, characterName: event.characterName });

				if (!isAutoMode) {
					await waitForTap();
				} else {
					await waitMs(1000);
				}
			}
			break;
		}
		case "appearMessageWindow": {
			updateStage({
				dialog: {
					...stage.dialog,
					isVisible: true,
				},
			});
			await waitMs(event.duration);
			break;
		}
		case "hideMessageWindow":
			updateStage({
				dialog: {
					...stage.dialog,
					isVisible: false,
				},
			});
			await waitMs(event.duration);
			break;
	}
};

const waitForTap = () =>
	new Promise<void>((resolve) => {
		const handleTap = () => {
			window.removeEventListener("click", handleTap);
			resolve();
		};
		window.addEventListener("click", handleTap);
	});

const animateLine = async (line: string, update: (text: string) => void) => {
	const { isTextSkip, setIsTextSkip } = useStore.getState();

	const DELAY = 50;
	let text = "";

	for (const char of line) {
		if (isTextSkip) {
			update(line);
			setIsTextSkip(false);
			break;
		}
		text += char;
		update(text);
		await waitMs(DELAY);
	}
};
