import { Button } from "@/client/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/client/components/shadcn/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/client/components/shadcn/tabs";
import { FILE_VALIDATION_SETTING } from "@/client/features/editor/constants";
import { useStore } from "@/client/stores";
import type {
  AssetManageParams,
  AssetSelectParams,
  ModalState,
} from "@/client/stores/modal";
import type {
  AssetResponse,
  GameDetailResponse,
  ResourceResponse,
} from "@ptera/schema";
import { Film, Image, Music, Volume2 } from "lucide-react";
import { type ReactElement, useEffect, useState } from "react";
import { ResourceValidator } from "../../../utils/resource-validator";
import { ValidationErrorAlert } from "../../validtion-error-alert";
import { AssetUpload } from "../asset-upload";
import { useDeleteConfirmationDialog } from "../delete-confirmation-dialog";
import { AssetCard } from "./asset-card";

type resources = Omit<ResourceResponse, "character">;
export type AssetDialogKeyType = keyof resources;

export const AssetDialogContainer = ({
  game,
  resources,
  onDeleteAsset,
  onUploadAsset,
  onNavigateToScene,
}: {
  game: GameDetailResponse | null;
  resources: ResourceResponse | null;
  onDeleteAsset: (assetId: number, type: AssetDialogKeyType) => void;
  onUploadAsset: (file: File, type: AssetDialogKeyType) => void;
  onNavigateToScene: (sceneId: number) => void;
}) => {
  const modalSlice = useStore.useSlice.modal();

  if (
    !game ||
    !resources ||
    !modalSlice.params ||
    (modalSlice.modalType !== "asset.manage" &&
      modalSlice.modalType !== "asset.select")
  )
    return null;

  return (
    <Dialog
      open={modalSlice.isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          modalSlice.closeModal();
        }
      }}
    >
      <AssetDialog
        type={modalSlice.modalType}
        params={modalSlice.params as AssetManageParams | AssetSelectParams}
        game={game}
        resources={resources}
        onDeleteAsset={onDeleteAsset}
        onUploadAsset={onUploadAsset}
        onNavigateToScene={onNavigateToScene}
      />
    </Dialog>
  );
};

