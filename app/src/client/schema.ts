import type { Howl } from "howler";

import type { AssetResponse, CharacterResponse } from "@/schemas/assets/dto";

import type {
	GameDetailResponse,
	GameListResponse,
	ResourceResponse,
	SceneResponse,
} from "@/schemas/games/dto";

import type { UserResponse } from "@/schemas/users/dto";

import type {
	ChoiceScene,
	EndScene,
	GotoScene,
} from "@/schemas/games/domain/scene";

export {
	type GameEvent,
	type GameEventType,
	type AppearCGEvent,
	type AppearCharacterEvent,
	type CharacterEffectEvent,
	type HideCharacterEvent,
	type MoveCharacterEvent,
	type TextRenderEvent,
	effectType,
	characterEffectType,
	appearCGEventSchema,
	appearCharacterEventSchema,
	appearMessageWindowEventSchema,
	bgmStartEventSchema,
	bgmStopEventSchema,
	changeBackgroundEventSchema,
	characterEffectEventSchema,
	effectEventSchema,
	hideAllCharactersEventSchema,
	hideCharacterEventSchema,
	hideMessageWindowEventSchema,
	moveCharacterEventSchema,
	soundEffectEventSchema,
	textRenderEventSchema,
} from "@/schemas/games/domain/event";

export type MediaAsset = AssetResponse;
export type Character = CharacterResponse;

export type CharacterImage = MediaAsset;
export type BackgroundImage = MediaAsset;
export type CGImage = MediaAsset;
export type SoundEffect = MediaAsset;
export type BGM = MediaAsset;

export type Game = GameDetailResponse;
export type GameMetaData = GameListResponse;
export type Scene = SceneResponse;
export type GameResources = ResourceResponse;

export type UserProfile = UserResponse;

export type { GotoScene, ChoiceScene, EndScene };

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
			scale: number;
			position: [number, number];
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
		[id: number]: Character & {
			images: { [id: number]: { cache: HTMLImageElement } };
		};
	};
	backgroundImage: {
		[id: number]: BackgroundImage & { cache: HTMLImageElement };
	};
	cgImage: {
		[id: number]: CGImage & { cache: HTMLImageElement };
	};
	soundEffect: { [id: number]: SoundEffect & { cache: Howl } };
	bgm: { [id: number]: BGM & { cache: Howl } };
};
