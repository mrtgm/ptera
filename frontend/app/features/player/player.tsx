import { useCallback, useEffect, useState } from "react";
import dummyAssets from "~/__mocks__/dummy-assets.json";
import dummyGame from "~/__mocks__/dummy-game.json";
import { player } from "~/features/player/libs/engine";
import { resourceManager } from "~/utils/preloader";
import { GameScreen } from "./game-screen";

const states = ["beforeStart", "playing", "end", "idle"] as const;

export const Player = () => {
	const [game, setGame] = useState<Game | null>(null);
	const [state, setState] = useState<GameState>("loading");
	const [history, setHistory] = useState<MessageHistory[]>([]);
	const [stage, setStage] = useState<Stage>(player.stage);
	const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);

	useEffect(() => {
		resourceManager.loadResources(dummyAssets as GameResources).then(() => {
			setState("beforeStart");

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

			for (const state of states) {
				player.emitter.off(state);
			}
		};
	}, []);

	const handleTapGameScreen = useCallback(
		(e: React.MouseEvent) => {
			if (currentEvent && state !== "idle")
				player.addCancelRequest(currentEvent?.id);
		},
		[currentEvent, state],
	);

	const handleTapInitialScreen = () => {
		player.startGame();
	};

	const handleTapGoToInitialScreen = () => {
		setState("beforeStart");
	};

	const handleTapGoToOtherWorks = () => {
		// TODO: 他の作品へのリンク
	};

	return state === "loading" ? (
		<div className="w-full h-full bg-black flex justify-center items-center select-none">
			<div className="text-white text-2xl">読み込み中...</div>
		</div>
	) : state === "beforeStart" ? (
		<InitialScreen
			game={game}
			handleTapInitialScreen={handleTapInitialScreen}
		/>
	) : state === "end" ? (
		<EndScreen
			handleTapGoToInitialScreen={handleTapGoToInitialScreen}
			handleTapGoToOtherWorks={handleTapGoToOtherWorks}
		/>
	) : (
		<GameScreen
			handleTapScreen={handleTapGameScreen}
			currentEvent={currentEvent}
			state={state}
			resourceCache={resourceManager.cache}
			history={history}
			stage={stage}
		/>
	);
};

const InitialScreen = ({
	game,
	handleTapInitialScreen,
}: {
	game: Game | null;
	handleTapInitialScreen: () => void;
}) => {
	return (
		<div
			className="w-full h-full bg-black flex flex-col justify-center items-center select-none"
			onClick={handleTapInitialScreen}
			onKeyDown={() => {}}
		>
			<div className="text-white text-4xl">{game?.title}</div>
			<div className="text-white text-2xl">{game?.author}</div>
			<div className="text-white text-lg">タップしてスタート</div>
		</div>
	);
};

const EndScreen = ({
	handleTapGoToInitialScreen,
	handleTapGoToOtherWorks,
}: {
	handleTapGoToInitialScreen: () => void;
	handleTapGoToOtherWorks: () => void;
}) => {
	return (
		<div
			id="end-screen"
			className="bg-gray-900 bg-opacity-90 absolute top-0 w-full h-full flex flex-col justify-center items-center select-none"
		>
			<div
				onClick={handleTapGoToInitialScreen}
				onKeyDown={() => {}}
				className="text-white text-2xl cursor-pointer"
			>
				もう一度最初から始める
			</div>
			<div
				onClick={handleTapGoToOtherWorks}
				onKeyDown={() => {}}
				className="text-white text-lg cursor-pointer"
			>
				他の作品を見る
			</div>
		</div>
	);
};
