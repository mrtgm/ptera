import { Laptop, PlayCircle, Rewind, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/shadcn/dialog";
import { Tabs, TabsList, TabsTrigger } from "~/components/shadcn/tabs";
import { GameScreen } from "~/features/player/game-screen";
import { usePlayerInitialize } from "~/features/player/hooks";
import { Player } from "~/features/player/libs/engine";
import { INITIAL_STAGE } from "~/features/player/libs/engine";
import {
	buildCurrentStageFromScenes,
	findAllPaths,
} from "~/features/player/libs/utils";
import type {
	Game,
	GameEvent,
	GameResources,
	ResourceCache,
	Scene,
} from "~/schema";
import { useStore } from "~/stores";
import type { ModalParams } from "~/stores/modal";

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

export const PreviewDialog = ({
	game,
	resources,
	currentScene,
	currentEvent,
	formValues,
}: {
	game: Game;
	resources: GameResources;
	currentScene: Scene;
	currentEvent: GameEvent;
	formValues: Partial<GameEvent>;
}) => {
	const modalSlice = useStore.useSlice.modal();
	const isOpen = modalSlice.isOpen && modalSlice.target === "preview";

	const [player, setPlayer] = useState<Player>(() => new Player());
	const [selectedDevice, setSelectedDevice] = useState<string>("pc");
	const [previewMode, setPreviewMode] = useState<
		"from-current" | "from-beginning"
	>("from-current");
	const [viewportSize, setViewportSize] = useState<{
		width: number;
		height: number;
	}>({
		width: 1280,
		height: 720,
	});

	const {
		stage,
		cache,
		state,
		history,
		currentEvent: previewCurrentEvent,
	} = usePlayerInitialize({
		player,
		gameToLoad: game,
		resourcesToLoad: resources,
	});

	// デバイス選択時の処理
	useEffect(() => {
		const device = devicePresets.find((d) => d.id === selectedDevice);
		if (device) {
			setViewportSize({ width: device.width, height: device.height });
		}
	}, [selectedDevice]);

	// プレビュー実行
	useEffect(() => {
		if (!isOpen || !game || !resources) return;

		const updatedEvent = {
			...currentEvent,
			...formValues,
		} as GameEvent;

		const updatedScene = {
			...currentScene,
			events: currentScene.events.map((event) => {
				if (event.id === currentEvent.id) {
					return updatedEvent;
				}
				return event;
			}),
		};

		const result = findAllPaths({
			game,
			targetSceneId: currentScene.id,
		});

		if (previewMode === "from-current") {
			console.log("dispose3");

			player.dispose();
			const newPlayer = new Player();

			const currentStage = buildCurrentStageFromScenes({
				scenes: result,
				currentStage: INITIAL_STAGE,
				resources,
				eventId: updatedEvent.id,
			});

			newPlayer.previewGame(currentStage, updatedScene, updatedEvent);
			setPlayer(() => newPlayer);
		} else {
			console.log("dispose");
			player.dispose();
			const newPlayer = new Player();

			// const firstScene = game.scenes[0];
			// const firstEvent = game.scenes[0].events[0];

			const firstEvent = updatedScene.events[0];

			console.log("firstEvent", firstEvent);

			newPlayer.previewGame(INITIAL_STAGE, updatedScene, firstEvent);
			setPlayer(() => newPlayer);
		}

		return () => {
			console.log("dispose2");
			player.dispose();
		};
	}, [
		isOpen,
		previewMode,
		formValues,
		game,
		resources,
		currentScene,
		currentEvent,
		player.dispose,
	]);

	useEffect(() => {
		if (!isOpen) {
			player.dispose();
			setPlayer(() => new Player());
		}
	}, [isOpen, player.dispose]);

	if (!game || !resources) {
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
										<span>シーンの最初から</span>
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
								width: `${viewportSize.width}px`,
								height: `${viewportSize.height}px`,
								maxWidth: "100%",
								maxHeight: "100%",
								transform: viewportSize.width > 500 ? "none" : "scale(0.8)",
								transformOrigin: "top left",
							}}
						>
							{state === "end" && (
								<div className="w-full h-full flex justify-center items-center absolute top-0 z-20">
									<div>ゲーム終了</div>
								</div>
							)}
							{stage ? (
								<GameScreen
									style={{
										minWidth: "auto",
										maxWidth: "100%",
										aspectRatio: "auto",
										height: "100%",
										minHeight: "auto",
										width: "100%",
									}}
									player={player}
									stage={stage}
									resourceCache={cache}
									history={history}
									handleTapScreen={() => {
										if (previewCurrentEvent && state !== "idle") {
											player.addCancelRequest(previewCurrentEvent?.id);
										}
									}}
									state={state}
									currentEvent={previewCurrentEvent}
									isPreviewMode
								/>
							) : (
								<div className="w-full h-full flex justify-center items-center">
									<div>読み込み中...</div>
								</div>
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
};
