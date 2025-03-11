import { and, count, eq, ilike, inArray, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { ENV } from "@/server/configs/env";
import { db } from "@/server/shared/infrastructure/db";
import { likeRelations } from "@/server/shared/infrastructure/db/relations";
import {
	appearCgEvent,
	appearCharacterEvent,
	appearMessageWindowEvent,
	asset,
	assetGame,
	bgmStartEvent,
	bgmStopEvent,
	changeBackgroundEvent,
	character,
	characterAsset,
	characterEffectEvent,
	characterGame,
	choice,
	choiceScene,
	effectEvent,
	endScene,
	event,
	game,
	gameCategory,
	gameCategoryRelation,
	gameInitialScene,
	gamePlay,
	gotoScene,
	hideAllCharactersEvent,
	hideCgEvent,
	hideCharacterEvent,
	hideMessageWindowEvent,
	like,
	moveCharacterEvent,
	scene,
	soundEffectEvent,
	textRenderEvent,
} from "@/server/shared/infrastructure/db/schema";
import type { GetGamesRequest } from "../api/validator";
import { GameNotFoundError } from "../domain/error";
import { type GameEvent, sortEvent } from "../domain/event";
import type { Game } from "../domain/game";
import type { Character, GameResources, MediaAsset } from "../domain/resoucres";
import type { Scene } from "../domain/scene";

export interface GameRepository {
	getGameById: (gamePublicId: string) => Promise<Game | null>;
	getResource: (gameId: number) => Promise<GameResources>;
	getScenes: (gameId: number) => Promise<Scene[] | null>;
	getEvents: (sceneIds: number[]) => Promise<Record<number, GameEvent[]>>;

	getGames: (
		filter: GetGamesRequest,
	) => Promise<{ items: Game[]; total: number }>;
	getGameInitialScenes: (gameIds: number[]) => Promise<Record<number, number>>;
	getLikes: (gameIds: number[]) => Promise<Record<number, number>>;
	getCategoryIds: (gameIds: number[]) => Promise<Record<number, number[]>>;
	getPlayerCounts: (gameIds: number[]) => Promise<Record<number, number>>;

	getGameIdFromPublicId: (gamePublicId: string) => Promise<number>;
	playGame: (gamePublicId: string, userId: number) => Promise<void>;
	likeGame: (gamePublicId: string, userId: number) => Promise<void>;
	unlikeGame: (gamePublicId: string, userId: number) => Promise<void>;

	// createGame: (game: Game) => Promise<Game>;
	// updateGame: (game: Game) => Promise<Game>;
	// deleteGame: (gameId: string) => Promise<void>;
}

export const gameRepository: GameRepository = {
	getResource: async (gameId: number) => {
		const characters = await db
			.select({
				id: character.id,
				publicId: character.publicId,
				name: character.name,
			})
			.from(characterGame)
			.innerJoin(character, eq(character.id, characterGame.characterId))
			.where(eq(characterGame.gameId, gameId))
			.execute();

		const characterAssets = await db
			.select({
				characterId: characterAsset.characterId,
				assetId: characterAsset.assetId,
				assetPublicId: asset.publicId,
				filename: asset.name,
				url: asset.url,
				metadata: asset.metadata,
			})
			.from(characterAsset)
			.innerJoin(asset, eq(characterAsset.assetId, asset.id))
			.where(
				inArray(
					characterAsset.characterId,
					characters.map((v) => v.id),
				),
			)
			.execute();

		const characterAssetsMap = characterAssets.reduce(
			(acc, cur) => {
				if (!acc[cur.characterId]) {
					acc[cur.characterId] = {};
				}
				acc[cur.characterId][cur.assetPublicId] = {
					id: cur.assetId,
					publicId: cur.assetPublicId,
					filename: cur.filename,
					url: cur.url,
					metadata: cur.metadata as Record<string, unknown>,
				};
				return acc;
			},
			{} as Record<number, Record<string, MediaAsset>>,
		);

		const charactersMap = characters
			.map((v) => ({
				...v,
				images: characterAssetsMap[v.id],
			}))
			.reduce(
				(acc, cur) => {
					acc[cur.publicId] = cur;
					return acc;
				},
				{} as Record<string, Character>,
			);

		const usedAssets = await db
			.select({
				id: asset.id,
				publicId: asset.publicId,
				type: asset.assetType,
				filename: asset.name,
				url: asset.url,
				metadata: asset.metadata,
			})
			.from(assetGame)
			.innerJoin(asset, eq(asset.id, assetGame.assetId))
			.where(eq(assetGame.gameId, gameId))
			.execute();

		const bgms = usedAssets.filter((v) => v.type === "bgm");
		const soundEffects = usedAssets.filter((v) => v.type === "soundEffect");
		const backgroundImages = usedAssets.filter(
			(v) => v.type === "backgroundImage",
		);
		const cgImages = usedAssets.filter((v) => v.type === "cgImage");

		const bgmsMap = bgms.reduce(
			(acc, cur) => {
				acc[cur.publicId] = cur as MediaAsset;
				return acc;
			},
			{} as Record<string, MediaAsset>,
		);

		const soundEffectsMap = soundEffects.reduce(
			(acc, cur) => {
				acc[cur.publicId] = cur as MediaAsset;
				return acc;
			},
			{} as Record<string, MediaAsset>,
		);

		const backgroundImagesMap = backgroundImages.reduce(
			(acc, cur) => {
				acc[cur.publicId] = cur as MediaAsset;
				return acc;
			},
			{} as Record<string, MediaAsset>,
		);

		const cgImagesMap = cgImages.reduce(
			(acc, cur) => {
				acc[cur.publicId] = cur as MediaAsset;
				return acc;
			},
			{} as Record<string, MediaAsset>,
		);

		return {
			characters: charactersMap,
			bgms: bgmsMap,
			soundEffects: soundEffectsMap,
			backgroundImages: backgroundImagesMap,
			cgImages: cgImagesMap,
		};
	},

	getGames: async (filter) => {
		const filters = [];
		if (filter.q) {
			filters.push(ilike(game.name, `%${filter.q}%`));
		}
		if (filter.categoryId) {
			filters.push(eq(gameCategoryRelation.gameCategoryId, filter.categoryId));
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

		const items: Game[] = await gamesQuery
			.limit(Number(filter.limit))
			.offset(Number(filter.offset))
			.execute()
			.then((v) =>
				v
					.map((game) => ({
						...game,
						status: game.status as Game["status"],
						categoryIds: [],
						playCount: 0,
						likeCount: 0,
						schemaVersion: ENV.API_VERSION,
					}))
					.sort((a, b) => {
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
					}),
			);

		const gameIds = items.map((v) => v.id);
		const [likeCountByGameId, playCountByGameId, categoriesByGameId] =
			await Promise.all([
				gameRepository.getLikes(gameIds),
				gameRepository.getPlayerCounts(gameIds),
				gameRepository.getCategoryIds(gameIds),
			]);

		for (const item of items) {
			item.categoryIds = categoriesByGameId[item.id] || [];
			item.playCount = playCountByGameId[item.id] || 0;
			item.likeCount = likeCountByGameId[item.id] || 0;
		}

		return {
			items,
			total,
		};
	},

	getGameInitialScenes: async (gameIds) => {
		const initialScenes = await db
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
	},

	getLikes: async (gameIds: number[]) => {
		const likeCounts = await db
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
	},

	getCategoryIds: async (gameIds: number[]) => {
		const categories = await db
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
	},

	getPlayerCounts: async (gameIds: number[]) => {
		const playCounts = await db
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
	},

	getGameById: async (gamePublicId) => {
		const gameData = await db
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
			await db
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
			await db
				.select({ count: count() })
				.from(like)
				.where(eq(like.gameId, gameData[0].id))
		)[0].count;

		const playCount = (
			await db
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
	},

	getScenes: async (gameId) => {
		const scenes = await db
			.select()
			.from(scene)
			.leftJoin(choiceScene, eq(scene.id, choiceScene.sceneId))
			.leftJoin(endScene, eq(scene.id, endScene.sceneId))
			.leftJoin(gotoScene, eq(scene.id, gotoScene.sceneId))
			.where(eq(scene.gameId, gameId))
			.execute();

		if (scenes.length === 0) {
			return null;
		}

		const sceneDatas: Scene[] = scenes.map(
			({ choice_scene, goto_scene, scene }) => {
				if (choice_scene) {
					return {
						...scene,
						sceneType: "choice",
						choices: [], // 後で注入
						events: [], // 後で注入
					};
				}
				if (goto_scene) {
					return {
						...scene,
						sceneType: "goto",
						nextSceneId: goto_scene.nextSceneId,
						events: [],
					};
				}
				return {
					...scene,
					sceneType: "end",
					events: [],
				};
			},
		);

		const choiceSceneIds = scenes
			.map(({ choice_scene }) => choice_scene?.id)
			.filter((v) => v !== null) as number[];

		const choices =
			choiceSceneIds.length > 0
				? await db
						.select({
							id: choice.id,
							publicId: choice.publicId,
							text: choice.text,
							nextSceneId: choice.nextSceneId,
							choiceSceneId: choice.choiceSceneId,
							sceneId: choiceScene.sceneId,
						})
						.from(choice)
						.leftJoin(choiceScene, eq(choice.choiceSceneId, choiceScene.id))
						.where(inArray(choice.choiceSceneId, choiceSceneIds))
				: [];

		for (const sceneData of sceneDatas) {
			if (sceneData.sceneType === "choice") {
				sceneData.choices = choices
					.filter((c) => c.sceneId === sceneData.id)
					.map((c) => ({
						id: c.id,
						publicId: c.publicId,
						text: c.text,
						nextSceneId: c.nextSceneId,
					}));
			}
		}
		return sceneDatas;
	},
	getEvents: async (sceneIds) => {
		const events = await db
			.select()
			.from(event)
			.where(inArray(event.sceneId, sceneIds))
			.execute();

		const eventIds = events.map((v) => v.id);
		const eventDbSchemas = [
			textRenderEvent,
			appearMessageWindowEvent,
			hideMessageWindowEvent,
			appearCharacterEvent,
			hideCharacterEvent,
			hideAllCharactersEvent,
			moveCharacterEvent,
			bgmStartEvent,
			bgmStopEvent,
			soundEffectEvent,
			changeBackgroundEvent,
			effectEvent,
			characterEffectEvent,
			appearCgEvent,
			hideCgEvent,
		];

		const eventDetailMap = (
			await Promise.all(
				eventDbSchemas.map(async (schema) => {
					const events = await db
						.select()
						.from(schema)
						.where(inArray(schema.eventId, eventIds))
						.execute();
					return events;
				}),
			).then((v) => v.flat())
		).reduce(
			(acc, cur) => {
				acc[cur.eventId] = cur;
				return acc;
			},
			{} as Record<
				number,
				Omit<GameEvent, "publicId" | "type" | "category" | "orderIndex">
			>,
		);

		const eventMap: Record<number, GameEvent[]> = {};
		for (const event of events) {
			if (!eventMap[event.sceneId]) {
				eventMap[event.sceneId] = [];
			}

			const eventDetail = eventDetailMap[event.id];
			const gameEvent = {
				...eventDetail,
				id: event.id,
				publicId: event.publicId,
				type: event.evnetType as GameEvent["type"],
				category: event.category,
				orderIndex: event.orderIndex,
			} as GameEvent;

			eventMap[event.sceneId].push(gameEvent);
		}

		for (const id of sceneIds) {
			eventMap[id] = (eventMap[id] || []).sort(sortEvent);
		}

		return eventMap;
	},

	getGameIdFromPublicId: async (gamePublicId: string) => {
		const gameId = (
			await db
				.select({
					id: game.id,
				})
				.from(game)
				.where(eq(game.publicId, gamePublicId))
				.limit(1)
				.execute()
		)[0].id;

		if (!gameId) {
			throw new GameNotFoundError(gamePublicId);
		}

		return gameId;
	},

	playGame: async (gamePublicId, userId) => {
		const gameId = await gameRepository.getGameIdFromPublicId(gamePublicId);
		await db.insert(gamePlay).values({
			gameId,
			userId,
		});
	},

	likeGame: async (gamePublicId, userId) => {
		const gameId = await gameRepository.getGameIdFromPublicId(gamePublicId);
		await db.insert(like).values({
			gameId,
			userId,
		});
	},

	unlikeGame: async (gamePublicId, userId) => {
		const gameId = await gameRepository.getGameIdFromPublicId(gamePublicId);
		await db
			.delete(like)
			.where(and(eq(like.gameId, gameId), eq(like.userId, userId)));
	},
};
