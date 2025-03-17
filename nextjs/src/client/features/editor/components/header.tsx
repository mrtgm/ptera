import { Logo } from "@/client/components/logo";
import { Button } from "@/client/components/shadcn/button";
import { Menubar } from "@/client/components/shadcn/menubar";
import { useStore } from "@/client/stores";
import { sortEvent } from "@ptera/schema";
import Link from "next/link";
import { useParams } from "next/navigation";

export const Header = () => {
  const editorSlice = useStore.useSlice.editor();
  const modalSlice = useStore.useSlice.modal();
  const pathparams = useParams();
  const selectedSceneId = pathparams.sceneId;
  const selectedEventId = pathparams.eventId;

  if (!editorSlice.editingGame || !editorSlice.editingResources) {
    return null;
  }

  const previewSceneId =
    selectedSceneId ?? editorSlice.editingGame?.initialSceneId;

  const previewEventId =
    selectedEventId ?? //選択中のイベントがある
    editorSlice.editingGame.scenes
      .find((scene) => scene.id === previewSceneId)
      ?.events.sort(sortEvent)[0]?.id ?? //選択中のシーンの最初のイベントがある
    editorSlice.editingGame.scenes
      .find((scene) => scene.id === editorSlice.editingGame?.initialSceneId)
      ?.events.sort(sortEvent)[0]?.id ?? //初期シーンの最初のイベントがある
    null;

  return (
    <Menubar className="rounded-none flex justify-between bg-[#1E1E1E] text-[#8D8D8D] w-full">
      <div className="p-2">
        <Link href="/dashboard">
          <Logo variant="small" />
        </Link>
      </div>
      <div className="flex-1 flex gap-3 justify-end p-2">
        <>
          {previewEventId && (
            <Button
              variant="ghost"
              onClick={() => {
                modalSlice.openModal("preview", {
                  currentSceneId: Number(previewSceneId),
                  currentEventId: Number(previewEventId),
                  formValues: {},
                });
              }}
            >
              プレビュー
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => {
              modalSlice.openModal("asset.manage", {
                target: "backgroundImage",
              });
            }}
          >
            アセット
          </Button>
          <Button
            variant="ghost"
            onClick={() => modalSlice.openModal("character.manage", undefined)}
          >
            キャラクター
          </Button>
        </>
      </div>
    </Menubar>
  );
};
