import { and, eq, inArray, sql } from "drizzle-orm";
import { ENV } from "~/configs/env";
import { db } from "~/shared/infrastructure/db";
import {
	appearCgEvent,
	appearCharacterEvent,
	appearMessageWindowEvent,
	bgmStartEvent,
	bgmStopEvent,
	changeBackgroundEvent,
	characterEffectEvent,
	choice,
	choiceScene,
	effectEvent,
	endScene,
	event,
	game,
	gameCategory,
	gameCategoryRelation,
	gameInitialScene,
	gotoScene,
	hideAllCharactersEvent,
	hideCgEvent,
	hideCharacterEvent,
	hideMessageWindowEvent,
	moveCharacterEvent,
	scene,
	soundEffectEvent,
	textRenderEvent,
	user,
	userProfile,
} from "~/shared/infrastructure/db/schema";
import type { Scene as DomainScene, Game, GameEvent } from "../domain/entities";

export async function fetchCompleteGameById(publicId: string) {
	async function fetchGameData() {
		// ゲーム基本情報を取得
		const gameData = await db
			.select({
				id: game.id,
				publicId: game.publicId,
				title: game.name,
				author: game.userId,
				authorName: userProfile.name,
				authorAvatarUrl: userProfile.avatarUrl,
				description: game.description,
				releaseDate: game.releaseDate,
				coverImageUrl: game.coverImageUrl,
				status: game.status,
				createdAt: game.createdAt,
				updatedAt: game.updatedAt,
			})
			.from(game)
			.leftJoin(user, eq(game.userId, user.id))
			.leftJoin(userProfile, eq(user.id, userProfile.userId))
			.where(eq(game.publicId, publicId))
			.limit(1);

		if (gameData.length === 0) {
			return null;
		}

		const gameId = gameData[0].id;

		// 初期シーンIDを取得
		const initialSceneData = await db
			.select({
				sceneId: gameInitialScene.sceneId,
			})
			.from(gameInitialScene)
			.where(eq(gameInitialScene.gameId, gameId))
			.limit(1);

		// いいね数とプレイ数を取得
		const likesCount = await db
			.select({
				count: sql<number>`count(*)`,
			})
			.from(sql`"like"`)
			.where(sql`game_id = ${gameId}`)
			.limit(1);

		const playsCount = await db
			.select({
				count: sql<number>`count(*)`,
			})
			.from(sql`"game_play"`)
			.where(sql`game_id = ${gameId}`)
			.limit(1);

		// ジャンル（カテゴリ）を取得
		const genres = await db
			.select({
				name: gameCategory.name,
			})
			.from(gameCategory)
			.innerJoin(
				gameCategoryRelation,
				eq(gameCategory.id, gameCategoryRelation.gameCategoryId),
			)
			.where(eq(gameCategoryRelation.gameId, gameId));

		return {
			...gameData[0],
			initialSceneId: initialSceneData[0]?.sceneId || "",
			likeCount: likesCount[0]?.count || 0,
			playCount: playsCount[0]?.count || 0,
			genres: genres.map((g) => g.name),
			schemaVersion: ENV.API_VERSION,
		};
	}

	async function fetchScenes(gameId: number) {
		// シーン基本情報を取得
		const scenesData = await db
			.select({
				id: scene.id,
				title: scene.title,
			})
			.from(scene)
			.where(eq(scene.gameId, gameId));

		if (scenesData.length === 0) {
			return [];
		}

		const sceneIds = scenesData.map((s) => s.id);

		// シーンタイプ情報を取得
		const choiceScenes = await db
			.select({
				id: choiceScene.id,
				sceneId: choiceScene.sceneId,
			})
			.from(choiceScene)
			.where(inArray(choiceScene.sceneId, sceneIds));

		const gotoScenes = await db
			.select({
				sceneId: gotoScene.sceneId,
				nextSceneId: gotoScene.nextSceneId,
			})
			.from(gotoScene)
			.where(inArray(gotoScene.sceneId, sceneIds));

		const endScenes = await db
			.select({
				sceneId: endScene.sceneId,
			})
			.from(endScene)
			.where(inArray(endScene.sceneId, sceneIds));

		// 選択肢情報を取得
		const choiceSceneIds = choiceScenes.map((cs) => cs.id);
		const choices =
			choiceSceneIds.length > 0
				? await db
						.select({
							id: choice.id,
							choiceSceneId: choice.choiceSceneId,
							text: choice.text,
							nextSceneId: choice.nextSceneId,
						})
						.from(choice)
						.where(inArray(choice.choiceSceneId, choiceSceneIds))
				: [];

		// イベント情報を取得
		const events = await db
			.select({
				id: event.id,
				sceneId: event.sceneId,
				type: event.type,
				order: event.orderIndex,
			})
			.from(event)
			.where(inArray(event.sceneId, sceneIds))
			.orderBy(event.orderIndex);

		if (events.length === 0) {
			return scenesData.map((s) => ({
				...s,
				sceneType: determineSceneType(
					s.id,
					choiceScenes,
					gotoScenes,
					endScenes,
				),
				events: [],
				nextSceneId: getNextSceneId(s.id, gotoScenes),
				choices: getChoices(s.id, choiceScenes, choices),
			}));
		}

		// イベントIDを収集
		const eventIds = events.map((e) => e.id);

		// 各イベントタイプのデータを取得
		const eventDetailsMap = await fetchEventDetails(eventIds);

		// シーン情報を構築
		return scenesData.map((s) => {
			const sceneEvents = events
				.filter((e) => e.sceneId === s.id)
				.map((e) => mapEvent(e, eventDetailsMap));

			return {
				...s,
				sceneType: determineSceneType(
					s.id,
					choiceScenes,
					gotoScenes,
					endScenes,
				),
				events: sceneEvents,
				nextSceneId: getNextSceneId(s.id, gotoScenes),
				choices: getChoices(s.id, choiceScenes, choices),
			};
		});
	}

	// 各イベントタイプの詳細データを取得
	async function fetchEventDetails(eventIds: number[]) {
		if (eventIds.length === 0) return {};

		// 様々なイベントタイプのデータを並列取得
		const [
			textEvents,
			appearMessageEvents,
			hideMessageEvents,
			appearCharEvents,
			hideCharEvents,
			hideAllCharsEvents,
			moveCharEvents,
			bgmStartEvents,
			bgmStopEvents,
			soundEffectEvents,
			changeBgEvents,
			effectEvents,
			charEffectEvents,
			appearCgEvents,
			hideCgEvents,
		] = await Promise.all([
			db
				.select()
				.from(textRenderEvent)
				.where(inArray(textRenderEvent.eventId, eventIds)),
			db
				.select()
				.from(appearMessageWindowEvent)
				.where(inArray(appearMessageWindowEvent.eventId, eventIds)),
			db
				.select()
				.from(hideMessageWindowEvent)
				.where(inArray(hideMessageWindowEvent.eventId, eventIds)),
			db
				.select()
				.from(appearCharacterEvent)
				.where(inArray(appearCharacterEvent.eventId, eventIds)),
			db
				.select()
				.from(hideCharacterEvent)
				.where(inArray(hideCharacterEvent.eventId, eventIds)),
			db
				.select()
				.from(hideAllCharactersEvent)
				.where(inArray(hideAllCharactersEvent.eventId, eventIds)),
			db
				.select()
				.from(moveCharacterEvent)
				.where(inArray(moveCharacterEvent.eventId, eventIds)),
			db
				.select()
				.from(bgmStartEvent)
				.where(inArray(bgmStartEvent.eventId, eventIds)),
			db
				.select()
				.from(bgmStopEvent)
				.where(inArray(bgmStopEvent.eventId, eventIds)),
			db
				.select()
				.from(soundEffectEvent)
				.where(inArray(soundEffectEvent.eventId, eventIds)),
			db
				.select()
				.from(changeBackgroundEvent)
				.where(inArray(changeBackgroundEvent.eventId, eventIds)),
			db
				.select()
				.from(effectEvent)
				.where(inArray(effectEvent.eventId, eventIds)),
			db
				.select()
				.from(characterEffectEvent)
				.where(inArray(characterEffectEvent.eventId, eventIds)),
			db
				.select()
				.from(appearCgEvent)
				.where(inArray(appearCgEvent.eventId, eventIds)),
			db
				.select()
				.from(hideCgEvent)
				.where(inArray(hideCgEvent.eventId, eventIds)),
		]);

		// イベントの詳細情報をマッピング
		const detailsMap: Record<string, any> = {};

		// テキストイベント
		for (const e of textEvents) {
			detailsMap[e.eventId] = {
				type: "text",
				category: "message",
				text: e.text,
				characterName: e.characterName,
			};
		}

		// メッセージウィンドウ表示イベント
		for (const e of appearMessageEvents) {
			detailsMap[e.eventId] = {
				type: "appearMessageWindow",
				category: "message",
				transitionDuration: Number(e.transitionDuration),
			};
		}

		// メッセージウィンドウ非表示イベント
		for (const e of hideMessageEvents) {
			detailsMap[e.eventId] = {
				type: "hideMessageWindow",
				category: "message",
				transitionDuration: Number(e.transitionDuration),
			};
		}

		// キャラクター表示イベント
		for (const e of appearCharEvents) {
			detailsMap[e.eventId] = {
				type: "appearCharacter",
				category: "character",
				characterId: e.characterId,
				characterImageId: e.characterImageId,
				position: e.position,
				scale: Number(e.scale),
				transitionDuration: Number(e.transitionDuration),
			};
		}

		// キャラクター非表示イベント
		for (const e of hideCharEvents) {
			detailsMap[e.eventId] = {
				type: "hideCharacter",
				category: "character",
				characterId: e.characterId,
				transitionDuration: Number(e.transitionDuration),
			};
		}

		// すべてのキャラクター非表示イベント
		for (const e of hideAllCharsEvents) {
			detailsMap[e.eventId] = {
				type: "hideAllCharacters",
				category: "character",
				transitionDuration: Number(e.transitionDuration),
			};
		}

		// キャラクター移動イベント
		for (const e of moveCharEvents) {
			detailsMap[e.eventId] = {
				type: "moveCharacter",
				category: "character",
				characterId: e.characterId,
				position: e.position,
				scale: Number(e.scale),
			};
		}

		// BGM開始イベント
		for (const e of bgmStartEvents) {
			detailsMap[e.eventId] = {
				type: "bgmStart",
				category: "media",
				bgmId: e.bgmId,
				loop: e.loop,
				volume: Number(e.volume),
				transitionDuration: Number(e.transitionDuration),
			};
		}

		// BGM停止イベント
		for (const e of bgmStopEvents) {
			detailsMap[e.eventId] = {
				type: "bgmStop",
				category: "media",
				transitionDuration: Number(e.transitionDuration),
			};
		}

		// 効果音イベント
		for (const e of soundEffectEvents) {
			detailsMap[e.eventId] = {
				type: "soundEffect",
				category: "media",
				soundEffectId: e.soundEffectId,
				volume: Number(e.volume),
				loop: e.loop,
				transitionDuration: Number(e.transitionDuration),
			};
		}

		// 背景変更イベント
		for (const e of changeBgEvents) {
			detailsMap[e.eventId] = {
				type: "changeBackground",
				category: "background",
				backgroundId: e.backgroundId,
				transitionDuration: Number(e.transitionDuration),
			};
		}

		// エフェクトイベント
		for (const e of effectEvents) {
			detailsMap[e.eventId] = {
				type: "effect",
				category: "effect",
				effectType: e.effectType,
				transitionDuration: Number(e.transitionDuration),
			};
		}

		// キャラクターエフェクトイベント
		for (const e of charEffectEvents) {
			detailsMap[e.eventId] = {
				type: "characterEffect",
				category: "character",
				characterId: e.characterId,
				effectType: e.effectType,
				transitionDuration: Number(e.transitionDuration),
			};
		}

		// CG表示イベント
		for (const e of appearCgEvents) {
			detailsMap[e.eventId] = {
				type: "appearCG",
				category: "cg",
				cgImageId: e.cgImageId,
				position: e.position,
				scale: Number(e.scale),
				transitionDuration: Number(e.transitionDuration),
			};
		}

		// CG非表示イベント
		for (const e of hideCgEvents) {
			detailsMap[e.eventId] = {
				type: "hideCG",
				category: "cg",
				transitionDuration: Number(e.transitionDuration),
			};
		}

		return detailsMap;
	}

	// ヘルパー関数
	function determineSceneType(
		sceneId: number,
		choiceScenes: { id: number; sceneId: number }[],
		gotoScenes: { sceneId: number; nextSceneId: number | null }[],
		endScenes: { sceneId: number }[],
	): "choice" | "goto" | "end" {
		if (choiceScenes.some((cs) => cs.sceneId === sceneId)) return "choice";
		if (gotoScenes.some((gs) => gs.sceneId === sceneId)) return "goto";
		if (endScenes.some((es) => es.sceneId === sceneId)) return "end";
		return "end";
	}

	function getNextSceneId(
		sceneId: number,
		gotoScenes: { sceneId: number; nextSceneId: number | null }[],
	): number | undefined {
		const scene = gotoScenes.find((gs) => gs.sceneId === sceneId);
		return scene?.nextSceneId || undefined;
	}

	function getChoices(
		sceneId: number,
		choiceScenes: { id: number; sceneId: number }[],
		choices: {
			id: number;
			choiceSceneId: number;
			text: string;
			nextSceneId: number | null;
		}[],
	) {
		const choiceScene = choiceScenes.find((cs) => cs.sceneId === sceneId);
		if (!choiceScene) return undefined;

		return choices
			.filter((c) => c.choiceSceneId === choiceScene.id)
			.map((c) => ({
				id: c.id,
				text: c.text,
				nextSceneId: c.nextSceneId || "",
			}));
	}

	function mapEvent(
		eventBase: { id: number; type: string; order: string },
		detailsMap: Record<string, any>,
	): GameEvent {
		const details = detailsMap[eventBase.id] || {};

		return {
			id: eventBase.id,
			type: eventBase.type as any,
			category: details.category || "unknown",
			order: eventBase.order,
			...details,
		};
	}

	// メインロジック
	const gameData = await fetchGameData();
	if (!gameData) return null;

	const scenes = await fetchScenes(gameData.id);

	return {
		...gameData,
		scenes,
	};
}
