import React, { useEffect, useState, useRef } from "react";
import {
	type Game,
	type GameEvent,
	type GameResources,
	type GameState,
	type MessageHistory,
	type Scene,
	type Stage,
	isChoiceScene,
} from "~/schema";
import { resourceManager } from "~/utils/preloader";
import { INITIAL_STAGE } from "./engine"; // 初期ステージの定義を流用
import { EventManager } from "./event"; // 新しいイベントマネージャー
import { GameScreen } from "./game-screen";

/**
 * GamePlayerコンポーネント
 */
export const GamePlayer = ({
	game,
	resources,
	initialSceneId,
	initialEventId,
}: {
	game: Game;
	resources: GameResources;
	initialSceneId?: string;
	initialEventId?: string;
}) => {
	// 基本的な状態
	const [state, setState] = useState<GameState>("loading");
	const [stage, setStage] = useState<Stage>(INITIAL_STAGE);

	const stageRef = useRef<Stage>(stage);

	const [history, setHistory] = useState<MessageHistory[]>([]);
	const [currentScene, setCurrentScene] = useState<Scene | null>(null);
	const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
	const [isResourcesLoaded, setIsResourcesLoaded] = useState(false);

	const eventManagerRef = useRef<EventManager | null>(null);

	if (!eventManagerRef.current) {
		eventManagerRef.current = new EventManager();
	}

	useEffect(() => {
		resourceManager.loadResources(resources).then(() => {
			setIsResourcesLoaded(true);
		});

		return () => {
			if (eventManagerRef.current) {
				eventManagerRef.current.dispose();
				eventManagerRef.current = null;
			}
		};
	}, [resources]);

	// 初期シーンとイベントの設定
	useEffect(() => {
		if (!isResourcesLoaded || !game) return;

		const sceneId = initialSceneId || game.initialSceneId;
		const scene = game.scenes.find((s) => s.id === sceneId);

		if (!scene) {
			throw new Error(`シーンが見つかりません: ${sceneId}`);
		}

		setCurrentScene(scene);

		// 初期イベントを取得（指定されている場合）
		if (initialEventId) {
			const event = scene.events.find((e) => e.id === initialEventId);
			if (event) {
				setCurrentEvent(event);
			}
		} else if (scene.events.length > 0) {
			// 最初のイベントを設定
			setCurrentEvent(scene.events[0]);
		}

		setState("playing");
	}, [game, initialSceneId, initialEventId, isResourcesLoaded]);

	// 現在のイベントが変更されたら処理
	useEffect(() => {
		if (currentEvent && state === "playing" && eventManagerRef.current) {
			const currentStage = stageRef.current;

			const processEvent = async () => {
				try {
					await eventManagerRef.current?.processGameEvent(
						currentEvent,
						currentStage,
						(updatedStage) => {
							stageRef.current = updatedStage;
							setStage(updatedStage);
						},
					);

					// テキストイベントの場合は履歴に追加
					if (currentEvent.type === "text") {
						setHistory((prev) => [
							...prev,
							{
								text: currentEvent.text,
								characterName: currentEvent.characterName || "",
							},
						]);
					}

					// イベント処理が完了したら次のイベントに進む
					goToNextEvent();
				} catch (error) {
					console.error("イベント処理エラー:", error);
				}
			};

			processEvent();
		}
	}, [currentEvent, state]);

	// 次のイベントに進む
	const goToNextEvent = () => {
		if (!currentScene || !currentEvent) return;

		// 現在のイベントのインデックスを取得
		const eventIndex = currentScene.events.findIndex(
			(e) => e.id === currentEvent.id,
		);

		if (eventIndex >= 0 && eventIndex < currentScene.events.length - 1) {
			// 次のイベントがある場合
			setCurrentEvent(currentScene.events[eventIndex + 1]);
		} else {
			// 次のイベントがない場合、シーンの分岐処理
			handleSceneBranching();
		}
	};

	// シーンの分岐処理
	const handleSceneBranching = () => {
		if (!currentScene) return;

		if (currentScene.sceneType === "choice") {
			// 選択肢表示
			setStage((prevStage) => ({
				...prevStage,
				choices: currentScene.choices,
			}));
			setState("idle");
		} else if (currentScene.sceneType === "goto") {
			// 次のシーンに移動
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
			// ゲーム終了
			setState("end");
		}
	};

	// 選択肢を選んだときの処理
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

		// 選択肢をクリア
		setStage((prevStage) => ({
			...prevStage,
			choices: [],
		}));

		// 次のシーンに移動
		const nextScene = game.scenes.find((s) => s.id === choice.nextSceneId);
		if (nextScene) {
			setCurrentScene(nextScene);
			if (nextScene.events.length > 0) {
				setCurrentEvent(nextScene.events[0]);
			}
		}

		setState("playing");
	};

	// 画面タップ処理
	const handleTapScreen = () => {
		if (state === "playing" && currentEvent) {
			// 現在のイベントの処理をキャンセル
			eventManagerRef.current?.addCancelRequest(currentEvent.id);
		}
	};

	return (
		<>
			<GameScreen
				stage={stage}
				history={history}
				state={state}
				manager={eventManagerRef.current}
				resourceCache={resourceManager.cache}
				currentEvent={currentEvent}
				onChoiceSelected={handleChoiceSelected}
				onTapScreen={handleTapScreen}
			/>

			{/* デバッグ情報（開発時のみ表示） */}
			{process.env.NODE_ENV === "development" && (
				<div className="absolute top-0 right-0 bg-black bg-opacity-70 text-white p-2 text-xs z-50">
					<div>State: {state}</div>
					<div>Scene: {currentScene?.id}</div>
					<div>Event: {currentEvent?.id}</div>
				</div>
			)}
		</>
	);
};

export default GamePlayer;
