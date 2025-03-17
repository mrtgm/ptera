import type { GameDetailResponse, SceneResponse } from "@ptera/schema";
import type { SideBarSettings } from "../../constants";

type SceneCardProps = {
	scene: SceneResponse;
	index: number;
	game: GameDetailResponse;
	sideBarSettings: typeof SideBarSettings;
	onSceneClick: (sceneId: number) => void;
};

export const SceneItem = ({
	scene,
	index,
	game,
	sideBarSettings,
	onSceneClick,
}: SceneCardProps) => {
	let badgeColor = "bg-gray-200 text-gray-700";
	let badgeText = "通常";

	if (scene.sceneType === "end") {
		badgeColor = "bg-red-100 text-red-800";
		badgeText = "エンディング";
	} else if (scene.sceneType === "choice") {
		badgeColor = "bg-blue-100 text-blue-800";
		badgeText = "選択肢";
	} else if (scene.sceneType === "goto") {
		badgeColor = "bg-green-100 text-green-800";
		badgeText = "次のシーンへ";
	}

	const eventCount = scene.events?.length || 0;

	return (
		<div className="mb-2 hover:bg-gray-50 rounded-lg border border-gray-200">
			<div
				className="cursor-pointer w-full p-3"
				onClick={() => onSceneClick(scene.id)}
				onKeyDown={() => {}}
			>
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center gap-2">
						<div className="flex-shrink-0 w-6 h-6 flex items-center justify-center font-medium">
							{index + 1}
						</div>
						<h3 className="font-medium text-gray-900">{scene.name}</h3>
					</div>

					<span
						className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}
					>
						{badgeText}
					</span>
				</div>

				{eventCount > 0 && (
					<div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-1">
						{scene.events.slice(0, 3).map((event, i) => {
							const categoryColor =
								sideBarSettings[event.category]?.hex || "#6366F1";
							return (
								<span
									key={`${event.id}-${i}`}
									className="inline-flex items-center px-2 py-0.5 rounded-md"
									style={{
										backgroundColor: `${categoryColor}20`,
										color: categoryColor,
									}}
								>
									{sideBarSettings[event.category]?.items.find(
										(item) => item.type === event.eventType,
									)?.label || event.eventType}
								</span>
							);
						})}
						{eventCount > 3 && (
							<span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">
								+{eventCount - 3}
							</span>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
