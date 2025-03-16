import { randomIntId, randomUUID } from "@/server/shared/utils/id";
import { generateKeyBetween } from "fractional-indexing";
import { z } from "zod";
import type { GameResources } from "../../assets/domain/resoucres";

/* ------------------------------------------------------
    GameEvent Entities
------------------------------------------------------ */

export const textRenderEventSchema = z.object({
	id: z.number(),
	eventType: z.literal("textRender"),
	category: z.literal("message"),
	orderIndex: z.string(),
	text: z.string().min(1, { message: "テキストは必須です" }),
	characterName: z.string().optional().nullable(),
});

export type TextRenderEvent = z.infer<typeof textRenderEventSchema>;

export const appearMessageWindowEventSchema = z.object({
	id: z.number(),
	eventType: z.literal("appearMessageWindow"),
	category: z.literal("message"),
	orderIndex: z.string(),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type AppearMessageWindowEvent = z.infer<
	typeof appearMessageWindowEventSchema
>;

export const hideMessageWindowEventSchema = z.object({
	id: z.number(),
	eventType: z.literal("hideMessageWindow"),
	category: z.literal("message"),
	orderIndex: z.string(),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type HideMessageWindowEvent = z.infer<
	typeof hideMessageWindowEventSchema
>;

export const appearCharacterEventSchema = z.object({
	id: z.number(),
	eventType: z.literal("appearCharacter"),
	category: z.literal("character"),
	orderIndex: z.string(),
	characterId: z.number(),
	characterImageId: z.number(),
	position: z.tuple([z.number(), z.number()]),
	scale: z.union([z.number(), z.string().transform(Number)]),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type AppearCharacterEvent = z.infer<typeof appearCharacterEventSchema>;

export const hideCharacterEventSchema = z.object({
	id: z.number(),
	eventType: z.literal("hideCharacter"),
	category: z.literal("character"),
	orderIndex: z.string(),
	characterId: z.number(),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type HideCharacterEvent = z.infer<typeof hideCharacterEventSchema>;

export const hideAllCharactersEventSchema = z.object({
	id: z.number(),
	eventType: z.literal("hideAllCharacters"),
	category: z.literal("character"),
	orderIndex: z.string(),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type HideAllCharactersEvent = z.infer<
	typeof hideAllCharactersEventSchema
>;

export const moveCharacterEventSchema = z.object({
	id: z.number(),
	eventType: z.literal("moveCharacter"),
	category: z.literal("character"),
	orderIndex: z.string(),
	characterId: z.number(),
	position: z.tuple([z.number(), z.number()]),
	scale: z.union([z.number(), z.string().transform(Number)]),
});

export type MoveCharacterEvent = z.infer<typeof moveCharacterEventSchema>;

export const bgmStartEventSchema = z.object({
	id: z.number(),
	eventType: z.literal("bgmStart"),
	category: z.literal("media"),
	orderIndex: z.string(),
	bgmId: z.number(),
	loop: z.boolean(),
	volume: z.union([z.number(), z.string().transform(Number)]),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type BGMStartEvent = z.infer<typeof bgmStartEventSchema>;

export const bgmStopEventSchema = z.object({
	id: z.number(),
	eventType: z.literal("bgmStop"),
	category: z.literal("media"),
	orderIndex: z.string(),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type BGMStopEvent = z.infer<typeof bgmStopEventSchema>;

export const soundEffectEventSchema = z.object({
	id: z.number(),
	eventType: z.literal("soundEffect"),
	category: z.literal("media"),
	orderIndex: z.string(),
	volume: z.union([z.number(), z.string().transform(Number)]),
	loop: z.boolean(),
	soundEffectId: z.number(),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type SoundEffectEvent = z.infer<typeof soundEffectEventSchema>;

export const changeBackgroundEventSchema = z.object({
	id: z.number(),
	eventType: z.literal("changeBackground"),
	category: z.literal("background"),
	orderIndex: z.string(),
	backgroundId: z.number(),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type ChangeBackgroundEvent = z.infer<typeof changeBackgroundEventSchema>;

export const effectType = ["fadeIn", "fadeOut", "shake"] as const;
export const effectEventSchema = z.object({
	id: z.number(),
	eventType: z.literal("effect"),
	category: z.literal("effect"),
	orderIndex: z.string(),
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
	id: z.number(),
	eventType: z.literal("characterEffect"),
	category: z.literal("character"),
	orderIndex: z.string(),
	characterId: z.number(),
	effectType: z.enum(characterEffectType),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type CharacterEffectEvent = z.infer<typeof characterEffectEventSchema>;

export const appearCGEventSchema = z.object({
	id: z.number(),
	eventType: z.literal("appearCG"),
	category: z.literal("cg"),
	orderIndex: z.string(),
	cgImageId: z.number(),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type AppearCGEvent = z.infer<typeof appearCGEventSchema>;

export const hideCGEventSchema = z.object({
	id: z.number(),
	eventType: z.literal("hideCG"),
	category: z.literal("cg"),
	orderIndex: z.string(),
	transitionDuration: z.union([z.number(), z.string().transform(Number)]),
});

export type HideCGEvent = z.infer<typeof hideCGEventSchema>;

export const gameEventSchema = z.discriminatedUnion("eventType", [
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

const eventTypes = gameEventSchema._def.options.map(
	(v) => v.shape.eventType._def.value,
);
export const gameEventTypeSchema = z.enum(
	eventTypes as [GameEvent["eventType"], ...GameEvent["eventType"][]],
);

export type GameEventType = z.infer<typeof gameEventTypeSchema>;

export type GameEvent = z.infer<typeof gameEventSchema>;

type ExcludeCommonKeys<T> = Omit<
	T,
	"eventType" | "id" | "category" | "orderIndex"
>;
export type EventProperties = {
	[K in GameEvent as K["eventType"]]: ExcludeCommonKeys<K>;
};

export type AllPropertyTypes = {
	[K in GameEvent as K["eventType"]]: {
		[P in keyof ExcludeCommonKeys<K>]: ExcludeCommonKeys<K>[P];
	};
}[GameEvent["eventType"]];

export type UniquePropertyUnion = {
	[K in keyof AllPropertyTypes]: AllPropertyTypes[K];
};

/* ------------------------------------------------------
    GameEvent Factory Functions
------------------------------------------------------ */

export const createEvent = (
	eventType: GameEventType,
	orderIndex: string | null | undefined,
	resources: GameResources,
) => {
	const event = {
		id: randomIntId(),
		eventType,
		category: getEventCategory(eventType),
		orderIndex,
		...getDefaultValueForType(eventType, resources),
	} as GameEvent;
	return event;
};

export const getEventCategory = (
	type: GameEventType,
): GameEvent["category"] => {
	switch (type) {
		case "textRender":
		case "appearMessageWindow":
		case "hideMessageWindow":
			return "message";
		case "appearCharacter":
		case "hideCharacter":
		case "hideAllCharacters":
		case "moveCharacter":
		case "characterEffect":
			return "character";
		case "bgmStart":
		case "bgmStop":
		case "soundEffect":
			return "media";
		case "changeBackground":
			return "background";
		case "effect":
			return "effect";
		case "appearCG":
		case "hideCG":
			return "cg";
		default:
			return "message";
	}
};

export const getDefaultValueForType = (
	type: GameEventType,
	resources: GameResources,
): EventProperties[GameEventType] => {
	const defaults = {} as EventProperties[GameEventType];

	switch (type) {
		case "textRender":
			return {
				text: "テキストを入力してください",
				characterName: "",
			};
		case "appearMessageWindow":
			return {
				transitionDuration: 1000,
			};
		case "hideMessageWindow":
			return {
				transitionDuration: 1000,
			};
		case "appearCharacter": {
			//TODO: 使用履歴を見て最後に選択したキャラクターを選択する
			const characterId = Number(Object.keys(resources.character)[0]);
			const characterImageId = resources.character[characterId].images
				? Object.values(resources.character[characterId].images)[0].id
				: undefined;

			return {
				characterId,
				characterImageId,
				transitionDuration: 1000,
				scale: 1,
				position: [0, 0],
			};
		}
		case "hideCharacter":
			return {
				characterId: Number(Object.keys(resources.character)[0]),
				transitionDuration: 1000,
			};
		case "hideAllCharacters":
			return {
				transitionDuration: 1000,
			};
		case "moveCharacter":
			return {
				characterId: Number(Object.keys(resources.character)[0]),
				position: [0, 0],
				transitionDuration: 1000,
			};
		case "characterEffect":
			return {
				characterId: Number(Object.values(resources.character)[0].id),
				effectType: "shake",
				transitionDuration: 1000,
			};
		case "bgmStart":
			return {
				bgmId: Object.values(resources.bgm)[0].id,
				volume: 1,
				loop: true,
				transitionDuration: 1000,
			};
		case "bgmStop":
			return {
				transitionDuration: 1000,
			};
		case "soundEffect":
			return {
				soundEffectId: Object.values(resources.soundEffect)[0].id,
				volume: 1,
				loop: false,
				transitionDuration: 1000,
			};
		case "changeBackground":
			return {
				backgroundId: Object.values(resources.backgroundImage)[0].id,
				transitionDuration: 1000,
			};
		case "effect":
			return {
				effectType: "shake",
				transitionDuration: 1000,
			};
		case "appearCG":
			return {
				cgImageId: Object.values(resources.cgImage)[0].id,
				transitionDuration: 1000,
			};
		case "hideCG":
			return {
				transitionDuration: 1000,
			};
		default:
			return defaults;
	}
};

// fractional-indexing
export const sortEvent = (ag: GameEvent, bg: GameEvent) => {
	const EXTENDED_ALPHABET =
		"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

	const a = ag.orderIndex;
	const b = bg.orderIndex;

	const minLength = Math.min(a.length, b.length);

	for (let i = 0; i < minLength; i++) {
		const indexA = EXTENDED_ALPHABET.indexOf(a[i]);
		const indexB = EXTENDED_ALPHABET.indexOf(b[i]);

		if (indexA !== indexB) {
			return indexA - indexB;
		}
	}

	return a.length - b.length;
};
