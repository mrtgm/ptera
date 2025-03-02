import { useEffect, useState } from "react";
import dummyAssets from "~/__mocks__/dummy-assets.json";
import dummyGame from "~/__mocks__/dummy-game.json";
import type {
	Game,
	GameEvent,
	GameResources,
	GameState,
	MessageHistory,
	ResourceCache,
	Scene,
	Stage,
} from "~/schema";
import { resourceManager } from "~/utils/preloader";
import { states } from "./constants";
import type { Player } from "./utils/engine";

export const usePlayerInitialize = ({
	player,
	gameToLoad,
	resourcesToLoad,
}: {
	player: Player;
	gameToLoad: Game;
	resourcesToLoad: GameResources;
}) => {
	const [game, setGame] = useState<Game | null>(null);
	const [state, setState] = useState<GameState>("loading");
	const [stage, setStage] = useState<Stage>(player.stage);
	const [cache, setCache] = useState<ResourceCache>(resourceManager.cache);
	const [history, setHistory] = useState<MessageHistory[]>([]);
	const [currentScene, setCurrentScene] = useState<Scene | null>(null);
	const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);

	useEffect(() => {
		const cleanup = () => {
			player.emitter.off("stageUpdated");
			player.emitter.off("currentEventUpdated");
			player.emitter.off("historyUpdated");
			player.emitter.off("currentSceneUpdated");
			player.emitter.off("gameLoaded");
			for (const state of states) {
				player.emitter.off(state);
			}
		};

		cleanup(); // Clear any existing listeners

		// Setup new listeners
		for (const state of states) {
			player.emitter.on(state, () => {
				setState(state);
			});
		}

		player.emitter.on("stageUpdated", (stage) => {
			setStage(stage);
		});

		player.emitter.on("historyUpdated", (history) => {
			setHistory(history);
		});

		player.emitter.on("currentSceneUpdated", (scene) => {
			setCurrentScene(scene);
		});

		player.emitter.on("currentEventUpdated", (event) => {
			console.log("currentEventUpdated2", event);
			setCurrentEvent(event);
		});

		player.emitter.on("gameLoaded", () => {
			console.log("gameLoaded");
			setGame(player.currentGame);
		});

		return cleanup;
	}, [player]); // Only re-run if the player instance changes

	// Load resources and game
	useEffect(() => {
		let isMounted = true;

		resourceManager.loadResources(resourcesToLoad).then(() => {
			if (!isMounted) return;

			setCache(resourceManager.cache);
			player.loadGame(gameToLoad);
		});

		return () => {
			isMounted = false;
		};
	}, [player, gameToLoad, resourcesToLoad]);

	return {
		game,
		state,
		stage,
		history,
		currentScene,
		currentEvent,
		cache,
	};
};
