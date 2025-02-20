import type { StateCreator } from "zustand";
import type { State } from ".";

export interface UserState {
	id: string;
	nickname: string;
	email: string;

	set: (state: Partial<UserState>) => void;
}

export const createUserSlice: StateCreator<
	State,
	[["zustand/devtools", never]],
	[],
	UserState
> = (_set, _get) => ({
	id: "",
	nickname: "",
	email: "",

	set: (state) => _set(state),
});
