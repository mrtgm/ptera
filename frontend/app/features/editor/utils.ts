import type { Game, GameEvent, GameResources, MediaAsset } from "~/schema";
import { getEventTitle } from "./constants";

export const ResourceValidator = {
	isCharacterInUse: (characterId: string, game: Game | null) => {
		if (!game) return { inUse: false, usages: [] };

		const usages: Array<{
			sceneId: string;
			sceneName: string;
			eventId: string;
			eventType: string;
		}> = [];

		// 各シーンのイベントをチェック
		for (const scene of game.scenes) {
			for (const event of scene.events) {
				if (ResourceValidator.isEventUsingCharacter(event, characterId)) {
					usages.push({
						sceneId: scene.id,
						sceneName: scene.title,
						eventId: event.id,
						eventType: getEventTitle(event.type),
					});
				}
			}
		}

		return {
			inUse: usages.length > 0,
			usages,
		};
	},

	isEventUsingCharacter: (event: GameEvent, characterId: string): boolean => {
		switch (event.type) {
			case "appearCharacter":
			case "hideCharacter":
			case "moveCharacter":
			case "characterEffect":
				return event.characterId === characterId;
			case "text":
				return false;
			default:
				return false;
		}
	},

	isImageInUse: (characterId: string, imageId: string, game: Game | null) => {
		if (!game) return { inUse: false, usages: [] };

		const usages: Array<{
			sceneId: string;
			sceneName: string;
			eventId: string;
			eventType: string;
		}> = [];

		// 各シーンのイベントをチェック
		for (const scene of game.scenes) {
			for (const event of scene.events) {
				if (ResourceValidator.isEventUsingImage(event, characterId, imageId)) {
					usages.push({
						sceneId: scene.id,
						sceneName: scene.title,
						eventId: event.id,
						eventType: getEventTitle(event.type),
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
		characterId: string,
		imageId: string,
	): boolean => {
		// appearCharacterイベントの場合のみキャラクター画像を使用
		if (event.type === "appearCharacter") {
			return (
				event.characterId === characterId && event.characterImageId === imageId
			);
		}
		return false;
	},

	isAssetInUse: (
		type: keyof Omit<GameResources, "characters">,
		id: string,
		game: Game | null,
	) => {
		if (!game) return { inUse: false, usages: [] };

		const usages: Array<{
			sceneId: string;
			sceneName: string;
			eventId: string;
			eventType: string;
		}> = [];

		for (const scene of game.scenes) {
			for (const event of scene.events) {
				if (ResourceValidator.isEventUsingAsset(event, type, id)) {
					usages.push({
						sceneId: scene.id,
						sceneName: scene.title,
						eventId: event.id,
						eventType: getEventTitle(event.type),
					});
				}
			}
		}

		return {
			inUse: usages.length > 0,
			usages,
		};
	},

	isEventUsingAsset: (
		event: GameEvent,
		type: keyof Omit<GameResources, "characters">,
		id: string,
	) => {
		if (type === "backgroundImages" && event.type === "changeBackground") {
			return event.backgroundId === id;
		}
		if (type === "soundEffects" && event.type === "soundEffect") {
			return event.soundEffectId === id;
		}
		if (type === "bgms" && event.type === "bgmStart") {
			return event.bgmId === id;
		}
		if (type === "cgImages" && event.type === "appearCG") {
			return event.cgImageId === id;
		}
		return false;
	},

	canDeleteCharacter: (characterId: string, game: Game | null) => {
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
		type: keyof Omit<GameResources, "characters">,
		id: string,
		game: Game | null,
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
		characterId: string,
		imageId: string,
		game: Game | null,
		resources: GameResources | null,
	) => {
		const { inUse, usages } = ResourceValidator.isImageInUse(
			characterId,
			imageId,
			game,
		);

		// キャラクターの画像が1枚しかない場合は削除不可
		const isLastImage =
			resources?.characters[characterId] &&
			Object.keys(resources.characters[characterId].images).length <= 1;

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

export default ResourceValidator;
