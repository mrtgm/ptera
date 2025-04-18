import { api } from "@/client/api";
import { Toaster } from "@/client/components/shadcn/sonner";
import { useStore } from "@/client/stores";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type {
  EventResponse,
  GameDetailResponse,
  ResourceResponse,
  SceneResponse,
  UpdateGameRequest,
  UpdateSceneSettingRequest,
} from "@ptera/schema";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import {
  AdjustSizeDialogContainer,
  CharacterDialogContainer,
  PreviewDialogContainer,
} from "./components/dialogs";
import {
  AssetDialogContainer,
  type AssetDialogKeyType,
} from "./components/dialogs/asset";
import { EventDetail } from "./components/event-detail";
import { Graph } from "./components/graph";
import { Header } from "./components/header";
import { SceneDetail } from "./components/scene-detail";
import { EndingEditor } from "./components/scene-detail/ending-editor";
import { ScenesList } from "./components/scene-list";
import { ProjectSettings } from "./components/scene-list/project-settings";
import { Sidebar, SidebarItemCore } from "./components/sidebar";
import {
  SideBarSettings,
  type SidebarItem,
  getColorFromType,
} from "./constants";
import { useTimelineDrag } from "./hooks/use-timeline-drag";

const initialize = async (gameId: number) => {
  const [games, assets] = await Promise.all([
    api.games.get(gameId),
    api.auth.getMyAssets(),
  ]);
  return {
    game: games as GameDetailResponse,
    assets: assets as ResourceResponse,
  };
};

const toNumber = (id: string | undefined) => (id ? Number(id) : undefined);

