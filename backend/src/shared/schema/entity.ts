import { z } from "zod";

// TODO: Define the entity type
export const entityTypeSchema = z.union([
	z.literal("user"),
	z.literal("game"),
	z.literal("gameInitialScene"),
	z.literal("scene"),
	z.literal("choiceScene"),
	z.literal("gotoScene"),
	z.literal("endScene"),
]);

export type EntityType = z.infer<typeof entityTypeSchema>;
