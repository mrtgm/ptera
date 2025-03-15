import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/client/components/shadcn/alert";
import { Button } from "@/client/components/shadcn/button";
import { DialogFooter } from "@/client/components/shadcn/dialog";
import { Input } from "@/client/components/shadcn/input";
import { Label } from "@/client/components/shadcn/label";
import { FILE_VALIDATION_SETTING } from "@/client/features/editor/constants";
import { useStore } from "@/client/stores";
import { cn } from "@/client/utils/cn";
import type { MediaAsset } from "@/schemas/assets/domain/resoucres";
import type { GameDetailResponse, ResourceResponse } from "@/schemas/games/dto";
import { AlertTriangle, ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ResourceValidator from "../../../utils/resource-validator";
import { AssetUpload } from "../asset-upload";
import { useDeleteConfirmationDialog } from "../delete-confirmation-dialog";

interface CharacterDetailProps {
	game: GameDetailResponse;
	resources: ResourceResponse;
	selectedCharacterId: number;
	selectedImage: number | null;
	onBackToList: () => void;
	onImageSelect: (imageId: number | null) => void;
	onCharacterNameChange?: (characterId: number, name: string) => void;
	onDeleteCharacter: (characterId: number) => void;
	onFilesSelected: (files: FileList | File[]) => void;
	onConfirmSelection?: () => void;
	onDeleteImage: (characterId: number, imageId: number) => void;
	selectionMode?: boolean;
}

export const CharacterDetail = ({
	game,
	resources,
	selectedCharacterId,
	selectedImage,
	onBackToList,
	onImageSelect,
	onCharacterNameChange,
	onDeleteCharacter,
	onFilesSelected,
	onConfirmSelection,
	onDeleteImage,
	selectionMode = false,
}: CharacterDetailProps) => {
	const character = resources.character[selectedCharacterId];
	const [newCharacterName, setNewCharacterName] = useState<string>(
		character?.name || "",
	);
	const [imageToDelete, setImageToDelete] = useState<number | null>(null);

	const [validationError, setValidationError] = useState<{
		message: string;
		usages: Array<{
			sceneId: number;
			sceneName: string;
			eventId: number;
			eventType: string;
		}>;
	} | null>(null);

	const router = useRouter();
	const modalSlice = useStore.useSlice.modal();

	const {
		ConfirmDialog: DeleteCharacterDialog,
		setDeleteDialogOpen: setDeleteCharacterDialogOpen,
	} = useDeleteConfirmationDialog();

	const {
		ConfirmDialog: DeleteCharacterImageDialog,
		setDeleteDialogOpen: setDeleteCharacterImageDialogOpen,
	} = useDeleteConfirmationDialog();

	if (!character) {
		return (
			<div className="h-[500px] flex items-center justify-center">
				<div className="text-center text-gray-500">
					キャラクターが選択されていません
				</div>
			</div>
		);
	}

	const handleDeleteImageClick = (e: React.MouseEvent, imageId: number) => {
		e.stopPropagation();

		// 画像が使用されているか検証
		const validationResult = ResourceValidator.canDeleteImage(
			selectedCharacterId,
			imageId,
			game,
			resources,
		);

		if (!validationResult.canDelete) {
			setValidationError({
				message: validationResult.reason,
				usages: validationResult.usages,
			});
			return;
		}

		setImageToDelete(imageId);
		setDeleteCharacterImageDialogOpen(true);
		setValidationError(null);
	};

	const confirmDeleteImage = () => {
		if (imageToDelete && onDeleteImage) {
			onDeleteImage(selectedCharacterId, imageToDelete);
			// 削除する画像が選択中だった場合、選択を解除
			if (selectedImage === imageToDelete) {
				onImageSelect(null);
			}
		}
		setDeleteCharacterImageDialogOpen(false);
		setImageToDelete(null);
	};

	const confirmDeleteCharacter = () => {
		if (onDeleteCharacter) {
			onDeleteCharacter(selectedCharacterId);
		}
		setDeleteCharacterDialogOpen(false);
	};

	const handleDeleteCharacterClick = () => {
		// キャラクターが使用されているか検証
		const validationResult = ResourceValidator.canDeleteCharacter(
			selectedCharacterId,
			game,
		);

		if (!validationResult.canDelete) {
			setValidationError({
				message: validationResult.reason,
				usages: validationResult.usages,
			});
			return;
		}

		setDeleteCharacterDialogOpen(true);
		setValidationError(null);
	};

	const closeValidationError = () => {
		setValidationError(null);
	};

	const handleSceneNavigate = (sceneId: number, eventId: number) => {
		modalSlice.closeModal();
		router.push(`/editor/${sceneId}/${eventId}`);
	};

	return (
		<div className="h-[500px] flex flex-col">
			<div className="flex mb-4 items-center">
				<Button
					variant="ghost"
					onClick={onBackToList}
					className="flex items-center gap-2"
				>
					<ArrowLeft size={16} />
					キャラクター一覧に戻る
				</Button>
				<Label className="flex gap-2 flex-1 items-center">
					<Input
						value={newCharacterName}
						onChange={(e) => setNewCharacterName(e.target.value)}
					/>
				</Label>
				<Button
					variant="ghost"
					onClick={() =>
						onCharacterNameChange?.(selectedCharacterId, newCharacterName)
					}
					className="flex items-center gap-2"
				>
					名前変更
				</Button>
				<Button
					variant="destructive"
					onClick={handleDeleteCharacterClick}
					className="flex items-center gap-2"
				>
					削除
				</Button>
			</div>

			{/* バリデーションエラー表示 */}
			{validationError && (
				<Alert variant="destructive" className="mb-4">
					<AlertTriangle className="h-4 w-4" />
					<AlertTitle>削除できません</AlertTitle>
					<AlertDescription>
						<p>{validationError.message}</p>
						{validationError.usages.length > 0 && (
							<div className="mt-2 max-h-32 overflow-y-auto">
								<ul className="text-xs list-disc pl-5">
									{validationError.usages.map((usage, index) => (
										<li
											key={`${usage.sceneId}-${usage.eventId}-${index}`}
											className="mb-1"
										>
											<span>
												シーン「{usage.sceneName}」の「{usage.eventType}」
											</span>
											<button
												onClick={() =>
													handleSceneNavigate(usage.sceneId, usage.eventId)
												}
												className="ml-2 text-blue-300 hover:underline text-xs"
												type="button"
											>
												移動
											</button>
										</li>
									))}
								</ul>
							</div>
						)}
						<Button
							variant="outline"
							size="sm"
							onClick={closeValidationError}
							className="mt-2"
						>
							閉じる
						</Button>
					</AlertDescription>
				</Alert>
			)}

			<div className="flex-1 overflow-y-auto grid grid-cols-4 gap-4 pb-4">
				{Object.entries(
					character.images || ({} as Record<string, MediaAsset>),
				).map(([imageId, image]) => {
					const imageIdNum = Number(imageId);
					return (
						<div
							key={imageId}
							className={cn(
								"border rounded-md p-2 cursor-pointer hover:border-blue-500 h-fit relative group",
								selectedImage === imageIdNum && "border-blue-500 bg-blue-50",
							)}
							onClick={() => onImageSelect(imageIdNum)}
							onKeyDown={(e) => e.key === "Enter" && onImageSelect(imageIdNum)}
							aria-selected={selectedImage === imageIdNum}
						>
							<div className="aspect-square bg-gray-100 mb-2 overflow-hidden rounded">
								<img
									src={image.url}
									alt={image.name}
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="text-xs text-gray-500 truncate">{image.name}</div>
							{/* 削除ボタン - ホバー時に表示 */}
							<button
								className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
								onClick={(e) => handleDeleteImageClick(e, imageIdNum)}
								aria-label={`画像「${image.name}」を削除`}
								type="button"
							>
								<X size={16} />
							</button>
						</div>
					);
				})}
			</div>
			<AssetUpload
				onFilesSelected={onFilesSelected}
				validation={FILE_VALIDATION_SETTING}
				buttonText="画像をアップロード"
			/>
			{selectionMode && (
				<DialogFooter className="mt-4">
					<Button onClick={onConfirmSelection} disabled={!selectedImage}>
						選択
					</Button>
				</DialogFooter>
			)}

			<DeleteCharacterImageDialog
				title="画像の削除"
				description="この画像を削除してもよろしいですか？この操作は元に戻せません。"
				alertDescription="この操作は元に戻せません。画像は完全に削除されます。"
				confirmDelete={confirmDeleteImage}
			>
				{imageToDelete && character.images?.[imageToDelete] && (
					<div className="flex justify-center">
						<div className="w-32 h-32 overflow-hidden rounded border">
							<img
								src={character.images[imageToDelete].url}
								alt={character.images[imageToDelete].name}
								className="w-full h-full object-cover"
							/>
						</div>
					</div>
				)}
			</DeleteCharacterImageDialog>

			<DeleteCharacterDialog
				title="キャラクターの削除"
				description="このキャラクターを削除してもよろしいですか？"
				alertDescription="この操作は元に戻せません。キャラクターと関連するすべての画像が完全に削除されます。"
				confirmDelete={confirmDeleteCharacter}
			/>
		</div>
	);
};
