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

export const createGameDtoSchema = gameSchema.pick({
	name: true,
	description: true,
});
export type CreateGameDto = z.infer<typeof createGameDtoSchema>;

export const updateGameDtoSchema = gameSchema.pick({
	name: true,
	description: true,
});
export type UpdateGameDto = z.infer<typeof updateGameDtoSchema>;

// *------------------------------------------------------
//      Response DTOs
// ------------------------------------------------------ */

export const gameListResponseDtoSchema = gameSchema.merge(
	z.object({
		userPublicId: z.string(),
		username: z.string(),
		avatarUrl: z.string().optional(),
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
