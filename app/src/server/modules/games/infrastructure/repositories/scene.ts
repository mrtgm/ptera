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
import type {
	CreateEventRequest,
	CreateSceneRequest,
	UpdateSceneRequest,
} from "../../application/dto";
import {
	InitialSceneCannotBeDeletedError,
	SceneNotFoundError,
} from "../../domain/error";
import { createEvent } from "../../domain/event";
import { type Choice, type Scene, createEndScene } from "../../domain/scene";
import { BaseRepository, type Transaction } from "./base";
import { EventRepository } from "./event";

export class SceneRepository extends BaseRepository {
	async getSceneByPublicId(
		scenePublicId: string,
		tx?: Transaction,
	): Promise<Scene> {
		const sceneData = await (tx ?? this.db)
			.select()
			.from(scene)
			.where(eq(scene.publicId, scenePublicId))
			.limit(1)
			.execute();

		if (sceneData.length === 0) {
			throw new SceneNotFoundError(scenePublicId);
		}

		const sceneId = sceneData[0].id;
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
					publicId: c.publicId,
					text: c.text,
					nextSceneId: c.nextSceneId,
				})),
				events: [],
			};
		}

		if (gotoSceneData.length > 0) {
			return {
				...sceneData[0],
				sceneType: "goto",
				nextSceneId: gotoSceneData[0].nextSceneId,
				events: [],
			};
		}

		return {
			...sceneData[0],
			sceneType: "end",
			events: [],
		};
	}

	async getScenes(gamePublicId: string): Promise<Scene[] | null> {
		const gameId = await this.getGameIdFromPublicId(gamePublicId);

		const scenes = await this.db
			.select()
			.from(scene)
			.leftJoin(choiceScene, eq(scene.id, choiceScene.sceneId))
			.leftJoin(endScene, eq(scene.id, endScene.sceneId))
			.leftJoin(gotoScene, eq(scene.id, gotoScene.sceneId))
			.where(eq(scene.gameId, gameId))
			.execute();

		if (scenes.length === 0) {
			throw new SceneNotFoundError(gameId.toString());
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
	}

	async createScene({
		params: { name, fromScene, gamePublicId, userId },
		tx,
	}: {
		params: CreateSceneRequest & { gamePublicId: string; userId: number };
		tx?: Transaction;
	}): Promise<Scene> {
		return await this.executeTransaction(async (txLocal) => {
			const sceneData = createEndScene({
				name,
			});

			const gameId = await this.getGameIdFromPublicId(gamePublicId, txLocal);

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
					gamePublicId,
					scenePublicId: createdScene[0].publicId,
					type: "textRender",
					orderIndex: "a0", //TODO: 関数に
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
				if (fromScene.type === "choice" && fromScene.choiceId) {
					// 選択肢シーンの場合、選択肢の遷移先を更新
					await txLocal
						.update(choice)
						.set({
							nextSceneId: createdScene[0].id,
							updatedAt: sql.raw("NOW()"),
						})
						.where(
							and(
								eq(choice.id, fromScene.choiceId),
								eq(choice.choiceSceneId, fromScene.id),
							),
						);
				} else if (fromScene.type === "goto") {
					// Gotoシーンの場合、遷移先を更新
					await txLocal
						.update(gotoScene)
						.set({
							nextSceneId: createdScene[0].id,
							updatedAt: sql.raw("NOW()"),
						})
						.where(eq(gotoScene.sceneId, fromScene.id));
				} else if (fromScene.type === "end") {
					// Endシーンの場合、Gotoシーンに変換
					await txLocal
						.delete(endScene)
						.where(eq(endScene.sceneId, fromScene.id));
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
				publicId: createdScene[0].publicId,
				createdAt: createdScene[0].createdAt,
				updatedAt: createdScene[0].updatedAt,
				events: [event],
			};
		}, tx);
	}

	async updateScene({
		scenePublicId,
		params: { name, sceneType, nextSceneId, choices },
		tx,
	}: {
		scenePublicId: string;
		params: UpdateSceneRequest;
		tx?: Transaction;
	}): Promise<Scene> {
		return await this.executeTransaction(async (txLocal) => {
			const sceneData = await txLocal
				.update(scene)
				.set({
					name,
					updatedAt: sql.raw("NOW()"),
				})
				.where(eq(scene.publicId, scenePublicId))
				.returning();

			const sceneId = sceneData[0].id;

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

			return this.getSceneByPublicId(scenePublicId, txLocal);
		}, tx);
	}

	async deleteScene({
		params: { scenePublicId, gamePublicId },
		tx,
	}: {
		params: { gamePublicId: string; scenePublicId: string };
		tx?: Transaction;
	}): Promise<void> {
		return await this.executeTransaction(async (txLocal) => {
			const sceneData = await txLocal
				.select()
				.from(scene)
				.where(eq(scene.publicId, scenePublicId))
				.limit(1)
				.execute();

			if (sceneData.length === 0) {
				throw new SceneNotFoundError(scenePublicId);
			}

			const sceneId = sceneData[0].id;
			const gameId = await this.getGameIdFromPublicId(gamePublicId, txLocal);

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
				throw new InitialSceneCannotBeDeletedError(gamePublicId);
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
