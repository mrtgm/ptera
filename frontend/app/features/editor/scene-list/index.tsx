import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
} from "~/components/shadcn/breadcrumb";
import { Button } from "~/components/shadcn/button";
import type { Game } from "~/schema";
import type { SideBarSettings } from "../constants";
import { SceneCard } from "./scene-card";

type ScenesListProps = {
	game: Game | null;
	sideBarSettings: typeof SideBarSettings;
	onSceneClick: (sceneId: string) => void;
};

export const ScenesList = ({
	game,
	sideBarSettings,
	onSceneClick,
}: ScenesListProps) => {
	if (!game) {
		return null;
	}

	return (
		<>
			<div className="flex justify-between items-center mb-2">
				<Breadcrumb className="mb-2">
					<BreadcrumbList>
						<BreadcrumbItem>シーン一覧</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			<div className="w-full h-[calc(100dvh-120px)] flex flex-col select-none gap-2 overflow-scroll">
				{game.scenes.map((scene, index) => (
					<SceneCard
						key={scene.id}
						scene={scene}
						index={index}
						game={game}
						sideBarSettings={sideBarSettings}
						onSceneClick={onSceneClick}
					/>
				))}

				{game.scenes.length === 0 && (
					<div className="flex flex-col items-center justify-center h-full text-gray-500">
						<p className="mb-4">シーンがありません</p>
					</div>
				)}
			</div>
		</>
	);
};
