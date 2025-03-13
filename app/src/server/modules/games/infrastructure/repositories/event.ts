import {
	appearCgEvent,
	appearCharacterEvent,
	appearMessageWindowEvent,
	assetGame,
	bgmStartEvent,
	bgmStopEvent,
	changeBackgroundEvent,
	characterEffectEvent,
	effectEvent,
	event,
	hideAllCharactersEvent,
	hideCgEvent,
	hideCharacterEvent,
	hideMessageWindowEvent,
	moveCharacterEvent,
	scene,
	soundEffectEvent,
	textRenderEvent,
} from "@/server/shared/infrastructure/db/schema";
import * as changeCase from "change-case";
import { count, eq, inArray, sql } from "drizzle-orm";
import { generateKeyBetween } from "fractional-indexing";
import { omit } from "remeda";
import { ResourceRepository } from "../../../assets/infrastructure/repositories/resource";
import {
	EventNotFoundError,
	EventsNotFoundError,
	LastEventCannotBeDeletedError,
	SceneNotFoundError,
} from "../../domain/error";
import { type GameEvent, createEvent, sortEvent } from "../../domain/event";
import { domainToPersitence } from "../mapper";
import { BaseRepository, type Transaction } from "./base";
import { getEventAssetId } from "./utils";

export class EventRepository extends BaseRepository {
	async getEvents(sceneIds: number[]): Promise<Record<number, GameEvent[]>> {
		// シーン ID に紐づくすべてのイベントを取得

		const events = await this.db
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

		// イベントの詳細情報を取得、Event ID をキーにしたマップを作成
		const eventDetailMap = (
			await Promise.all(
				eventDbSchemas.map(async (schema) => {
					const events = await this.db
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
				Omit<GameEvent, "publicId" | "eventType" | "category" | "orderIndex">
			>,
		);

		// シーン ID をキーにしたイベントのマップを作成
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
				eventType: event.eventType as GameEvent["eventType"],
				category: event.category,
				orderIndex: event.orderIndex,
			} as GameEvent;

			eventMap[event.sceneId].push(gameEvent);
		}

		for (const id of sceneIds) {
			eventMap[id] = (eventMap[id] || []).sort(sortEvent);
		}

		return eventMap;
	}

	async createEvent({
		params: { gamePublicId, scenePublicId, type, orderIndex, userId },
		tx,
	}: {
		params: {
			gamePublicId: string;
			scenePublicId: string;
			type: GameEvent["eventType"];
			userId: number;
			orderIndex?: string | null;
		};
		tx?: Transaction;
	}): Promise<GameEvent> {
		return await this.executeTransaction(async (txLocal) => {
			const resourceRepository = new ResourceRepository();
			const resource = await resourceRepository.getResource(userId);

			const gameId = await this.getGameIdFromPublicId(gamePublicId, txLocal);

			const sceneData = await txLocal
				.select()
				.from(scene)
				.where(eq(scene.publicId, scenePublicId))
				.limit(1)
				.execute();

			if (sceneData.length === 0) {
				throw new SceneNotFoundError(scenePublicId);
			}

			const eventData = createEvent(type, orderIndex, resource);
			const createdEventBase = await txLocal
				.insert(event)
				.values({
					eventType: eventData.eventType,
					category: eventData.category,
					orderIndex: eventData.orderIndex,
					sceneId: sceneData[0].id,
				})
				.returning();

			await this.createEventDetail(createdEventBase[0].id, eventData, txLocal);

			// アセットの関連付けを更新
			await this.linkEventAssets(gameId, eventData, txLocal);

			return {
				...eventData,
				id: createdEventBase[0].id,
				publicId: createdEventBase[0].publicId,
			};
		}, tx);
	}

	private async createEventDetail(
		eventId: number,
		eventData: GameEvent,
		tx: Transaction,
	): Promise<void> {
		if (eventData.eventType === "textRender") {
			await tx.insert(textRenderEvent).values({
				eventId,
				text: eventData.text,
				characterName: eventData.characterName,
			});
		} else if (eventData.eventType === "appearMessageWindow") {
			await tx.insert(appearMessageWindowEvent).values({
				eventId,
			});
		} else if (eventData.eventType === "hideMessageWindow") {
			await tx.insert(hideMessageWindowEvent).values({
				eventId,
			});
		} else if (eventData.eventType === "appearCharacter") {
			await tx.insert(appearCharacterEvent).values({
				eventId,
				characterId: eventData.characterId,
				characterImageId: eventData.characterImageId,
				scale: eventData.scale,
				position: eventData.position,
				transitionDuration: eventData.transitionDuration,
			});
		} else if (eventData.eventType === "hideCharacter") {
			await tx.insert(hideCharacterEvent).values({
				eventId,
				characterId: eventData.characterId,
				transitionDuration: eventData.transitionDuration,
			});
		} else if (eventData.eventType === "hideAllCharacters") {
			await tx.insert(hideAllCharactersEvent).values({
				eventId,
				transitionDuration: eventData.transitionDuration,
			});
		} else if (eventData.eventType === "moveCharacter") {
			await tx.insert(moveCharacterEvent).values({
				eventId,
				characterId: eventData.characterId,
				position: eventData.position,
			});
		} else if (eventData.eventType === "bgmStart") {
			await tx.insert(bgmStartEvent).values({
				eventId,
				bgmId: eventData.bgmId,
				volume: eventData.volume.toString(),
				loop: eventData.loop,
				transitionDuration: eventData.transitionDuration,
			});
		} else if (eventData.eventType === "bgmStop") {
			await tx.insert(bgmStopEvent).values({
				eventId,
				transitionDuration: eventData.transitionDuration,
			});
		} else if (eventData.eventType === "soundEffect") {
			await tx.insert(soundEffectEvent).values({
				eventId,
				soundEffectId: eventData.soundEffectId,
				volume: eventData.volume.toString(),
				transitionDuration: eventData.transitionDuration,
			});
		} else if (eventData.eventType === "changeBackground") {
			await tx.insert(changeBackgroundEvent).values({
				eventId,
				backgroundId: eventData.backgroundId,
				transitionDuration: eventData.transitionDuration,
			});
		} else if (eventData.eventType === "effect") {
			await tx.insert(effectEvent).values({
				eventId,
				effectType: eventData.effectType,
				transitionDuration: eventData.transitionDuration,
			});
		} else if (eventData.eventType === "characterEffect") {
			await tx.insert(characterEffectEvent).values({
				eventId,
				characterId: eventData.characterId,
				effectType: eventData.effectType,
				transitionDuration: eventData.transitionDuration,
			});
		} else if (eventData.eventType === "appearCG") {
			await tx.insert(appearCgEvent).values({
				eventId,
				cgImageId: eventData.cgImageId,
				transitionDuration: eventData.transitionDuration,
			});
		} else if (eventData.eventType === "hideCG") {
			await tx.insert(hideCgEvent).values({
				eventId,
				transitionDuration: eventData.transitionDuration,
			});
		}
	}

	async deleteEventDetail(
		eventId: number,
		eventType: string,
		tx: Transaction,
	): Promise<void> {
		const tableName = `${changeCase.snakeCase(eventType)}_event`;
		await tx.execute(
			sql.raw(`DELETE FROM ${tableName} WHERE event_id = ${eventId}`),
		);
	}

	private async linkEventAssets(
		gameId: number,
		eventData: GameEvent,
		tx: Transaction,
	): Promise<void> {
		// アセットの関連付けを更新
		const assetId = getEventAssetId(eventData);
		if (assetId) {
			await tx
				.insert(assetGame)
				.values({
					gameId,
					assetId,
				})
				.onConflictDoNothing({
					target: [assetGame.gameId, assetGame.assetId],
				});
		}
	}

	async updateEvent({
		params: { eventData, gamePublicId },
		tx,
	}: {
		params: { eventData: GameEvent; gamePublicId: string };
		tx?: Transaction;
	}): Promise<GameEvent> {
		return await this.executeTransaction(async (txLocal) => {
			const gameId = await this.getGameIdFromPublicId(gamePublicId, txLocal);

			const found = await txLocal
				.select()
				.from(event)
				.where(eq(event.id, eventData.id))
				.limit(1)
				.execute();

			if (found.length === 0) {
				throw new EventNotFoundError(eventData.publicId);
			}

			await txLocal
				.update(event)
				.set({
					eventType: eventData.eventType,
					category: eventData.category,
					orderIndex: eventData.orderIndex,
					updatedAt: sql.raw("NOW()"),
				})
				.where(eq(event.id, eventData.id));

			if (eventData.eventType === "textRender") {
				await txLocal
					.update(textRenderEvent)
					.set({
						text: eventData.text,
						characterName: eventData.characterName,
						updatedAt: sql.raw("NOW()"),
					})
					.where(eq(textRenderEvent.eventId, eventData.id));
			} else if (eventData.eventType === "appearMessageWindow") {
				await txLocal
					.update(appearMessageWindowEvent)
					.set({
						updatedAt: sql.raw("NOW()"),
					})
					.where(eq(appearMessageWindowEvent.eventId, eventData.id));
			} else if (eventData.eventType === "hideMessageWindow") {
				await txLocal
					.update(hideMessageWindowEvent)
					.set({
						updatedAt: sql.raw("NOW()"),
					})
					.where(eq(hideMessageWindowEvent.eventId, eventData.id));
			} else if (eventData.eventType === "appearCharacter") {
				await txLocal
					.update(appearCharacterEvent)
					.set({
						characterId: eventData.characterId,
						characterImageId: eventData.characterImageId,
						scale: eventData.scale,
						position: eventData.position,
						transitionDuration: eventData.transitionDuration,
						updatedAt: sql.raw("NOW()"),
					})
					.where(eq(appearCharacterEvent.eventId, eventData.id));
			} else if (eventData.eventType === "hideCharacter") {
				await txLocal
					.update(hideCharacterEvent)
					.set({
						characterId: eventData.characterId,
						transitionDuration: eventData.transitionDuration,
						updatedAt: sql.raw("NOW()"),
					})
					.where(eq(hideCharacterEvent.eventId, eventData.id));
			} else if (eventData.eventType === "hideAllCharacters") {
				await txLocal
					.update(hideAllCharactersEvent)
					.set({
						transitionDuration: eventData.transitionDuration,
						updatedAt: sql.raw("NOW()"),
					})
					.where(eq(hideAllCharactersEvent.eventId, eventData.id));
			} else if (eventData.eventType === "moveCharacter") {
				await txLocal
					.update(moveCharacterEvent)
					.set({
						characterId: eventData.characterId,
						position: eventData.position,
						updatedAt: sql.raw("NOW()"),
					})
					.where(eq(moveCharacterEvent.eventId, eventData.id));
			} else if (eventData.eventType === "bgmStart") {
				await txLocal
					.update(bgmStartEvent)
					.set({
						bgmId: eventData.bgmId,
						volume: eventData.volume.toString(),
						loop: eventData.loop,
						transitionDuration: eventData.transitionDuration,
						updatedAt: sql.raw("NOW()"),
					})
					.where(eq(bgmStartEvent.eventId, eventData.id));
			} else if (eventData.eventType === "bgmStop") {
				await txLocal
					.update(bgmStopEvent)
					.set({
						transitionDuration: eventData.transitionDuration,
						updatedAt: sql.raw("NOW()"),
					})
					.where(eq(bgmStopEvent.eventId, eventData.id));
			} else if (eventData.eventType === "soundEffect") {
				await txLocal
					.update(soundEffectEvent)
					.set({
						soundEffectId: eventData.soundEffectId,
						volume: eventData.volume.toString(),
						transitionDuration: eventData.transitionDuration,
						updatedAt: sql.raw("NOW()"),
					})
					.where(eq(soundEffectEvent.eventId, eventData.id));
			} else if (eventData.eventType === "changeBackground") {
				await txLocal
					.update(changeBackgroundEvent)
					.set({
						backgroundId: eventData.backgroundId,
						transitionDuration: eventData.transitionDuration,
						updatedAt: sql.raw("NOW()"),
					})
					.where(eq(changeBackgroundEvent.eventId, eventData.id));
			} else if (eventData.eventType === "effect") {
				await txLocal
					.update(effectEvent)
					.set({
						effectType: eventData.effectType,
						transitionDuration: eventData.transitionDuration,
						updatedAt: sql.raw("NOW()"),
					})
					.where(eq(effectEvent.eventId, eventData.id));
			} else if (eventData.eventType === "characterEffect") {
				await txLocal
					.update(characterEffectEvent)
					.set({
						characterId: eventData.characterId,
						effectType: eventData.effectType,
						transitionDuration: eventData.transitionDuration,
						updatedAt: sql.raw("NOW()"),
					})
					.where(eq(characterEffectEvent.eventId, eventData.id));
			} else if (eventData.eventType === "appearCG") {
				await txLocal
					.update(appearCgEvent)
					.set({
						cgImageId: eventData.cgImageId,
						transitionDuration: eventData.transitionDuration,
						updatedAt: sql.raw("NOW()"),
					})
					.where(eq(appearCgEvent.eventId, eventData.id));
			} else if (eventData.eventType === "hideCG") {
				await txLocal
					.update(hideCgEvent)
					.set({
						transitionDuration: eventData.transitionDuration,
						updatedAt: sql.raw("NOW()"),
					})
					.where(eq(hideCgEvent.eventId, eventData.id));
			}

			// アセットの関連付けを更新
			await this.linkEventAssets(gameId, eventData, txLocal);

			return eventData;
		}, tx);
	}

	async deleteEvent({
		params: { eventPublicId },
		tx,
	}: {
		params: { eventPublicId: string };
		tx?: Transaction;
	}): Promise<void> {
		return await this.executeTransaction(async (txLocal) => {
			const eventData = await txLocal
				.select({
					id: event.id,
					sceneId: event.sceneId,
					eventType: event.eventType,
				})
				.from(event)
				.where(eq(event.publicId, eventPublicId))
				.limit(1)
				.execute();

			if (eventData.length === 0) {
				throw new EventNotFoundError(eventPublicId);
			}

			const eventId = eventData[0].id;
			const sceneId = eventData[0].sceneId;

			const eventCount = await txLocal
				.select({ count: count() })
				.from(event)
				.where(eq(event.sceneId, sceneId))
				.execute();

			if (eventCount[0].count <= 1) {
				throw new LastEventCannotBeDeletedError(eventPublicId);
			}

			const eventType = eventData[0].eventType;
			await this.deleteEventDetail(eventId, eventType, txLocal);
			await txLocal.delete(event).where(eq(event.id, eventId));
		}, tx);
	}

	async moveEvent({
		params: { oldIndex, newIndex, scenePublicId },
		tx,
	}: {
		params: { oldIndex: number; newIndex: number; scenePublicId: string };
		tx?: Transaction;
	}): Promise<boolean> {
		return await this.executeTransaction(async (txLocal) => {
			const events = await txLocal
				.select({
					id: event.id,
					orderIndex: event.orderIndex,
				})
				.from(event)
				.innerJoin(scene, eq(event.sceneId, scene.id))
				.where(eq(scene.publicId, scenePublicId))
				.orderBy(event.orderIndex)
				.execute();

			if (events.length === 0) {
				throw new EventsNotFoundError(scenePublicId);
			}

			// 移動するイベント
			const movedEvent = events[oldIndex];
			if (!movedEvent) {
				throw new EventNotFoundError(`Event with index ${oldIndex} not found`);
			}

			// 新しい順序インデックスを生成
			const prevEvent = newIndex > 0 ? events[newIndex - 1] : null;
			const nextEvent = newIndex < events.length ? events[newIndex] : null;

			const newOrderIndex = generateKeyBetween(
				prevEvent?.orderIndex || null,
				nextEvent?.orderIndex || null,
			);

			await txLocal
				.update(event)
				.set({
					orderIndex: newOrderIndex,
					updatedAt: sql.raw("NOW()"),
				})
				.where(eq(event.id, movedEvent.id));

			return true;
		}, tx);
	}
}