export default function Editor() {
  const editorSlice = useStore.useSlice.editor();
  const modalSlice = useStore.useSlice.modal();

  const pathparams = useParams();
  const navigate = useNavigate();

  const gameId = toNumber(pathparams.gameId);
  const selectedSceneId = toNumber(pathparams.sceneId);
  const selectedEventId = toNumber(pathparams.eventId);

  const isOpenEnding = selectedEventId === 0;
  const selectedScene = editorSlice.editingGame?.scenes?.find(
    (scene) => scene.id === selectedSceneId,
  );
  const selectedEvent = selectedScene?.events?.find(
    (event) => event.id === selectedEventId,
  );

  useEffect(() => {
    if (!gameId) return;
    initialize(gameId).then(({ game, assets }) => {
      editorSlice.initializeEditor(game, assets);
    });
  }, [editorSlice.initializeEditor, gameId]);

  const handleNavigateToScene = (sceneId: number) => {
    navigate(`/dashboard/games/${gameId}/edit/scenes/${sceneId}`);
  };

  const handleNavigateToEvent = (eventId: number) => {
    navigate(
      `/dashboard/games/${gameId}/edit/scenes/${selectedSceneId}/events/${eventId}`,
    );
  };

  const handleNavigateToScenesList = () => {
    navigate(`/dashboard/games/${gameId}/edit`);
  };

  const handleClickSceneEnding = () => {
    navigate(
      `/dashboard/games/${gameId}/edit/scenes/${selectedSceneId}/events/0`,
    );
  };

  const handleAddScene = async (
    name: string,
    fromScene: SceneResponse,
    choiceId?: number | undefined,
  ) => {
    const newScene = await editorSlice.addScene({
      name,
      fromScene,
      choiceId,
    });
    toast.success("シーンを追加しました");
    return newScene;
  };

  const handleDeleteScene = () => {
    if (!selectedSceneId) return;
    editorSlice.deleteScene(selectedSceneId as number);
    handleNavigateToScenesList();
    toast.success("シーンを削除しました");
  };

  const handleSaveProjectSettings = async (data: UpdateGameRequest) => {
    await editorSlice.saveProjectSettings(data);
    toast.success("プロジェクト設定を保存しました");
  };

  const handleSaveSceneSettings = async (data: UpdateSceneSettingRequest) => {
    if (!selectedSceneId) return;
    await editorSlice.saveSceneSettings(selectedSceneId, data);
    toast.success("シーン設定を保存しました");
  };

  const handleDeleteEvent = async () => {
    if (!selectedSceneId || !selectedEventId) return;
    await editorSlice.deleteEvent(selectedEventId, selectedSceneId);
    handleNavigateToScene(selectedSceneId);
    toast.success("イベントを削除しました");
  };

  const handleSaveEvent = async (event: EventResponse) => {
    if (!selectedSceneId) return;
    await editorSlice.saveEvent(event, selectedSceneId);
    toast.success("イベントを保存しました");
  };

  const handleAddCharacter = (name: string) => {
    // TODO: 実装
    editorSlice.addCharacter(name);
    toast.success("キャラクターを追加しました");
  };

  const handleCharacterNameChange = (characterId: number, name: string) => {
    // TODO: 実装
    console.log("Change character name", characterId, name);
    editorSlice.updateCharacterName(characterId, name);
    toast.success("キャラクター名を変更しました");
  };

  const handleUploadCharacterImage = (characterId: number, file: File) => {
    // TODO: 実装
    console.log("Upload image", characterId, file);
    editorSlice.uploadCharacterImage(characterId, file);
    toast.success("キャラクター画像をアップロードしました");
  };

  const handleDeleteCharacterImage = (characterId: number, imageId: number) => {
    // TODO: 実装
    console.log("Delete image", characterId, imageId);
    editorSlice.deleteCharacterImage(characterId, imageId);
    toast.success("キャラクター画像を削除しました");
  };

  const handleDeleteCharacter = (characterId: number) => {
    // TODO: 実装
    console.log("Delete character", characterId);
    editorSlice.deleteCharacter(characterId);
    toast.success("キャラクターを削除しました");
  };

  const handleDeleteAsset = (assetId: number, type: AssetDialogKeyType) => {
    // TODO: 実装
    console.log("Delete asset", assetId, type);
    editorSlice.deleteAsset(assetId, type);
    toast.success("アセットを削除しました");
  };

  const handleUploadAsset = (file: File, type: AssetDialogKeyType) => {
    console.log("Upload asset", file, type);
    editorSlice.uploadAsset(file, type);
    toast.success("アセットをアップロードしました");
  };

  const handleSaveEnding = (
    endingScene: GameDetailResponse["scenes"][number],
  ) => {
    editorSlice.saveEnding(endingScene);
    toast.success("シーン終了設定を保存しました");
  };

  const handleAddEvent = async (
    index: number,
    item: SidebarItem,
    sceneId: number,
  ) => {
    await editorSlice.addEvent(index, item, sceneId);
    toast.success("イベントを追加しました");
  };

  const handleMoveEvent = (
    oldIndex: number,
    newIndex: number,
    sceneId: number,
  ) => {
    editorSlice.moveEvent(oldIndex, newIndex, sceneId);
    toast.success("イベントを移動しました");
  };

  const {
    sensors,
    activeSidebarItem,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useTimelineDrag({
    selectedSceneId,
    sceneEvents: selectedScene?.events,
    onAddEvent: handleAddEvent,
    onMoveEvent: handleMoveEvent,
  });

  if (!editorSlice.editingGame || !editorSlice.editingResources) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex items-center justify-center h-64 select-none">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">読み込み中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <Toaster />

      <CharacterDialogContainer
        game={editorSlice.editingGame}
        resources={editorSlice.editingResources}
        onCharacterNameChange={handleCharacterNameChange}
        onAddCharacter={handleAddCharacter}
        onDeleteCharacter={handleDeleteCharacter}
        onDeleteImage={handleDeleteCharacterImage}
        onUploadImage={handleUploadCharacterImage}
      />
      <AdjustSizeDialogContainer resources={editorSlice.editingResources} />
      <AssetDialogContainer
        game={editorSlice.editingGame}
        resources={editorSlice.editingResources}
        onDeleteAsset={handleDeleteAsset}
        onUploadAsset={handleUploadAsset}
        onNavigateToScene={handleNavigateToScene}
      />
      <PreviewDialogContainer
        game={editorSlice.editingGame}
        resources={editorSlice.editingResources}
      />

      <Header />
      <div className="w-full h-[calc(100dvh-40px)] grid grid-cols-12">
        {/* エンディング編集 */}
        {isOpenEnding && selectedScene && (
          <>
            <div className="col-span-3 border-r-[1px] border-gray-200">
              <Sidebar
                selectedScene={selectedScene}
                sideBarSettings={SideBarSettings}
                onSaveSettings={handleSaveSceneSettings}
              />
            </div>
            <div className="col-span-9 w-full h-full relative">
              <EndingEditor
                selectedScene={selectedScene}
                game={editorSlice.editingGame}
                onSaveEnding={handleSaveEnding}
                onNavigateToScene={handleNavigateToScene}
                onAddScene={handleAddScene}
              />
            </div>
          </>
        )}

        {/* 選択時 */}
        {selectedSceneId !== undefined && !isOpenEnding && (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <div className="col-span-3 border-r-[1px] border-gray-200">
              <Sidebar
                selectedScene={selectedScene}
                sideBarSettings={SideBarSettings}
                onSaveSettings={handleSaveSceneSettings}
              />
            </div>
            <div className="col-span-5 flex flex-col justify-center bg-white text-black relative">
              <SceneDetail
                selectedEvent={selectedEvent}
                selectedScene={selectedScene}
                game={editorSlice.editingGame}
                resources={editorSlice.editingResources}
                onNavigateToScenesList={handleNavigateToScenesList}
                onDeleteScene={handleDeleteScene}
                onClickEvent={handleNavigateToEvent}
                onClickSceneEnding={handleClickSceneEnding}
              />

              <DragOverlay>
                {activeSidebarItem && (
                  <SidebarItemCore
                    item={activeSidebarItem}
                    color={getColorFromType(activeSidebarItem.type)}
                  />
                )}
              </DragOverlay>
            </div>
          </DndContext>
        )}

        {/*　未選択時 */}
        {selectedSceneId === undefined && (
          <>
            <div className="col-span-3 border-r-[1px] border-gray-200 overflow-y-scroll">
              <div className="p-4">
                <ProjectSettings
                  game={editorSlice.editingGame}
                  categories={[]}
                  onSaveSettings={handleSaveProjectSettings}
                />
              </div>
            </div>
            <div className="col-span-5 flex flex-col bg-white text-black p-2">
              <ScenesList
                game={editorSlice.editingGame}
                sideBarSettings={SideBarSettings}
                onSceneClick={handleNavigateToScene}
              />
            </div>
          </>
        )}

        <div className="col-span-4 bg-[#EEEEEE]">
          {selectedScene && selectedEvent && !isOpenEnding && (
            <EventDetail
              key={selectedEventId}
              selectedScene={selectedScene}
              selectedEvent={selectedEvent}
              game={editorSlice.editingGame}
              resources={editorSlice.editingResources}
              onDeleteEvent={handleDeleteEvent}
              onSaveEvent={handleSaveEvent}
            />
          )}

          {!selectedEventId && !isOpenEnding && (
            <div className="w-full h-[calc(100dvh-40px)] sticky top-0">
              <Graph
                game={editorSlice.editingGame}
                onNavigateToScene={handleNavigateToScene}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
