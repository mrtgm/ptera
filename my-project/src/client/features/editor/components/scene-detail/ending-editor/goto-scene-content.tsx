import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/client/components/shadcn/card";
import { Label } from "@/client/components/shadcn/label";
import type { Game, GotoScene } from "@/client/schema";
import { SceneSelector } from "./scene-selector";

interface GotoSceneContentProps {
	scene: GotoScene;
	game: Game | null;
	currentSceneId: string;
	onNextSceneChange: (nextSceneId: string) => void;
	onNavigateToScene: (sceneId: string) => void;
	onOpenNewSceneDialog: () => void;
}

export const GotoSceneContent: React.FC<GotoSceneContentProps> = ({
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
