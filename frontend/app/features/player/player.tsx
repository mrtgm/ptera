import { useCallback } from "react";
import { player } from "~/features/player/libs/engine";
import { resourceManager } from "~/utils/preloader";
import { GameScreen } from "./game-screen";
import { usePlayerInitialize } from "./hooks";

export const Player = () => {
	const { game, state, stage, history, currentEvent } = usePlayerInitialize();

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
		player.setState("beforeStart");
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
