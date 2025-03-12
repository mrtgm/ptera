import { z } from "zod";
import { scene } from "@/server/shared/infrastructure/db/schema";
import { randomIntId, randomUUID } from "@/server/shared/utils/id";
import { createEvent } from "./event";
import type { GameResources } from "./resoucres";
import { createScene, sceneSchema } from "./scene";

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
	publicId: z.string(),
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

const hasInitialScene = (
	game: Game,
): game is Game & { initialSceneId: number } => {
	return "initialSceneId" in game;
};

export const gameWithSceneSchema = z
	.object({
		scenes: z.array(sceneSchema),
		initialSceneId: z.number(),
	})
	.merge(gameSchema);

export type GameWithScene = z.infer<typeof gameWithSceneSchema>;

export const createGameWithScene = ({
	userId,
	name,
	description,
	resources,
}: {
	userId: number;
	name: string;
	description: string;
	resources: GameResources;
}): GameWithScene => {
	const initial: GameWithScene = {
		id: randomIntId(),
		publicId: randomUUID(),
		userId,
		name,
		description,
		initialSceneId: randomIntId(),
		coverImageUrl: null,
		releaseDate: null,
		categoryIds: [],
		schemaVersion: "0.1",
		status: "draft",
		createdAt: Date.now().toString(),
		updatedAt: Date.now().toString(),
		playCount: 0,
		likeCount: 0,
		scenes: [],
	};

	initial.scenes = [
		createScene({
			id: initial.initialSceneId,
			name: "最初のシーン",
		}),
	];

	initial.scenes[0].events = [createEvent("text", resources)];
	return initial;
};
