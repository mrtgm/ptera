import { randomIntId, randomUUID } from "@/server/shared/utils/id";
import { z } from "zod";

/* ------------------------------------------------------
    Asset Entities
------------------------------------------------------ */
export const assetTypeSchema = z.union([
	z.literal("bgm"),
	z.literal("soundEffect"),
	z.literal("backgroundImage"),
	z.literal("cgImage"),
	z.literal("characterImage"),
]);
export type AssetType = z.infer<typeof assetTypeSchema>;

export const mediaAssetSchema = z.object({
	id: z.number(),
	assetType: assetTypeSchema,
	name: z.string().max(255),
	url: z.string(),
	metadata: z.any().optional(),
});
export type MediaAsset = z.infer<typeof mediaAssetSchema>;

export const characterImageSchema = mediaAssetSchema.extend({
	assetType: z.literal("characterImage"),
});
export type CharacterImage = z.infer<typeof characterImageSchema>;

export const backgroundImageSchema = mediaAssetSchema.extend({
	assetType: z.literal("backgroundImage"),
});
export type BackgroundImage = z.infer<typeof backgroundImageSchema>;

export const cgImageSchema = mediaAssetSchema.extend({
	assetType: z.literal("cgImage"),
});
export type CGImage = z.infer<typeof cgImageSchema>;

export const soundEffectSchema = mediaAssetSchema.extend({
	assetType: z.literal("soundEffect"),
});
export type SoundEffect = z.infer<typeof soundEffectSchema>;

export const bgmSchema = mediaAssetSchema.extend({
	assetType: z.literal("bgm"),
});
export type BGM = z.infer<typeof bgmSchema>;

/* ------------------------------------------------------
    Character Entities
------------------------------------------------------ */
export const characterSchema = z.object({
	id: z.number(),
	name: z.string().min(1).max(100),
	images: z.record(z.string(), characterImageSchema).optional(),
});
export type Character = z.infer<typeof characterSchema>;

/* ------------------------------------------------------
    GameResources Entities
------------------------------------------------------ */
export const gameResourcesSchema = z.object({
	character: z.record(z.string(), characterSchema),
	backgroundImage: z.record(z.string(), backgroundImageSchema),
	soundEffect: z.record(z.string(), soundEffectSchema),
	bgm: z.record(z.string(), bgmSchema),
	cgImage: z.record(z.string(), cgImageSchema),
});
export type GameResources = z.infer<typeof gameResourcesSchema>;

export const createCharacter = (name: string): Character => ({
	id: randomIntId(),
	name,
	images: {},
});

export const createAsset = (
	assetType: AssetType,
	name: string,
	url: string,
	metadata?: Record<string, Record<string, unknown>>,
): MediaAsset => ({
	id: randomIntId(),
	assetType,
	name,
	url,
	metadata,
});
