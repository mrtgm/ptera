import type { GameEvent } from "@ptera/schema";

export function getEventAssetId(eventData: GameEvent): number | null {
	if (eventData.eventType === "bgmStart") {
		return eventData.bgmId;
	}
	if (eventData.eventType === "soundEffect") {
		return eventData.soundEffectId;
	}
	if (eventData.eventType === "appearCharacter") {
		return eventData.characterImageId;
	}
	if (eventData.eventType === "appearCG") {
		return eventData.cgImageId;
	}
	if (eventData.eventType === "changeBackground") {
		return eventData.backgroundId;
	}

	return null;
}
