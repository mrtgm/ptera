import { z } from "zod";

export const assetParamSchema = z.object({ assetId: z.number() });
export const characterParamSchema = z.object({
	characterId: z.number(),
});
export const assetCharacterLinkParamSchema = z.object({
	characterId: z.number(),
	assetId: z.number(),
});
