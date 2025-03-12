"use client";

import {
	type Game,
	type GameEvent,
	type GameResources,
	type GameState,
	type MessageHistory,
	type Scene,
	type Stage,
	isChoiceScene,
} from "@/client/schema";
import { resourceManager } from "@/client/utils/preloader";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { EndScreen } from "./components/end-screen";
import { GameScreen } from "./components/game-screen";
import { InitialScreen } from "./components/initial-screen";
import { INITIAL_STAGE } from "./constants";
import type { EventManager } from "./utils/event";

export const GamePlayer = ({
	game,
	resources,
	initialScene,
	initialEvent,
	initialStage = INITIAL_STAGE,
	isPreviewMode,
	eventManager,
}: {
	game: Game;
	resources: GameResources;
	initialScene?: Scene;
	initialEvent?: GameEvent;
	initialStage?: Stage;
	isPreviewMode?: boolean;
	eventManager: EventManager;
}) => {
	const [state, setState] = useState<GameState>("loading");
	const [stage, setStage] = useState<Stage>(initialStage);

	const stageRef = useRef<Stage>(initialStage);

	const [history, setHistory] = useState<MessageHistory[]>([]);
	const [currentScene, setCurrentScene] = useState<Scene | null>(null);
	const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
	const [isResourcesLoaded, setIsResourcesLoaded] = useState(false);

	useEffect(() => {
		resourceManager.loadResources(resources).then(() => {
			setIsResourcesLoaded(true);

			if (isPreviewMode) {
				startGame();
			} else {
				setState("beforeStart");
			}
		});
	}, [resources, isPreviewMode]);

	const resetGame = useCallback(() => {
		setStage(initialStage);
		stageRef.current = initialStage;
		setHistory([]);
		setCurrentScene(null);
		setCurrentEvent(null);
		setState("beforeStart");
	}, [initialStage]);

	const startGame = useCallback(() => {
		if (!game) return;

		const sceneId = initialScene?.id || game.initialSceneId;
		const scene = game.scenes.find((s) => s.id === sceneId);

		if (!scene) {
			throw new Error(`シーンが見つかりません: ${sceneId}`);
		}

		setCurrentScene(scene);

		if (initialEvent) {
			const event = scene.events.find((e) => e.id === initialEvent.id);
			if (event) {
				setCurrentEvent(event);
			}
		} else if (scene.events.length > 0) {
			setCurrentEvent(scene.events[0]);
		}

		setState("playing");
	}, [game, initialScene, initialEvent]);

	const handleChageAutoMode = (isAutoMode: boolean) => {
		eventManager.setAutoMode(isAutoMode);
	};

	const handleChangeMute = (isMute: boolean) => {
		Howler.mute(isMute);
	};

	useEffect(() => {
		if (currentEvent && eventManager) {
			const processEvent = async () => {
				try {
					await eventManager.processGameEvent(
						currentEvent,
						stageRef.current,
						(updatedStage) => {
							stageRef.current = updatedStage;
							setStage(updatedStage);
						},
						(updateState) => {
							setState(updateState);
						},
						(message) => {
							setHistory((prev) => [
								...prev,
								{
									...message,
									isChoice: false,
								},
							]);
						},
					);

					goToNextEvent();
				} catch (error) {
					console.error("イベント処理エラー:", error);
				}
			};

			processEvent();
		}
	}, [currentEvent, eventManager]);

	const goToNextEvent = () => {
		if (!currentScene || !currentEvent) return;

		// TODO: イベントはソートしておく
		const eventIndex = currentScene.events.findIndex(
			(e) => e.id === currentEvent.id,
		);

		if (eventIndex >= 0 && eventIndex < currentScene.events.length - 1) {
			setCurrentEvent(currentScene.events[eventIndex + 1]);
		} else {
			handleSceneBranching();
		}
	};

	const handleSceneBranching = () => {
		if (!currentScene) return;

		if (currentScene.sceneType === "choice") {
			setStage((prevStage) => ({
				...prevStage,
				choices: currentScene.choices,
			}));

			setState("idle");
		} else if (currentScene.sceneType === "goto") {
			const nextScene = game.scenes.find(
				(s) => s.id === currentScene.nextSceneId,
			);

			if (nextScene) {
				setCurrentScene(nextScene);
				if (nextScene.events.length > 0) {
					setCurrentEvent(nextScene.events[0]);
				}
			}
		} else if (currentScene.sceneType === "end") {
			setState("end");
		}
	};

	const handleChoiceSelected = (choiceId: string) => {
		if (!currentScene || !isChoiceScene(currentScene)) return;

		const choice = currentScene.choices.find((c) => c.id === choiceId);
		if (!choice) return;

		// 選択肢を履歴に追加
		setHistory((prev) => [
			...prev,
			{
				text: choice.text,
				isChoice: true,
			},
		]);

		setStage((prevStage) => ({
			...prevStage,
			choices: [],
		}));

		const nextScene = game.scenes.find((s) => s.id === choice.nextSceneId);
		if (nextScene) {
			setCurrentScene(nextScene);
			if (nextScene.events.length > 0) {
				setCurrentEvent(nextScene.events[0]);
			}
		}

		setState("playing");
	};

	const handleTapScreen = () => {
		if (state === "playing" && currentEvent) {
			eventManager.addCancelRequest(currentEvent.id);
		}
	};

	const handleTapInitialScreen = useCallback(() => {
		startGame();
	}, [startGame]);

	const handleTapGoToInitialScreen = useCallback(() => {
		resetGame();
	}, [resetGame]);

	const handleTapGoToOtherWorks = () => {};

	return (
		<>
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
						stage={stage}
						history={history}
						state={state}
						manager={eventManager}
						resourceCache={resourceManager.cache}
						currentEvent={currentEvent}
						onChoiceSelected={handleChoiceSelected}
						onTapScreen={handleTapScreen}
						onChangeAutoMode={handleChageAutoMode}
						onChangeMute={handleChangeMute}
						isPreviewMode={isPreviewMode}
					/>
				)}
			</>

			{process.env.NODE_ENV === "development" && (
				<div className="absolute bottom-0 left-0 bg-black/70 text-white p-2 text-xs z-50">
					<div>State: {state}</div>
					<div>Scene: {currentScene?.id}</div>
					<div>Event: {currentEvent?.id}</div>
				</div>
			)}
		</>
	);
};

export default GamePlayer;
