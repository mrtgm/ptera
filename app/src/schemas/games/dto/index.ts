import type { User } from "@/schemas/users/domain/user";
import { paginationRequestSchema } from "@/server/shared/schema/request";
import { z } from "zod";
import {
	type GameResources,
	gameResourcesSchema,
} from "~/schemas/assets/domain/resoucres";
import { type Category, categorySchema } from "../domain/category";
import { type Comment, commentSchema } from "../domain/comment";
import {
	type GameEvent,
	gameEventSchema,
	gameEventTypeSchema,
} from "../domain/event";
import {
	type Game,
	type GameWithScene,
	gameSchema,
	gameWithSceneSchema,
} from "../domain/game";
import { type Scene, sceneSchema } from "../domain/scene";

// *------------------------------------------------------
//      Request Schemas
// ------------------------------------------------------ */

export const createGameRequestSchema = gameSchema.pick({
	name: true,
	description: true,
});
export type CreateGameRequest = z.infer<typeof createGameRequestSchema>;

export const updateGameRequestSchema = z.object({
	name: z.string().optional().nullable(),
	description: z.string().optional().nullable(),
	coverImageUrl: z.string().optional().nullable(),
	categoryIds: z.array(z.number()).optional().nullable(),
});

export type UpdateGameRequest = z.infer<typeof updateGameRequestSchema>;

export const updateGameStatusRequestSchema = z.object({
	status: z.enum(["draft", "published", "archived"]),
});
export type UpdateGameStatusRequest = z.infer<
	typeof updateGameStatusRequestSchema
>;

export const getGamesRequestSchema = paginationRequestSchema.merge(
	z.object({
		sort: z
			.enum(["createdAt", "likeCount", "playCount"])
			.default("createdAt")
			.optional(),
		categoryId: z.union([z.number(), z.string().transform(Number)]).optional(),
	}),
);

export type GetGamesRequest = z.infer<typeof getGamesRequestSchema>;

export const getCommentsRequestSchema = paginationRequestSchema.omit({
	sort: true,
	order: true,
});
export type GetCommentsRequest = z.infer<typeof getCommentsRequestSchema>;

export const createCommentRequestSchema = z.object({
	content: z.string().min(1).max(1000),
});

export type CreateCommentRequest = z.infer<typeof createCommentRequestSchema>;

export const createSceneRequestSchema = z.object({
	name: z.string().min(1).max(100),
	fromScene: z
		.object({
			type: z.enum(["choice", "goto", "end"]),
			id: z.number(),
			choiceId: z.number().optional(),
		})
		.optional(),
});

export type CreateSceneRequest = z.infer<typeof createSceneRequestSchema>;

export const updateSceneRequestSchema = z.object({
	name: z.string().min(1).max(100),
	sceneType: z.enum(["choice", "goto", "end"]),
	choices: z
		.array(
			z.object({
				text: z.string(),
				nextSceneId: z.number(),
			}),
		)
		.optional(),
	nextSceneId: z.number().optional(),
});

export type UpdateSceneRequest = z.infer<typeof updateSceneRequestSchema>;

export const createEventRequestSchema = z.object({
	type: gameEventTypeSchema,
	orderIndex: z.string().optional(),
});

export type CreateEventRequest = z.infer<typeof createEventRequestSchema>;

export const updateEventRequestSchema = gameEventSchema;

export type UpdateEventRequest = z.infer<typeof updateEventRequestSchema>;

export const moveEventRequestSchema = z.object({
	oldIndex: z.number().int().min(0),
	newIndex: z.number().int().min(0),
});

export type MoveEventRequest = z.infer<typeof moveEventRequestSchema>;

// *------------------------------------------------------
//      Response Schemas
// ------------------------------------------------------ */

export const countResponseSchema = z.object({
	count: z.number(),
});
export type CountResponse = z.infer<typeof countResponseSchema>;

export const gameListResponseSchema = gameSchema.merge(
	z.object({
		userId: z.number(),
		username: z.string(),
		avatarUrl: z.string().optional().nullable(),
	}),
);
export type GameListResponse = z.infer<typeof gameListResponseSchema>;
export const mapDomainToGameListResponse = (
	game: Game[],
	users: Record<string, User>,
): GameListResponse[] => {
	return game.map((v) => {
		return gameListResponseSchema.parse({
			...v,
			userId: users[v.userId].id,
			username: users[v.userId].name,
			avatarUrl: users[v.userId].avatarUrl,
		});
	});
};

export const gameResponseSchema = gameSchema;
export type GameResponse = z.infer<typeof gameResponseSchema>;
export const mapDomainToGameResponse = (game: Game): Game => {
	return gameResponseSchema.parse(game);
};

export const gameDetailResponseSchema = gameWithSceneSchema.merge(
	z.object({
		userId: z.number(),
		username: z.string(),
		avatarUrl: z.string().optional().nullable(),
	}),
);
export const mapDomainToGameDetailResponse = (
	gameWithScene: GameWithScene,
	user: User,
): GameDetailResponse => {
	console.log(gameWithScene);
	return gameDetailResponseSchema.parse({
		...gameWithScene,
		userId: user.id,
		username: user.name,
		avatarUrl: user.avatarUrl,
	});
};
export type GameDetailResponse = z.infer<typeof gameDetailResponseSchema>;

export const resourceResponseSchema = gameResourcesSchema;
export type ResourceResponse = z.infer<typeof resourceResponseSchema>;
export const mapDomainToResourceResponse = (resources: GameResources) => {
	return resourceResponseSchema.parse(resources);
};

export const sceneResponseSchema = sceneSchema;

export type SceneResponse = z.infer<typeof sceneResponseSchema>;

export const mapDomainToSceneResponse = (scene: Scene): SceneResponse => {
	return sceneResponseSchema.parse(scene);
};

export const eventResponseSchema = z
	.object({
		id: z.number(),
		eventType: z.string(),
		category: z.string(),
		orderIndex: z.string(),
	})
	.passthrough();

export type EventResponse = z.infer<typeof eventResponseSchema>;

export const mapDomainToEventResponse = (event: GameEvent): EventResponse => {
	return eventResponseSchema.parse(event);
};

export const commentResponseSchema = commentSchema;
export type CommentResponse = z.infer<typeof commentResponseSchema>;

export const mapDomainToCommentResponse = (
	comment: Comment,
): CommentResponse => {
	return commentResponseSchema.parse(comment);
};

export const categoryResponseSchema = categorySchema;
export type CategoryResponse = z.infer<typeof categoryResponseSchema>;

export const mapDomainToCategoryResponse = (
	category: Category,
): CategoryResponse => {
	return categoryResponseSchema.parse(category);
};
