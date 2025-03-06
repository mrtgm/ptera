import { z } from "zod";
import { randomIntId, randomUUID } from "~/shared/utils/id";

/* ------------------------------------------------------
    Asset Entities
------------------------------------------------------ */
export const mediaAssetSchema = z.object({
	id: z.number(),
	publicId: z.string(),
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
    Character Entities
------------------------------------------------------ */
export const characterSchema = z.object({
	id: z.number(),
	publicId: z.string(),
	name: z.string(),
	images: z.record(z.string(), characterImageSchema),
});
export type Character = z.infer<typeof characterSchema>;

/* ------------------------------------------------------
    GameResources Entities
------------------------------------------------------ */
export const gameResourcesSchema = z.object({
	characters: z.record(z.string(), characterSchema),
	backgroundImages: z.record(z.string(), backgroundImageSchema),
	soundEffects: z.record(z.string(), soundEffectSchema),
	bgms: z.record(z.string(), bgmSchema),
	cgImages: z.record(z.string(), cgImageSchema),
});
export type GameResources = z.infer<typeof gameResourcesSchema>;

const createCharacter = (name: string): Character => ({
	id: randomIntId(),
	publicId: randomUUID(),
	name,
	images: {},
});
