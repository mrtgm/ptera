import { z } from "zod";
import type { User } from "~/modules/users/domain/entities";
import {
	type Game,
	type GameWithScene,
	gameSchema,
	gameStatusSchema,
	gameWithSceneSchema,
} from "../domain/game";
import { type GameResources, gameResourcesSchema } from "../domain/resoucres";

// *------------------------------------------------------
//      Request DTOs
// ------------------------------------------------------ */

export const createGameDtoSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().optional(),
});

export type CreateGameDto = z.infer<typeof createGameDtoSchema>;

export const updateGameDtoSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	description: z.string().optional(),
	status: gameStatusSchema.optional(),
});

export type UpdateGameDto = z.infer<typeof updateGameDtoSchema>;

export const gameListResponseDtoSchema = gameSchema.omit({ id: true }).merge(
	z.object({
		userPublicId: z.string(),
		username: z.string(),
		avatarUrl: z.string().optional(),
	}),
);

// *------------------------------------------------------
//      Response DTOs
// ------------------------------------------------------ */

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
		avatarUrl: z.string().optional(),
	}),
);
export const mapDomainToDetailResponseDto = (
	gameWithScene: GameWithScene,
	user: User,
): GameDetailResponseDto => {
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
