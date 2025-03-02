import { Laptop, PlayCircle, Rewind, Smartphone } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { Button } from "~/components/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/shadcn/dialog";
import { Tabs, TabsList, TabsTrigger } from "~/components/shadcn/tabs";
import { GameScreen } from "~/features/player/components/game-screen";
import { usePlayerInitialize } from "~/features/player/hooks";
import { Player } from "~/features/player/utils/engine";
import { INITIAL_STAGE } from "~/features/player/utils/engine";
import { getFirstEvent } from "~/features/player/utils/event";
import {
	buildCurrentStageFromScenes,
	findAllPaths,
} from "~/features/player/utils/graph";
import type { Game, GameEvent, GameResources, Scene } from "~/schema";
import { useStore } from "~/stores";
import type { PreviewParams } from "~/stores/modal";

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
	game: Game | null;
	resources: GameResources | null;
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
		game: Game;
		resources: GameResources;
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
								<PreviewFromGivenEvent
									game={game}
									resources={resources}
									params={params}
								/>
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

const PreviewFromGivenEvent = ({
	game,
	resources,
	params,
}: {
	game: Game;
	resources: GameResources;
	params: PreviewParams;
}) => {
	// Use useRef to maintain a stable reference to the Player instance
	const playerRef = useRef<Player | null>(null);

	// Initialize the player if it doesn't exist
	if (!playerRef.current) {
		playerRef.current = new Player();
	}

	const {
		stage,
		cache,
		state,
		history,
		currentEvent: previewCurrentEvent,
	} = usePlayerInitialize({
		player: playerRef.current,
		gameToLoad: game,
		resourcesToLoad: resources,
	});

	// Set up the preview game after player initialization and event listeners are attached
	useEffect(() => {
		// Make sure player and listeners are initialized
		if (!playerRef.current) {
			playerRef.current = new Player();
		}

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

		// Use setTimeout to ensure all event listeners are attached before preview starts
		setTimeout(() => {
			playerRef.current?.previewGame(currentStage, currentScene, currentEvent);
		}, 0);

		return () => {
			if (playerRef.current) {
				playerRef.current.dispose();
				playerRef.current = null;
			}
		};
	}, [game, resources, params]);

	console.log(previewCurrentEvent, "stage");

	return (
		<>
			{state === "end" ? (
				<div className="w-full h-full flex justify-center items-center absolute top-0 z-20">
					<div>ゲーム終了</div>
				</div>
			) : (
				<>
					{stage && (
						<GameScreen
							style={{
								minWidth: "auto",
								maxWidth: "100%",
								aspectRatio: "auto",
								height: "100%",
								minHeight: "auto",
								width: "100%",
							}}
							player={playerRef.current}
							stage={stage}
							resourceCache={cache}
							history={history}
							handleTapScreen={() => {
								if (previewCurrentEvent && state !== "idle") {
									playerRef.current?.addCancelRequest(previewCurrentEvent.id);
								}
							}}
							state={state}
							currentEvent={previewCurrentEvent}
							isPreviewMode
						/>
					)}
				</>
			)}
		</>
	);
};
