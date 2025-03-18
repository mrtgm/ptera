"use client";

import {
  type GameState,
  type MessageHistory,
  type Stage,
  isChoiceScene,
} from "@/client/schema";
import { waitMs } from "@/client/utils/function";
import { resourceManager } from "@/client/utils/preloader";
import type {
  EventResponse,
  GameDetailResponse,
  GameEvent,
  ResourceResponse,
  SceneResponse,
} from "@ptera/schema";
import { Loader2 } from "lucide-react";
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
  game: GameDetailResponse;
  resources: ResourceResponse;
  initialScene?: SceneResponse;
  initialEvent?: EventResponse;
  initialStage?: Stage;
  isPreviewMode?: boolean;
  eventManager: EventManager;
}) => {
  const [state, setState] = useState<GameState>("loading");
  const [stage, setStage] = useState<Stage>(initialStage);

  const stageRef = useRef<Stage>(initialStage);

  const [error, setError] = useState<{
    title: string;
    message: string;
  } | null>();

  const [history, setHistory] = useState<MessageHistory[]>([]);
  const [currentScene, setCurrentScene] = useState<SceneResponse | null>(null);
  const [currentEvent, setCurrentEvent] = useState<EventResponse | null>(null);

  const alreadyStarted = useRef(false);

  useEffect(() => {
    if (!resources) return;

    resourceManager
      .loadResources(resources)
      .then(async () => {
        if (isPreviewMode) {
          startGame();
        } else {
          if (alreadyStarted.current) return;
          setState("beforeStart");
          alreadyStarted.current = true;
        }
      })
      .catch((error) => {
        setError({
          title: "リソースの読み込みに失敗しました。設定が間違ってるかも。",
          message: error.message,
        });
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

  const alreadyPlaying = useRef(false);

  useEffect(() => {
    if (currentEvent && eventManager) {
      const processEvent = async () => {
        if (alreadyPlaying.current) return;
        alreadyPlaying.current = true;
        try {
          await eventManager.processGameEvent(
            currentEvent as GameEvent,
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

          alreadyPlaying.current = false;

          goToNextEvent();
        } catch (error) {
          console.error("イベント処理エラー:", error);
          setError({
            title:
              "イベント処理中にエラーが発生しました。設定を確認してください。",
            message: JSON.stringify(error),
          });
        }
      };

      processEvent();
    }
  }, [currentEvent, eventManager]);

  const goToNextEvent = () => {
    if (!currentScene || !currentEvent) return;

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

  const handleChoiceSelected = (choiceId: number) => {
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
    if (state !== "beforeStart") return;
    startGame();
  }, [startGame, state]);

  const handleTapGoToInitialScreen = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handleTapGoToOtherWorks = () => {};

  return (
    <>
      <>
        {error && (
          <div className="w-full h-full bg-blue-800 flex-col justify-center items-center select-none">
            <div className="text-white text-2xl">{error.title}</div>
            <div className="text-white text-sm">{error.message}</div>
          </div>
        )}
        {state === "loading" && (
          <div className="w-full h-full bg-black flex justify-center items-center select-none">
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
              <span className="ml-2 text-white">リソースを読み込み中...</span>
            </div>
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
