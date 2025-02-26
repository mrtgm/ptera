import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "~/components/shadcn/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "~/components/shadcn/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/shadcn/form";
import { Input } from "~/components/shadcn/input";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "~/components/shadcn/tabs";
import { Textarea } from "~/components/shadcn/textarea";
import { Player } from "~/features/player/libs/engine";
import { useClickAway } from "~/hooks/use-click-away";
import {
	type AppearCharacterEvent,
	type ChangeBackgroundEvent,
	type Game,
	type GameEvent,
	type GameResources,
	type ResourceCache,
	type Scene,
	appearCGEventSchema,
	appearCharacterEventSchema,
	appearMessageWindowEventSchema,
	bgmStartEventSchema,
	bgmStopEventSchema,
	changeBackgroundEventSchema,
	characterEffectEventSchema,
	effectEventSchema,
	hideAllCharactersEventSchema,
	hideCharacterEventSchema,
	hideMessageWindowEventSchema,
	moveCharacterEventSchema,
	soundEffectEventSchema,
	textRenderEventSchema,
} from "~/schema";
import { GameScreen } from "../player/game-screen";
import { usePlayerInitialize } from "../player/hooks";
import { INITIAL_STAGE } from "../player/libs/engine";
import {
	buildCurrentStageFromScenes,
	findAllPaths,
} from "../player/libs/utils";
import { type SidebarItemParameter, getEventTitle } from "./constants";
import { SideBarSettings } from "./constants";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/shadcn/dialog";
import { DialogClose } from "~/components/shadcn/dialog";
import { Label } from "~/components/shadcn/label";
import { Separator } from "~/components/shadcn/separator";
import { useStore } from "~/stores";
import type { ModalParams, ModalPayload } from "~/stores/modal";
import { AdjustSizeDialog } from "./adjust-size-dialog";
import AssetDialog from "./asset-dialog";

type EventEditorProps = {
	selectedScene: Scene;
	selectedEvent: GameEvent;
	game: Game | null;
	resources: GameResources | null;
	onDeleteEvent: () => void;
	onSaveEvent: (updatedEvent: GameEvent) => void;
	onClickAwayEvent: (e: MouseEvent) => void;
};

const schemaMap: Record<GameEvent["type"], z.ZodType> = {
	text: textRenderEventSchema,
	moveCharacter: moveCharacterEventSchema,
	appearCharacter: appearCharacterEventSchema,
	hideCharacter: hideCharacterEventSchema,
	characterEffect: characterEffectEventSchema,
	appearCG: appearCGEventSchema,
	hideCG: appearCGEventSchema,
	changeBackground: changeBackgroundEventSchema,
	bgmStart: bgmStartEventSchema,
	bgmStop: bgmStopEventSchema,
	soundEffect: soundEffectEventSchema,
	effect: effectEventSchema,
	appearMessageWindow: appearMessageWindowEventSchema,
	hideMessageWindow: hideMessageWindowEventSchema,
	hideAllCharacters: hideAllCharactersEventSchema,
};

export type AssetFormType =
	| "backgroundId"
	| "cgImageId"
	| "soundEffectId"
	| "bgmId";

