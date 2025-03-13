import { paginationRequestSchema } from "@/server/shared/schema/request";
import { z } from "zod";
import { gameEventSchema, gameEventTypeSchema } from "../domain/event";

export const gameParamSchema = z.object({ gameId: z.string().uuid() });
export const commentParamSchema = z.object({
	gameId: z.string().uuid(),
	commentId: z.string().uuid(),
});
export const sceneParamSchema = z.object({
	gameId: z.string().uuid(),
	sceneId: z.string().uuid(),
});
export const eventParamSchema = z.object({
	gameId: z.string().uuid(),
	sceneId: z.string().uuid(),
	eventId: z.string().uuid(),
});
