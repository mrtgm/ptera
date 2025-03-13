import { z } from "zod";
import { assetTypeSchema } from "../domain/resoucres";

// アセット関連のスキーマ
export const createAssetSchema = z.object({
	file: z.any(), // ファイルアップロード用
	assetType: assetTypeSchema,
	name: z.string().min(1).max(100),
	metadata: z.record(z.any()).optional(),
});

export type CreateAssetRequest = z.infer<typeof createAssetSchema>;

export const updateAssetSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	metadata: z.record(z.any()).optional(),
});

export type UpdateAssetRequest = z.infer<typeof updateAssetSchema>;

export const assetResponseSchema = z.object({
	id: z.number(),
	publicId: z.string(),
	assetType: assetTypeSchema,
	name: z.string(),
	url: z.string(),
	metadata: z.record(z.any()).optional(),
});

export type AssetResponse = z.infer<typeof assetResponseSchema>;

// キャラクター関連のスキーマ
export const createCharacterSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().optional(),
});

export type CreateCharacterRequest = z.infer<typeof createCharacterSchema>;

export const updateCharacterSchema = z.object({
	name: z.string().min(1).max(100).optional(),
});

export type UpdateCharacterRequest = z.infer<typeof updateCharacterSchema>;

export const characterResponseSchema = z.object({
	id: z.number(),
	publicId: z.string(),
	name: z.string(),
	description: z.string().optional().nullable(),
	assets: z.array(assetResponseSchema).optional(),
});

export type CharacterResponse = z.infer<typeof characterResponseSchema>;

// キャラクターとアセットの関連付け
export const assetCharacterLinkSchema = z.object({
	assetId: z.string(),
});

export type AssetCharacterLinkRequest = z.infer<
	typeof assetCharacterLinkSchema
>;
