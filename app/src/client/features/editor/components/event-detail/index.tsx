import { Button } from "@/client/components/shadcn/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/client/components/shadcn/card";
import { Form } from "@/client/components/shadcn/form";
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
} from "@/client/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
	SideBarSettings,
	type SidebarItemParameter,
	getEventTitle,
} from "../../constants";

import { useStore } from "@/client/stores";
import { MonitorPlay, Trash } from "lucide-react";
import { useDeleteConfirmationDialog } from "../dialogs";
import { UnsavedChangeDialog } from "../dialogs/unsaved-change";
import {
	BGMSelect,
	BackgroundSelect,
	CGSelect,
	CharacterEffectSelect,
	CharacterImageSelect,
	CharacterNameInput,
	CharacterSelect,
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
};

const schemaMap: Record<GameEvent["eventType"], z.ZodType> = {
	textRender: textRenderEventSchema,
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
}: EventDetailProps) => {
	const [activeTab, setActiveTab] = useState("parameters");
	const [formValues, setFormValues] =
		useState<Partial<GameEvent>>(selectedEvent);
	const modalSlice = useStore.useSlice.modal();

	const ref = useRef<HTMLDivElement>(null);

	const formSchema = schemaMap[selectedEvent.eventType];

	const form = useForm({
		mode: "onBlur",
		defaultValues: selectedEvent as Record<string, unknown>,
		resolver: zodResolver(formSchema),
	});

	useEffect(() => {
		console.log("selectedEvent", selectedEvent);
		if (selectedEvent) {
			form.reset(selectedEvent);
		}
	}, [selectedEvent, form]);

	// useUnsavedFormWarning(form.formState);

	const handleSubmit = (data: Partial<GameEvent>) => {
		const updatedEvent = {
			...selectedEvent,
			...data,
		} as GameEvent;

		onSaveEvent(updatedEvent);
		form.reset(data);
	};

	useEffect(() => {
		const subscription = form.watch((data) => {
			setFormValues(data as Partial<GameEvent>);
		});
		return () => subscription.unsubscribe();
	}, [form]);

	const {
		ConfirmDialog: EventDeleteDialog,
		setDeleteDialogOpen: setEventDeleteDialogOpen,
	} = useDeleteConfirmationDialog();

	if (!selectedEvent || !game || !resources) {
		return null;
	}

	return (
		<div className="w-full h-[calc(100dvh-40px)] overflow-auto p-4" ref={ref}>
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

			<UnsavedChangeDialog isDirty={form.formState.isDirty} />

			<Card className="w-full">
				<CardHeader className="flex flex-row justify-between items-center">
					<CardTitle className="text-md">
						{getEventTitle(selectedEvent.eventType)}
					</CardTitle>
					<div className="flex gap-2 flex-wrap">
						<Button
							size="icon"
							variant="outline"
							onClick={() =>
								modalSlice.openModal("preview", {
									currentSceneId: selectedScene.id,
									currentEventId: selectedEvent.id,
									formValues,
								})
							}
							className="flex items-center gap-2"
						>
							<MonitorPlay size={16} />
						</Button>
						{selectedScene.events.length > 1 && (
							<Button
								size="icon"
								variant="outline"
								onClick={() => setEventDeleteDialogOpen(true)}
							>
								<Trash size={16} className="text-red-600" />
							</Button>
						)}
					</div>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							className="space-y-4"
							onSubmit={(e) => {
								e.preventDefault();
								form.handleSubmit(handleSubmit, (e) => {
									console.error(e);
								})();
							}}
						>
							{renderEventFormFields(selectedEvent, form, game, resources)}

							{activeTab === "parameters" && (
								<div className="mt-4 flex justify-end">
									<Button type="submit">保存</Button>
								</div>
							)}
						</form>
					</Form>
				</CardContent>
			</Card>
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
		(item) => item.type === event.eventType,
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
				<CharacterSelect
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
