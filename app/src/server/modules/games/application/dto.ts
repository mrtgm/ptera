import type { User } from "@/server/modules/users/domain/entities";
import { paginationRequestSchema } from "@/server/shared/schema/request";
import { z } from "zod";
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
import { type GameResources, gameResourcesSchema } from "../domain/resoucres";
import type { Scene } from "../domain/scene";

// *------------------------------------------------------
//      Request DTOs
// ------------------------------------------------------ */

export const createGameDtoSchema = gameSchema.pick({
	name: true,
	description: true,
});
export type CreateGameDto = z.infer<typeof createGameDtoSchema>;

export const updateGameDtoSchema = z.object({
	name: z.string().optional().nullable(),
	description: z.string().optional().nullable(),
	coverImageUrl: z.string().optional().nullable(),
	categoryIds: z.array(z.number()).optional().nullable(),
});

export type UpdateGameDto = z.infer<typeof updateGameDtoSchema>;

export const updateGameStatusDtoSchema = z.object({
	status: z.enum(["draft", "published", "archived"]),
});
export type UpdateGameStatusDto = z.infer<typeof updateGameStatusDtoSchema>;

export const getGamesRequstSchema = paginationRequestSchema.merge(
	z.object({
		sort: z
			.enum(["createdAt", "likeCount", "playCount"])
			.default("createdAt")
			.optional(),
		categoryId: z.union([z.number(), z.string().transform(Number)]).optional(),
	}),
);
export type GetGamesRequest = z.infer<typeof getGamesRequstSchema>;

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
//      Response DTOs
// ------------------------------------------------------ */

export const countResponseDtoSchema = z.object({
	count: z.number(),
});
export type CountResponseDto = z.infer<typeof countResponseDtoSchema>;

export const gameListResponseDtoSchema = gameSchema.merge(
	z.object({
		userPublicId: z.string(),
		username: z.string(),
		avatarUrl: z.string().optional().nullable(),
	}),
);
export type GameListResponseDto = z.infer<typeof gameListResponseDtoSchema>;
export const mapDomainToListResponseDto = (
	game: Game[],
	users: Record<string, User>,
): GameListResponseDto[] => {
	return game.map((v) => {
		return gameListResponseDtoSchema.parse({
			...v,
			userPublicId: users[v.userId].publicId,
			username: users[v.userId].name,
			avatarUrl: users[v.userId].avatarUrl,
		});
	});
};

export const gameResponseDtoSchema = gameSchema;
export type GameResponseDto = z.infer<typeof gameResponseDtoSchema>;
export const mapDomainToResponseDto = (game: Game): Game => {
	return gameResponseDtoSchema.parse(game);
};

export const gameDetailResponseDtoSchema = gameWithSceneSchema.merge(
	z.object({
		userPublicId: z.string(),
		username: z.string(),
		avatarUrl: z.string().optional().nullable(),
	}),
);
export const mapDomainToDetailResponseDto = (
	gameWithScene: GameWithScene,
	user: User,
): GameDetailResponseDto => {
	console.log(gameWithScene);
	return gameDetailResponseDtoSchema.parse({
		...gameWithScene,
		userPublicId: user.publicId,
		username: user.name,
		avatarUrl: user.avatarUrl,
	});
};
export type GameDetailResponseDto = z.infer<typeof gameDetailResponseDtoSchema>;

export const resourseResponseDtoSchema = gameResourcesSchema;
export type ResourceResponseDto = z.infer<typeof resourseResponseDtoSchema>;
export const mapDomainToResourceResponseDto = (resources: GameResources) => {
	return resourseResponseDtoSchema.parse(resources);
};

export const sceneResponseDtoSchema = z.object({
	id: z.number(),
	publicId: z.string(),
	name: z.string(),
	gameId: z.number(),
	sceneType: z.enum(["choice", "goto", "end"]),
	nextSceneId: z.number().optional(),
	choices: z
		.array(
			z.object({
				text: z.string(),
				nextSceneId: z.number().optional(),
			}),
		)
		.optional(),
	events: z.array(z.any()).optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type SceneResponseDto = z.infer<typeof sceneResponseDtoSchema>;

export const mapDomainToSceneResponseDto = (scene: Scene): SceneResponseDto => {
	return sceneResponseDtoSchema.parse(scene);
};

export const eventResponseDtoSchema = z
	.object({
		id: z.number(),
		publicId: z.string(),
		eventType: z.string(),
		category: z.string(),
		orderIndex: z.string(),
	})
	.passthrough(); // パススルーで汎用的に使用

export type EventResponseDto = z.infer<typeof eventResponseDtoSchema>;

export const mapDomainToEventResponseDto = (
	event: GameEvent,
): EventResponseDto => {
	return eventResponseDtoSchema.parse(event);
};

export const commentResponseDtoSchema = commentSchema;
export type CommentResponseDto = z.infer<typeof commentResponseDtoSchema>;

export const mapDomainToCommentResponseDto = (
	comment: Comment,
): CommentResponseDto => {
	return commentResponseDtoSchema.parse(comment);
};
