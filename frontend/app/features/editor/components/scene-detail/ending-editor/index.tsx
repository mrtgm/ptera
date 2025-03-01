import type React from "react";
import { useRef, useState } from "react";
import {
	type ChoiceScene,
	type Game,
	type GotoScene,
	type Scene,
	isChoiceScene,
	isGotoScene,
} from "~/schema";

import { Button } from "~/components/shadcn/button";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "~/components/shadcn/tabs";
import { ChoiceSceneContent } from "./choice-scene-content";
import { EndSceneContent } from "./end-scene-content";
import { GotoSceneContent } from "./goto-scene-content";
import { NewSceneDialog } from "./new-scene-dialog";

interface EndingEditorProps {
	selectedScene: Scene;
	game: Game | null;
	onSaveEnding: (endingScene: Scene) => void;
	onNavigateToScene: (sceneId: string) => void;
	onAddScene: (
		sceneTitle: string,
		scene: Scene,
		choiceId?: string | null,
	) => string;
}

export const EndingEditor: React.FC<EndingEditorProps> = ({
	selectedScene,
	game,
	onSaveEnding,
	onNavigateToScene,
	onAddScene,
}) => {
	const [endingScene, setEndingScene] = useState<Scene>(selectedScene);
	const [hasChanges, setHasChanges] = useState(false);
	const [isNewSceneDialogOpen, setIsNewSceneDialogOpen] = useState(false);
	const activeChoiceId = useRef<string | null>(null);

	const handleSceneTypeChange = (value: string) => {
		setEndingScene((prev) => {
			if (value === "end") {
				return { ...prev, sceneType: "end" };
			}
			if (value === "goto") {
				return {
					...prev,
					sceneType: "goto",
					nextSceneId: "",
					...(isGotoScene(selectedScene) && {
						nextSceneId: selectedScene.nextSceneId,
					}),
				};
			}
			if (value === "choice") {
				return {
					...prev,
					sceneType: "choice",
					choices: [],
					...(isChoiceScene(selectedScene) && {
						choices: selectedScene.choices,
					}),
				};
			}
			return prev;
		});
		setHasChanges(true);
	};

	const handleAddChoice = () => {
		setEndingScene((prev) => {
			if (isChoiceScene(prev)) {
				return {
					...prev,
					choices: [
						...prev.choices,
						{
							id: crypto.randomUUID(),
							text: "",
							nextSceneId: game?.scenes[0].id || "",
						},
					],
				};
			}
			return prev;
		});
		setHasChanges(true);
	};

	const handleRemoveChoice = (choiceId: string) => {
		setEndingScene((prev) => {
			if (isChoiceScene(prev)) {
				return {
					...prev,
					choices: prev.choices.filter((choice) => choice.id !== choiceId),
				};
			}
			return prev;
		});
		setHasChanges(true);
	};

	const handleChoiceTextChange = (choiceId: string, text: string) => {
		setEndingScene((prev) => {
			if (isChoiceScene(prev)) {
				return {
					...prev,
					choices: prev.choices.map((choice) =>
						choice.id === choiceId ? { ...choice, text } : choice,
					),
				};
			}
			return prev;
		});
		setHasChanges(true);
	};

	const handleChoiceNextSceneChange = (
		choiceId: string,
		nextSceneId: string,
	) => {
		setEndingScene((prev) => {
			if (isChoiceScene(prev)) {
				return {
					...prev,
					choices: prev.choices.map((choice) =>
						choice.id === choiceId ? { ...choice, nextSceneId } : choice,
					),
				};
			}
			return prev;
		});
		setHasChanges(true);
	};

	const handleNextSceneChange = (nextSceneId: string) => {
		setEndingScene((prev) => ({
			...prev,
			nextSceneId,
		}));
		setHasChanges(true);
	};

	const handleOpenNewSceneDialog = (choiceId: string | null = null) => {
		activeChoiceId.current = choiceId;
		setIsNewSceneDialogOpen(true);
	};

	const handleCreateNewScene = (newSceneTitle: string) => {
		if (!newSceneTitle.trim()) {
			return;
		}

		const newSceneId = onAddScene(
			newSceneTitle,
			endingScene,
			activeChoiceId.current,
		);

		const newScene: Scene = {
			...endingScene,
			...(isGotoScene(endingScene) && {
				nextSceneId: newSceneId,
			}),
			...(isChoiceScene(endingScene) && {
				choices: (endingScene as ChoiceScene).choices.map((choice) => {
					if (choice.id === activeChoiceId.current) {
						return {
							...choice,
							nextSceneId: newSceneId,
						};
					}
					return choice;
				}),
			}),
		};

		activeChoiceId.current = null;
		setEndingScene(newScene);
		setIsNewSceneDialogOpen(false);
		setHasChanges(false);
	};

	const handleSave = () => {
		if (isGotoScene(endingScene)) {
			if (!endingScene.nextSceneId) {
				alert("遷移先シーンを選択してください");
				return;
			}
		}
		if (isChoiceScene(endingScene)) {
			const validChoices = endingScene.choices.filter(
				(choice) => choice.text.trim() !== "" && choice.nextSceneId !== "",
			);
			if (validChoices.length === 0) {
				alert("少なくとも1つの有効な選択肢が必要です");
				return;
			}
		}
		setHasChanges(false);
		onSaveEnding(endingScene);
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
		<div className="absolute w-full top-0">
			<div className="bg-white rounded-lg shadow overflow-y-auto h-[calc(100dvh-40px)]">
				<div className="sticky top-0 z-10 bg-white border-b p-2 flex justify-between items-start">
					<div>
						<h2 className="text-xl font-bold">シーン終了設定</h2>
						<p className="text-sm text-gray-500">{selectedScene.title}</p>
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
						defaultValue={endingScene.sceneType}
						onValueChange={handleSceneTypeChange}
						className="mb-6"
					>
						<TabsList className="grid grid-cols-3 mb-2">
							<TabsTrigger value="end">終了</TabsTrigger>
							<TabsTrigger value="goto">遷移</TabsTrigger>
							<TabsTrigger value="choice">選択肢</TabsTrigger>
						</TabsList>

						{endingScene.sceneType === "end" && (
							<TabsContent value="end" className="space-y-4">
								<EndSceneContent />
							</TabsContent>
						)}

						{endingScene.sceneType === "goto" && (
							<TabsContent value="goto" className="space-y-4">
								<GotoSceneContent
									scene={endingScene as GotoScene}
									game={game}
									currentSceneId={selectedScene.id}
									onNextSceneChange={handleNextSceneChange}
									onNavigateToScene={onNavigateToScene}
									onOpenNewSceneDialog={() => handleOpenNewSceneDialog(null)}
								/>
							</TabsContent>
						)}

						{endingScene.sceneType === "choice" && (
							<TabsContent value="choice" className="space-y-4">
								<ChoiceSceneContent
									scene={endingScene as ChoiceScene}
									game={game}
									currentSceneId={selectedScene.id}
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
					activeChoiceId.current = null;
				}}
				onCreateScene={handleCreateNewScene}
			/>
		</div>
	);
};
