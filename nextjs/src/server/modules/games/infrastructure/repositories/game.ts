import {
  game,
  gameCategory,
  gameCategoryRelation,
  gamePlay,
  like,
  user,
  userProfile,
} from "@/server/shared/infrastructure/db/schema";
import { ENV } from "@ptera/config";
import {
  type Game,
  type GameMetaDataResponse,
  GameNotFoundError,
  type GetGamesRequest,
  type UpdateGameRequest,
  createGame,
} from "@ptera/schema";
import { and, count, eq, ilike, or, sql } from "drizzle-orm";
import { domainToPersitence } from "../mapper";
import { BaseRepository, type Transaction } from "./base";
import { StatisticsRepository } from "./statistic";

export class GameRepository extends BaseRepository {
  async getGameMetadataById(
    gameId: number,
    tx?: Transaction,
  ): Promise<GameMetaDataResponse | null> {
    return await this.executeTransaction(async (txLocal) => {
      const gameData = await txLocal
        .select({
          id: game.id,
          name: game.name,
          description: game.description,
          coverImageUrl: game.coverImageUrl,
        })
        .from(game)
        .where(eq(game.id, gameId))
        .execute();
      if (gameData.length === 0) {
        return null;
      }
      return {
        ...gameData[0],
      };
    }, tx);
  }

  async getGameById(gameId: number, tx?: Transaction): Promise<Game> {
    return await this.executeTransaction(async (txLocal) => {
      const gameWithCounts = await txLocal
        .select({
          id: game.id,
          name: game.name,
          userId: game.userId,
          description: game.description,
          releaseDate: game.releaseDate,
          coverImageUrl: game.coverImageUrl,
          status: game.status,
          createdAt: game.createdAt,
          updatedAt: game.updatedAt,
          likeCount: sql<number>`count(distinct ${like.id})`,
          playCount: sql<number>`count(distinct ${gamePlay.id})`,
        })
        .from(game)
        .leftJoin(like, eq(like.gameId, game.id))
        .leftJoin(gamePlay, eq(gamePlay.gameId, game.id))
        .where(eq(game.id, gameId))
        .groupBy(
          game.id,
          game.name,
          game.userId,
          game.description,
          game.releaseDate,
          game.coverImageUrl,
          game.status,
          game.createdAt,
          game.updatedAt,
        )
        .execute();

      if (gameWithCounts.length === 0) {
        throw new GameNotFoundError(gameId);
      }

      const categories = await txLocal
        .select({
          id: gameCategory.id,
        })
        .from(gameCategoryRelation)
        .innerJoin(
          gameCategory,
          eq(gameCategory.id, gameCategoryRelation.gameCategoryId),
        )
        .where(eq(gameCategoryRelation.gameId, gameId))
        .execute();

      const categoryIds = categories.map((category) => category.id);

      return {
        ...gameWithCounts[0],
        status: gameWithCounts[0].status as Game["status"],
        schemaVersion: ENV.NEXT_PUBLIC_API_VERSION,
        categoryIds,
      };
    }, tx);
  }

  async getLikedGamesByUserId(userId: number): Promise<number[]> {
    return await this.db
      .select({
        gameId: like.gameId,
      })
      .from(like)
      .where(eq(like.userId, userId))
      .execute()
      .then((v) => v.map((v) => v.gameId));
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
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      };
    }, tx);
  }

  async updateGameStatus({
    params: { gameId, status },
    tx,
  }: {
    params: { gameId: number; status: Game["status"] };
    tx?: Transaction;
  }): Promise<Game> {
    return await this.executeTransaction(async (txLocal) => {
      await txLocal
        .update(game)
        .set({
          status: status,
          releaseDate: status === "published" ? sql.raw("NOW()") : null,
          updatedAt: sql.raw("NOW()"),
        })
        .where(eq(game.id, gameId));

      const updatedGame = await this.getGameById(gameId, txLocal);
      if (!updatedGame) {
        throw new GameNotFoundError(gameId);
      }
      return updatedGame;
    }, tx);
  }

  async updateGame({
    gameId,
    params,
    tx,
  }: {
    gameId: number;
    params: UpdateGameRequest;
    tx?: Transaction;
  }): Promise<Game> {
    return await this.executeTransaction(async (txLocal) => {
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

      const updatedGame = await this.getGameById(gameId, txLocal);
      if (!updatedGame) {
        throw new GameNotFoundError(gameId);
      }
      return updatedGame;
    }, tx);
  }

  async deleteGame({
    params: { gameId },
    tx,
  }: {
    params: { gameId: number };
    tx?: Transaction;
  }): Promise<void> {
    return await this.executeTransaction(async (txLocal) => {
      await txLocal.delete(game).where(eq(game.id, gameId));
    }, tx);
  }

  async getGamesByUserId(
    userId: number,
    onlyPublished = true,
  ): Promise<Game[]> {
    const conditions = [eq(game.userId, userId)];

    if (onlyPublished) {
      conditions.push(eq(game.status, "published"));
    }

    const items = await this.db
      .select({
        id: game.id,
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
      .where(and(...conditions))
      .execute()
      .then((v) =>
        v.map((game) => ({
          ...game,
          status: game.status as Game["status"],
          categoryIds: [] as number[],
          playCount: 0,
          likeCount: 0,
          schemaVersion: ENV.NEXT_PUBLIC_API_VERSION,
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
      filters.push(
        or(
          ilike(game.name, `%${filter.q}%`),
          ilike(userProfile.name, `%${filter.q}%`),
        ),
      );
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
        userName: userProfile.name,
        userId: game.userId,
        updatedAt: game.updatedAt,
        createdAt: game.createdAt,
      })
      .from(game)
      .leftJoin(user, eq(user.id, game.userId))
      .leftJoin(userProfile, eq(userProfile.userId, user.id))
      .leftJoin(gameCategoryRelation, eq(gameCategoryRelation.gameId, game.id))
      .leftJoin(
        gameCategory,
        eq(gameCategory.id, gameCategoryRelation.gameCategoryId),
      )
      .where(and(...filters))
      .groupBy(game.id, userProfile.name);

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
          schemaVersion: ENV.NEXT_PUBLIC_API_VERSION,
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
