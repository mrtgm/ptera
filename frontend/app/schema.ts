import { z } from "zod";

export const mediaAssetSchema = z.object({
	id: z.string(),
	filename: z.string(),
	url: z.string(),
	metadata: z
		.object({
			mimeType: z.string().optional(),
			size: z.number().optional(),
		})
		.optional(),
});
export type MediaAsset = z.infer<typeof mediaAssetSchema>;

export const characterImageSchema = mediaAssetSchema.extend({});
export type CharacterImage = z.infer<typeof characterImageSchema>;

export const backgroundImageSchema = mediaAssetSchema.extend({});
export type BackgroundImage = z.infer<typeof backgroundImageSchema>;

export const cgImageSchema = mediaAssetSchema.extend({});
export type CGImage = z.infer<typeof cgImageSchema>;

export const soundEffectSchema = mediaAssetSchema.extend({});
export type SoundEffect = z.infer<typeof soundEffectSchema>;

export const bgmSchema = mediaAssetSchema.extend({});
export type BGM = z.infer<typeof bgmSchema>;

/* ------------------------------------------------------
    Character
------------------------------------------------------ */
export const characterSchema = z.object({
	id: z.string(),
	name: z.string(),
	images: z.record(z.string(), characterImageSchema),
});
export type Character = z.infer<typeof characterSchema>;

/* ------------------------------------------------------
    GameResources
------------------------------------------------------ */
export const gameResourcesSchema = z.object({
	characters: z.record(z.string(), characterSchema),
	backgroundImages: z.record(z.string(), backgroundImageSchema),
	soundEffects: z.record(z.string(), soundEffectSchema),
	bgms: z.record(z.string(), bgmSchema),
	cgImages: z.record(z.string(), cgImageSchema),
});
export type GameResources = z.infer<typeof gameResourcesSchema>;

/* ------------------------------------------------------
    GameEvent (Discriminated Union)
------------------------------------------------------ */

export const textRenderEventSchema = z.object({
	id: z.string(),
	type: z.literal("text"),
	category: z.literal("message"),
	text: z.string().min(1, { message: "テキストを入力してください" }),
	characterName: z.string().optional(),
});

export type TextRenderEvent = z.infer<typeof textRenderEventSchema>;

