import type { Edge, Node } from "@xyflow/react";
import type { Game, GameEvent, GameResources, Scene, Stage } from "~/schema";
import { sortByFractionalIndex } from "~/utils/sort";

type PositionMap = {
	[key: string]: {
		position: { x: number; y: number };
	};
};

export const getAllNodesPosition = ({
	game,
}: {
	game: Game | null;
}): PositionMap => {
	if (!game) return {};
	const result: PositionMap = {};

	// 各深さでのノードを追跡
	const nodesByDepth: { [depth: number]: string[] } = {};

	const visited = new Set<string>();

	for (const scene of game.scenes) {
		if (visited.has(scene.id)) continue;
		visited.add(scene.id);
		const queue: { id: string; depth: number }[] = [{ id: scene.id, depth: 0 }];

		while (queue.length > 0) {
			const now = queue.shift();
			if (!now) break;

			const { id: cur, depth } = now;

			if (!nodesByDepth[depth]) {
				nodesByDepth[depth] = [];
			}
			nodesByDepth[depth].push(cur);

			result[cur] = {
				position: { x: 0, y: 0 },
			};

			const currentScene = game.scenes.find((s) => s.id === cur);

			if (!currentScene) {
				throw new Error(`Scene not found: ${cur} ${typeof cur}`);
			}

			if (currentScene.sceneType === "choice") {
				for (const choice of currentScene.choices) {
					if (!visited.has(choice.nextSceneId)) {
						queue.push({
							id: choice.nextSceneId,
							depth: depth + 1,
						});
						visited.add(choice.nextSceneId);
					}
				}
			}

			if (currentScene.sceneType === "goto") {
				if (!visited.has(currentScene.nextSceneId)) {
					queue.push({
						id: currentScene.nextSceneId,
						depth: depth + 1,
					});
					visited.add(currentScene.nextSceneId);
				}
			}
		}
	}

	const HORIZONTAL_SPACING = 300; // 横方向の間隔
	const VERTICAL_SPACING = 100; // 縦方向の間隔

	const maxDepth = Math.max(...Object.keys(nodesByDepth).map(Number));

	for (let depth = 0; depth <= maxDepth; depth++) {
		const nodesAtDepth = nodesByDepth[depth] || [];
		const totalWidth = (nodesAtDepth.length - 1) * HORIZONTAL_SPACING;

		// 各深さのノードを水平に配置
		nodesAtDepth.forEach((nodeId, index) => {
			// 中央揃えになるようにX座標を計算
			const startX = -totalWidth / 2;
			result[nodeId].position = {
				x: startX + index * HORIZONTAL_SPACING,
				y: depth * VERTICAL_SPACING,
			};
		});
	}

	// 選択肢がある場合、親ノードを子ノードの中央に近づける
	for (const sceneId in result) {
		const scene = game.scenes.find((s) => s.id === sceneId);
		if (!scene || scene.sceneType !== "choice" || scene.choices.length <= 1)
			continue;

		const parentPos = result[sceneId].position;
		const childIds = scene.choices.map((c) => c.nextSceneId);

		// 子ノードのX位置の範囲を取得
		const childXPositions = childIds.map((id) => result[id]?.position.x || 0);
		const minX = Math.min(...childXPositions);
		const maxX = Math.max(...childXPositions);
		const width = maxX - minX;

		const idealParentX = minX + width / 2;

		// もし親ノードが離れすぎている場合調整
		const xDiff = Math.abs(parentPos.x - idealParentX);
		if (xDiff > HORIZONTAL_SPACING / 2) {
			// 親ノードの兄弟との関係を維持しながら、より子ノードの中央に近づける
			const shift = Math.min(xDiff, HORIZONTAL_SPACING / 2);
			result[sceneId].position.x += idealParentX > parentPos.x ? shift : -shift;
		}
	}

	return result;
};

export const transfromToNodes = (
	game: Game | null,
	map: PositionMap,
): Node[] => {
	if (!game) return [];

	// TODO: 開始ノードは配列の最初にしない
	const startId = game.scenes[0]?.id;
	const endIds = game.scenes
		.filter((scene) => scene.sceneType === "end")
		.map((scene) => scene.id);

	return Object.entries(map).map(([sceneId, { position }]) => {
		const scene = game.scenes.find((s) => s.id === sceneId);
		const label = scene?.title ?? sceneId;
		return {
			id: sceneId,
			type: "custom",
			position,
			data: {
				label,
				isStart: sceneId === startId,
				isEnd: endIds.includes(sceneId),
			},
		} as Node;
	});
};

export const getAllEdges = ({
	game,
}: {
	game: Game | null;
}): Edge[] => {
	if (!game) return [];

	const result: Edge[] = [] as Edge[];
	const visited = new Set<string>();

	const BASE_EDGE_STYLE = {
		stroke: "#000000",
		strokeWidth: 1,
	};

	const dfs = (
		game: Game,
		sceneId: string | undefined,
		result: Edge[],
		visited: Set<string>,
	) => {
		const newSceneId = sceneId ?? game.scenes[0].id;
		const scene = game.scenes.find((s) => s.id === newSceneId);

		if (!scene) throw new Error(`Scene not found: ${newSceneId}`);

		visited.add(newSceneId);

		if (scene.sceneType === "choice") {
			for (const choice of scene.choices) {
				result.push({
					id: `${newSceneId}-${choice.nextSceneId}-${choice.id}`,
					source: newSceneId,
					target: choice.nextSceneId,
					label: choice.text,
					style: BASE_EDGE_STYLE,
				});

				if (!visited.has(choice.nextSceneId))
					dfs(game, choice.nextSceneId, result, visited);
			}
		}

		if (scene.sceneType === "goto") {
			result.push({
				id: `${newSceneId}-${scene.nextSceneId}-goto`,
				source: newSceneId,
				target: scene.nextSceneId,
				style: BASE_EDGE_STYLE,
			});

			if (!visited.has(scene.nextSceneId))
				dfs(game, scene.nextSceneId, result, visited);
		}
	};

	for (const scene of game.scenes) {
		if (visited.has(scene.id)) continue;
		dfs(game, scene.id, result, visited);
	}

	return result;
};

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
	const events = scenes.flatMap((scene) =>
		scene.events.sort((a, b) => {
			return sortByFractionalIndex(a.order, b.order);
		}),
	);

	let newStage = { ...currentStage };

	for (const event of events) {
		newStage = handleEvent(event, newStage, resources);
		if (eventId !== undefined && event.id === eventId) break;
	}

	// もしイベントの最後が effect, soundEffect, characterEffect（one-shot なイベント）でない場合 nullにする
	if (events.at(-1)?.type !== "effect") newStage.effect = null;
	if (events.at(-1)?.type !== "soundEffect") newStage.soundEffect = null;
	if (events.at(-1)?.type !== "characterEffect") {
		newStage.characters.items = newStage.characters.items.map((c) => ({
			...c,
			effect: null,
		}));
	}

	return newStage;
};

export const handleEvent = (
	event: GameEvent,
	stage: Stage,
	resources: GameResources | null,
): Stage => {
	switch (event.type) {
		case "appearMessageWindow": {
			return {
				...stage,
				dialog: { ...stage.dialog, isVisible: true },
			};
		}
		case "hideMessageWindow":
			return { ...stage, dialog: { ...stage.dialog, isVisible: false } };
		case "text":
			return {
				...stage,
				dialog: {
					...stage.dialog,
					text: event.text || "",
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
