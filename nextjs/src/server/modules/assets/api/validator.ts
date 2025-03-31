import { z } from "zod";

export const assetParamSchema = z.object({
  assetId: z.union([z.number(), z.string().transform(Number)]),
});
export const characterParamSchema = z.object({
  characterId: z.union([z.number(), z.string().transform(Number)]),
});
export const assetCharacterLinkParamSchema = z.object({
  characterId: z.union([z.number(), z.string().transform(Number)]),
  assetId: z.union([z.number(), z.string().transform(Number)]),
});

export const unlinkGameAssetSchema = z.object({
  gameId: z.union([z.number(), z.string().transform(Number)]),
  assetId: z.union([z.number(), z.string().transform(Number)]),
});

export const unlinkGameCharacterSchema = z.object({
  gameId: z.union([z.number(), z.string().transform(Number)]),
  characterId: z.union([z.number(), z.string().transform(Number)]),
});
