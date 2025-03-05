import { and, count, eq, ilike, inArray } from "drizzle-orm";
import { db } from "~/shared/infrastructure/db";
import {
	game,
	gameCategory,
	gameCategoryRelation,
	gameInitialScene,
	gamePlay,
	like,
	scene,
} from "~/shared/infrastructure/db/schema";
import type { GetGamesRequest } from "../api/validator";
import type { Game } from "../domain/entities";
import { mapGameToDomain } from "./mapper";

export interface GameRepository {
	getGames(query: GetGamesRequest): Promise<{ items: Game[]; total: number }>;
	getCategoriesByGameIds(gameIds: number[]): Promise<Record<number, string[]>>;
	getLikesByGameIds(gameIds: number[]): Promise<Record<number, number>>;
	getPlayerCountByGameIds(gameIds: number[]): Promise<Record<number, number>>;
	getInitialScenesByGameIds(gameIds: number[]): Promise<Record<number, string>>;

	// listByUserId(userId: string): Promise<Game[]>;

	// findById(id: string): Promise<Game | null>;
	// save(game: Game): Promise<void>;
	// listByOwnerId(ownerId: string): Promise<Game[]>;
}

const getCategoriesByGameIds = async (
	gameIds: number[],
): Promise<Record<number, string[]>> => {
	const categoriesQuery = await db
		.select({
			gameId: gameCategoryRelation.gameId,
			name: gameCategory.name,
		})
		.from(gameCategoryRelation)
		.innerJoin(
			gameCategory,
			eq(gameCategory.id, gameCategoryRelation.gameCategoryId),
		)
		.where(inArray(gameCategoryRelation.gameId, gameIds))
		.execute();

	return categoriesQuery.reduce(
		(acc, c) => {
			acc[c.gameId] = acc[c.gameId] || [];
			acc[c.gameId].push(c.name);
			return acc;
		},
		{} as Record<number, string[]>,
	);
};

const getLikesByGameIds = async (
	gameIds: number[],
): Promise<Record<number, number>> => {
	const likesQuery = await db
		.select({
			gameId: like.gameId,
			count: count(),
		})
		.from(like)
		.where(inArray(like.gameId, gameIds))
		.groupBy(like.gameId)
		.execute();

	return likesQuery.reduce(
		(acc, l) => {
			acc[l.gameId] = l.count;
			return acc;
		},
		{} as Record<number, number>,
	);
};

const getInitialScenesByGameIds = async (
	gameIds: number[],
): Promise<Record<number, string>> => {
	// 初期シーン情報の取得
	const initialScenesQuery = await db
		.select({
			gameId: gameInitialScene.gameId,
			publicId: scene.publicId,
		})
		.from(gameInitialScene)
		.innerJoin(scene, eq(gameInitialScene.sceneId, scene.id))
		.where(inArray(gameInitialScene.gameId, gameIds))
		.execute();

	return initialScenesQuery.reduce(
		(acc, s) => {
			acc[s.gameId] = s.publicId; // publicId
			return acc;
		},
		{} as Record<number, string>,
	);
};

const getPlayerCountByGameIds = async (
	gameIds: number[],
): Promise<Record<number, number>> => {
	const playsQuery = await db
		.select({
			gameId: gamePlay.gameId,
			count: count(),
		})
		.from(gamePlay)
		.where(inArray(gamePlay.gameId, gameIds))
		.groupBy(gamePlay.gameId)
		.execute();

	return playsQuery.reduce(
		(acc, p) => {
			acc[p.gameId] = p.count;
			return acc;
		},
		{} as Record<number, number>,
	);
};

const getGames = async (params: GetGamesRequest) => {
	const filters = [];
	if (params.q) {
		filters.push(ilike(game.name, `%${params.q}%`));
	}
	if (params.category) {
		filters.push(eq(gameCategory.name, params.category));
	}

	filters.push(eq(game.status, "published"));

	const gamesQuery = db
		.select({
			id: game.id,
			name: game.name,
			description: game.description,
			status: game.status,
			coverImageUrl: game.coverImageUrl,
			releaseDate: game.releaseDate,
			userId: game.userId,
			publicId: game.publicId,
			updatedAt: game.updatedAt,
			createdAt: game.createdAt,
		})
		.from(game)
		.leftJoin(gameCategoryRelation, eq(gameCategoryRelation.gameId, game.id))
		.leftJoin(
			gameCategory,
			eq(gameCategory.id, gameCategoryRelation.gameCategoryId),
		)
		.where(and(...filters))
		.groupBy(game.id);

	const [{ total }] = await db
		.select({ total: count() })
		.from(gamesQuery.as("games"));

	const items = await gamesQuery
		.limit(Number(params.limit))
		.offset(Number(params.offset))
		.execute();

	return {
		items: items.map((item) => {
			return mapGameToDomain(item);
		}),
		total,
	};
};

export const gameRepository: GameRepository = {
	getGames,
	getCategoriesByGameIds,
	getLikesByGameIds,
	getPlayerCountByGameIds,
	getInitialScenesByGameIds,

	// listByUserId: listGamesByUserId,
	// findById: findGameById,
	// findByPublicId: findGameByPublicId,
	// save: saveGame,
};
