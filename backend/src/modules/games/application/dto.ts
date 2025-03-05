import { z } from "zod";
import { userResponseDtoSchema } from "~/modules/users/application/dto";
import { type Game, checkStatus, gameStatusSchema } from "../domain/entities";
import type { GameRowSelect } from "../infrastructure/mapper";

export const createGameDtoSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().optional(),
	isPublic: z.boolean().optional().default(false),
});

export type CreateGameDto = z.infer<typeof createGameDtoSchema>;

export const updateGameDtoSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	description: z.string().optional(),
	status: gameStatusSchema.optional(),
	isPublic: z.boolean().optional(),
});

export type UpdateGameDto = z.infer<typeof updateGameDtoSchema>;

export const gameResponseDtoSchema = z.object({
	name: z.string(),
	publicId: z.string(),
	coverImageUrl: z.string().optional(),
	description: z.string().optional(),
	releaseDate: z.string().optional(),
	initialScenePublicId: z.string().optional(),
	status: gameStatusSchema,
	likeCount: z.number().optional(),
	playCount: z.number().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
	categories: z.array(z.string()).optional(),
	userPublicId: z.string(),
	username: z.string(),
	avatarUrl: z.string().optional(),
});

export const mapGameToResponseDto = (
	game: GameRowSelect,
	initialScenePublicId?: string,
	likeCount?: number,
	playCount?: number,
	categories?: string[],
	userInfo?: { publicId: string; name: string; avatarUrl: string | null },
): GameResponseDto => {
	return {
		name: game.name,
		publicId: game.publicId,
		coverImageUrl: game.coverImageUrl || undefined,
		description: game.description || undefined,
		releaseDate: game.releaseDate || undefined,
		initialScenePublicId: initialScenePublicId,
		status: checkStatus(game.status) ? game.status : "draft",
		likeCount: likeCount || 0,
		playCount: playCount || 0,
		createdAt: game.createdAt,
		updatedAt: game.updatedAt,
		categories: categories,
		userPublicId: userInfo?.publicId || "",
		username: userInfo?.name || "",
		avatarUrl: userInfo?.avatarUrl || undefined,
	};
};

export type GameResponseDto = z.infer<typeof gameResponseDtoSchema>;
