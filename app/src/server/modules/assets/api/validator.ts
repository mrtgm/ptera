import { z } from "zod";

export const assetParamSchema = z.object({ assetId: z.string().uuid() });
export const characterParamSchema = z.object({
	characterId: z.string().uuid(),
});
export const assetCharacterLinkParamSchema = z.object({
	characterId: z.string().uuid(),
	assetId: z.string().uuid(),
});
