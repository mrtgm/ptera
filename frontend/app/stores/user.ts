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
	[["zustand/devtools", never]],
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
			const saveData = state.saveData[gameId] ?? [];
			saveData.currentSceneId = sceneId;
			saveData.currentEventIndex = eventIndex;
			saveData.playHistory = [
				...(saveData.playHistory && saveData.playHistory.length > 0
					? saveData.playHistory
					: []),
				sceneId,
			];
			saveData.timestamp = Date.now();
			state.saveData[gameId] = saveData;
			return state;
		}),
});
