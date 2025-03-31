import type {
  GameDetailResponse,
  GameEvent,
  GameEventType,
  ResourceResponse,
} from "@ptera/schema";
import { getEventTitle } from "../constants";

export const ResourceValidator = {
  isCharacterInUse: (characterId: number, game: GameDetailResponse | null) => {
    if (!game) return { inUse: false, usages: [] };

    const usages: Array<{
      sceneId: number;
      sceneName: string;
      eventId: number;
      eventType: string;
    }> = [];

    // 各シーンのイベントをチェック
    for (const scene of game.scenes) {
      for (const event of scene.events) {
        if (ResourceValidator.isEventUsingCharacter(event, characterId)) {
          usages.push({
            sceneId: scene.id,
            sceneName: scene.name,
            eventId: event.id,
            eventType: getEventTitle(event.eventType),
          });
        }
      }
    }

    return {
      inUse: usages.length > 0,
      usages,
    };
  },

  isEventUsingCharacter: (event: GameEvent, characterId: number): boolean => {
    switch (event.eventType) {
      case "appearCharacter":
      case "hideCharacter":
      case "moveCharacter":
      case "characterEffect":
        return event.characterId === characterId;
      case "textRender":
        return false;
      default:
        return false;
    }
  },

  isImageInUse: (
    characterId: number,
    imageId: number,
    game: GameDetailResponse | null,
  ) => {
    if (!game) return { inUse: false, usages: [] };

    const usages: Array<{
      sceneId: number;
      sceneName: string;
      eventId: number;
      eventType: string;
    }> = [];

    // 各シーンのイベントをチェック
    for (const scene of game.scenes) {
      for (const event of scene.events) {
        if (ResourceValidator.isEventUsingImage(event, characterId, imageId)) {
          usages.push({
            sceneId: scene.id,
            sceneName: scene.name,
            eventId: event.id,
            eventType: getEventTitle(event.eventType),
          });
        }
      }
    }

    return {
      inUse: usages.length > 0,
      usages,
    };
  },

  isEventUsingImage: (
    event: GameEvent,
    characterId: number,
    imageId: number,
  ): boolean => {
    // appearCharacterイベントの場合のみキャラクター画像を使用
    if (event.eventType === "appearCharacter") {
      return (
        event.characterId === characterId && event.characterImageId === imageId
      );
    }
    return false;
  },

  isAssetInUse: (
    type: keyof Omit<ResourceResponse, "characters">,
    id: number,
    game: GameDetailResponse | null,
  ) => {
    if (!game) return { inUse: false, usages: [] };

    const usages: Array<{
      sceneId: number;
      sceneName: string;
      eventId: number;
      eventType: string;
    }> = [];

    for (const scene of game.scenes) {
      for (const event of scene.events) {
        if (ResourceValidator.isEventUsingAsset(event, type, id)) {
          usages.push({
            sceneId: scene.id,
            sceneName: scene.name,
            eventId: event.id,
            eventType: getEventTitle(event.eventType),
          });
        }
      }
    }

    return {
      inUse: usages.length > 0,
      usages,
    };
  },

  getCharacterFromEvent: (
    event: GameEvent,
  ): {
    type: GameEventType;
    characterId: number;
  } | null => {
    if (
      event.eventType === "appearCharacter" ||
      event.eventType === "hideCharacter" ||
      event.eventType === "moveCharacter" ||
      event.eventType === "characterEffect"
    ) {
      return {
        type: event.eventType,
        characterId: event.characterId,
      };
    }
    return null;
  },

  getAssetFromEvent: (
    event: GameEvent,
  ): {
    type: keyof Omit<ResourceResponse, "characters">;
    id: number;
  } | null => {
    if (event.eventType === "appearCharacter") {
      return { type: "character", id: event.characterImageId };
    }
    if (event.eventType === "changeBackground") {
      return { type: "backgroundImage", id: event.backgroundId };
    }
    if (event.eventType === "soundEffect") {
      return { type: "soundEffect", id: event.soundEffectId };
    }
    if (event.eventType === "bgmStart") {
      return { type: "bgm", id: event.bgmId };
    }
    if (event.eventType === "appearCG") {
      return { type: "cgImage", id: event.cgImageId };
    }
    return null;
  },

  isEventUsingAsset: (
    event: GameEvent,
    type: keyof Omit<ResourceResponse, "characters">,
    id: number,
  ) => {
    if (type === "backgroundImage" && event.eventType === "changeBackground") {
      return event.backgroundId === id;
    }
    if (type === "soundEffect" && event.eventType === "soundEffect") {
      return event.soundEffectId === id;
    }
    if (type === "bgm" && event.eventType === "bgmStart") {
      return event.bgmId === id;
    }
    if (type === "cgImage" && event.eventType === "appearCG") {
      return event.cgImageId === id;
    }
    return false;
  },

  canDeleteCharacter: (
    characterId: number,
    game: GameDetailResponse | null,
  ) => {
    const { inUse, usages } = ResourceValidator.isCharacterInUse(
      characterId,
      game,
    );

    return {
      canDelete: !inUse,
      reason: inUse
        ? "このキャラクターは以下の箇所で使用されているため削除できません"
        : "",
      usages,
    };
  },

  canDeleteAsset: (
    type: keyof Omit<ResourceResponse, "characters">,
    id: number,
    game: GameDetailResponse | null,
  ) => {
    const { inUse, usages } = ResourceValidator.isAssetInUse(type, id, game);

    return {
      canDelete: !inUse,
      reason: inUse
        ? "このアセットは以下の箇所で使用されているため削除できません"
        : "",
      usages,
    };
  },

  canDeleteImage: (
    characterId: number,
    imageId: number,
    game: GameDetailResponse | null,
    resources: ResourceResponse | null,
  ) => {
    const { inUse, usages } = ResourceValidator.isImageInUse(
      characterId,
      imageId,
      game,
    );

    // キャラクターの画像が1枚しかない場合は削除不可
    const isLastImage =
      resources?.character[characterId] &&
      Object.keys(resources.character[characterId].images ?? {}).length <= 1;

    return {
      canDelete: !inUse && !isLastImage,
      reason: inUse
        ? "この画像は以下の箇所で使用されているため削除できません"
        : isLastImage
          ? "キャラクターには少なくとも1枚の画像が必要です"
          : "",
      usages,
    };
  },
};
