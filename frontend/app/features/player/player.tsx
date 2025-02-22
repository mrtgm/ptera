import { X } from "lucide-react";
import { memo, useEffect, useState } from "react";
import dummyAssets from "~/datas/dummy-assets.json";
import dummyGame from "~/datas/dummy-game.json";
import { type GameState, player } from "~/stores/player";
import { resourceManager } from "~/utils/preloader";
import { AnimatePresence } from "./animatePresence";

export const Player = () => {
	const [game, setGame] = useState<Game | null>(null);
	const [state, setState] = useState<GameState>("beforeStart");
	const [stage, setStage] = useState<Stage>(player.stage);
	const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);

	useEffect(() => {
		player.loadGame(dummyGame as Game);
		resourceManager.loadResources(dummyAssets as GameResources);

		player.currentGame && setGame(player.currentGame);

		const states = ["beforeStart", "playing", "end", "idle"] as const;
		for (const state of states) {
			player.emitter.on(state, () => {
				setState(state);
			});
		}

		player.emitter.on("stageUpdated", (stage) => {
			setStage(stage);
		});

		player.emitter.on("currentEventUpdated", (event) => {
			console.log("currentEventUpdated", event);
			setCurrentEvent(event);
		});

		return () => {
			player.emitter.off("stageUpdated");
			player.emitter.off("currentEventUpdated");

			for (const state of states) {
				player.emitter.off(state);
			}
		};
	}, []);

	const handleTapGameScreen = (e: React.MouseEvent) => {
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
		<GameScreen
			handleTapScreen={handleTapGameScreen}
			currentEvent={currentEvent}
			state={state}
			stage={stage}
		/>
	);
};

const GameScreen = memo(
	({
		handleTapScreen,
		stage,
		state,
		currentEvent,
	}: {
		handleTapScreen: (e: React.MouseEvent) => void;
		stage: Stage;
		state: GameState;
		currentEvent: GameEvent | null;
	}) => {
		return (
			<div
				id="game-screen"
				className="w-dvw h-[calc(100dvh-64px)] max-w-[1000px] min-w-[320px] min-h-[500px] relative bg-white overflow-hidden select-none"
				onClick={handleTapScreen}
				onKeyDown={() => {}}
			>
				<Ui />
				<History />
				<Background background={stage.background} currentEvent={currentEvent} />
				<Character characters={stage.characters} currentEvent={currentEvent} />
				<FadeOutEffect effect={stage.effect} currentEvent={currentEvent} />
				<Choice choices={stage.choices} currentEvent={currentEvent} />
				<Dialog
					dialog={stage.dialog}
					currentEvent={currentEvent}
					state={state}
				/>
			</div>
		);
	},
);

const History = () => {
	const handleTapHistoryClose = () => {
		player.closeHistory();
	};

	return (
		<div
			id="history-modal"
			className="z-30 hidden h-full w-full bg-gray-900 bg-opacity-90 text-white text-sm absolute top-0 left-0 p-4"
		>
			<div
				className="absolute top-2 right-2 cursor-pointer p-2"
				onClick={handleTapHistoryClose}
				onKeyDown={() => {}}
			>
				<X id="history-close" />
			</div>
			<ul id="history-text" className="overflow-y-scroll h-[calc(100%-32px)]" />
		</div>
	);
};

const Ui = () => {
	const handleTapMuteIndicator = () => {
		player.toggleMute();
	};

	const handleHisotyButton = () => {
		player.showHistory();
	};

	return (
		<div
			id="ui"
			className="absolute z-20 top-0 left-0 w-full h-16 flex justify-end items-center"
		>
			<div
				id="mute-indicator"
				className="text-white text-lg mr-4 cursor-pointer p-2 bg-slate-900 bg-opacity-70 rounded-sm"
				onClick={handleTapMuteIndicator}
				onKeyDown={() => {}}
			>
				Mute
			</div>
			<div
				id="history-button"
				className="text-white text-lg mr-4 cursor-pointer p-2 bg-slate-900 bg-opacity-70 rounded-sm"
				onClick={handleHisotyButton}
				onKeyDown={() => {}}
			>
				History
			</div>
		</div>
	);
};

const FadeOutEffect = ({
	effect,
	currentEvent,
}: { effect: Stage["effect"]; currentEvent: GameEvent | null }) => {
	if (!currentEvent) return null;

	return (
		<AnimatePresence
			eventId={currentEvent.id}
			config={{
				enter: {
					configs: {
						duration: effect?.duration || 800,
						easing: "easeInOutQuad",
					},
				},
				exit: {
					configs: {
						duration: effect?.duration || 800,
						easing: "easeInOutQuad",
					},
				},
			}}
		>
			{effect?.type === "fadeOut" && (
				<div
					id="effect-container"
					className="opacity-0 w-full h-full absolute select-none pointer-events-none bg-black"
				/>
			)}
		</AnimatePresence>
	);
};

