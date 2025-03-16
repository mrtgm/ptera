import { db } from "@/server/shared/infrastructure/db";
import {
	choice,
	choiceScene,
	endScene,
	event,
	gameInitialScene,
	gotoScene,
	scene,
} from "@/server/shared/infrastructure/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { unionAll } from "drizzle-orm/pg-core";
import { generateKeyBetween } from "fractional-indexing";
import {
	InitialSceneCannotBeDeletedError,
	SceneNotFoundError,
} from "~/schemas/games/domain/error";
import {
	type Choice,
	type Scene,
	createEndScene,
} from "~/schemas/games/domain/scene";
import type {
	CreateEventRequest,
	CreateSceneRequest,
	UpdateSceneRequest,
	UpdateSceneSettingRequest,
} from "~/schemas/games/dto";
import { BaseRepository, type Transaction } from "./base";
import { EventRepository } from "./event";

export class SceneRepository extends BaseRepository {
	async getSceneById(sceneId: number, tx?: Transaction): Promise<Scene> {
		const sceneData = await (tx ?? this.db)
			.select()
			.from(scene)
			.where(eq(scene.id, sceneId))
			.limit(1)
			.execute();

		if (sceneData.length === 0) {
			throw new SceneNotFoundError(sceneId);
		}

		const eventRepository = new EventRepository();
		const events = await eventRepository.getEventsBySceneId(sceneId, tx);

		const choiceSceneData = await (tx ?? this.db)
			.select()
			.from(choiceScene)
			.where(eq(choiceScene.sceneId, sceneId))
			.limit(1)
			.execute();

		const gotoSceneData = await (tx ?? this.db)
			.select()
			.from(gotoScene)
			.where(eq(gotoScene.sceneId, sceneId))
			.limit(1)
			.execute();

		if (choiceSceneData.length > 0) {
			const choices = await (tx ?? this.db)
				.select()
				.from(choice)
				.where(eq(choice.choiceSceneId, choiceSceneData[0].id))
				.execute();

			return {
				...sceneData[0],
				sceneType: "choice",
				choices: choices.map((c) => ({
					id: c.id,
					text: c.text,
					nextSceneId: c.nextSceneId,
				})),
				events,
			};
		}

		if (gotoSceneData.length > 0) {
			return {
				...sceneData[0],
				sceneType: "goto",
				nextSceneId: gotoSceneData[0].nextSceneId,
				events,
			};
		}

		return {
			...sceneData[0],
			sceneType: "end",
			events,
		};
	}

