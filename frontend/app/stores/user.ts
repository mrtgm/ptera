import type { StateCreator } from "zustand";
import type { GameMetaData, UserProfile } from "~/schema";
import type { State } from ".";
import { useStore } from ".";

interface GameSaveData {
	currentSceneId: string;
	currentEventId: string;
	playHistory: string[]; // 訪れたシーンのID履歴
	timestamp: number;
}

export interface UserState {
	isAuthenticated: boolean;
	authToken: string | null;
	currentUser: UserProfile | null;

	userGames: GameMetaData[]; // IDs of games created by the user
	saveData: Record<string, GameSaveData>;

	login: (email: string, password: string) => Promise<boolean>;
	register: (
		email: string,
		password: string,
		nickname: string,
	) => Promise<boolean>;
	logout: () => void;
	updateProfile: (profile: Partial<UserProfile>) => Promise<void>;

	savePath: (gameId: string, sceneId: string, eventId: string) => void;
	resetGameProgress: (gameId: string) => void;
}

// Create the user slice
export const createUserSlice: StateCreator<
	State,
	[["zustand/devtools", never], ["zustand/immer", never]],
	[],
	UserState
> = (set, get) => ({
	isAuthenticated: false,
	authToken: null,
	currentUser: null,
	userGames: [],
	saveData: {},

	// Auth actions
	login: async (email, password) => {
		//TODO: implement login
		return false;
	},

	register: async (email, password, nickname) => {
		//TODO: implement register
		return false;
	},

	logout: () => {
		//TODO: implement logout
		return false;
	},

	updateProfile: async (profile) => {
		//TODO: implement updateProfile
	},

	savePath: (gameId, sceneId, eventId) => {
		set((state) => {
			state.saveData[gameId] = {
				currentSceneId: sceneId,
				currentEventId: eventId,
				playHistory: [...(state.saveData[gameId]?.playHistory || []), sceneId],
				timestamp: Date.now(),
			};
		});
	},

	resetGameProgress: (gameId) => {
		set((state) => {
			delete state.saveData[gameId];
		});
	},
});
