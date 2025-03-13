import {
	gameCategory,
	gameCategoryRelation,
	gameInitialScene,
	gamePlay,
	like,
	scene,
} from "@/server/shared/infrastructure/db/schema";
import { and, count, eq, inArray } from "drizzle-orm";
import type { CountResponseDto } from "../../application/dto";
import { BaseRepository } from "./base";

export class StatisticsRepository extends BaseRepository {
	async getGameInitialScenes(
		gameIds: number[],
	): Promise<Record<number, number>> {
		// 複数のゲーム ID に対して、それぞれのゲームの初期シーンを取得

		const initialScenes = await this.db
			.select({
				id: scene.id,
				gameId: gameInitialScene.gameId,
			})
			.from(gameInitialScene)
			.innerJoin(scene, eq(gameInitialScene.sceneId, scene.id))
			.where(inArray(gameInitialScene.gameId, gameIds))
			.limit(1)
			.execute();

		return initialScenes.reduce(
			(acc, cur) => {
				if (!cur) {
					return acc;
				}
				acc[cur.gameId] = cur.id;
				return acc;
			},
			{} as Record<number, number>,
		);
	}

	async getLikes(gameIds: number[]): Promise<Record<number, number>> {
		// 複数のゲーム ID に対して、それぞれのゲームのいいね数を取得

		const likeCounts = await this.db
			.select({
				gameId: like.gameId,
				count: count(),
			})
			.from(like)
			.where(inArray(like.gameId, gameIds))
			.groupBy(like.gameId)
			.execute();

		return likeCounts.reduce(
			(acc, cur) => {
				acc[cur.gameId] = cur.count;
				return acc;
			},
			{} as Record<number, number>,
		);
	}

	async getCategoryIds(gameIds: number[]): Promise<Record<number, number[]>> {
		// 複数のゲーム ID に対して、それぞれのゲームのカテゴリ ID を取得

		const categories = await this.db
			.select({
				gameId: gameCategoryRelation.gameId,
				id: gameCategory.id,
				name: gameCategory.name,
			})
			.from(gameCategory)
			.innerJoin(
				gameCategoryRelation,
				eq(gameCategory.id, gameCategoryRelation.gameCategoryId),
			)
			.where(inArray(gameCategoryRelation.gameId, gameIds))
			.execute();

		return categories.reduce(
			(acc, cur) => {
				if (!acc[cur.gameId]) {
					acc[cur.gameId] = [];
				}
				acc[cur.gameId].push(cur.id);
				return acc;
			},
			{} as Record<number, number[]>,
		);
	}

	async getPlayerCounts(gameIds: number[]): Promise<Record<number, number>> {
		// 複数のゲーム ID に対して、それぞれのゲームのプレイ回数を取得

		const playCounts = await this.db
			.select({
				gameId: gamePlay.gameId,
				count: count(),
			})
			.from(gamePlay)
			.where(inArray(gamePlay.gameId, gameIds))
			.groupBy(gamePlay.gameId)
			.execute();

		return playCounts.reduce(
			(acc, cur) => {
				acc[cur.gameId] = cur.count;
				return acc;
			},
			{} as Record<number, number>,
		);
	}

	async playGame(
		gamePublicId: string,
		userId: number | null | undefined,
		guestId: string | null | undefined,
	): Promise<CountResponseDto> {
		const gameId = await this.getGameIdFromPublicId(gamePublicId);
		await this.db
			.insert(gamePlay)
			.values({
				gameId,
				userId,
				guestId,
			})
			.onConflictDoNothing(); // 既にプレイ済みの場合は何もしない

		const playCount = await this.db
			.select({ count: count() })
			.from(gamePlay)
			.where(eq(gamePlay.gameId, gameId))
			.execute();

		return {
			count: playCount[0].count,
		};
	}

	async likeGame(
		gamePublicId: string,
		userId: number,
	): Promise<CountResponseDto> {
		const gameId = await this.getGameIdFromPublicId(gamePublicId);
		await this.db
			.insert(like)
			.values({
				gameId,
				userId,
			})
			.onConflictDoNothing(); // 既にいいね済みの場合は何もしない

		const likeCount = await this.db
			.select({ count: count() })
			.from(like)
			.where(eq(like.gameId, gameId))
			.execute();

		return {
			count: likeCount[0].count,
		};
	}

	async unlikeGame(
		gamePublicId: string,
		userId: number,
	): Promise<CountResponseDto> {
		const gameId = await this.getGameIdFromPublicId(gamePublicId);
		await this.db
			.delete(like)
			.where(and(eq(like.gameId, gameId), eq(like.userId, userId)));

		const likeCount = await this.db
			.select({ count: count() })
			.from(like)
			.where(eq(like.gameId, gameId))
			.execute();

		return {
			count: likeCount[0].count,
		};
	}
}
