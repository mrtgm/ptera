import { z } from "zod";
import {
	assetTypeSchema,
	characterSchema,
	mediaAssetSchema,
} from "../domain/resoucres";

export const createAssetSchema = mediaAssetSchema
	.pick({
		name: true,
		assetType: true,
		metadata: true,
	})
	.extend({
		file: z.instanceof(File),
	});

export type CreateAssetRequest = z.infer<typeof createAssetSchema>;

export const updateAssetSchema = mediaAssetSchema.pick({
	name: true,
	metadata: true,
});

export type UpdateAssetRequest = z.infer<typeof updateAssetSchema>;

export const assetResponseSchema = mediaAssetSchema;

export type AssetResponse = z.infer<typeof assetResponseSchema>;

export const createCharacterSchema = characterSchema.pick({
	name: true,
});

export type CreateCharacterRequest = z.infer<typeof createCharacterSchema>;

export const updateCharacterSchema = characterSchema.pick({
	name: true,
});

export type UpdateCharacterRequest = z.infer<typeof updateCharacterSchema>;

export const characterResponseSchema = characterSchema;
export type CharacterResponse = z.infer<typeof characterResponseSchema>;

// キャラクターとアセットの関連付け
export const assetCharacterLinkSchema = z.object({
	assetId: z.number(),
});

export type AssetCharacterLinkRequest = z.infer<
	typeof assetCharacterLinkSchema
>;
