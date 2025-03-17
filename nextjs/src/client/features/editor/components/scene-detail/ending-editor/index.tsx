import { type Choice, isChoiceScene, isGotoScene } from "@/client/schema";
import type React from "react";
import { useRef, useState } from "react";

import { Button } from "@/client/components/shadcn/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/client/components/shadcn/tabs";
import { randomIntId } from "@/server/shared/utils/id";
import type {
  ChoiceScene,
  EndScene,
  GameDetailResponse,
  GotoScene,
  SceneResponse,
} from "@ptera/schema";
import { Graph } from "../../graph";
import { ChoiceSceneContent } from "./choice-scene-content";
import { EndSceneContent } from "./end-scene-content";
import { GotoSceneContent } from "./goto-scene-content";
import { NewSceneDialog } from "./new-scene-dialog";

interface EndingEditorProps {
  selectedScene: SceneResponse;
  game: GameDetailResponse | null;
  onSaveEnding: (endingScene: SceneResponse) => void;
  onNavigateToScene: (sceneId: number) => void;
  onAddScene: (
    sceneTitle: string,
    fromScene: SceneResponse,
    choiceId?: number | undefined,
  ) => Promise<SceneResponse | null | undefined>;
}

export const EndingEditor: React.FC<EndingEditorProps> = ({
  selectedScene,
  game,
  onSaveEnding,
  onNavigateToScene,
  onAddScene,
}) => {
  // ゲーム全体をローカルステートとして保持する
  const [localGame, setLocalGame] = useState<GameDetailResponse | null>(game);
  const [hasChanges, setHasChanges] = useState(false);
  const [isNewSceneDialogOpen, setIsNewSceneDialogOpen] = useState(false);
  const activeChoiceId = useRef<number | undefined>(undefined);

  const currentScene = localGame?.scenes.find(
    (scene) => scene.id === selectedScene.id,
  );

  if (!localGame || !currentScene) {
    return null;
  }

  const handleSceneTypeChange = (value: string) => {
    setLocalGame((prevGame) => {
      if (!prevGame) return prevGame;

      // シーンのタイプ変更時に初期値を設定
      const updatedScenes = prevGame.scenes.map((scene) => {
        if (scene.id !== selectedScene.id) return scene;

        if (value === "end") {
          return { ...scene, sceneType: "end" } as EndScene;
        }
        if (value === "goto") {
          return {
            ...scene,
            sceneType: "goto",
            nextSceneId: undefined,
            ...(isGotoScene(selectedScene) && {
              nextSceneId: selectedScene.nextSceneId,
            }),
          } as GotoScene;
        }
        if (value === "choice") {
          return {
            ...scene,
            sceneType: "choice",
            choices: [],
            ...(isChoiceScene(selectedScene) && {
              choices: selectedScene.choices,
            }),
          } as ChoiceScene;
        }
        return scene;
      });

      return {
        ...prevGame,
        scenes: updatedScenes,
      };
    });

    setHasChanges(true);
  };

  const handleAddChoice = () => {
    setLocalGame((prevGame) => {
      if (!prevGame) return prevGame;

      const initialScene = prevGame.scenes.find(
        (scene) => scene.id === prevGame.initialSceneId,
      );

      if (!initialScene) {
        throw new Error("Initial scene not found");
      }

      const updatedScenes = prevGame.scenes.map((scene) => {
        if (scene.id !== selectedScene.id) return scene;
        if (!isChoiceScene(scene)) return scene;

        return {
          ...scene,
          choices: [
            ...scene.choices,
            {
              id: randomIntId(),
              text: "",
              nextSceneId: undefined,
            } as unknown as Choice, // 一時的に undefined を許容
          ],
        };
      });

      return {
        ...prevGame,
        scenes: updatedScenes,
      };
    });
    setHasChanges(true);
  };

  const handleRemoveChoice = (choiceId: number) => {
    setLocalGame((prevGame) => {
      if (!prevGame) return prevGame;

      const updatedScenes = prevGame.scenes.map((scene) => {
        if (scene.id !== selectedScene.id) return scene;
        if (!isChoiceScene(scene)) return scene;

        return {
          ...scene,
          choices: scene.choices.filter((choice) => choice.id !== choiceId),
        };
      });

      return {
        ...prevGame,
        scenes: updatedScenes,
      };
    });
    setHasChanges(true);
  };

  const handleChoiceTextChange = (choiceId: number, text: string) => {
    setLocalGame((prevGame) => {
      if (!prevGame) return prevGame;

      const updatedScenes = prevGame.scenes.map((scene) => {
        if (scene.id !== selectedScene.id) return scene;
        if (!isChoiceScene(scene)) return scene;

        return {
          ...scene,
          choices: scene.choices.map((choice) =>
            choice.id === choiceId ? { ...choice, text } : choice,
          ),
        };
      });

      return {
        ...prevGame,
        scenes: updatedScenes,
      };
    });
    setHasChanges(true);
  };

  const handleChoiceNextSceneChange = (
    choiceId: number,
    nextSceneId: number,
  ) => {
    setLocalGame((prevGame) => {
      if (!prevGame) return prevGame;

      const updatedScenes = prevGame.scenes.map((scene) => {
        if (scene.id !== selectedScene.id) return scene;
        if (!isChoiceScene(scene)) return scene;

        return {
          ...scene,
          choices: scene.choices.map((choice) =>
            choice.id === choiceId ? { ...choice, nextSceneId } : choice,
          ),
        };
      });

      return {
        ...prevGame,
        scenes: updatedScenes,
      };
    });
    setHasChanges(true);
  };

  const handleNextSceneChange = (nextSceneId: number) => {
    setLocalGame((prevGame) => {
      if (!prevGame) return prevGame;

      const updatedScenes = prevGame.scenes.map((scene) => {
        if (scene.id !== selectedScene.id) return scene;
        if (!isGotoScene(scene)) return scene;

        return {
          ...scene,
          nextSceneId,
        };
      });

      return {
        ...prevGame,
        scenes: updatedScenes,
      };
    });
    setHasChanges(true);
  };

  const handleOpenNewSceneDialog = (
    choiceId: number | undefined = undefined,
  ) => {
    activeChoiceId.current = choiceId;
    setIsNewSceneDialogOpen(true);
  };

  const handleCreateNewScene = async (newSceneTitle: string) => {
    if (!newSceneTitle.trim() || !currentScene) {
      return;
    }

    const newScene = await onAddScene(
      newSceneTitle,
      currentScene,
      activeChoiceId.current,
    );

    if (!newScene) return;

    let updatedScene = null;

    setLocalGame((prevGame) => {
      if (!prevGame) return prevGame;

      const updatedScenes = prevGame.scenes.map((scene) => {
        if (scene.id !== selectedScene.id) return scene;

        updatedScene = scene;

        if (isGotoScene(scene)) {
          updatedScene = {
            ...scene,
            nextSceneId: newScene.id,
          };
        }

        if (isChoiceScene(scene) && activeChoiceId.current) {
          updatedScene = {
            ...scene,
            choices: scene.choices.map((choice) => {
              if (choice.id === activeChoiceId.current) {
                return {
                  ...choice,
                  nextSceneId: newScene.id,
                };
              }
              return choice;
            }),
          };
        }

        return updatedScene;
      });

      return {
        ...prevGame,
        scenes: [...updatedScenes, newScene],
      };
    });

    activeChoiceId.current = undefined;
    setIsNewSceneDialogOpen(false);

    setHasChanges(false);
  };

  const handleSave = () => {
    if (!currentScene) return;

    if (isGotoScene(currentScene)) {
      if (!currentScene.nextSceneId) {
        alert("遷移先シーンを選択してください");
        return;
      }
    }
    if (isChoiceScene(currentScene)) {
      const validChoices = currentScene.choices.filter(
        (choice) => choice.text.trim() !== "" && choice.nextSceneId !== 0,
      );
      if (validChoices.length === 0) {
        alert("選択肢のテキストを入力してください");
        return;
      }
      const undefinedNextScene = validChoices.find(
        (choice) => choice.nextSceneId === undefined,
      );
      if (undefinedNextScene) {
        alert("選択肢の遷移先を選択してください");
        return;
      }
    }

    setHasChanges(false);
    onSaveEnding(currentScene);
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        "変更が保存されていません。このページから移動してもよろしいですか？",
      );
      if (!confirmed) return;
    }
    onNavigateToScene(selectedScene.id);
  };

  return (
    <div className="absolute w-full top-0 grid-cols-9 grid">
      <div className="col-span-5">
        <div className="bg-white rounded-lg shadow overflow-y-auto h-[calc(100dvh-40px)]">
          <div className="sticky top-0 z-10 bg-white border-b p-2 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">シーン終了設定</h2>
              <p className="text-sm text-gray-500">{currentScene.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                キャンセル
              </Button>
              <Button size="sm" onClick={handleSave}>
                保存
              </Button>
            </div>
          </div>

          <div className="p-4">
            <Tabs
              defaultValue={currentScene.sceneType}
              onValueChange={handleSceneTypeChange}
              className="mb-6"
            >
              <TabsList className="grid grid-cols-3 mb-2">
                <TabsTrigger value="end">終了</TabsTrigger>
                <TabsTrigger value="goto">遷移</TabsTrigger>
                <TabsTrigger value="choice">選択肢</TabsTrigger>
              </TabsList>

              {currentScene.sceneType === "end" && (
                <TabsContent value="end" className="space-y-4">
                  <EndSceneContent />
                </TabsContent>
              )}

              {currentScene.sceneType === "goto" && (
                <TabsContent value="goto" className="space-y-4">
                  <GotoSceneContent
                    scene={currentScene as GotoScene}
                    game={localGame}
                    currentSceneId={currentScene.id}
                    onNextSceneChange={handleNextSceneChange}
                    onNavigateToScene={onNavigateToScene}
                    onOpenNewSceneDialog={() =>
                      handleOpenNewSceneDialog(undefined)
                    }
                  />
                </TabsContent>
              )}

              {currentScene.sceneType === "choice" && (
                <TabsContent value="choice" className="space-y-4">
                  <ChoiceSceneContent
                    scene={currentScene as ChoiceScene}
                    game={localGame}
                    currentSceneId={currentScene.id}
                    onAddChoice={handleAddChoice}
                    onRemoveChoice={handleRemoveChoice}
                    onChoiceTextChange={handleChoiceTextChange}
                    onChoiceNextSceneChange={handleChoiceNextSceneChange}
                    onNavigateToScene={onNavigateToScene}
                    onCreateNewSceneForChoice={handleOpenNewSceneDialog}
                  />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>

        <NewSceneDialog
          isOpen={isNewSceneDialogOpen}
          onClose={() => {
            setIsNewSceneDialogOpen(false);
            activeChoiceId.current = undefined;
          }}
          onCreateScene={handleCreateNewScene}
        />
      </div>

      <div className="col-span-4">
        <Graph game={localGame} onNavigateToScene={onNavigateToScene} />
      </div>
    </div>
  );
};