export const EventEditor = ({
	selectedScene,
	selectedEvent,
	game,
	resources,
	onDeleteEvent,
	onSaveEvent,
	onClickAwayEvent,
}: EventEditorProps) => {
	const [activeTab, setActiveTab] = useState("parameters");
	const modalSlice = useStore.useSlice.modal();

	const ref = useRef<HTMLDivElement>(null);

	const formSchema = schemaMap[selectedEvent.type];

	// useClickAway({
	// 	ref,
	// 	handler: onClickAwayEvent,
	// });

	const form = useForm({
		mode: "onBlur",
		defaultValues: selectedEvent as Record<string, unknown>,
		resolver: zodResolver(formSchema),
	});

	const handleSubmit = (data: Partial<GameEvent>) => {
		const updatedEvent = {
			...selectedEvent,
			...data,
		} as GameEvent;
		onSaveEvent(updatedEvent);
	};

	const handleConfirmAssetSelection = (
		assetId: string,
		type: AssetFormType,
	) => {
		form.setValue(type, assetId);
	};

	if (!selectedEvent || !game || !resources) {
		return null;
	}

	return (
		<div className="w-full h-full overflow-auto p-4" ref={ref}>
			<AssetDialog
				resources={resources}
				onConfirmAssetSelection={handleConfirmAssetSelection}
			/>
			<AdjustSizeDialog
				onConfirmAdjustment={(x) => {
					console.log(x);
				}}
				open={modalSlice.isOpen && modalSlice.target === "adjustSize"}
				resources={resources}
				onOpenChange={modalSlice.closeModal}
				initialData={modalSlice.params as ModalParams["adjustSize"]}
			/>

			<Card className="w-full">
				<CardHeader className="flex flex-row justify-between items-center">
					<CardTitle className="text-md">
						{getEventTitle(selectedEvent.type)}
					</CardTitle>
					<Button variant="destructive" onClick={onDeleteEvent}>
						イベント削除
					</Button>
				</CardHeader>
				<CardContent>
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="mb-4">
							<TabsTrigger value="parameters">パラメータ</TabsTrigger>
							<TabsTrigger value="preview">プレビュー</TabsTrigger>
						</TabsList>

						<Form {...form}>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									form.handleSubmit(handleSubmit)();
								}}
							>
								<TabsContent value="parameters" className="space-y-4">
									{renderEventFormFields(selectedEvent, form, game, resources)}
								</TabsContent>

								<TabsContent value="preview">
									<div className="min-h-[200px] bg-gray-100 rounded-md p-4">
										{renderEventPreview(
											form,
											game,
											resources,
											selectedScene,
											selectedEvent,
											activeTab,
										)}
									</div>
								</TabsContent>

								<div className="mt-4 flex justify-end">
									<Button type="submit">保存</Button>
								</div>
							</form>
						</Form>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
};

const renderEventPreview = (
	form: ReturnType<typeof useForm>,
	game: Game,

	resources: GameResources,
	currentScene: Scene,
	currentEvent: GameEvent,
	activeTab: string,
) => {
	const [formValues, setFormValues] =
		useState<Partial<GameEvent>>(currentEvent);
	const [player, setPlayer] = useState<Player>(() => new Player());

	const {
		stage,
		cache,
		state,
		currentEvent: previewCurrentEvent,
	} = usePlayerInitialize({
		player,
		gameToLoad: game,
		resourcesToLoad: resources,
	});

	useEffect(() => {
		if (activeTab !== "preview") {
			player.dispose();
			setPlayer(() => new Player());
			return;
		}

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

		const currentStage = buildCurrentStageFromScenes({
			scenes: result,
			currentStage: INITIAL_STAGE,
			resources,
			eventId: updatedEvent.id,
		});

		player.previewGame(currentStage, updatedScene, updatedEvent);
	}, [
		activeTab,
		formValues,
		currentEvent,
		currentScene,
		game,
		resources,
		player.dispose,
		player.previewGame,
	]);

	useEffect(() => {
		const subscription = form.watch((data) => {
			setFormValues(data as Partial<GameEvent>);
		});
		return () => subscription.unsubscribe();
	}, [form]);

	return (
		<div className="w-full h-full relative">
			{state === "end" && (
				<div className="w-full h-full flex justify-center items-center absolute top-0 z-20">
					<div>ゲーム終了</div>
				</div>
			)}
			{stage ? (
				<GameScreen
					player={player}
					stage={stage}
					resourceCache={cache}
					history={[]}
					handleTapScreen={() => {
						if (previewCurrentEvent && state !== "idle") {
							player.addCancelRequest(previewCurrentEvent?.id);
							console.log(state, player.cancelTransitionRequests);
						}
					}}
					state={state}
					currentEvent={previewCurrentEvent}
					isPreviewMode
				/>
			) : (
				<div className="w-full h-full flex justify-center items-center">
					<div>プレビューを表示するにはイベントを保存してください。</div>
				</div>
			)}
		</div>
	);
};

