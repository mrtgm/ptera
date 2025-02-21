import type { StateCreator } from "zustand";
import type { State } from ".";

export interface UserState {
	userId: string;
	nickname: string;
	email: string;
	saveData: {
		[gameId: string]: {
			currentSceneId: string;
			currentEventIndex: number;
			playHistory: string[]; // 訪れたシーンのID履歴
			timestamp: number;
		};
	};

	setUserId: (userId: string) => void;
	savePath: (gameId: string, sceneId: string, eventIndex: number) => void;
}

export const createUserSlice: StateCreator<
	State,
	[["zustand/devtools", never], ["zustand/immer", never]],
	[],
	UserState
> = (_set, _get) => ({
	userId: "",
	nickname: "",
	email: "",
	saveData: {},

	setUserId: (userId: string) => _set({ userId }),

	savePath: (gameId: string, sceneId: string, eventIndex: number) =>
		_set((state) => {
			state.saveData[gameId] = {
				currentSceneId: sceneId,
				currentEventIndex: eventIndex,
				playHistory: [...(state.saveData[gameId]?.playHistory || []), sceneId],
				timestamp: Date.now(),
			};
		}),
});
