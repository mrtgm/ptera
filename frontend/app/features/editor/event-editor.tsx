import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { type FieldErrors, useForm } from "react-hook-form";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/shadcn/select";
import { Slider } from "~/components/shadcn/slider";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "~/components/shadcn/tabs";
import { Textarea } from "~/components/shadcn/textarea";
import { useClickAway } from "~/hooks/use-click-away";
import {
	type AppearCharacterEvent,
	type Game,
	type GameEvent,
	type ResourceCache,
	type TextRenderEvent,
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
import { type SidebarItemParameter, getEventTitle } from "./constants";
import { SideBarSettings } from "./constants";

type EventEditorProps = {
	selectedEvent: GameEvent;
	game: Game | null;
	cache: ResourceCache;
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

export const EventEditor = ({
	selectedEvent,
	game,
	cache,
	onDeleteEvent,
	onSaveEvent,
	onClickAwayEvent,
}: EventEditorProps) => {
	const [activeTab, setActiveTab] = useState("parameters");

	const ref = useRef<HTMLDivElement>(null);

	const formSchema = schemaMap[selectedEvent.type];

	useClickAway({
		ref,
		handler: onClickAwayEvent,
	});

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

	useEffect(() => {
		console.log(form.getValues());
	}, [form]);

	if (!selectedEvent || !game) {
		return null;
	}

	return (
		<div className="w-full h-full overflow-auto p-4" ref={ref}>
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
									{renderEventFormFields(selectedEvent, form, game, cache)}
								</TabsContent>

								<TabsContent value="preview">
									<div className="min-h-[200px] bg-gray-100 rounded-md p-4">
										{/* {renderEventPreview(selectedEvent, form.watch(), cache)} */}
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

const renderEventFormFields = (
	event: GameEvent,
	form: ReturnType<typeof useForm>,
	game: Game,
	cache: ResourceCache,
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
		return <div key={v.label}>{renderField(v, event, form, game, cache)}</div>;
	});
};

const renderField = (
	field: SidebarItemParameter,
	event: GameEvent,
	form: ReturnType<typeof useForm>,
	game: Game,
	cache: ResourceCache,
) => {
	switch (field.component) {
		case "text": {
			return <TextInput label={field.label} form={form} event={event} />;
		}
		case "character-name-input": {
			return (
				<CharacterNameInput label={field.label} form={form} event={event} />
			);
		}
		case "background-select": {
			return (
				<BackgroundSelect form={form} field={field} event={event} game={game} />
			);
		}
		// case "cg-select": {
		// 	// return <CGSelect form={form} field={field} event={event} game={game} />;
		// }
		// case "transition-duration": {
		// 	// return <TransitionDuration form={form} field={field} event={event} />;
		// }
		// case "bgm-select": {
		// 	// return <BGMSelect form={form} field={field} event={event} game={game} />;
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
	event,
}: {
	label: string;
	form: ReturnType<typeof useForm>;
	event: GameEvent;
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
	event,
}: {
	form: ReturnType<typeof useForm>;
	label: string;
	event: GameEvent;
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
	form,
	field,
	event,
	game,
}: {
	form: ReturnType<typeof useForm>;
	field: SidebarItemParameter;
	event: GameEvent;
	game: Game;
}) => {
	return (
		<FormField
			key={"backgroundId"}
			control={form.control}
			name={"backgroundId"}
			render={({ field }) => (
				<FormItem>
					{/* <FormLabel>{field.label}</FormLabel>
					<FormControl>
						<Select {...field}>
							<SelectTrigger>
								<SelectValue>
									{
										backgroundOptions.find((o) => o.value === field.value)
											?.label
									}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{backgroundOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FormControl>
					<FormMessage /> */}
				</FormItem>
			)}
		/>
	);
};