const renderEventFormFields = (
	event: GameEvent,
	form: ReturnType<typeof useForm>,
	game: Game,
	resources: GameResources,
) => {
	const category = event.category;
	const settings = SideBarSettings[category];
	const fields = settings?.items.find(
		(item) => item.type === event.type,
	)?.parameters;

	if (!fields) {
		return null;
	}

	return fields.map((v) => {
		return (
			<div key={v.label}>{renderField(v, event, form, game, resources)}</div>
		);
	});
};

const renderField = (
	field: SidebarItemParameter,
	event: GameEvent,
	form: ReturnType<typeof useForm>,
	game: Game,
	resources: GameResources,
) => {
	switch (field.component) {
		case "text": {
			return <TextInput label={field.label} form={form} />;
		}
		case "character-name-input": {
			return <CharacterNameInput label={field.label} form={form} />;
		}
		case "background-select": {
			return (
				<BackgroundSelect
					label={field.label}
					form={form}
					resources={resources}
					event={event}
				/>
			);
		}
		case "cg-select": {
			return <CGSelect form={form} label={field.label} resources={resources} />;
		}
		case "bgm-select": {
			return (
				<BGMSelect form={form} label={field.label} resources={resources} />
			);
		}
		// case "transition-duration": {
		// 	// return <TransitionDuration form={form} field={field} event={event} />;
		// }

		// case "character-effect-select": {
		// 	// return <CharacterEffectSelect form={form} field={field} event={event} />;
		// }
		// case "effect-select": {
		// 	// return <EffectSelect form={form} field={field} event={event} />;
		// }
		// case "sound-effect-select": {
		// 	// return <SoundEffectSelect form={form} field={field} event={event} />;
		// }
		// case "volume-slider": {
		// 	// return <VolumeSlider form={form} field={field} event={event} />;
		// }
		// case "character-image-select": {
		// 	// return (
		// 	// 	<CharacterImageSelect
		// 	// 		form={form}
		// 	// 		field={field}
		// 	// 		event={event}
		// 	// 		cache={cache}
		// 	// 	/>
		// 	// );
		// }
		// case "position-select": {
		// 	// return <PositionSelect form={form} field={field} event={event} />;
		// }
		// case "character-select": {
		// 	return (
		// 		// <CharacterSelect form={form} field={field} event={event} game={game} />
		// 	);
		// }

		default:
			return null;
	}
};

