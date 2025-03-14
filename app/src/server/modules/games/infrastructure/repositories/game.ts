import { ENV } from "@/configs/env";
import {
	game,
	gameCategory,
	gameCategoryRelation,
	gamePlay,
	like,
	user,
} from "@/server/shared/infrastructure/db/schema";
import { and, count, eq, ilike, sql } from "drizzle-orm";
import { GameNotFoundError } from "~/schemas/games/domain/error";
import { type Game, createGame } from "~/schemas/games/domain/game";
import type { GetGamesRequest, UpdateGameRequest } from "~/schemas/games/dto";
import { domainToPersitence } from "../mapper";
import { BaseRepository, type Transaction } from "./base";
import { StatisticsRepository } from "./statistic";

export class GameRepository extends BaseRepository {
	async getGameById(gamePublicId: string, tx?: Transaction): Promise<Game> {
		return await this.executeTransaction(async (txLocal) => {
			const gameData = await txLocal
				.select({
					id: game.id,
					publicId: game.publicId,
					name: game.name,
					userId: game.userId,
					description: game.description,
					releaseDate: game.releaseDate,
					coverImageUrl: game.coverImageUrl,
					status: game.status,
					createdAt: game.createdAt,
					updatedAt: game.updatedAt,
				})
				.from(game)
				.where(eq(game.publicId, gamePublicId))
				.limit(1)
				.execute();

			if (gameData.length === 0) {
				throw new GameNotFoundError(gamePublicId);
			}

			const categoryIds = (
				await txLocal
					.select({
						id: gameCategory.id,
						name: gameCategory.name,
					})
					.from(gameCategory)
					.innerJoin(
						gameCategoryRelation,
						eq(gameCategory.id, gameCategoryRelation.gameCategoryId),
					)
					.where(eq(gameCategoryRelation.gameId, gameData[0].id))
					.execute()
			).map((v) => v.id);

			const likeCount = (
				await txLocal
					.select({ count: count() })
					.from(like)
					.where(eq(like.gameId, gameData[0].id))
			)[0].count;

			const playCount = (
				await txLocal
					.select({ count: count() })
					.from(gamePlay)
					.where(eq(gamePlay.gameId, gameData[0].id))
					.limit(1)
			)[0].count;

			return {
				...gameData[0],
				status: gameData[0].status as Game["status"],
				schemaVersion: ENV.API_VERSION,
				likeCount,
				playCount,
				categoryIds,
			};
		}, tx);
	}

	async createGame({
		params: { name, description, userId },
		tx,
	}: {
		params: { name: string; description: string | null; userId: number };
		tx?: Transaction;
	}): Promise<Game> {
		return await this.executeTransaction(async (txLocal) => {
			const gameData = createGame({
				userId,
				name,
				description,
			});
			const persistableData = domainToPersitence(gameData);
			const res = (
				await txLocal.insert(game).values(persistableData).returning()
			)[0];

			return {
				...gameData,
				id: res.id,
				publicId: res.publicId,
				createdAt: res.createdAt,
				updatedAt: res.updatedAt,
			};
		}, tx);
	}

	async updateGameStatus({
		params,
		tx,
	}: {
		params: { gamePublicId: string; status: Game["status"] };
		tx?: Transaction;
	}): Promise<Game> {
		return await this.executeTransaction(async (txLocal) => {
			const gameId = await this.getGameIdFromPublicId(
				params.gamePublicId,
				txLocal,
			);

			await txLocal
				.update(game)
				.set({
					status: params.status,
					releaseDate: params.status === "published" ? sql.raw("NOW()") : null,
					updatedAt: sql.raw("NOW()"),
				})
				.where(eq(game.id, gameId));

			const updatedGame = await this.getGameById(params.gamePublicId, txLocal);
			if (!updatedGame) {
				throw new GameNotFoundError(params.gamePublicId);
			}
			return updatedGame;
		}, tx);
	}

