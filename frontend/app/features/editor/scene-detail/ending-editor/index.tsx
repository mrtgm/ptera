import type React from "react";
import { useEffect, useRef, useState } from "react";
import type {
	Choice,
	ChoiceScene,
	EndScene,
	Game,
	GotoScene,
	Scene,
} from "~/schema";

import {
	ArrowRight,
	Check,
	ChevronDown,
	ChevronRight,
	FileText,
	Plus,
	X,
} from "lucide-react";
import { Badge } from "~/components/shadcn/badge";
import { Button } from "~/components/shadcn/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/shadcn/card";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "~/components/shadcn/command";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/shadcn/dialog";
import { Input } from "~/components/shadcn/input";
import { Label } from "~/components/shadcn/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/shadcn/popover";
import { Separator } from "~/components/shadcn/separator";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "~/components/shadcn/tabs";
import { Textarea } from "~/components/shadcn/textarea";
import { ChoiceSceneContent } from "./choice-scene-content";
import { SceneSelector } from "./scene-selector";

// ユーティリティ関数
export const isGotoScene = (scene: Scene): scene is GotoScene => {
	return scene.sceneType === "goto";
};

export const isChoiceScene = (scene: Scene): scene is ChoiceScene => {
	return scene.sceneType === "choice";
};

export const isEndScene = (scene: Scene): scene is EndScene => {
	return scene.sceneType === "end";
};

// 型定義
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

interface NewSceneDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onCreateScene: (title: string) => void;
}

const NewSceneDialog: React.FC<NewSceneDialogProps> = ({
	isOpen,
	onClose,
	onCreateScene,
}) => {
	const [newSceneTitle, setNewSceneTitle] = useState("");

	const handleCreate = () => {
		if (newSceneTitle.trim()) {
			onCreateScene(newSceneTitle);
			setNewSceneTitle("");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={() => onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>新規シーン作成</DialogTitle>
					<DialogDescription>
						新しいシーンのタイトルを入力してください
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<Label htmlFor="new-scene-title" className="mb-2 block">
						シーンタイトル
					</Label>
					<Input
						id="new-scene-title"
						value={newSceneTitle}
						onChange={(e) => setNewSceneTitle(e.target.value)}
						placeholder="シーンタイトルを入力"
						autoFocus
					/>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						キャンセル
					</Button>
					<Button onClick={handleCreate} disabled={!newSceneTitle.trim()}>
						作成
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

const EndSceneContent: React.FC = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-bold">ゲーム終了</CardTitle>
				<CardDescription>このシーンでゲームが終了します</CardDescription>
			</CardHeader>
		</Card>
	);
};

interface GotoSceneContentProps {
	scene: GotoScene;
	game: Game | null;
	currentSceneId: string;
	onNextSceneChange: (nextSceneId: string) => void;
	onNavigateToScene: (sceneId: string) => void;
	onOpenNewSceneDialog: () => void;
}

const GotoSceneContent: React.FC<GotoSceneContentProps> = ({
	scene,
	game,
	currentSceneId,
	onNextSceneChange,
	onNavigateToScene,
	onOpenNewSceneDialog,
}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-bold">次のシーンへ</CardTitle>
				<CardDescription>
					プレイヤーは自動的に次のシーンへ進みます
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div>
						<Label className="text-base">遷移先シーン</Label>
						<div className="flex items-center gap-2 mt-2">
							<SceneSelector
								game={game}
								currentSceneId={currentSceneId}
								selectedSceneId={scene.nextSceneId}
								onSelect={onNextSceneChange}
								onCreateNew={onOpenNewSceneDialog}
								onNavigate={onNavigateToScene}
							/>
						</div>
						<p className="text-xs text-gray-500 mt-2">
							このシーン終了後に自動的に遷移するシーンを選択します
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

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

	// シーンタイプ変更ハンドラー
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
				"変更内容が保存されていません。破棄しますか？",
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
