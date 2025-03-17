import { Button } from "@/client/components/shadcn/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/client/components/shadcn/card";
import { Label } from "@/client/components/shadcn/label";
import { Textarea } from "@/client/components/shadcn/textarea";
import type { Choice, ChoiceScene, GameDetailResponse } from "@ptera/schema";
import { Plus, X } from "lucide-react";
import { SceneSelector } from "./scene-selector";

interface ChoiceSceneContentProps {
	scene: ChoiceScene;
	game: GameDetailResponse | null;
	currentSceneId: number;
	onAddChoice: () => void;
	onRemoveChoice: (choiceId: number) => void;
	onChoiceTextChange: (choiceId: number, text: string) => void;
	onChoiceNextSceneChange: (choiceId: number, nextSceneId: number) => void;
	onNavigateToScene: (sceneId: number) => void;
	onCreateNewSceneForChoice: (choiceId: number) => void;
}

interface ChoiceItemProps {
	choice: Choice;
	index: number;
	game: GameDetailResponse | null;
	currentSceneId: number;
	onTextChange: (choiceId: number, text: string) => void;
	onNextSceneChange: (choiceId: number, nextSceneId: number) => void;
	onRemove: (choiceId: number) => void;
	onNavigateToScene: (sceneId: number) => void;
	onCreateNewScene: (choiceId: number) => void;
}

const ChoiceItem: React.FC<ChoiceItemProps> = ({
	choice,
	index,
	game,
	currentSceneId,
	onTextChange,
	onNextSceneChange,
	onRemove,
	onNavigateToScene,
	onCreateNewScene,
}) => {
	return (
		<Card key={choice.id} className="border border-gray-200">
			<CardHeader className="pt-3 pb-0 px-4 flex flex-row items-center justify-between space-y-0">
				<h4 className="font-medium text-sm">選択肢 {index + 1}</h4>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8"
					onClick={() => onRemove(choice.id)}
				>
					<X className="h-4 w-4" />
				</Button>
			</CardHeader>
			<CardContent className="py-2 px-4 space-y-4">
				<div>
					<Label htmlFor={`choice-text-${choice.id}`}>テキスト</Label>
					<Textarea
						id={`choice-text-${choice.id}`}
						value={choice.text}
						onChange={(e) => onTextChange(choice.id, e.target.value)}
						placeholder="選択肢のテキストを入力"
						className="mt-1"
						rows={1}
					/>
				</div>

				<div>
					<Label htmlFor={`choice-scene-${choice.id}`}>遷移先シーン</Label>
					<div className="flex items-center gap-2 mt-1">
						<SceneSelector
							game={game}
							currentSceneId={currentSceneId}
							selectedSceneId={choice.nextSceneId}
							onSelect={(sceneId) => onNextSceneChange(choice.id, sceneId)}
							onCreateNew={() => onCreateNewScene(choice.id)}
							onNavigate={onNavigateToScene}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export const ChoiceSceneContent: React.FC<ChoiceSceneContentProps> = ({
	scene,
	game,
	currentSceneId,
	onAddChoice,
	onRemoveChoice,
	onChoiceTextChange,
	onChoiceNextSceneChange,
	onNavigateToScene,
	onCreateNewSceneForChoice,
}) => {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<div className="space-y-1.5">
					<CardTitle className="text-xl font-bold">選択肢</CardTitle>
					<CardDescription>
						プレイヤーに表示する選択肢を設定します
					</CardDescription>
				</div>
				<Button onClick={onAddChoice} size="sm">
					<Plus className="h-4 w-4 mr-2" />
					選択肢を追加
				</Button>
			</CardHeader>
			<CardContent className="pt-2">
				{scene.choices.length === 0 ? (
					<div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-md border border-dashed border-gray-300">
						<p className="text-sm text-gray-500 mb-4 text-center">
							選択肢がありません。
							<br />
							「選択肢を追加」をクリックして選択肢を追加してください。
						</p>
						<Button variant="outline" size="sm" onClick={onAddChoice}>
							<Plus className="h-4 w-4 mr-2" />
							選択肢を追加
						</Button>
					</div>
				) : (
					<div className="space-y-2">
						{scene.choices.map((choice, index) => (
							<ChoiceItem
								key={choice.id}
								choice={choice}
								index={index}
								game={game}
								currentSceneId={currentSceneId}
								onTextChange={onChoiceTextChange}
								onNextSceneChange={onChoiceNextSceneChange}
								onRemove={onRemoveChoice}
								onNavigateToScene={onNavigateToScene}
								onCreateNewScene={onCreateNewSceneForChoice}
							/>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};
