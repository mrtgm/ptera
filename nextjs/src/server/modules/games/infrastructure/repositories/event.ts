import {
  appearCgEvent,
  appearCharacterEvent,
  appearMessageWindowEvent,
  assetGame,
  bgmStartEvent,
  bgmStopEvent,
  changeBackgroundEvent,
  characterEffectEvent,
  characterGame,
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
import {
  EventNotFoundError,
  EventsNotFoundError,
  type GameEvent,
  LastEventCannotBeDeletedError,
  SceneNotFoundError,
  createEvent,
  getEventCategory,
  sortEvent,
} from "@ptera/schema";
import * as changeCase from "change-case";
import { count, eq, inArray, sql } from "drizzle-orm";
import { generateKeyBetween } from "fractional-indexing";
import { ResourceRepository } from "../../../assets/infrastructure/repositories/resource";
import { BaseRepository, type Transaction } from "./base";
import { getEventAssetId } from "./utils";

const EVENT_DB_SCHEMA = [
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

export class EventRepository extends BaseRepository {
  async getEventsBySceneId(
    sceneId: number,
    tx?: Transaction,
  ): Promise<GameEvent[]> {
    const dbToUse = tx || this.db;
    const events = await dbToUse
      .select()
      .from(event)
      .where(eq(event.sceneId, sceneId))
      .execute();

    if (events.length === 0) {
      throw new EventsNotFoundError(sceneId);
    }

    const eventIds = events.map((v) => v.id);

    const eventDetailMap = (
      await Promise.all(
        EVENT_DB_SCHEMA.map(async (schema) => {
          const events = await dbToUse
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
        Omit<GameEvent, "eventType" | "category" | "orderIndex">
      >,
    );

    const gameEvents = events.map((event) => {
      const eventDetail = eventDetailMap[event.id];
      return {
        ...eventDetail,
        id: event.id,
        eventType: event.eventType as GameEvent["eventType"],
        category: event.category,
        orderIndex: event.orderIndex,
      } as GameEvent;
    });

    return gameEvents.sort(sortEvent);
  }
  async getEventsBySceneIds(
    sceneIds: number[],
    tx?: Transaction,
  ): Promise<Record<number, GameEvent[]>> {
    return await this.executeTransaction(async (dbToUse) => {
      // シーン ID に紐づくすべてのイベントを一度に取得
      const events = await dbToUse
        .select()
        .from(event)
        .where(inArray(event.sceneId, sceneIds))
        .execute();

      const eventIds = events.map((e) => e.id);

      // 全イベントタイプを一度に処理するためのクエリを準備
      const detailQueries = EVENT_DB_SCHEMA.map((schema) =>
        dbToUse.select().from(schema).where(inArray(schema.eventId, eventIds)),
      );

      // すべてのクエリを並列実行
      const allDetails = await Promise.all(
        detailQueries.map((q) => q.execute()),
      );

      // イベント詳細をイベントIDでインデックス化
      const eventDetailMap: Record<
        number,
        Omit<GameEvent, "eventType" | "category" | "orderIndex">
      > = {};
      for (const detail of allDetails.flat()) {
        eventDetailMap[detail.eventId] = detail;
      }

      // 結果をシーンIDでグループ化して返す
      const eventMap: Record<number, GameEvent[]> = {};

      // 初期化: すべてのシーンIDに空の配列を設定
      for (const id of sceneIds) {
        eventMap[id] = [];
      }

      // イベントをシーンIDごとに格納
      for (const event of events) {
        const eventDetail = eventDetailMap[event.id];
        if (eventDetail) {
          const gameEvent = {
            ...eventDetail,
            id: event.id,
            eventType: event.eventType as GameEvent["eventType"],
            category: event.category,
            orderIndex: event.orderIndex,
          } as GameEvent;

          eventMap[event.sceneId].push(gameEvent);
        }
      }

      // 各シーンのイベントをソート
      for (const sceneId of Object.keys(eventMap)) {
        eventMap[Number(sceneId)].sort(sortEvent);
      }

      return eventMap;
    }, tx);
  }

  async createEvent({
    params: { gameId, sceneId, type, orderIndex, userId },
    tx,
  }: {
    params: {
      gameId: number;
      sceneId: number;
      type: GameEvent["eventType"];
      userId: number;
      orderIndex?: string | undefined;
    };
    tx?: Transaction;
  }): Promise<GameEvent> {
    return await this.executeTransaction(async (txLocal) => {
      const resourceRepository = new ResourceRepository();
      const resource = await resourceRepository.getResource(userId);

      const sceneData = await txLocal
        .select()
        .from(scene)
        .where(eq(scene.id, sceneId))
        .limit(1)
        .execute();

      if (sceneData.length === 0) {
        throw new SceneNotFoundError(sceneId);
      }

      const eventData = createEvent(type, orderIndex, resource);
      const createdEventBase = await txLocal
        .insert(event)
        .values({
          eventType: type,
          category: getEventCategory(type),
          orderIndex: orderIndex ?? generateKeyBetween(null, null),
          sceneId: sceneData[0].id,
        })
        .returning();

      await this.createEventDetail(createdEventBase[0].id, eventData, txLocal);

      // キャラクターの関連付けを更新
      if (eventData.eventType === "appearCharacter") {
        await txLocal
          .insert(characterGame)
          .values({
            gameId,
            characterId: eventData.characterId,
          })
          .onConflictDoNothing({
            target: [characterGame.gameId, characterGame.characterId],
          });
      }

      // アセットの関連付けを更新
      await this.linkEventAssets(gameId, eventData, txLocal);

      return {
        ...eventData,
        id: createdEventBase[0].id,
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
        scale: eventData.scale.toString(),
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
    params: { eventData, gameId },
    tx,
  }: {
    params: { eventData: GameEvent; gameId: number };
    tx?: Transaction;
  }): Promise<GameEvent> {
    return await this.executeTransaction(async (txLocal) => {
      const found = await txLocal
        .select()
        .from(event)
        .where(eq(event.id, eventData.id))
        .limit(1)
        .execute();

      if (found.length === 0) {
        throw new EventNotFoundError(gameId);
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
            scale: eventData.scale.toString(),
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

      // キャラクターの関連付けを更新
      if (eventData.eventType === "appearCharacter") {
        await txLocal
          .insert(characterGame)
          .values({
            gameId,
            characterId: eventData.characterId,
          })
          .onConflictDoNothing({
            target: [characterGame.gameId, characterGame.characterId],
          });
      }

      // アセットの関連付けを更新
      await this.linkEventAssets(gameId, eventData, txLocal);

      return eventData;
    }, tx);
  }

  async deleteEvent({
    params: { eventId },
    tx,
  }: {
    params: { eventId: number };
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
        .where(eq(event.id, eventId))
        .limit(1)
        .execute();

      if (eventData.length === 0) {
        throw new EventNotFoundError(eventId);
      }

      const sceneId = eventData[0].sceneId;

      const eventCount = await txLocal
        .select({ count: count() })
        .from(event)
        .where(eq(event.sceneId, sceneId))
        .execute();

      if (eventCount[0].count <= 1) {
        throw new LastEventCannotBeDeletedError(eventId);
      }

      const eventType = eventData[0].eventType;
      await this.deleteEventDetail(eventId, eventType, txLocal);
      await txLocal.delete(event).where(eq(event.id, eventId));
    }, tx);
  }

  async unlinkEventAssets(eventId: number, tx: Transaction): Promise<void> {
    await tx.delete(assetGame).where(eq(assetGame.assetId, eventId));
  }

  async moveEvent({
    params: { eventId, newOrderIndex },
    tx,
  }: {
    params: { eventId: number; newOrderIndex: string };
    tx?: Transaction;
  }): Promise<boolean> {
    return await this.executeTransaction(async (txLocal) => {
      const events = await txLocal
        .select({
          id: event.id,
          orderIndex: event.orderIndex,
        })
        .from(event)
        .where(eq(event.id, eventId))
        .limit(1)
        .execute();

      if (events.length === 0) {
        throw new EventNotFoundError(eventId);
      }

      await txLocal
        .update(event)
        .set({
          orderIndex: newOrderIndex,
          updatedAt: sql.raw("NOW()"),
        })
        .where(eq(event.id, eventId));

      return true;
    }, tx);
  }
}
