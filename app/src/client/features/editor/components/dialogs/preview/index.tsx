import { Button } from "@/client/components/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/client/components/shadcn/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/client/components/shadcn/tabs";
import {
	buildCurrentStageFromScenes,
	findAllPaths,
	getFirstEvent,
} from "@/client/features/editor/utils/preview";
import { INITIAL_STAGE } from "@/client/features/player/constants";
import GamePlayer from "@/client/features/player/player";
import { EventManager } from "@/client/features/player/utils/event";
import type { Stage } from "@/client/schema";
import { useStore } from "@/client/stores";
import type { PreviewParams } from "@/client/stores/modal";
import type {
	EventResponse,
	GameDetailResponse,
	ResourceResponse,
	SceneResponse,
} from "@/schemas/games/dto";
import { Laptop, PlayCircle, Rewind, Smartphone } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

type DevicePreset = {
	id: string;
	name: string;
	width: number;
	height: number;
};

const devicePresets: DevicePreset[] = [
	{ id: "pc", name: "PC", width: 1280, height: 720 },
	{ id: "tablet", name: "タブレット", width: 768, height: 1024 },
	{ id: "smartphone", name: "スマートフォン", width: 375, height: 667 },
];

export const PreviewDialogContainer = ({
	game,
	resources,
}: {
	game: GameDetailResponse | null;
	resources: ResourceResponse | null;
}) => {
	const modalSlice = useStore.useSlice.modal();

	if (!game || !resources || modalSlice.modalType !== "preview") return null;

	return (
		<Dialog
			open={modalSlice.isOpen}
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					modalSlice.closeModal();
				}
			}}
		>
			<PreviewDialog
				game={game}
				resources={resources}
				params={modalSlice.params as PreviewParams}
			/>
		</Dialog>
	);
};

