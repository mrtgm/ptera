import { useNavigate } from "@remix-run/react";
import { Film, Image, Music, Volume2 } from "lucide-react";
import { type ReactElement, useEffect, useState } from "react";
import { Button } from "~/components/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/shadcn/dialog";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "~/components/shadcn/tabs";
import type { Game, GameResources, MediaAsset } from "~/schema";
import { useStore } from "~/stores";
import type { ModalParams } from "~/stores/modal";
import AssetValidator from "../../../utils/resource-validator";
import { ValidationErrorAlert } from "../../validtion-error-alert";
import { AssetUpload } from "../asset-upload";
import { useDeleteConfirmationDialog } from "../delete-confirmation-dialog";
import { AssetCard } from "./asset-card";

type resources = Omit<GameResources, "characters">;
export type AssetDialogKeyType = keyof resources;

export const AssetDialog = ({
	resources,
	game,
	onConfirmAssetSelection,
	onDeleteAsset,
}: {
	resources: GameResources;
	game: Game;
	onConfirmAssetSelection: (assetId: string, type: AssetDialogKeyType) => void;
	onDeleteAsset: (assetId: string, type: AssetDialogKeyType) => void;
}) => {
	const modalSlice = useStore.useSlice.modal();
	const navigate = useNavigate();

	const [activeTab, setActiveTab] =
		useState<AssetDialogKeyType>("backgroundImages");
	const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
	const [assetToDelete, setAssetToDelete] = useState<string | null>(null);
	const [validationError, setValidationError] = useState<{
		message: string;
		usages: Array<{
			sceneId: string;
			sceneName: string;
			eventId: string;
			eventType: string;
		}>;
	} | null>(null);

	const {
		ConfirmDialog: DeleteAssetDialog,
		setDeleteDialogOpen: setDeleteAssetDialogOpen,
	} = useDeleteConfirmationDialog();

	useEffect(() => {
		// モーダル開いた時にアセットタイプが指定されている場合、そのタイプをアクティブタブに設定
		if (
			modalSlice.isOpen &&
			(modalSlice.params as ModalParams["asset"])?.target
		) {
			setActiveTab(
				(modalSlice.params as ModalParams["asset"])
					?.target as AssetDialogKeyType,
			);
		}
	}, [modalSlice.isOpen, modalSlice.params]);

	const handleFiles = (files: FileList) => {
		// ファイルアップロード処理
		for (const file of Array.from(files)) {
			console.log(`Uploading ${file.name} to ${activeTab}`);
		}
	};

	const handleAssetSelect = (assetId: string) => {
		if ((modalSlice.params as ModalParams["asset"])?.mode === "select") {
			setSelectedAsset(assetId);
		}
	};

	const handleDeleteAssetClick = (e: React.MouseEvent, assetId: string) => {
		e.stopPropagation(); // 親要素のクリックイベントを発火させない

		// アセットが使用されているか検証
		const validationResult = AssetValidator.canDeleteAsset(
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
		if (selectedAsset) {
			onConfirmAssetSelection(selectedAsset, activeTab);
			modalSlice.closeModal();
		}
	};

	const closeValidationError = () => {
		setValidationError(null);
	};

	const handleSceneNavigate = (sceneId: string, eventId: string) => {
		modalSlice.closeModal();
		navigate(`/editor/${sceneId}/${eventId}`);
	};

	const AssetModalSideBarSettings: Record<
		AssetDialogKeyType,
		{
			label: string;
			icon: ReactElement;
		}
	> = {
		backgroundImages: {
			label: "背景",
			icon: <Film size={16} />,
		},
		cgImages: {
			label: "CG",
			icon: <Image size={16} />,
		},
		bgms: {
			label: "BGM",
			icon: <Music size={16} />,
		},
		soundEffects: {
			label: "効果音",
			icon: <Volume2 size={16} />,
		},
	};

	const getPreviewType = (type: AssetDialogKeyType) => {
		switch (type) {
			case "backgroundImages":
			case "cgImages":
				return "image";
			case "bgms":
			case "soundEffects":
				return "audio";
			default:
				return "placeholder";
		}
	};

	if (!resources[activeTab] || !AssetModalSideBarSettings[activeTab])
		return null;

	const currentAssetsList = Object.values(resources[activeTab]) as MediaAsset[];
	const isSelectionMode =
		(modalSlice.params as ModalParams["asset"])?.mode === "select";
	const deleteAssetTitle = `${AssetModalSideBarSettings[activeTab].label}の削除`;
	const selectedAssetForDelete = assetToDelete
		? (resources[activeTab][assetToDelete] as MediaAsset)
		: null;

	return (
		<Dialog
			open={modalSlice.isOpen && modalSlice.target === "asset"}
			onOpenChange={modalSlice.closeModal}
		>
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
											selected={selectedAsset === asset.id}
											onSelect={handleAssetSelect}
											onDelete={handleDeleteAssetClick}
											previewType={getPreviewType(activeTab)}
											previewUrl={asset.url}
											filename={asset.filename}
											placeholderContent={
												AssetModalSideBarSettings[activeTab].icon
											}
										/>
									))}
								</div>

								<AssetUpload
									onFilesSelected={handleFiles}
									className="mt-4"
									inputId={`${activeTab}-upload`}
									assetType={
										activeTab === "backgroundImages" || activeTab === "cgImages"
											? "image"
											: "audio"
									}
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
									alt={selectedAssetForDelete.filename}
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
		</Dialog>
	);
};
