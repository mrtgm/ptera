import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/shadcn/dialog";
import type { Game, GameResources } from "~/schema";
import { useStore } from "~/stores";
import type { ModalParams } from "~/stores/modal";
import { AddCharacterDialog } from "./add-character-dialog";
import { CharacterDetail } from "./character-detail";
import { CharacterList } from "./character-list";

export const CharacterDialog = ({
	game,
	resources,
	onConfirmCharacterSelection,
	onConfirmCharacterImageSelection,
	onAddCharacter,
	onDeleteCharacter,
	onDeleteImage,
	onCharacterNameChange,
}: {
	game: Game;
	resources: GameResources;
	onConfirmCharacterSelection: (characterId: string) => void;
	onConfirmCharacterImageSelection: (
		characterId: string,
		imageId: string,
	) => void;
	onAddCharacter: (name: string) => void;
	onDeleteCharacter: (characterId: string) => void;
	onDeleteImage: (characterId: string, imageId: string) => void;
	onCharacterNameChange: (characterId: string, name: string) => void;
}) => {
	const modalSlice = useStore.useSlice.modal();

	const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
		null,
	);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [showAddCharacterDialog, setShowAddCharacterDialog] =
		useState<boolean>(false);
	const [currentView, setCurrentView] = useState<"characters" | "images">(
		"characters",
	);

	useEffect(() => {
		if (modalSlice.isOpen) {
			setSelectedCharacter(null);
			setSelectedImage(null);
			setCurrentView("characters");
		}
	}, [modalSlice.isOpen]);

	const mode = (modalSlice.params as ModalParams["character"])?.mode;
	const isCharacterSelectionMode = mode === "character";
	const isImageSelectionMode = mode === "characterImage";

	const handleCharacterSelect = (characterId: string) => {
		setSelectedCharacter(characterId);
		if (isImageSelectionMode) {
			setCurrentView("images");
		}
	};

	const handleImageSelect = (imageId: string) => {
		setSelectedImage(imageId);
	};

	const handleFiles = (files: FileList) => {
		// TODO: Upload character images
		for (const file of Array.from(files)) {
			console.log(`Uploading ${file.name} for character ${selectedCharacter}`);
		}
	};

	const handleConfirmSelection = () => {
		if (
			isCharacterSelectionMode &&
			selectedCharacter &&
			onConfirmCharacterSelection
		) {
			onConfirmCharacterSelection(selectedCharacter);
			modalSlice.closeModal();
		} else if (
			isImageSelectionMode &&
			selectedCharacter &&
			selectedImage &&
			onConfirmCharacterImageSelection
		) {
			onConfirmCharacterImageSelection(selectedCharacter, selectedImage);
			modalSlice.closeModal();
		}
	};

	const handleBackToCharacters = () => {
		setCurrentView("characters");
		setSelectedImage(null);
	};

	const handleDeleteCharacter = (characterId: string) => {
		// TODO: Delete character
		console.log(`Deleting character: ${characterId}`);
		onDeleteCharacter(characterId);
		setSelectedCharacter(null);
		setCurrentView("characters");
	};

	let dialogTitle = "キャラクター一覧";
	let dialogDescription = "キャラクターと画像の管理を行います";

	if (currentView === "images" && selectedCharacter) {
		dialogTitle = `${resources.characters[selectedCharacter]?.name || ""}の画像一覧`;
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
			<Dialog
				open={modalSlice.isOpen && modalSlice.target === "character"}
				onOpenChange={modalSlice.closeModal}
			>
				<DialogContent className="sm:max-w-4xl">
					<DialogHeader>
						<DialogTitle>{dialogTitle}</DialogTitle>
						<DialogDescription>{dialogDescription}</DialogDescription>
					</DialogHeader>

					{currentView === "characters" ? (
						<CharacterList
							resources={resources}
							selectedCharacter={selectedCharacter}
							onCharacterSelect={handleCharacterSelect}
							onAddCharacterClick={() => setShowAddCharacterDialog(true)}
							onConfirmSelection={
								isCharacterSelectionMode ? handleConfirmSelection : undefined
							}
							selectionMode={isCharacterSelectionMode}
						/>
					) : (
						selectedCharacter && (
							<CharacterDetail
								game={game}
								resources={resources}
								selectedCharacter={selectedCharacter}
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
			</Dialog>

			<AddCharacterDialog
				open={showAddCharacterDialog}
				onOpenChange={setShowAddCharacterDialog}
				onAddCharacter={onAddCharacter}
			/>
		</>
	);
};