	async getScenes(gameId: number): Promise<Scene[] | null> {
		const scenes = await this.db
			.select()
			.from(scene)
			.leftJoin(choiceScene, eq(scene.id, choiceScene.sceneId))
			.leftJoin(endScene, eq(scene.id, endScene.sceneId))
			.leftJoin(gotoScene, eq(scene.id, gotoScene.sceneId))
			.where(eq(scene.gameId, gameId))
			.execute();

		if (scenes.length === 0) {
			throw new SceneNotFoundError(gameId);
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
			.filter((v) => v !== null && v !== undefined) as number[];

		const choices =
			choiceSceneIds.length > 0
				? await this.db
						.select({
							id: choice.id,
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
						text: c.text,
						nextSceneId: c.nextSceneId,
					}));
			}
		}
		return sceneDatas;
	}

	async createScene({
		params: { name, fromScene, gameId, userId, choiceId },
		tx,
	}: {
		params: {
			gameId: number;
			userId: number;
			name: string;
			fromScene?: CreateSceneRequest["fromScene"];
			choiceId?: number;
		};
		tx?: Transaction;
	}): Promise<Scene> {
		return await this.executeTransaction(async (txLocal) => {
			const sceneData = createEndScene({
				name,
			});

			const createdScene = await txLocal
				.insert(scene)
				.values({
					name,
					gameId,
				})
				.returning();

			const eventRepository = new EventRepository();
			const event = await eventRepository.createEvent({
				params: {
					gameId,
					sceneId: createdScene[0].id,
					type: "textRender",
					orderIndex: generateKeyBetween(null, null),
					userId,
				},
				tx,
			});

			// 作成時は最初はエンドシーン
			await this.createEndScene({
				params: { sceneId: createdScene[0].id },
				tx: txLocal,
			});

			if (fromScene) {
				// まず削除
				await Promise.all([
					txLocal
						.delete(choiceScene)
						.where(eq(choiceScene.sceneId, fromScene.id)),
					txLocal.delete(gotoScene).where(eq(gotoScene.sceneId, fromScene.id)),
					txLocal.delete(endScene).where(eq(endScene.sceneId, fromScene.id)),
				]);

				if (fromScene.sceneType === "choice" && choiceId) {
					const updatedChoices = fromScene.choices?.map((c) => {
						if (c.id === choiceId) {
							return {
								...c,
								nextSceneId: createdScene[0].id,
							};
						}
						return c;
					});
					if (!updatedChoices) {
						throw new Error("choiceId is not found in choices");
					}
					const choiceSceneData = await txLocal
						.insert(choiceScene)
						.values({
							sceneId: fromScene.id,
						})
						.returning();
					for (const choiceData of updatedChoices) {
						if (!choiceData.nextSceneId) {
							throw new Error("nextSceneId is required for choice");
						}
						await txLocal.insert(choice).values({
							text: choiceData.text,
							nextSceneId: choiceData.nextSceneId,
							choiceSceneId: choiceSceneData[0].id,
						});
					}
				} else if (fromScene.sceneType === "goto") {
					await txLocal.insert(gotoScene).values({
						sceneId: fromScene.id,
						nextSceneId: createdScene[0].id,
					});
				} else if (fromScene.sceneType === "end") {
					await txLocal.insert(gotoScene).values({
						sceneId: fromScene.id,
						nextSceneId: createdScene[0].id,
					});
				}
			}

			return {
				...sceneData,
				id: createdScene[0].id,
				gameId,
				createdAt: createdScene[0].createdAt,
				updatedAt: createdScene[0].updatedAt,
				events: [event],
			};
		}, tx);
	}

	async updateSceneSetting({
		sceneId,
		params,
		tx,
	}: {
		sceneId: number;
		params: UpdateSceneSettingRequest;
		tx?: Transaction;
	}): Promise<Scene> {
		return await this.executeTransaction(async (txLocal) => {
			const updatedScene = await txLocal
				.update(scene)
				.set({
					name: params.name,
					updatedAt: sql.raw("NOW()"),
				})
				.where(eq(scene.id, sceneId))
				.returning();
			return await this.getSceneById(sceneId, txLocal);
		}, tx);
	}

	async updateScene({
		sceneId,
		params: { sceneType, nextSceneId, choices },
		tx,
	}: {
		sceneId: number;
		params: UpdateSceneRequest;
		tx?: Transaction;
	}): Promise<Scene> {
		return await this.executeTransaction(async (txLocal) => {
			// 関連するすべての派生タイプのレコードを削除
			const choiceSceneRecord = await txLocal
				.select()
				.from(choiceScene)
				.where(eq(choiceScene.sceneId, sceneId))
				.limit(1)
				.execute();

			if (choiceSceneRecord.length > 0) {
				// choiceSceneに関連する選択肢を削除
				await txLocal
					.delete(choice)
					.where(eq(choice.choiceSceneId, choiceSceneRecord[0].id));
				// choiceSceneを削除
				await txLocal
					.delete(choiceScene)
					.where(eq(choiceScene.id, choiceSceneRecord[0].id));
			}
			await txLocal.delete(gotoScene).where(eq(gotoScene.sceneId, sceneId));
			await txLocal.delete(endScene).where(eq(endScene.sceneId, sceneId));

			// 新しいシーンタイプに応じてレコードを作成
			switch (sceneType) {
				case "choice": {
					if (!choices) {
						throw new Error("choices are required for choice scene");
					}
					if (choices.length === 0) {
						throw new Error("choices are required for choice scene");
					}
					await this.createChoiceScene({
						params: {
							sceneId,
							choices,
						},
						tx: txLocal,
					});
					break;
				}

				case "goto": {
					if (!nextSceneId) {
						throw new Error("nextSceneId is required for goto scene");
					}
					await this.createGotoScene({
						params: {
							sceneId: sceneId,
							nextSceneId,
						},
						tx: txLocal,
					});
					break;
				}

				case "end": {
					await this.createEndScene({
						params: {
							sceneId,
						},
						tx: txLocal,
					});
					break;
				}
			}

			return await this.getSceneById(sceneId, txLocal);
		}, tx);
	}

	async deleteScene({
		params: { sceneId, gameId },
		tx,
	}: {
		params: { gameId: number; sceneId: number };
		tx?: Transaction;
	}): Promise<void> {
		return await this.executeTransaction(async (txLocal) => {
			const sceneData = await txLocal
				.select()
				.from(scene)
				.where(eq(scene.id, sceneId))
				.limit(1)
				.execute();

			if (sceneData.length === 0) {
				throw new SceneNotFoundError(sceneId);
			}

			// 初期シーンかどうか確認
			const initialScene = await txLocal
				.select()
				.from(gameInitialScene)
				.where(
					and(
						eq(gameInitialScene.gameId, gameId),
						eq(gameInitialScene.sceneId, sceneId),
					),
				)
				.limit(1)
				.execute();

			if (initialScene.length > 0) {
				throw new InitialSceneCannotBeDeletedError(gameId);
			}

			// 依存関係の削除
			// 選択肢シーンの場合削除
			const referencingChoices = await txLocal
				.select()
				.from(choice)
				.where(eq(choice.nextSceneId, sceneId))
				.execute();

			for (const c of referencingChoices) {
				await txLocal.delete(choice).where(eq(choice.id, c.id));
			}

			// Gotoシーンの場合、シーンのタイプをendに変更
			const referencingGotoScenes = await txLocal
				.select({
					gotoId: gotoScene.id,
					sceneId: gotoScene.sceneId,
				})
				.from(gotoScene)
				.where(eq(gotoScene.nextSceneId, sceneId))
				.execute();

			for (const gs of referencingGotoScenes) {
				await txLocal.delete(gotoScene).where(eq(gotoScene.id, gs.gotoId));
				await txLocal.insert(endScene).values({
					sceneId: gs.sceneId,
				});
			}

			// シーンの保持するイベント詳細を削除
			const eventRepository = new EventRepository();
			const sceneEvents = await txLocal
				.select()
				.from(event)
				.where(eq(event.sceneId, sceneId))
				.execute();

			for (const ev of sceneEvents) {
				await eventRepository.deleteEventDetail(ev.id, ev.eventType, txLocal);
			}

			// シーンのイベントを削除
			await txLocal.delete(event).where(eq(event.sceneId, sceneId));

			// シーンタイプを削除
			await txLocal.delete(choiceScene).where(eq(choiceScene.sceneId, sceneId));
			await txLocal.delete(gotoScene).where(eq(gotoScene.sceneId, sceneId));
			await txLocal.delete(endScene).where(eq(endScene.sceneId, sceneId));

			// 最後にシーン自体を削除
			await txLocal.delete(scene).where(eq(scene.id, sceneId));
		}, tx);
	}

	async createEndScene({
		params: { sceneId },
		tx,
	}: {
		params: { sceneId: number };
		tx?: Transaction;
	}): Promise<void> {
		await (tx ?? this.db).insert(endScene).values({
			sceneId,
		});
	}

	async createChoiceScene({
		params: { sceneId, choices },
		tx,
	}: {
		params: {
			sceneId: number;
			choices: {
				text: string;
				nextSceneId: number;
			}[];
		};
		tx?: Transaction;
	}): Promise<void> {
		await this.executeTransaction(async (txLocal) => {
			const createdChoiceScene = await txLocal
				.insert(choiceScene)
				.values({
					sceneId,
				})
				.returning();

			const createdChoices = choices.map((choice) => {
				return {
					...choice,
					choiceSceneId: createdChoiceScene[0].id,
				};
			});

			await txLocal.insert(choice).values(createdChoices);
		}, tx);
	}

	async createGotoScene({
		params: { sceneId, nextSceneId },
		tx,
	}: {
		params: { sceneId: number; nextSceneId: number };
		tx?: Transaction;
	}): Promise<void> {
		await (tx ?? this.db).insert(gotoScene).values({
			sceneId,
			nextSceneId,
		});
	}

	async createInitialScene({
		params: { gameId, sceneId },
		tx,
	}: {
		params: { gameId: number; sceneId: number };
		tx?: Transaction;
	}): Promise<void> {
		await (tx ?? this.db).insert(gameInitialScene).values({
			gameId,
			sceneId,
		});
	}
}