const Dialog = ({
	state,
	dialog,
	currentEvent,
}: {
	state: GameState;
	dialog: Stage["dialog"];
	currentEvent: GameEvent | null;
}) => {
	if (!currentEvent) return null;

	return (
		<AnimatePresence
			eventId={currentEvent.id}
			config={{
				enter: {
					configs: {
						duration: dialog.duration || 800,
						easing: "easeInOutQuad",
					},
				},
				exit: {
					configs: {
						duration: dialog.duration || 800,
						easing: "easeInOutQuad",
					},
				},
			}}
		>
			{dialog.isVisible && (
				<div
					id="dialog"
					className="opacity-0 bg-gray-900 bg-opacity-90 absolute bottom-1 w-[calc(100%-16px)] h-[200px] m-auto left-0 right-0 text-white p-4"
				>
					{dialog.characterName && (
						<div className="text-lg absolute -top-12 left-0 bg-opacity-90 bg-gray-900 p-2">
							{dialog.characterName}
						</div>
					)}
					<span>{dialog.text}</span>

					{state === "idle" && (
						<span className="text-white text-sm animate-bounce inline-block ml-2">
							▼
						</span>
					)}
				</div>
			)}
		</AnimatePresence>
	);
};

const Choice = ({
	choices,
	currentEvent,
}: {
	choices: Stage["choices"];
	currentEvent: GameEvent | null;
}) => {
	if (!currentEvent) return null;

	const handleTapChoice = (index: number) => {
		player.selectChoice(choices[index]);
	};

	return (
		<AnimatePresence
			eventId={currentEvent.id}
			config={{
				enter: {
					configs: {
						duration: 100,
						easing: "easeInOutQuad",
					},
				},
				exit: {
					configs: {
						duration: 100,
						easing: "easeInOutQuad",
					},
				},
			}}
		>
			{choices.length > 0 && (
				<div className="w-full h-full absolute top-0 left-0 z-10 bg-black bg-opacity-50">
					<ul className="flex flex-col justify-center items-center h-full">
						{choices.map((choice, index) => (
							<li
								key={choice.id}
								className="text-white text-lg p-2 m-2 bg-gray-800 cursor-pointer"
								onClick={() => handleTapChoice(index)}
								onKeyDown={() => {}}
							>
								{choice.text}
							</li>
						))}
					</ul>
				</div>
			)}
		</AnimatePresence>
	);
};

const Character = ({
	characters,
	currentEvent,
}: {
	characters: Stage["characters"];
	currentEvent: GameEvent | null;
}) => {
	if (!currentEvent) return null;

	const charcterEvent =
		currentEvent.type === "appearCharacter" ? currentEvent : null;

	return (
		<div id="character-container" className="w-full h-full absolute">
			<AnimatePresence
				eventId={currentEvent.id}
				config={{
					enter: {
						configs: {
							duration: charcterEvent?.duration || 800,
							easing: "easeInOutQuad",
						},
					},
					exit: {
						configs: {
							duration: charcterEvent?.duration || 800,
							easing: "easeInOutQuad",
						},
					},
				}}
			>
				{characters.map((character) => (
					<div
						id={character.id}
						key={character.imageId}
						className="object-contain absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 max-w-max w-full"
						style={{
							height: `${character.scale * 100}%`,
						}}
					>
						<img
							src={
								resourceManager.getResource("characters", character.id)?.images[
									character.imageId
								].url
							}
							alt="character"
							className="h-full w-auto relative m-auto"
							style={{
								top: `${character.position[1] * 100}%`,
								left: `${character.position[0] * 100}%`,
							}}
						/>
					</div>
				))}
			</AnimatePresence>
		</div>
	);
};

const Background = ({
	background,
	currentEvent,
}: {
	background: Stage["background"] | null;
	currentEvent: GameEvent | null;
}) => {
	if (!background || !currentEvent) return null;

	return (
		<AnimatePresence
			eventId={currentEvent.id}
			config={{
				enter: {
					configs: {
						duration: background.duration,
						easing: "easeInOutQuad",
					},
				},
				exit: {
					configs: {
						duration: background.duration,
						easing: "easeInOutQuad",
					},
				},
			}}
		>
			{background && (
				<div
					id="background"
					className="w-full h-full absolute"
					key={background.id}
				>
					<img
						src={
							resourceManager.getResource("backgroundImages", background.id)
								?.url
						}
						alt=""
						className="w-full h-full object-cover"
					/>
				</div>
			)}
		</AnimatePresence>
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
