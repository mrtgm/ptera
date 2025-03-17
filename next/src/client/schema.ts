import type { AssetResponse, CharacterResponse } from "@ptera/schema";
import type { ChoiceScene, EndScene, GotoScene, Scene } from "@ptera/schema";
import type { Howl } from "howler";

// --------------------------------------------------
//	ゲームエンジンのための型定義
// --------------------------------------------------

export const isGotoScene = (
	scene: Scene,
): scene is GotoScene & { sceneType: "goto" } => {
	return scene.sceneType === "goto";
};

export const isChoiceScene = (
	scene: Scene,
): scene is ChoiceScene & { sceneType: "choice" } => {
	return scene.sceneType === "choice";
};

export const isEndScene = (
	scene: EndScene,
): scene is Scene & { sceneType: "end" } => {
	return scene.sceneType === "end";
};

export type Choice = {
	id: number;
	text: string;
	nextSceneId: number;
};

export type Stage = {
	cg: {
		item: {
			id: number;
		} | null;
		transitionDuration: number;
	};
	background: {
		id: number;
		transitionDuration: number;
	} | null;
	characters: {
		transitionDuration: number;
		items: {
			id: number;
			scale: number;
			imageId: number;
			position: [number, number];
			effect: {
				type: string;
				transitionDuration: number;
			} | null;
		}[];
	};
	dialog: {
		isVisible: boolean;
		text: string;
		characterName: string | undefined | null;
		transitionDuration: number;
	};
	choices: Choice[];
	soundEffect: {
		id: number;
		volume: number;
		loop: boolean;
		isPlaying: boolean;
		transitionDuration: number;
	} | null;
	bgm: {
		id: number;
		volume: number;
		loop: boolean;
		isPlaying: boolean;
		transitionDuration: number;
	} | null;
	effect: {
		type: string;
		transitionDuration: number;
	} | null;
};

export type MessageHistory = {
	text: string;
	characterName?: string;
	isChoice?: boolean;
};

export type GameState = "loading" | "beforeStart" | "playing" | "idle" | "end";

export type ResourceCache = {
	character: {
		[id: string]: CharacterResponse & {
			images: { [id: string]: { cache: HTMLImageElement } };
		};
	};
	backgroundImage: {
		[id: string]: AssetResponse & { cache: HTMLImageElement };
	};
	cgImage: {
		[id: string]: AssetResponse & { cache: HTMLImageElement };
	};
	soundEffect: { [id: string]: AssetResponse & { cache: Howl } };
	bgm: { [id: string]: AssetResponse & { cache: Howl } };
};