const AssetDialog = ({
  type,
  resources,
  game,
  onDeleteAsset,
  onUploadAsset,
  onNavigateToScene,
  params,
}: {
  type: "asset.manage" | "asset.select";
  resources: ResourceResponse;
  game: GameDetailResponse;
  onDeleteAsset: (assetId: number, type: AssetDialogKeyType) => void;
  onUploadAsset: (file: File, type: AssetDialogKeyType) => void;
  onNavigateToScene: (sceneId: number) => void;
  params: AssetManageParams | AssetSelectParams;
}) => {
  const modalSlice = useStore.useSlice.modal();

  const isSelectionMode = type === "asset.select";

  // 初期アクティブタブをモーダルパラメータから取得
  const initialTab = params.target;

  const [activeTab, setActiveTab] = useState<AssetDialogKeyType>(initialTab);
  const [selectedAsset, setSelectedAsset] = useState<number | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<{
    message: string;
    usages: Array<{
      sceneId: number;
      sceneName: string;
      eventId: number;
      eventType: string;
    }>;
  } | null>(null);

  const {
    ConfirmDialog: DeleteAssetDialog,
    setDeleteDialogOpen: setDeleteAssetDialogOpen,
  } = useDeleteConfirmationDialog();

  useEffect(() => {
    // モーダル開いた時にアセットタイプが指定されている場合、そのタイプをアクティブタブに設定
    if (params.target) {
      setActiveTab(params.target);
    }
  }, [params.target]);

  const handleFiles = (files: FileList | File[]) => {
    for (const file of Array.from(files)) {
      onUploadAsset(file, activeTab);
    }
  };

  const handleAssetSelect = (assetId: number) => {
    if (isSelectionMode) {
      setSelectedAsset(assetId);
    }
  };

  const handleDeleteAssetClick = (e: React.MouseEvent, assetId: number) => {
    e.stopPropagation();

    // アセットが使用されているかチェック
    const validationResult = ResourceValidator.canDeleteAsset(
      activeTab,
      assetId,
      game,
    );

    if (!validationResult.canDelete) {
      setValidationError({
        message: validationResult.reason,
        usages: validationResult.usages,
      });
      return;
    }

    setAssetToDelete(assetId);
    setDeleteAssetDialogOpen(true);
    setValidationError(null);
  };

  const confirmDeleteAsset = () => {
    if (assetToDelete) {
      onDeleteAsset(assetToDelete, activeTab);

      // 削除するアセットが選択中だった場合、選択を解除
      if (selectedAsset === assetToDelete) {
        setSelectedAsset(null);
      }
    }
    setDeleteAssetDialogOpen(false);
    setAssetToDelete(null);
  };

  const handleConfirmSelection = () => {
    if (selectedAsset && isSelectionMode) {
      (params as AssetSelectParams).callback(selectedAsset);
      modalSlice.closeModal();
    }
  };

  const closeValidationError = () => {
    setValidationError(null);
  };

  const handleSceneNavigate = (sceneId: number, eventId: number) => {
    modalSlice.closeModal();
    onNavigateToScene(sceneId);
  };

  const AssetModalSideBarSettings: Record<
    AssetDialogKeyType,
    {
      label: string;
      icon: ReactElement;
    }
  > = {
    backgroundImage: {
      label: "背景",
      icon: <Film size={16} />,
    },
    cgImage: {
      label: "CG",
      icon: <Image size={16} />,
    },
    bgm: {
      label: "BGM",
      icon: <Music size={16} />,
    },
    soundEffect: {
      label: "効果音",
      icon: <Volume2 size={16} />,
    },
  };

  const getPreviewType = (type: AssetDialogKeyType) => {
    switch (type) {
      case "backgroundImage":
      case "cgImage":
        return "image";
      case "bgm":
      case "soundEffect":
        return "audio";
      default:
        return "placeholder";
    }
  };

  if (!resources[activeTab] || !AssetModalSideBarSettings[activeTab]) {
    return null;
  }

  const currentAssetsList = Object.values(
    resources[activeTab],
  ) as AssetResponse[];
  const deleteAssetTitle = `${AssetModalSideBarSettings[activeTab].label}の削除`;
  const selectedAssetForDelete = assetToDelete
    ? (resources[activeTab][assetToDelete] as AssetResponse)
    : null;

  return (
    <DialogContent className="sm:max-w-4xl">
      <DialogHeader>
        <DialogTitle>アセット一覧</DialogTitle>
        <DialogDescription>
          {isSelectionMode
            ? "使用するアセットを選択してください"
            : "アセットの管理を行います"}
        </DialogDescription>
      </DialogHeader>

      {validationError && (
        <ValidationErrorAlert
          message={validationError.message}
          usages={validationError.usages}
          onClose={closeValidationError}
          onNavigate={handleSceneNavigate}
        />
      )}

      <div className="flex h-[500px] gap-4">
        <div className="w-[200px] border-r pr-4">
          <Tabs
            orientation="vertical"
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as AssetDialogKeyType)}
            className="w-full"
          >
            <TabsList className="flex flex-col h-auto items-start">
              {Object.keys(AssetModalSideBarSettings).map((key) => {
                const settings =
                  AssetModalSideBarSettings[
                    key as keyof typeof AssetModalSideBarSettings
                  ];
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    // 選択モードの場合、選択可能なアセットタイプのみ有効にする
                    disabled={isSelectionMode && key !== activeTab}
                    className="justify-start grid grid-cols-8 gap-2"
                  >
                    <div className="col-span-1 w-full">{settings.icon}</div>
                    {settings.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} className="w-full h-full flex flex-col">
            <TabsContent
              key={activeTab}
              value={activeTab}
              className="flex-1 flex flex-col h-full"
            >
              <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-4 pb-4">
                {currentAssetsList.map((asset) => (
                  <AssetCard
                    key={asset.id}
                    id={asset.id}
                    showDeleteButton={!asset.isPublic}
                    selected={selectedAsset === asset.id}
                    onSelect={handleAssetSelect}
                    onDelete={handleDeleteAssetClick}
                    previewType={getPreviewType(activeTab)}
                    previewUrl={asset.url}
                    filename={asset.name}
                    placeholderContent={
                      AssetModalSideBarSettings[activeTab].icon
                    }
                  />
                ))}
              </div>

              <AssetUpload
                onFilesSelected={handleFiles}
                assetType={
                  activeTab === "backgroundImage" || activeTab === "cgImage"
                    ? "image"
                    : "audio"
                }
                validation={FILE_VALIDATION_SETTING}
                buttonText={`${AssetModalSideBarSettings[activeTab].label}をアップロード`}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {isSelectionMode && (
        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={modalSlice.closeModal}
          >
            キャンセル
          </Button>
          <Button
            type="button"
            onClick={handleConfirmSelection}
            disabled={!selectedAsset}
          >
            選択
          </Button>
        </DialogFooter>
      )}

      <DeleteAssetDialog
        title={deleteAssetTitle}
        description={`この${AssetModalSideBarSettings[activeTab].label}を削除してもよろしいですか？この操作は元に戻せません。`}
        alertDescription={`この操作は元に戻せません。${AssetModalSideBarSettings[activeTab].label}は完全に削除されます。`}
        confirmDelete={confirmDeleteAsset}
      >
        {selectedAssetForDelete && getPreviewType(activeTab) === "image" && (
          <div className="flex justify-center">
            <div className="w-32 h-32 overflow-hidden rounded border">
              <img
                src={selectedAssetForDelete.url}
                alt={selectedAssetForDelete.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        {selectedAssetForDelete && getPreviewType(activeTab) === "audio" && (
          <div className="flex justify-center">
            <audio
              src={selectedAssetForDelete.url}
              controls
              className="w-full"
              preload="metadata"
            >
              <track kind="captions" />
            </audio>
          </div>
        )}
      </DeleteAssetDialog>
    </DialogContent>
  );
};
