import type { UserResponse } from "@ptera/schema";
import type { StateCreator } from "zustand";
import type { State } from ".";
import { api } from "../api";
import { performUpdate } from "../utils/optimistic-update";

export interface UserState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  likedGamesId: number[];
  currentUser: UserResponse | null;

  login: (provider: string) => void;
  logout: () => void;
  fetchCurrentUser: () => void;
  updateProfile: (profile: UserResponse) => Promise<void>;
  likeGame: (gameId: number) => void;
  unlikeGame: (gameId: number) => void;
  isLiked(gameId: number): boolean;
}

export const createUserSlice: StateCreator<
  State,
  [["zustand/devtools", never], ["zustand/immer", never]],
  [],
  UserState
> = (set, get) => ({
  isInitialized: false,
  isAuthenticated: false,
  likedGamesId: [],
  currentUser: null,
  saveData: {},

  login: (provider: string) => {
    window.location.href = `/api/v1/auth/${provider}`;
  },

  logout: async () => {
    await api.auth.logout();
    set({
      isAuthenticated: false,
      currentUser: null,
    });
    return false;
  },

  likeGame: async (gameId: number) => {
    const { likedGamesId } = get();

    const updatedLikedGamesId = [...likedGamesId, gameId];
    console.log("likedGamesId", updatedLikedGamesId);
    await performUpdate({
      api: () => api.games.like(gameId),
      optimisticUpdate: () => {
        set({ likedGamesId: [...likedGamesId, gameId] });
      },
      rollback: () => {
        set({ likedGamesId });
      },
    });
  },

  unlikeGame: async (gameId: number) => {
    const { likedGamesId } = get();

    const updatedLikedGamesId = likedGamesId.filter((id) => id !== gameId);

    console.log("unlikedGamesId", updatedLikedGamesId);

    await performUpdate({
      api: () => api.games.unlike(gameId),
      optimisticUpdate: () => {
        set({ likedGamesId: updatedLikedGamesId });
      },
      rollback: () => {
        set({ likedGamesId });
      },
    });
  },

  isLiked: (gameId: number) => {
    const { likedGamesId } = get();
    return likedGamesId.includes(gameId);
  },

  fetchCurrentUser: async () => {
    try {
      const [userData, likedGamesId] = await Promise.all([
        api.auth.me(),
        api.auth.likedGames(),
      ]);

      if (!userData) {
        return false;
      }

      set({
        isAuthenticated: true,
        currentUser: userData,
        likedGamesId: likedGamesId || [],
      });

      console.log("User authenticated:", userData);
      return true;
    } catch (error) {
      console.error("Authentication error:", error);
      return false;
    } finally {
      set({ isInitialized: true });
    }
  },

  updateProfile: async (profile) => {
    const { currentUser } = get();

    if (!currentUser) {
      return;
    }

    await performUpdate({
      api: () => api.users.updateProfile(currentUser.id, profile),
      optimisticUpdate: () => {
        set({
          currentUser: { ...currentUser, ...profile },
        });
      },
      rollback: () => {
        set({
          currentUser,
        });
      },
    });
  },
});
