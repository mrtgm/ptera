import type { Game, GameEvent, GameResources, Scene, Stage } from "~/schema";

export const findAllPaths = ({
	game,
	sceneId,
	targetSceneId,
}: {
	game: Game;
	sceneId?: string;
	targetSceneId: string;
}): Scene[] => {
	const result: Scene[] = [];
	const visited = new Set<string>();

	const dfs = (
		game: Game,
		sceneId: string | undefined,
		targetSceneId: string,
		result: Scene[],
		visited: Set<string>,
	): boolean => {
		const newSceneId = sceneId ?? game.scenes[0].id;
		const scene = game.scenes.find((s) => s.id === newSceneId);

		if (!scene) throw new Error(`Scene not found: ${newSceneId}`);

		if (newSceneId === targetSceneId) {
			result.push(scene);
			return true;
		}

		visited.add(newSceneId);
		result.push(scene);

		if (scene.sceneType === "choice") {
			for (const choice of scene.choices) {
				if (visited.has(choice.nextSceneId)) continue;
				if (dfs(game, choice.nextSceneId, targetSceneId, result, visited)) {
					return true;
				}
			}
		}

		if (scene.sceneType === "goto") {
			if (!visited.has(scene.nextSceneId))
				if (dfs(game, scene.nextSceneId, targetSceneId, result, visited)) {
					return true;
				}
		}

		result.pop();
		visited.delete(newSceneId);

		return false;
	};

	dfs(game, sceneId, targetSceneId, result, visited);

	return result;
};

export const buildCurrentStageFromScenes = ({
	scenes,
	currentStage,
	resources,
	eventId,
}: {
	scenes: Scene[];
	currentStage: Stage;
	resources: GameResources;
	eventId?: string;
}): Stage => {
	const events = scenes.flatMap((scene) => scene.events);
	let newStage = { ...currentStage };
	for (const event of events) {
		newStage = handleEvent(event, newStage, resources);
		if (eventId !== undefined && event.id === eventId) break;
	}
	return newStage;
};

export const handleEvent = (
	event: GameEvent,
	stage: Stage,
	resources: GameResources | null,
): Stage => {
	// soundEffect をnullにする、characterEffectをnullにする

	switch (event.type) {
		case "appearMessageWindow":
			return {
				...stage,
				dialog: { ...stage.dialog, isVisible: true },
			};
		case "hideMessageWindow":
			return { ...stage, dialog: { ...stage.dialog, isVisible: false } };
		case "text":
			return {
				...stage,
				dialog: {
					...stage.dialog,
					text: event.lines.at(-1) || "",
					characterName: event.characterName || "",
				},
			};
		case "appearCharacter":
			return {
				...stage,
				characters: {
					transitionDuration: event.transitionDuration,
					items: [
						...stage.characters.items.filter((c) => c.id !== event.characterId),
						{
							id: event.characterId,
							scale: event.scale,
							imageId: event.characterImageId,
							position: event.position,
							effect: null,
						},
					],
				},
			};
		case "hideCharacter":
			return {
				...stage,
				characters: {
					transitionDuration: event.transitionDuration,
					items: stage.characters.items.filter(
						(c) => c.id !== event.characterId,
					),
				},
			};
		case "hideAllCharacters":
			return {
				...stage,
				characters: { transitionDuration: event.transitionDuration, items: [] },
			};
		case "changeBackground":
			if (!resources) return stage;
			return {
				...stage,
				background: {
					id: event.backgroundId,
					transitionDuration: event.transitionDuration,
				},
			};
		case "bgmStart":
			if (!resources) return stage;
			return {
				...stage,
				bgm: {
					id: event.bgmId,
					volume: event.volume,
					isPlaying: true,
					transitionDuration: event.transitionDuration,
				},
			};
		case "bgmStop":
			return { ...stage, bgm: null };
		case "soundEffect":
			if (!resources) return stage;
			return {
				...stage,
				soundEffect: {
					id: event.soundEffectId,
					volume: event.volume,
					isPlaying: true,
					transitionDuration: event.transitionDuration,
				},
			};
		case "appearCG":
			if (!resources) return stage;
			return {
				...stage,
				cg: {
					item: {
						id: event.cgImageId,
						scale: event.scale,
						position: event.position,
					},
					transitionDuration: event.transitionDuration,
				},
			};
		case "hideCG":
			return {
				...stage,
				cg: { item: null, transitionDuration: event.transitionDuration },
			};
		case "characterEffect":
			return {
				...stage,
				characters: {
					transitionDuration: event.transitionDuration,
					items: stage.characters.items.map((c) => {
						if (c.id !== event.characterId) return c;
						return {
							...c,
							effect: {
								type: event.effectType,
								transitionDuration: event.transitionDuration,
							},
						};
					}),
				},
			};
		case "effect":
			return {
				...stage,
				effect: {
					type: event.effectType,
					transitionDuration: event.transitionDuration,
				},
			};
	}

	return stage;
};