export const appearMessageWindowEventSchema = z.object({
	id: z.string(),
	type: z.literal("appearMessageWindow"),
	category: z.literal("message"),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type AppearMessageWindowEvent = z.infer<
	typeof appearMessageWindowEventSchema
>;

export const hideMessageWindowEventSchema = z.object({
	id: z.string(),
	type: z.literal("hideMessageWindow"),
	category: z.literal("message"),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type HideMessageWindowEvent = z.infer<
	typeof hideMessageWindowEventSchema
>;

export const appearCharacterEventSchema = z.object({
	id: z.string(),
	type: z.literal("appearCharacter"),
	category: z.literal("character"),
	characterId: z.string(),
	characterImageId: z.string(),
	position: z.tuple([z.number(), z.number()]),
	scale: z.number(),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type AppearCharacterEvent = z.infer<typeof appearCharacterEventSchema>;

export const hideCharacterEventSchema = z.object({
	id: z.string(),
	type: z.literal("hideCharacter"),
	category: z.literal("character"),
	characterId: z.string(),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type HideCharacterEvent = z.infer<typeof hideCharacterEventSchema>;

export const hideAllCharactersEventSchema = z.object({
	id: z.string(),
	type: z.literal("hideAllCharacters"),
	category: z.literal("character"),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type HideAllCharactersEvent = z.infer<
	typeof hideAllCharactersEventSchema
>;

export const moveCharacterEventSchema = z.object({
	id: z.string(),
	type: z.literal("moveCharacter"),
	category: z.literal("character"),
	characterId: z.string(),
	position: z.tuple([z.number(), z.number()]),
	scale: z.number(),
});

export type MoveCharacterEvent = z.infer<typeof moveCharacterEventSchema>;

export const bgmStartEventSchema = z.object({
	id: z.string(),
	type: z.literal("bgmStart"),
	category: z.literal("media"),
	bgmId: z.string(),
	volume: z.union([z.number(), z.string().transform(Number)]),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type BGMStartEvent = z.infer<typeof bgmStartEventSchema>;

export const bgmStopEventSchema = z.object({
	id: z.string(),
	type: z.literal("bgmStop"),
	category: z.literal("media"),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type BGMStopEvent = z.infer<typeof bgmStopEventSchema>;

export const soundEffectEventSchema = z.object({
	id: z.string(),
	type: z.literal("soundEffect"),
	category: z.literal("media"),
	volume: z.union([z.number(), z.string().transform(Number)]),
	soundEffectId: z.string(),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type SoundEffectEvent = z.infer<typeof soundEffectEventSchema>;

export const changeBackgroundEventSchema = z.object({
	id: z.string(),
	type: z.literal("changeBackground"),
	category: z.literal("background"),
	backgroundId: z.string(),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type ChangeBackgroundEvent = z.infer<typeof changeBackgroundEventSchema>;

export const effectType = ["fadeIn", "fadeOut", "shake"] as const;
export const effectEventSchema = z.object({
	id: z.string(),
	type: z.literal("effect"),
	category: z.literal("effect"),
	effectType: z.enum(effectType),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type EffectEvent = z.infer<typeof effectEventSchema>;

export const characterEffectType = [
	"shake",
	"flash",
	"bounce",
	"sway",
	"wobble",
	"blackOn",
	"blackOff",
] as const;
export const characterEffectEventSchema = z.object({
	id: z.string(),
	type: z.literal("characterEffect"),
	category: z.literal("character"),
	characterId: z.string(),
	effectType: z.enum(characterEffectType),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type CharacterEffectEvent = z.infer<typeof characterEffectEventSchema>;

export const appearCGEventSchema = z.object({
	id: z.string(),
	type: z.literal("appearCG"),
	category: z.literal("cg"),
	cgImageId: z.string(),
	position: z.tuple([z.number(), z.number()]),
	scale: z.number(),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type AppearCGEvent = z.infer<typeof appearCGEventSchema>;

export const hideCGEventSchema = z.object({
	id: z.string(),
	type: z.literal("hideCG"),
	category: z.literal("cg"),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type HideCGEvent = z.infer<typeof hideCGEventSchema>;

export const gameEventSchema = z.discriminatedUnion("type", [
	textRenderEventSchema,
	appearMessageWindowEventSchema,
	hideMessageWindowEventSchema,
	appearCharacterEventSchema,
	hideCharacterEventSchema,
	hideAllCharactersEventSchema,
	moveCharacterEventSchema,
	bgmStartEventSchema,
	bgmStopEventSchema,
	soundEffectEventSchema,
	changeBackgroundEventSchema,
	effectEventSchema,
	characterEffectEventSchema,
	appearCGEventSchema,
	hideCGEventSchema,
]);

export type GameEvent = z.infer<typeof gameEventSchema>;

type ExcludeCommonKeys<T> = Omit<T, "type" | "id" | "category">;
export type EventProperties = {
	[K in GameEvent as K["type"]]: ExcludeCommonKeys<K>;
};

export type AllPropertyTypes = {
	[K in GameEvent as K["type"]]: {
		[P in keyof ExcludeCommonKeys<K>]: ExcludeCommonKeys<K>[P];
	};
}[GameEvent["type"]];

export type UniquePropertyUnion = {
	[K in keyof AllPropertyTypes]: AllPropertyTypes[K];
};

/* ------------------------------------------------------
     Choice
------------------------------------------------------ */
export const choiceSchema = z.object({
	id: z.string(),
	text: z.string(),
	nextSceneId: z.string(),
});
export type Choice = z.infer<typeof choiceSchema>;

/* ------------------------------------------------------
     Scenes
------------------------------------------------------ */
const gotoSceneSchema = z.object({
	id: z.string(),
	title: z.string(),
	sceneType: z.literal("goto"),
	events: z.array(gameEventSchema),
	nextSceneId: z.string(),
});

export type GotoScene = z.infer<typeof gotoSceneSchema>;

const choiceSceneSchema = z.object({
	id: z.string(),
	title: z.string(),
	sceneType: z.literal("choice"),
	events: z.array(gameEventSchema),
	choices: z.array(choiceSchema),
});

export type ChoiceScene = z.infer<typeof choiceSceneSchema>;

const endSceneSchema = z.object({
	id: z.string(),
	title: z.string(),
	sceneType: z.literal("end"),
	events: z.array(gameEventSchema),
});

export type EndScene = z.infer<typeof endSceneSchema>;

export const sceneSchema = z.discriminatedUnion("sceneType", [
	gotoSceneSchema,
	choiceSceneSchema,
	endSceneSchema,
]);
export type Scene = z.infer<typeof sceneSchema>;

/* ------------------------------------------------------
    Game
------------------------------------------------------ */
export const gameSchema = z.object({
	id: z.string(),
	title: z.string(),
	author: z.string(),
	description: z.string(),
	scenes: z.array(sceneSchema),
	initialSceneId: z.string(),
	version: z.string(),
});
export type Game = z.infer<typeof gameSchema>;

/* ------------------------------------------------------
		GameData
------------------------------------------------------ */

export type Stage = {
	cg: {
		item: {
			id: string;
			scale: number;
			position: [number, number];
		} | null;
		transitionDuration: number;
	};
	background: {
		id: string;
		transitionDuration: number;
	} | null;
	characters: {
		transitionDuration: number;
		items: {
			id: string;
			scale: number;
			imageId: string;
			position: [number, number];
			effect: {
				type: CharacterEffectEvent["effectType"];
				transitionDuration: number;
			} | null;
		}[];
	};
	dialog: {
		isVisible: boolean;
		text: string;
		characterName: string | undefined;
		transitionDuration: number;
	};
	choices: Choice[];
	soundEffect: {
		id: string;
		volume: number;
		isPlaying: boolean;
		transitionDuration: number;
	} | null;
	bgm: {
		id: string;
		volume: number;
		isPlaying: boolean;
		transitionDuration: number;
	} | null;
	effect: {
		type: EffectEvent["effectType"];
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
	characters: {
		[id: string]: Character & {
			images: { [id: string]: { cache: HTMLImageElement } };
		};
	};
	backgroundImages: {
		[id: string]: BackgroundImage & { cache: HTMLImageElement };
	};
	cgImages: {
		[id: string]: CGImage & { cache: HTMLImageElement };
	};
	soundEffects: { [id: string]: SoundEffect & { cache: Howl } };
	bgms: { [id: string]: BGM & { cache: Howl } };
};

// ユーティリティ関数
export const isGotoScene = (scene: Scene): scene is GotoScene => {
	return scene.sceneType === "goto";
};

export const isChoiceScene = (scene: Scene): scene is ChoiceScene => {
	return scene.sceneType === "choice";
};

export const isEndScene = (scene: Scene): scene is EndScene => {
	return scene.sceneType === "end";
};
