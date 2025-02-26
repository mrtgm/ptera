import type { StateCreator } from "zustand";
import type { AssetFormType } from "~/features/editor/event-editor";
import type { GameResources } from "~/schema";
import type { State } from ".";

// export type ModalTarget = "asset" | "character" | "preview" | "adjustSize";

export type ModalParams = {
	asset: {
		mode: "none" | "select";
		target: keyof Omit<GameResources, "characters">;
		formTarget: AssetFormType;
	};
	character: {
		mode: "none" | "select";
		formTarget: "characterId";
	};
	preview: undefined;
	adjustSize: {
		target: "characters";
		assetId: string;
		characterId: string;
		position: [number, number];
		scale: number;
	};
};

export type ModalPayload =
	| {
			target: "asset";
			params: ModalParams["asset"];
	  }
	| {
			target: "character";
			params: ModalParams["character"];
	  }
	| {
			target: "preview";
			params?: ModalParams["preview"];
	  }
	| {
			target: "adjustSize";
			params: ModalParams["adjustSize"];
	  };

export interface ModalState {
	isOpen: boolean;
	target: ModalPayload["target"] | undefined;
	params: ModalPayload["params"] | undefined;

	openModal(payload: ModalPayload): void;
	closeModal(): void;
}

export const createModalSlice: StateCreator<
	State,
	[["zustand/devtools", never], ["zustand/immer", never]],
	[],
	ModalState
> = (_set, _get) => ({
	isOpen: false,
	target: "asset",
	params: undefined,

	openModal: ({ target, params }) => _set({ isOpen: true, target, params }),
	closeModal: () =>
		_set({ isOpen: false, target: undefined, params: undefined }),
});
