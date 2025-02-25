import { useEffect, useState } from "react";
import dummyAssets from "~/__mocks__/dummy-assets.json";
import dummyGame from "~/__mocks__/dummy-game.json";
import { resourceManager } from "~/utils/preloader";
import { states } from "./constants";
import { player } from "./libs/engine";

export const usePlayerInitialize = () => {
	const [game, setGame] = useState<Game | null>(null);
	const [state, setState] = useState<GameState>("loading");
	const [stage, setStage] = useState<Stage>(player.stage);
	const [cache, setCache] = useState<ResourceCache>(resourceManager.cache);
	const [history, setHistory] = useState<MessageHistory[]>([]);
	const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);

	useEffect(() => {
		resourceManager.loadResources(dummyAssets as GameResources).then(() => {
			setState("beforeStart");
			setCache(resourceManager.cache);

			player.loadGame(dummyGame as Game);
			player.currentGame && setGame(player.currentGame);

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

			player.emitter.on("currentEventUpdated", (event) => {
				setCurrentEvent(event);
			});
		});

		return () => {
			player.emitter.off("stageUpdated");
			player.emitter.off("currentEventUpdated");
			player.emitter.off("historyUpdated");

			for (const state of states) {
				player.emitter.off(state);
			}
		};
	}, []);

	return {
		game,
		state,
		stage,
		history,
		currentEvent,
		cache,
		setGame,
		setState,
		setStage,
		setHistory,
		setCurrentEvent,
		setCache,
	};
};
