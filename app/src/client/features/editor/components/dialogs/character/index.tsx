import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/client/components/shadcn/dialog";
import type { Game, GameResources } from "@/client/schema";
import { useStore } from "@/client/stores";
import type {
	CharacterImageSelectParams,
	CharacterSelectParams,
} from "@/client/stores/modal";
import { useEffect, useState } from "react";
import { AddCharacterDialog } from "./add-character-dialog";
import { CharacterDetail } from "./character-detail";
import { CharacterList } from "./character-list";

export const CharacterDialogContainer = ({
	game,
	resources,
	onAddCharacter,
	onDeleteCharacter,
	onUploadImage,
	onDeleteImage,
	onCharacterNameChange,
}: {
	game: Game | null;
	resources: GameResources | null;
	onAddCharacter: (name: string) => void;
	onDeleteCharacter: (characterId: number) => void;
	onUploadImage: (characterId: number, file: File) => void;
	onDeleteImage: (characterId: number, imageId: number) => void;
	onCharacterNameChange: (characterId: number, name: string) => void;
}) => {
	const modalSlice = useStore.useSlice.modal();

	if (
		!game ||
		!resources ||
		(modalSlice.modalType !== "character.select" &&
			modalSlice.modalType !== "character.image-select" &&
			modalSlice.modalType !== "character.manage")
	) {
		return null;
	}

	return (
		<Dialog
			open={modalSlice.isOpen}
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					modalSlice.closeModal();
				}
			}}
		>
			<CharacterDialog
				game={game}
				resources={resources}
				onAddCharacter={onAddCharacter}
				onDeleteCharacter={onDeleteCharacter}
				onUploadImage={onUploadImage}
				onDeleteImage={onDeleteImage}
				onCharacterNameChange={onCharacterNameChange}
				params={
					modalSlice.params as
						| CharacterSelectParams
						| CharacterImageSelectParams
				}
			/>
		</Dialog>
	);
};

const CharacterDialog = ({
	game,
	resources,
	params,
	onAddCharacter,
	onDeleteCharacter,
	onUploadImage,
	onDeleteImage,
	onCharacterNameChange,
}: {
	game: Game;
	resources: GameResources;
	params: CharacterSelectParams | CharacterImageSelectParams;
	onAddCharacter: (name: string) => void;
	onDeleteCharacter: (characterId: number) => void;
	onDeleteImage: (characterId: number, imageId: number) => void;
	onUploadImage: (characterId: number, file: File) => void;
	onCharacterNameChange: (characterId: number, name: string) => void;
}) => {
	const modalSlice = useStore.useSlice.modal();

	const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(
		null,
	);
	const [selectedImage, setSelectedImage] = useState<number | null>(null);
	const [showAddCharacterDialog, setShowAddCharacterDialog] =
		useState<boolean>(false);
	const [currentView, setCurrentView] = useState<"characters" | "images">(
		"characters",
	);

	useEffect(() => {
		if (modalSlice.isOpen) {
			setSelectedCharacterId(null);
			setSelectedImage(null);
			setCurrentView("characters");
		}
	}, [modalSlice.isOpen]);

	if (
		modalSlice.modalType !== "character.select" &&
		modalSlice.modalType !== "character.image-select" &&
		modalSlice.modalType !== "character.manage"
	) {
		return null;
	}

	const mode = modalSlice.modalType;
	const isManageMode = mode === "character.manage";
	const isCharacterSelectionMode = mode === "character.select";
	const isImageSelectionMode = mode === "character.image-select";

	const handleCharacterSelect = (characterId: number) => {
		setSelectedCharacterId(characterId);
		if (isImageSelectionMode || isManageMode) {
			setCurrentView("images");
		}
	};

	const handleImageSelect = (imageId: number | null) => {
		setSelectedImage(imageId);
	};

	const handleFiles = (files: FileList | File[]) => {
		if (!selectedCharacterId) return;
		for (const file of Array.from(files)) {
			console.log(
				`Uploading ${file.name} for character ${selectedCharacterId}`,
			);
			onUploadImage(selectedCharacterId, file);
		}
	};

	const handleConfirmSelection = () => {
		if (isCharacterSelectionMode && selectedCharacterId) {
			(params as CharacterSelectParams).callback(selectedCharacterId);
			modalSlice.closeModal();
		} else if (isImageSelectionMode && selectedCharacterId && selectedImage) {
			(params as CharacterImageSelectParams).callback(
				selectedCharacterId,
				selectedImage,
			);
			modalSlice.closeModal();
		}
	};

	const handleBackToCharacters = () => {
		setCurrentView("characters");
		setSelectedImage(null);
	};

	const handleDeleteCharacter = (characterId: number) => {
		// TODO: Delete character
		console.log(`Deleting character: ${characterId}`);
		onDeleteCharacter(characterId);
		setSelectedCharacterId(null);
		setCurrentView("characters");
	};

	let dialogTitle = "キャラクター一覧";
	let dialogDescription = "キャラクターと画像の管理を行います";

	if (currentView === "images" && selectedCharacterId) {
		dialogTitle = `${resources.character[selectedCharacterId]?.name || ""}の画像一覧`;
	}

	if (isCharacterSelectionMode) {
		dialogDescription = "使用するキャラクターを選択してください";
	} else if (isImageSelectionMode) {
		dialogDescription =
			currentView === "characters"
				? "キャラクターを選択してください"
				: "使用するキャラクター画像を選択してください";
	}

	return (
		<>
			<DialogContent className="sm:max-w-4xl">
				<DialogHeader>
					<DialogTitle>{dialogTitle}</DialogTitle>
					<DialogDescription>{dialogDescription}</DialogDescription>
				</DialogHeader>

				{currentView === "characters" ? (
					<CharacterList
						resources={resources}
						selectedCharacterId={selectedCharacterId}
						onCharacterSelect={handleCharacterSelect}
						onAddCharacterClick={() => setShowAddCharacterDialog(true)}
						onConfirmSelection={
							isCharacterSelectionMode ? handleConfirmSelection : undefined
						}
						selectionMode={isCharacterSelectionMode}
					/>
				) : (
					selectedCharacterId && (
						<CharacterDetail
							game={game}
							resources={resources}
							selectedCharacterId={selectedCharacterId}
							selectedImage={selectedImage}
							onBackToList={handleBackToCharacters}
							onImageSelect={handleImageSelect}
							onCharacterNameChange={onCharacterNameChange}
							onDeleteCharacter={handleDeleteCharacter}
							onFilesSelected={handleFiles}
							onDeleteImage={onDeleteImage}
							onConfirmSelection={
								isImageSelectionMode ? handleConfirmSelection : undefined
							}
							selectionMode={isImageSelectionMode}
						/>
					)
				)}
			</DialogContent>

			<AddCharacterDialog
				open={showAddCharacterDialog}
				onOpenChange={setShowAddCharacterDialog}
				onAddCharacter={onAddCharacter}
			/>
		</>
	);
};
