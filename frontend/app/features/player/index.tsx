import { useCallback, useState } from "react";
import dummyAssets from "~/__mocks__/dummy-assets.json";
import dummyGame from "~/__mocks__/dummy-game.json";
import type { Game, GameResources } from "~/schema";
import { EndScreen } from "./components/end-screen";
import { GameScreen } from "./components/game-screen";
import { InitialScreen } from "./components/initial-screen";
import { usePlayerInitialize } from "./hooks";
import { Player as PlayerEngine } from "./utils/engine";

export const Player = () => {
	const [player] = useState(() => new PlayerEngine());

	const { game, state, stage, history, currentEvent, cache } =
		usePlayerInitialize({
			player,
			gameToLoad: dummyGame as Game,
			resourcesToLoad: dummyAssets as GameResources,
		});

	const handleTapGameScreen = useCallback(
		(e: React.MouseEvent) => {
			if (currentEvent && state !== "idle")
				player.addCancelRequest(currentEvent?.id);
		},
		[player, currentEvent, state],
	);

	const handleTapInitialScreen = () => {
		player.startGame();
	};

	const handleTapGoToInitialScreen = () => {
		player.setState("beforeStart");
	};

	const handleTapGoToOtherWorks = () => {
		// TODO: 他の作品へのリンク
	};

	return (
		<>
			{state === "loading" && (
				<div className="w-full h-full bg-black flex justify-center items-center select-none">
					<div className="text-white text-2xl">読み込み中...</div>
				</div>
			)}
			{state === "beforeStart" && (
				<InitialScreen
					game={game}
					handleTapInitialScreen={handleTapInitialScreen}
				/>
			)}
			{state === "end" && (
				<EndScreen
					handleTapGoToInitialScreen={handleTapGoToInitialScreen}
					handleTapGoToOtherWorks={handleTapGoToOtherWorks}
				/>
			)}
			{["idle", "playing"].includes(state) && (
				<GameScreen
					handleTapScreen={handleTapGameScreen}
					currentEvent={currentEvent}
					state={state}
					resourceCache={cache}
					history={history}
					player={player}
					stage={stage}
				/>
			)}
		</>
	);
};
