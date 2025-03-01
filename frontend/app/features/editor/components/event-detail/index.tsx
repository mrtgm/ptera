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
import { Form } from "~/components/shadcn/form";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "~/components/shadcn/tabs";
import { Player } from "~/features/player/utils/engine";
import {
	type Game,
	type GameEvent,
	type GameResources,
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
import { GameScreen } from "../../../player/components/game-screen";
import { usePlayerInitialize } from "../../../player/hooks";
import { INITIAL_STAGE } from "../../../player/utils/engine";
import {
	buildCurrentStageFromScenes,
	findAllPaths,
} from "../../../player/utils/graph";
import {
	SideBarSettings,
	type SidebarItemParameter,
	getEventTitle,
} from "../../constants";

import { MonitorPlay } from "lucide-react";
import { useUnsavedFormWarning } from "~/hooks/use-unsaved-form-warning";
import { useStore } from "~/stores";
import type { ModalParams } from "~/stores/modal";
import {
	AdjustSizeDialog,
	AssetDialog,
	type AssetDialogKeyType,
	CharacterDialog,
	PreviewDialog,
	useDeleteConfirmationDialog,
} from "../dialogs";
import {
	BGMSelect,
	BackgroundSelect,
	CGSelect,
	CharacterEffectSelect,
	CharacterImageSelect,
	CharacterNameInput,
	EffectSelect,
	SoundEffectSelect,
	TextInput,
	TransitionDuration,
	VolumeSlider,
} from "./forms";

type EventDetailProps = {
	selectedScene: Scene;
	selectedEvent: GameEvent;
	game: Game | null;
	resources: GameResources | null;
	onDeleteEvent: () => void;
	onSaveEvent: (updatedEvent: GameEvent) => void;
	onAddCharacter: (name: string) => void;
	onDeleteCharacter: (characterId: string) => void;
	onDeleteImage: (characterId: string, imageId: string) => void;
	onDeleteAsset: (assetId: string, type: AssetDialogKeyType) => void;
	onCharacterNameChange: (characterId: string, name: string) => void;
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

export const EventDetail = ({
	selectedScene,
	selectedEvent,
	game,
	resources,
	onDeleteEvent,
	onSaveEvent,
	onAddCharacter,
	onDeleteCharacter,
	onCharacterNameChange,
	onDeleteImage,
	onDeleteAsset,
}: EventDetailProps) => {
	const [activeTab, setActiveTab] = useState("parameters");
	const [formValues, setFormValues] =
		useState<Partial<GameEvent>>(selectedEvent);
	const modalSlice = useStore.useSlice.modal();

	const ref = useRef<HTMLDivElement>(null);

	const formSchema = schemaMap[selectedEvent.type];

	const form = useForm({
		mode: "onBlur",
		defaultValues: selectedEvent as Record<string, unknown>,
		resolver: zodResolver(formSchema),
	});

	useEffect(() => {
		if (selectedEvent) {
			form.reset(selectedEvent);
		}
	}, [selectedEvent, form]);

	useUnsavedFormWarning(form.formState);

	const handleSubmit = (data: Partial<GameEvent>) => {
		const updatedEvent = {
			...selectedEvent,
			...data,
		} as GameEvent;

		onSaveEvent(updatedEvent);
		form.reset(data);
	};

	const mapAssetTypeToFormTarget = (
		type: AssetDialogKeyType,
	): AssetFormType => {
		switch (type) {
			case "backgroundImages":
				return "backgroundId";
			case "cgImages":
				return "cgImageId";
			case "soundEffects":
				return "soundEffectId";
			case "bgms":
				return "bgmId";
		}
	};

	const handleConfirmAssetSelection = (
		assetId: string,
		type: AssetDialogKeyType,
	) => {
		form.setValue(mapAssetTypeToFormTarget(type), assetId, {
			shouldDirty: true,
		});
	};

	const handleConfirmAdjustment = (
		characterId: string,
		assetId: string,
		position: [number, number],
		scale: number,
	) => {
		form.setValue("characterId", characterId, { shouldDirty: true });
		form.setValue("characterImageId", assetId, { shouldDirty: true });
		form.setValue("position", position, { shouldDirty: true });
		form.setValue("scale", scale, { shouldDirty: true });
	};

	const handleConfirmCharacterSelection = (characterId: string) => {
		form.setValue("characterId", characterId, { shouldDirty: true });
	};

	const handleConfirmCharacterImageSelection = (
		characterId: string,
		imageId: string,
	) => {
		form.setValue("characterId", characterId, { shouldDirty: true });
		form.setValue("characterImageId", imageId, { shouldDirty: true });
	};

	useEffect(() => {
		const subscription = form.watch((data) => {
			setFormValues(data as Partial<GameEvent>);
		});
		return () => subscription.unsubscribe();
	}, [form]);

	if (!selectedEvent || !game || !resources) {
		return null;
	}

	const {
		ConfirmDialog: EventDeleteDialog,
		setDeleteDialogOpen: setEventDeleteDialogOpen,
	} = useDeleteConfirmationDialog();

	return (
		<div className="w-full h-[calc(100dvh-40px)] overflow-auto p-4" ref={ref}>
			<AssetDialog
				game={game}
				resources={resources}
				onDeleteAsset={onDeleteAsset}
				onConfirmAssetSelection={handleConfirmAssetSelection}
			/>
			<AdjustSizeDialog
				onConfirmAdjustment={handleConfirmAdjustment}
				open={modalSlice.isOpen && modalSlice.target === "adjustSize"}
				resources={resources}
				onOpenChange={modalSlice.closeModal}
				initialData={modalSlice.params as ModalParams["adjustSize"]}
			/>
			<PreviewDialog
				game={game}
				resources={resources}
				formValues={formValues}
				currentScene={selectedScene}
				currentEvent={selectedEvent}
			/>
			<CharacterDialog
				game={game}
				resources={resources}
				onConfirmCharacterSelection={handleConfirmCharacterSelection}
				onConfirmCharacterImageSelection={handleConfirmCharacterImageSelection}
				onCharacterNameChange={onCharacterNameChange}
				onAddCharacter={onAddCharacter}
				onDeleteCharacter={onDeleteCharacter}
				onDeleteImage={onDeleteImage}
			/>
			<EventDeleteDialog
				title={"イベント削除"}
				description={"このイベントを削除しますか？"}
				alertDescription={
					"この操作は元に戻せません。イベントは完全に削除されます。"
				}
				confirmDelete={() => {
					onDeleteEvent();
					setEventDeleteDialogOpen(false);
				}}
			/>

			<Card className="w-full">
				<CardHeader className="flex flex-row justify-between items-center">
					<CardTitle className="text-md">
						{getEventTitle(selectedEvent.type)}
					</CardTitle>
					<div className="flex gap-2 flex-wrap">
						<Button
							variant="outline"
							onClick={() =>
								modalSlice.openModal({
									target: "preview",
									params: {
										currentSceneId: selectedScene.id,
										currentEventId: selectedEvent.id,
									},
								})
							}
							className="flex items-center gap-2"
						>
							<MonitorPlay size={16} />
						</Button>
						<Button
							variant="destructive"
							onClick={() => setEventDeleteDialogOpen(true)}
						>
							イベント削除
						</Button>
					</div>
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
									form.handleSubmit(handleSubmit, (e) => {
										console.error(e);
									})();
								}}
							>
								<TabsContent value="parameters" className="space-y-4">
									{renderEventFormFields(selectedEvent, form, game, resources)}
								</TabsContent>

								<TabsContent value="preview">
									<div className="min-h-[200px] bg-gray-100 rounded-md p-4">
										{renderEventPreview(
											formValues,
											game,
											resources,
											selectedScene,
											selectedEvent,
											activeTab,
										)}
									</div>
								</TabsContent>

								{activeTab === "parameters" && (
									<div className="mt-4 flex justify-end">
										<Button type="submit">保存</Button>
									</div>
								)}
							</form>
						</Form>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
};

export const renderEventPreview = (
	formValues: Partial<GameEvent>,
	game: Game,
	resources: GameResources,
	currentScene: Scene,
	currentEvent: GameEvent,
	activeTab?: string,
) => {
	const [player, setPlayer] = useState<Player>(() => new Player());

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

	useEffect(() => {
		if (activeTab && activeTab !== "preview") {
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

		console.log("currentStage", currentStage);

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
		return () => {
			player.dispose();
		};
	}, [player.dispose]);

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
		case "transition-duration": {
			return <TransitionDuration form={form} label={field.label} />;
		}

		case "character-effect-select": {
			return <CharacterEffectSelect form={form} label={field.label} />;
		}
		case "effect-select": {
			return <EffectSelect form={form} label={field.label} />;
		}
		case "sound-effect-select": {
			return (
				<SoundEffectSelect
					form={form}
					label={field.label}
					resources={resources}
				/>
			);
		}
		case "volume-slider": {
			return <VolumeSlider form={form} label={field.label} />;
		}
		case "character-image-select": {
			return (
				<CharacterImageSelect
					form={form}
					label={field.label}
					resources={resources}
				/>
			);
		}
		case "character-select": {
			return (
				<CharacterImageSelect
					form={form}
					label={field.label}
					resources={resources}
				/>
			);
		}

		default:
			return null;
	}
};
