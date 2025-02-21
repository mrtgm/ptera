import { memo, useEffect, useRef, useState } from "react";
import dummyAssets from "~/datas/dummy-assets.json";
import dummyGame from "~/datas/dummy-game.json";
import { type State, player } from "~/stores/player";

export const Player = () => {
	const [game, setGame] = useState<Game | null>(null);
	const [state, setState] = useState<State>("beforeStart");

	useEffect(() => {
		player.loadGame(dummyGame as Game);
		player.setCurrentResources(dummyAssets as GameResources);

		player.currentGame && setGame(player.currentGame);

		const states = ["beforeStart", "playing", "end", "idle"] as const;
		for (const state of states) {
			player.emitter.on(state, () => {
				setState(state);
			});
		}
	}, []);

	const handleTapGameScreen = () => {
		if (player.currentEvent && state !== "idle")
			player.addCancelRequest(player.currentEvent.id);
	};

	const handleTapInitialScreen = () => {
		player.startGame();
	};

	const handleTapGoToInitialScreen = () => {
		setState("beforeStart");
	};

	const handleTapGoToOtherWorks = () => {
		// TODO: 他の作品へのリンク
	};

	return state === "beforeStart" ? (
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
		<GameScreen handleTapScreen={handleTapGameScreen} />
	);
};

const GameScreen = memo(
	({
		handleTapScreen,
	}: {
		handleTapScreen: () => void;
	}) => {
		return (
			<div
				id="game-screen"
				className="w-dvw h-[calc(100dvh-64px)] max-w-[1000px] min-w-[320px] min-h-[500px] relative bg-white overflow-hidden select-none"
				onClick={handleTapScreen}
				onKeyDown={() => {}}
			>
				{/* bg-image */}
				<Background />

				{/* character */}
				<Character />

				{/* effect */}
				<Effect />

				{/* choice */}
				<Choice />

				{/* dialog */}
				<Dialog />
			</div>
		);
	},
);

const Effect = () => {
	return (
		<div
			id="effect-container"
			className="w-full h-full absolute select-none pointer-events-none"
		/>
	);
};

const Dialog = () => {
	return (
		<div
			id="dialog"
			className="opacity-0 bg-gray-900 bg-opacity-90 absolute bottom-1 w-[calc(100%-16px)] h-[200px] m-auto left-0 right-0 text-white p-4"
		>
			<div
				id="dialog-character-name"
				className="text-lg absolute -top-12 left-0 bg-opacity-90"
			/>
			<span id="dialog-text" />
		</div>
	);
};

const Choice = () => {
	return (
		<div
			id="choice-container"
			className="opacity-0 absolute top-0 left-0 w-full h-full z-10 bg-black bg-opacity-50"
		>
			<ul
				id="choice-list"
				className="flex flex-col justify-center items-center h-full"
			/>
		</div>
	);
};

const Character = () => {
	return <div id="character-container" className="w-full h-full absolute" />;
};

const Background = () => {
	return <div id="background" className="w-full h-full absolute" />;
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