const PreviewDialog = memo(
	({
		game,
		resources,
		params,
	}: {
		game: GameDetailResponse;
		resources: ResourceResponse;
		params: PreviewParams;
	}) => {
		const modalSlice = useStore.useSlice.modal();
		const isOpen = modalSlice.isOpen && modalSlice.modalType === "preview";

		const [selectedDevice, setSelectedDevice] = useState<string>("pc");
		const [previewMode, setPreviewMode] = useState<
			"from-current" | "from-beginning"
		>("from-current");

		const devicePreset = devicePresets.find(
			(preset) => preset.id === selectedDevice,
		);

		if (!game || !resources || !devicePreset) {
			return null;
		}

		return (
			<Dialog
				open={isOpen}
				onOpenChange={(open) => !open && modalSlice.closeModal()}
			>
				<DialogContent className="sm:max-w-[90vw] max-h-[90vh] flex flex-col">
					<DialogHeader>
						<DialogTitle>イベントプレビュー</DialogTitle>
					</DialogHeader>

					<div className="flex gap-4 my-4">
						<div className="flex flex-col space-y-4">
							<div className="flex flex-col space-y-2">
								<span className="text-sm font-medium">プレビューモード</span>
								<Tabs
									value={previewMode}
									onValueChange={(value) =>
										setPreviewMode(value as "from-current" | "from-beginning")
									}
									className="w-full"
								>
									<TabsList className="grid grid-cols-2">
										<TabsTrigger
											value="from-current"
											className="flex items-center gap-2"
										>
											<PlayCircle size={16} />
											<span>現在のイベントから</span>
										</TabsTrigger>
										<TabsTrigger
											value="from-beginning"
											className="flex items-center gap-2"
										>
											<Rewind size={16} />
											<span>ゲームの最初から</span>
										</TabsTrigger>
									</TabsList>
								</Tabs>
							</div>

							<div className="flex flex-col space-y-2">
								<span className="text-sm font-medium">デバイス</span>
								<Tabs
									value={selectedDevice}
									onValueChange={setSelectedDevice}
									className="w-full"
								>
									<TabsList className="grid grid-cols-3">
										<TabsTrigger value="pc" className="flex items-center gap-2">
											<Laptop size={16} />
											<span>PC</span>
										</TabsTrigger>
										<TabsTrigger
											value="tablet"
											className="flex items-center gap-2"
										>
											<Smartphone size={16} className="rotate-90" />
											<span>タブレット</span>
										</TabsTrigger>
										<TabsTrigger
											value="smartphone"
											className="flex items-center gap-2"
										>
											<Smartphone size={16} />
											<span>スマホ</span>
										</TabsTrigger>
									</TabsList>
								</Tabs>
							</div>
						</div>

						<div
							className="flex-1 bg-gray-100 rounded-md flex justify-center items-center overflow-auto p-4"
							style={{ maxHeight: "70vh" }}
						>
							<div
								className="relative bg-white shadow-lg"
								style={{
									width: `${devicePreset.width}px`,
									height: `${devicePreset.height}px`,
									maxWidth: "100%",
									maxHeight: "100%",
									transform: devicePreset.width > 500 ? "none" : "scale(0.8)",
									transformOrigin: "top left",
								}}
							>
								{previewMode === "from-current" ? (
									<PreviewFromGivenEvent
										game={game}
										resources={resources}
										params={params}
									/>
								) : (
									<PreviewFromStart game={game} resources={resources} />
								)}
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={modalSlice.closeModal}>
							閉じる
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	},
);

const PreviewFromStart = ({
	game,
	resources,
}: {
	game: GameDetailResponse;
	resources: ResourceResponse;
}) => {
	const managerRef = useRef<EventManager | null>(null);

	const [initialStage] = useState<Stage>(INITIAL_STAGE);
	const [initialScene, setIntialScene] = useState<SceneResponse | null>(null);
	const [initialEvent, setIntialEvent] = useState<EventResponse | null>(null);

	if (!managerRef.current) managerRef.current = new EventManager();

	useEffect(() => {
		const firstScene = game.scenes.find(
			(scene) => scene.id === game.initialSceneId,
		);
		if (!firstScene) {
			throw new Error(`シーンが見つかりません: ${game.initialSceneId}`);
		}
		const firstEvent = getFirstEvent(firstScene.events);
		if (!firstEvent) {
			throw new Error(`最初のイベントが見つかりません: ${firstScene.id}`);
		}

		setIntialScene(firstScene);
		setIntialEvent(firstEvent);
	}, [game]);

	return (
		<>
			{initialEvent && initialScene && initialStage && (
				<GamePlayer
					key="preview-from-start"
					game={game}
					resources={resources}
					initialEvent={initialEvent}
					initialScene={initialScene}
					initialStage={initialStage}
					eventManager={managerRef.current as EventManager}
					isPreviewMode
				/>
			)}
		</>
	);
};

const PreviewFromGivenEvent = ({
	game,
	resources,
	params,
}: {
	game: GameDetailResponse;
	resources: ResourceResponse;
	params: PreviewParams;
}) => {
	const managerRef = useRef<EventManager | null>(null);

	const [initialStage, setInitialStage] = useState<Stage>(INITIAL_STAGE);
	const [initialScene, setIntialScene] = useState<SceneResponse | null>(null);
	const [initialEvent, setIntialEvent] = useState<EventResponse | null>(null);

	if (!managerRef.current) managerRef.current = new EventManager();

	useEffect(() => {
		const currentScene = game.scenes.find(
			(scene) => scene.id === params.currentSceneId,
		);
		const currentEvent = currentScene?.events.find(
			(event) => event.id === params.currentEventId,
		);

		if (!currentScene || !currentEvent) {
			return;
		}

		const result = findAllPaths({
			game,
			targetSceneId: currentScene.id,
		});

		const currentStage = buildCurrentStageFromScenes({
			scenes: result,
			currentStage: INITIAL_STAGE,
			resources,
			eventId: currentEvent.id,
		});

		setIntialScene(currentScene);
		setIntialEvent(currentEvent);
		setInitialStage(currentStage);
	}, [game, resources, params]);

	return (
		<>
			{initialEvent && initialScene && initialStage && (
				<GamePlayer
					key="preview-from-given-event"
					game={game}
					resources={resources}
					initialEvent={initialEvent}
					initialScene={initialScene}
					initialStage={initialStage}
					eventManager={managerRef.current as EventManager}
					isPreviewMode
				/>
			)}
		</>
	);
};
