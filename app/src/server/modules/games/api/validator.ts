import { z } from "zod";

export const gameParamSchema = z.object({ gameId: z.number() });
export const commentParamSchema = z.object({
	gameId: z.number(),
	commentId: z.number(),
});
export const sceneParamSchema = z.object({
	gameId: z.number(),
	sceneId: z.number(),
});
export const eventParamSchema = z.object({
	gameId: z.number(),
	sceneId: z.number(),
	eventId: z.number(),
});
