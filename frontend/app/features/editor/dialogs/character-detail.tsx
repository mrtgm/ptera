import { useNavigate } from "@remix-run/react";
import { AlertTriangle, ArrowLeft, X } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/shadcn/alert";
import { Button } from "~/components/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/shadcn/dialog";
import { DialogClose } from "~/components/shadcn/dialog";
import { Input } from "~/components/shadcn/input";
import { Label } from "~/components/shadcn/label";
import type { Character, Game, GameResources, GameState } from "~/schema";
import { useStore } from "~/stores";
import { cn } from "~/utils/cn";
import ResourceValidator from "../utils";
import AssetUpload from "./asset-upload";
import { useDeleteConfirmationDialog } from "./delete-confirmation-dialog";

interface CharacterDetailProps {
	game: Game;
	resources: GameResources;
	selectedCharacter: string;
	selectedImage: string | null;
	onBackToList: () => void;
	onImageSelect: (imageId: string) => void;
	onCharacterNameChange?: (characterId: string, name: string) => void;
	onDeleteCharacter: (characterId: string) => void;
	onFilesSelected: (files: FileList) => void;
	onConfirmSelection?: () => void;
	onDeleteImage: (characterId: string, imageId: string) => void;
	selectionMode?: boolean;
}

export const CharacterDetail = ({
	game,
	resources,
	selectedCharacter,
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
	const character = resources.characters[selectedCharacter];
	const [newCharacterName, setNewCharacterName] = useState<string>(
		character?.name || "",
	);
	const [imageToDelete, setImageToDelete] = useState<string | null>(null);

	const [validationError, setValidationError] = useState<{
		message: string;
		usages: Array<{
			sceneId: string;
			sceneName: string;
			eventId: string;
			eventType: string;
		}>;
	} | null>(null);

	const navigate = useNavigate();
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

	const handleDeleteImageClick = (e: React.MouseEvent, imageId: string) => {
		e.stopPropagation(); // 親要素のクリックイベントを発火させない

		// 画像が使用されているか検証
		const validationResult = ResourceValidator.canDeleteImage(
			selectedCharacter,
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
			onDeleteImage(selectedCharacter, imageToDelete);
			// 削除する画像が選択中だった場合、選択を解除
			if (selectedImage === imageToDelete) {
				onImageSelect("");
			}
		}
		setDeleteCharacterImageDialogOpen(false);
		setImageToDelete(null);
	};

	const confirmDeleteCharacter = () => {
		if (onDeleteCharacter) {
			onDeleteCharacter(selectedCharacter);
		}
		setDeleteCharacterDialogOpen(false);
	};

	const handleDeleteCharacterClick = () => {
		// キャラクターが使用されているか検証
		const validationResult = ResourceValidator.canDeleteCharacter(
			selectedCharacter,
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

	const handleSceneNavigate = (sceneId: string, eventId: string) => {
		modalSlice.closeModal();
		navigate(`/editor/${sceneId}/${eventId}`);
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
						onCharacterNameChange?.(selectedCharacter, newCharacterName)
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
				{Object.entries(character.images || {}).map(([imageId, image]) => (
					<div
						key={imageId}
						className={cn(
							"border rounded-md p-2 cursor-pointer hover:border-blue-500 h-fit relative group",
							selectedImage === imageId && "border-blue-500 bg-blue-50",
						)}
						onClick={() => onImageSelect(imageId)}
						onKeyDown={(e) => e.key === "Enter" && onImageSelect(imageId)}
						aria-selected={selectedImage === imageId}
					>
						<div className="aspect-square bg-gray-100 mb-2 overflow-hidden rounded">
							<img
								src={image.url}
								alt={image.filename}
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="text-xs text-gray-500 truncate">
							{image.filename}
						</div>
						{/* 削除ボタン - ホバー時に表示 */}
						<button
							className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
							onClick={(e) => handleDeleteImageClick(e, imageId)}
							aria-label={`画像「${image.filename}」を削除`}
							type="button"
						>
							<X size={16} />
						</button>
					</div>
				))}
			</div>
			<AssetUpload
				onFilesSelected={onFilesSelected}
				className="mt-4"
				inputId="character-image-upload"
				buttonText="画像をアップロード"
			/>
			{selectionMode && (
				<DialogFooter className="mt-4">
					<Button onClick={onConfirmSelection} disabled={!selectedImage}>
						選択
					</Button>
				</DialogFooter>
			)}

			{/* 画像削除確認ダイアログ */}
			<DeleteCharacterImageDialog
				title="画像の削除"
				description="この画像を削除してもよろしいですか？この操作は元に戻せません。"
				alertDescription="この操作は元に戻せません。画像は完全に削除されます。"
				confirmDelete={confirmDeleteImage}
			>
				{imageToDelete && character.images[imageToDelete] && (
					<div className="flex justify-center">
						<div className="w-32 h-32 overflow-hidden rounded border">
							<img
								src={character.images[imageToDelete].url}
								alt={character.images[imageToDelete].filename}
								className="w-full h-full object-cover"
							/>
						</div>
					</div>
				)}
			</DeleteCharacterImageDialog>

			{/* キャラクター削除確認ダイアログ */}
			<DeleteCharacterDialog
				title="キャラクターの削除"
				description="このキャラクターを削除してもよろしいですか？"
				alertDescription="この操作は元に戻せません。キャラクターと関連するすべての画像が完全に削除されます。"
				confirmDelete={confirmDeleteCharacter}
			/>
		</div>
	);
};

export default CharacterDetail;