	async updateGame({
		gamePublicId,
		params,
		tx,
	}: {
		gamePublicId: string;
		params: UpdateGameRequest;
		tx?: Transaction;
	}): Promise<Game> {
		return await this.executeTransaction(async (txLocal) => {
			const gameId = await this.getGameIdFromPublicId(gamePublicId, txLocal);

			await txLocal
				.update(game)
				.set({
					...(params.name ? { name: params.name } : {}),
					...(params.description ? { description: params.description } : {}),
					...(params.coverImageUrl
						? { coverImageUrl: params.coverImageUrl }
						: {}),
					updatedAt: sql.raw("NOW()"),
				})
				.where(eq(game.id, gameId));

			if (params.categoryIds) {
				await txLocal
					.delete(gameCategoryRelation)
					.where(and(eq(gameCategoryRelation.gameId, gameId)));
				for (const categoryId of params.categoryIds) {
					await txLocal.insert(gameCategoryRelation).values({
						gameId,
						gameCategoryId: categoryId,
					});
				}
			}

			const updatedGame = await this.getGameById(gamePublicId, txLocal);
			if (!updatedGame) {
				throw new GameNotFoundError(gamePublicId);
			}
			return updatedGame;
		}, tx);
	}

	async deleteGame({
		params,
		tx,
	}: {
		params: { gamePublicId: string };
		tx?: Transaction;
	}): Promise<void> {
		return await this.executeTransaction(async (txLocal) => {
			const gameId = await this.getGameIdFromPublicId(
				params.gamePublicId,
				txLocal,
			);
			await txLocal.delete(game).where(eq(game.id, gameId));
		}, tx);
	}

	async getGamesByUserId(userId: number): Promise<Game[]> {
		const items = await this.db
			.select({
				id: game.id,
				publicId: game.publicId,
				name: game.name,
				userId: game.userId,
				description: game.description,
				coverImageUrl: game.coverImageUrl,
				releaseDate: game.releaseDate,
				status: game.status,
				createdAt: game.createdAt,
				updatedAt: game.updatedAt,
			})
			.from(game)
			.where(eq(game.userId, userId))
			.execute()
			.then((v) =>
				v.map((game) => ({
					...game,
					status: game.status as Game["status"],
					categoryIds: [] as number[],
					playCount: 0,
					likeCount: 0,
					schemaVersion: ENV.API_VERSION,
				})),
			);

		const gameIds = items.map((v) => v.id);

		const statisticsRepository = new StatisticsRepository();

		const [likeCountByGameId, playCountByGameId, categoriesByGameId] =
			await Promise.all([
				statisticsRepository.getLikes(gameIds),
				statisticsRepository.getPlayerCounts(gameIds),
				statisticsRepository.getCategoryIds(gameIds),
			]);

		for (const item of items) {
			item.categoryIds = categoriesByGameId[item.id] || [];
			item.playCount = playCountByGameId[item.id] || 0;
			item.likeCount = likeCountByGameId[item.id] || 0;
		}

		return items;
	}

	async getGames(
		filter: GetGamesRequest,
	): Promise<{ items: Game[]; total: number }> {
		const filters = [];
		if (filter.q) {
			filters.push(ilike(game.name, `%${filter.q}%`));
		}
		if (filter.categoryId) {
			filters.push(eq(gameCategoryRelation.gameCategoryId, filter.categoryId));
		}

		filters.push(eq(game.status, "published"));

		const gamesQuery = this.db
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

		const [{ total }] = await this.db
			.select({ total: count() })
			.from(gamesQuery.as("games"));

		const items: Game[] = await gamesQuery
			.limit(Number(filter.limit))
			.offset(Number(filter.offset))
			.execute()
			.then((v) =>
				v.map((game) => ({
					...game,
					status: game.status as Game["status"],
					categoryIds: [],
					playCount: 0,
					likeCount: 0,
					schemaVersion: ENV.API_VERSION,
				})),
			);

		const gameIds = items.map((v) => v.id);

		const statisticsRepository = new StatisticsRepository();

		const [likeCountByGameId, playCountByGameId, categoriesByGameId] =
			await Promise.all([
				statisticsRepository.getLikes(gameIds),
				statisticsRepository.getPlayerCounts(gameIds),
				statisticsRepository.getCategoryIds(gameIds),
			]);

		for (const item of items) {
			item.categoryIds = categoriesByGameId[item.id] || [];
			item.playCount = playCountByGameId[item.id] || 0;
			item.likeCount = likeCountByGameId[item.id] || 0;
		}

		items.sort((a, b) => {
			const first = filter.order === "asc" ? a : b;
			const second = filter.order === "asc" ? b : a;

			if (filter.sort === "likeCount") {
				return (first.likeCount || 0) - (second.likeCount || 0);
			}
			if (filter.sort === "playCount") {
				return (first.playCount || 0) - (second.playCount || 0);
			}
			if (filter.sort === "createdAt") {
				return (
					new Date(first.createdAt).getTime() -
					new Date(second.createdAt).getTime()
				);
			}
			return 0;
		});

		return {
			items,
			total,
		};
	}
}