const TextInput = ({
	label,
	form,
}: {
	label: string;
	form: ReturnType<typeof useForm>;
}) => {
	return (
		<FormField
			key={"lines"}
			control={form.control}
			name={"lines"}
			render={({ field }) => {
				const { value, ...rest } = field;
				const newValue =
					(Array.isArray(value) ? value.join("\n") : value) || "";
				return (
					<FormItem>
						<FormLabel>{label}</FormLabel>
						<FormControl>
							<Textarea
								placeholder="テキストを入力"
								rows={6}
								{...rest}
								value={newValue}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
};

const CharacterNameInput = ({
	form,
	label,
}: {
	form: ReturnType<typeof useForm>;
	label: string;
}) => {
	return (
		<FormField
			key={"characterName"}
			control={form.control}
			name={"characterName"}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Input placeholder="キャラクター名を入力" {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

const BackgroundSelect = ({
	label,
	form,
	resources,
	event,
}: {
	label: string;
	form: ReturnType<typeof useForm>;
	resources: GameResources;
	event: GameEvent;
}) => {
	const modalSlice = useStore.useSlice.modal();

	return (
		<>
			<FormField
				key={"backgroundId"}
				control={form.control}
				name={"backgroundId"}
				render={({ field }) => (
					<FormItem>
						<FormLabel>{label}</FormLabel>

						{field.value && resources.backgroundImages[field.value] ? (
							<>
								<div className="w-full max-w-[200px] h-auto bg-cover bg-center bg-no-repeat rounded-md mb-4">
									<img
										src={resources.backgroundImages[field.value].url}
										alt="background"
									/>
								</div>
								<p className="text-sm text-gray-500 mb-2">
									{resources.backgroundImages[field.value].filename}
								</p>
							</>
						) : (
							<div>背景画像が選択されていません</div>
						)}

						<div className="flex gap-2">
							<Button
								size="sm"
								onClick={() => {
									modalSlice.openModal({
										target: "asset",
										params: {
											mode: "select",
											target: "backgroundImages",
											formTarget: "backgroundId",
										},
									});
								}}
								type="button"
							>
								背景画像を選択
							</Button>

							{/* <Button
								size="sm"
								onClick={() => {
									modalSlice.openModal({
										target: "adjustSize",
										params: {
											target: "characters",
											characterId: (event as AppearCharacterEvent).characterId,
											assetId: field.value,
											position: (event as AppearCharacterEvent).position,
											scale: (event as AppearCharacterEvent).scale,
										},
									});
								}}
								type="button"
							>
								位置調整UIを開く
							</Button> */}
						</div>
					</FormItem>
				)}
			/>

			<Separator className="my-4" />
			<FormField
				key={"transitionDuration"}
				control={form.control}
				name={"transitionDuration"}
				render={({ field }) => {
					const { value, ...rest } = field;
					const newValue = Number.parseInt(value as string) || 0;
					return (
						<FormItem>
							<FormLabel>トランジション時間</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="トランジション時間を入力"
									{...rest}
									value={newValue}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					);
				}}
			/>
		</>
	);
};

const CGSelect = ({
	label,
	form,
	resources,
}: {
	label: string;
	form: ReturnType<typeof useForm>;
	resources: GameResources;
}) => {
	const modalSlice = useStore.useSlice.modal();

	return (
		<FormField
			key={"cgImageId"}
			control={form.control}
			name={"cgImageId"}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>

					{field.value && resources.cgImages[field.value] ? (
						<>
							<div className="w-full max-w-[200px] h-auto bg-cover bg-center bg-no-repeat rounded-md mb-4">
								<img
									src={resources.cgImages[field.value].url}
									alt="CG"
									className="w-full h-auto rounded-md"
								/>
							</div>
							<p className="text-sm text-gray-500 mb-2">
								{resources.cgImages[field.value].filename}
							</p>
						</>
					) : (
						<div className="text-sm text-gray-500 mb-2">
							CGが選択されていません
						</div>
					)}

					<Button
						size="sm"
						onClick={() => {
							modalSlice.openModal({
								target: "asset",
								params: {
									mode: "select",
									target: "cgImages",
									formTarget: "cgImageId",
								},
							});
						}}
						type="button"
					>
						CGを選択
					</Button>
				</FormItem>
			)}
		/>
	);
};

const BGMSelect = ({
	label,
	form,
	resources,
}: {
	label: string;
	form: ReturnType<typeof useForm>;
	resources: GameResources;
}) => {
	const modalSlice = useStore.useSlice.modal();

	return (
		<FormField
			key={"bgmId"}
			control={form.control}
			name={"bgmId"}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>

					{field.value && resources.bgms[field.value] ? (
						<>
							<div className="flex items-center gap-2 mb-2">
								<audio
									src={resources.bgms[field.value].url}
									controls
									className="w-full"
								>
									<track kind="captions" />
								</audio>
							</div>
							<p className="text-sm text-gray-500 mb-2">
								{resources.bgms[field.value].filename}
							</p>
						</>
					) : (
						<div className="text-sm text-gray-500 mb-2">
							BGMが選択されていません
						</div>
					)}

					<Button
						size="sm"
						onClick={() => {
							modalSlice.openModal({
								target: "asset",
								params: {
									mode: "select",
									target: "bgms",
									formTarget: "bgmId",
								},
							});
						}}
						type="button"
					>
						BGMを選択
					</Button>
				</FormItem>
			)}
		/>
	);
};
