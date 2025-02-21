export const findAllPaths = (
	game: Game,
	sceneId: string,
	targetSceneId: string,
): Scene[] => {
	const result: Scene[] = [];
	const visited = new Set<string>();

	const dfs = (
		game: Game,
		sceneId: string,
		targetSceneId: string,
		result: Scene[],
		visited: Set<string>,
	): boolean => {
		const scene = game.scenes.find((s) => s.id === sceneId);
		if (!scene) throw new Error(`Scene not found: ${sceneId}`);

		if (sceneId === targetSceneId) {
			result.push(scene);
			return true;
		}

		visited.add(sceneId);
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
		visited.delete(sceneId);

		return false;
	};

	dfs(game, sceneId, targetSceneId, result, visited);

	return result;
};

export const buildCurrentStageFromScenes = (
	scenes: Scene[],
	currentStage: Stage,
	resources: GameResources,
): Stage => {
	const events = scenes.flatMap((scene) => scene.events);
	let newStage = { ...currentStage };
	for (const event of events) {
		newStage = handleEvent(event, newStage, resources);
	}
	return newStage;
};

export const handleEvent = (
	event: GameEvent,
	stage: Stage,
	resources: GameResources | null,
): Stage => {
	if (event.type !== "soundEffect") {
		stage.soundEffect = null;
	}

	switch (event.type) {
		case "appearMessageWindow":
			return { ...stage, dialog: { ...stage.dialog, isVisible: true } };
		case "hideMessageWindow":
			return { ...stage, dialog: { ...stage.dialog, isVisible: false } };
		case "text":
			return {
				...stage,
				dialog: {
					...stage.dialog,
					lines: event.lines,
					characterName: event.characterName || "",
				},
			};
		case "appearCharacter":
			return {
				...stage,
				characters: [
					...stage.characters.filter((c) => c.id !== event.characterId),
					{
						id: event.characterId,
						scale: event.scale,
						imageId: event.characterImageId,
						position: event.position,
					},
				],
			};
		case "hideCharacter":
			return {
				...stage,
				characters: stage.characters.filter((c) => c.id !== event.characterId),
			};
		case "hideAllCharacters":
			return { ...stage, characters: [] };
		case "changeBackground":
			if (!resources) return stage;
			return {
				...stage,
				background: resources.backgroundImages[event.backgroundId],
			};
		case "soundEffect":
			if (!resources) return stage;
			return {
				...stage,
				soundEffect: resources.soundEffects[event.soundEffectId],
			};
		case "bgmStart":
			if (!resources) return stage;
			return {
				...stage,
				bgm: resources.bgms[event.bgmId],
			};
		case "bgmStop":
			return { ...stage, bgm: null };
		case "effect":
			return { ...stage, effect: event };
	}

	return stage;
};
