import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "~/components/shadcn/breadcrumb";
import { Button } from "~/components/shadcn/button";
import type { SideBarSettings } from "./constants";
import { EventTimeline } from "./event-timeline";

export const SceneEditor = ({
	selectedScene,
	game,
	cache,
	sideBarSettings,
	onNavigateToScenesList,
	onDeleteScene,
	onClickEvent,
}: {
	selectedScene: Scene | undefined;
	game: Game;
	cache: ResourceCache;
	sideBarSettings: typeof SideBarSettings;
	onNavigateToScenesList: () => void;
	onDeleteScene: () => void;
	onClickEvent: (eventId: string) => void;
}) => {
	if (!selectedScene) {
		return null;
	}

	return (
		<>
			<div className="flex justify-between items-center mb-2">
				<Breadcrumb className="mb-2">
					<BreadcrumbList>
						<BreadcrumbItem
							onClick={onNavigateToScenesList}
							className="cursor-pointer"
						>
							シーン一覧
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>{selectedScene?.title}</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<Button onClick={onDeleteScene} variant="destructive" size="sm">
					シーン削除
				</Button>
			</div>

			<EventTimeline
				selectedScene={selectedScene}
				game={game}
				sideBarSettings={sideBarSettings}
				cache={cache}
				onClickEvent={onClickEvent}
			/>
		</>
	);
};
