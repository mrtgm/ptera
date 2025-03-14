import { randomIntId, randomUUID } from "@/server/shared/utils/id";
import { z } from "zod";
import { sceneSchema } from "./scene";

/* ------------------------------------------------------
    Game Entities
------------------------------------------------------ */

export const gameStatusSchema = z.union([
	z.literal("draft"),
	z.literal("published"),
	z.literal("archived"),
]);

export const gameSchema = z.object({
	id: z.number(),
	userId: z.number(),
	name: z.string().min(1).max(100),
	description: z.string().nullable(),
	releaseDate: z.string().nullable(),
	coverImageUrl: z.string().nullable(),
	schemaVersion: z.string(),
	status: gameStatusSchema,
	categoryIds: z.array(z.number()),
	likeCount: z.number(),
	playCount: z.number(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type Game = z.infer<typeof gameSchema>;

export const gameWithSceneSchema = z
	.object({
		scenes: z.array(sceneSchema),
		initialSceneId: z.number(),
	})
	.merge(gameSchema);

export type GameWithScene = z.infer<typeof gameWithSceneSchema>;

export const createGame = ({
	userId,
	name,
	description,
}: {
	userId: number;
	name: string;
	description: string | null | undefined;
}): Game => {
	const initial: Game = {
		id: randomIntId(),
		userId,
		name,
		description: description ?? null,
		coverImageUrl: null,
		releaseDate: null,
		categoryIds: [],
		schemaVersion: "0.1",
		status: "draft",
		createdAt: Date.now().toString(),
		updatedAt: Date.now().toString(),
		playCount: 0,
		likeCount: 0,
	};

	return initial;
};
