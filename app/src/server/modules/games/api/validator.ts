import { z } from "zod";

export const gameParamSchema = z.object({
	gameId: z.union([z.number(), z.string().transform(Number)]),
});
export const commentParamSchema = z.object({
	gameId: z.union([z.number(), z.string().transform(Number)]),
	commentId: z.union([z.number(), z.string().transform(Number)]),
});
export const sceneParamSchema = z.object({
	gameId: z.union([z.number(), z.string().transform(Number)]),
	sceneId: z.union([z.number(), z.string().transform(Number)]),
});
export const eventParamSchema = z.object({
	gameId: z.union([z.number(), z.string().transform(Number)]),
	sceneId: z.union([z.number(), z.string().transform(Number)]),
	eventId: z.union([z.number(), z.string().transform(Number)]),
});
