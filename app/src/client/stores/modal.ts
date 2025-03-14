import type { GameEvent, GameResources } from "@/client/schema";
import type { StateCreator } from "zustand";
import type { State } from "./";

export interface AssetSelectParams {
	target: keyof Omit<GameResources, "character">;
	callback: (assetId: number) => void;
}

export interface AssetManageParams {
	target: keyof Omit<GameResources, "character">;
}

export interface CharacterSelectParams {
	callback: (characterId: number) => void;
}

export interface CharacterImageSelectParams {
	callback: (characterId: number, assetId: number) => void;
}

export interface AdjustSizeParams {
	target: "character";
	assetId: number;
	characterId: number;
	position: [number, number];
	scale: number;
	callback: (position: [number, number], scale: number) => void;
}

export interface PreviewParams {
	currentSceneId: number;
	currentEventId: number;
	formValues: Partial<GameEvent>;
}

type ModalConfig = {
	"asset.select": AssetSelectParams;
	"asset.manage": AssetManageParams;
	"character.select": CharacterSelectParams;
	"character.image-select": CharacterImageSelectParams;
	"character.manage": undefined; // パラメータなし
	preview: PreviewParams;
	adjustSize: AdjustSizeParams;
};

export interface ModalState {
	isOpen: boolean;
	modalType: keyof ModalConfig | null;
	params: ModalConfig[keyof ModalConfig] | null;

	openModal<T extends keyof ModalConfig>(
		modalType: T,
		params: ModalConfig[T],
	): void;

	closeModal(): void;
}

export const createModalSlice: StateCreator<
	State,
	[["zustand/devtools", never], ["zustand/immer", never]],
	[],
	ModalState
> = (set) => ({
	isOpen: false,
	modalType: null,
	params: null,

	openModal: <T extends keyof ModalConfig>(
		modalType: T,
		params: ModalConfig[T],
	) => {
		set({
			isOpen: true,
			modalType,
			params,
		});
	},

	closeModal: () => {
		set({
			isOpen: false,
			modalType: null,
			params: null,
		});
	},
});
