import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { type SidebarItemParameter, getEventTitle } from "./constants";
import { SideBarSettings } from "./constants";

type EventEditorProps = {
	selectedEvent: GameEvent;
	game: Game | null;
	cache: ResourceCache;
	onDeleteEvent: () => void;
	onSaveEvent: (updatedEvent: GameEvent) => void;
};

export const EventEditor = ({
	selectedEvent,
	game,
	cache,
	onDeleteEvent,
	onSaveEvent,
}: EventEditorProps) => {
	const [activeTab, setActiveTab] = useState("parameters");

	const form = useForm({
		// defaultValues: getDefaultValues(selectedEvent),
	});

	const handleSubmit = (data: Partial<GameEvent>) => {
		// Convert form data back to proper event structure
		// const updatedEvent = mapFormDataToEvent(data, selectedEvent);
		// onSaveEvent(updatedEvent);
	};

	if (!selectedEvent || !game) {
		return null;
	}

	return (
		<div className="w-full h-full overflow-auto p-4">
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
							<form onSubmit={form.handleSubmit(handleSubmit)}>
								<TabsContent value="parameters">
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

	return fields.map((field) => {
		return (
			<FormItem key={field.label}>
				<FormLabel>{field.label}</FormLabel>
				{renderField(field, event, form, game, cache)}
			</FormItem>
		);
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
			return <TextInput form={form} field={field} event={event} />;
		}
		// case "background-select": {
		// 	// return (
		// 		// <BackgroundSelect form={form} field={field} event={event} game={game} />
		// 	// );
		// }
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
		// case "character-name-input": {
		// 	// return <CharacterNameInput form={form} field={field} event={event} />;
		// }

		default:
			return null;
	}
};

const TextInput = ({
	form,
	field,
	event,
}: {
	form: ReturnType<typeof useForm>;
	field: SidebarItemParameter;
	event: GameEvent;
}) => {
	return (
		<FormControl>
			<Textarea
				placeholder="テキストを入力"
				rows={6}
				defaultValue={(event as TextRenderEvent).lines?.join("\n") || ""}
				{...form.register(field.label)}
			/>
		</FormControl>
	);
};

// const CharacterNameInput = ({
// 	form,
// 	field,
// 	event,
// }: {
// 	form: ReturnType<typeof useForm>;
// 	field: SidebarItemParameter;
// 	event: GameEvent;
// }) => {
// 	return (
// 		<FormControl>
// 			<Input
// 				placeholder="キャラクター名を入力"
// 				defaultValue={(event as TextRenderEvent).characterName || ""}
// 				{...form.register(field.label)}
// 			/>
// 		</FormControl>
// 	);
// };

// // Character Select Component
// const CharacterSelect = ({
// 	form,
// 	field,
// 	event,
// 	game,
//   res
// }: {
// 	form: ReturnType<typeof useForm>;
// 	field: SidebarItemParameter;
// 	event: GameEvent;
// 	game: Game;
// }) => {
// 	const characterEvent = event as
// 		| AppearCharacterEvent
// 		| HideCharacterEvent
// 		| MoveCharacterEvent
// 		| CharacterEffectEvent;

// 	return (
// 		<FormControl>
// 			<Select
// 				defaultValue={characterEvent.characterId || ""}
// 				onValueChange={(value) => form.setValue(field.label, value)}
// 			>
// 				<SelectTrigger>
// 					<SelectValue placeholder="キャラクターを選択" />
// 				</SelectTrigger>
// 				<SelectContent>
// 					{Object.entries(game.resources.characters || {}).map(
// 						([id, character]) => (
// 							<SelectItem key={id} value={id}>
// 								{character.name}
// 							</SelectItem>
// 						),
// 					)}
// 				</SelectContent>
// 			</Select>
// 		</FormControl>
// 	);
// };

// // Character Image Select Component
// const CharacterImageSelect = ({ form, field, event, cache }) => {
// 	const characterEvent = event as AppearCharacterEvent;
// 	const characterId = characterEvent.characterId;
// 	const character = cache.characters[characterId];

// 	if (!character) {
// 		return (
// 			<div className="text-sm text-gray-500">
// 				先にキャラクターを選択してください
// 			</div>
// 		);
// 	}

// 	return (
// 		<FormControl>
// 			<Select
// 				defaultValue={characterEvent.characterImageId || ""}
// 				onValueChange={(value) => form.setValue(field.label, value)}
// 			>
// 				<SelectTrigger>
// 					<SelectValue placeholder="画像を選択" />
// 				</SelectTrigger>
// 				<SelectContent>
// 					{Object.entries(character.images || {}).map(([id, image]) => (
// 						<SelectItem key={id} value={id}>
// 							{id}
// 						</SelectItem>
// 					))}
// 				</SelectContent>
// 			</Select>
// 		</FormControl>
// 	);
// };

// // Position Select Component
// const PositionSelect = ({ form, field, event }) => {
// 	// For events with position property like appearCharacter, moveCharacter, etc.
// 	let posX = 50;
// 	let posY = 50;

// 	if ("position" in event && Array.isArray(event.position)) {
// 		posX = event.position[0];
// 		posY = event.position[1];
// 	}

// 	return (
// 		<div className="grid grid-cols-2 gap-4">
// 			<div>
// 				<FormLabel className="text-xs">X (0-100)</FormLabel>
// 				<FormControl>
// 					<Input
// 						type="number"
// 						min="0"
// 						max="100"
// 						defaultValue={posX}
// 						{...form.register(`${field.label}-x`, { valueAsNumber: true })}
// 					/>
// 				</FormControl>
// 			</div>
// 			<div>
// 				<FormLabel className="text-xs">Y (0-100)</FormLabel>
// 				<FormControl>
// 					<Input
// 						type="number"
// 						min="0"
// 						max="100"
// 						defaultValue={posY}
// 						{...form.register(`${field.label}-y`, { valueAsNumber: true })}
// 					/>
// 				</FormControl>
// 			</div>
// 		</div>
// 	);
// };

// // Transition Duration Component
// const TransitionDuration = ({ form, field, event }) => {
// 	// For events with transitionDuration property
// 	const duration =
// 		"transitionDuration" in event ? event.transitionDuration : 0.5;

// 	return (
// 		<FormControl>
// 			<Input
// 				type="number"
// 				min="0"
// 				step="0.1"
// 				defaultValue={duration}
// 				{...form.register(field.label, { valueAsNumber: true })}
// 			/>
// 		</FormControl>
// 	);
// };

// // BGM Select Component
// const BGMSelect = ({ form, field, event, game }) => {
// 	const bgmEvent = event as BGMStartEvent;

// 	return (
// 		<FormControl>
// 			<Select
// 				defaultValue={bgmEvent.bgmId || ""}
// 				onValueChange={(value) => form.setValue(field.label, value)}
// 			>
// 				<SelectTrigger>
// 					<SelectValue placeholder="BGMを選択" />
// 				</SelectTrigger>
// 				<SelectContent>
// 					{Object.entries(game.resources.bgms || {}).map(([id, bgm]) => (
// 						<SelectItem key={id} value={id}>
// 							{bgm.filename}
// 						</SelectItem>
// 					))}
// 				</SelectContent>
// 			</Select>
// 		</FormControl>
// 	);
// };

// // Volume Slider Component
// const VolumeSlider = ({ form, field, event }) => {
// 	// For events with volume property
// 	const volume = "volume" in event ? event.volume : 1;
// 	const [value, setValue] = useState(volume);

// 	useEffect(() => {
// 		form.setValue(field.label, value);
// 	}, [value, field.label, form]);

// 	return (
// 		<>
// 			<FormControl>
// 				<Slider
// 					min={0}
// 					max={1}
// 					step={0.01}
// 					value={[value]}
// 					onValueChange={(values) => setValue(values[0])}
// 				/>
// 			</FormControl>
// 			<div className="text-xs text-right mt-1">{Math.round(value * 100)}%</div>
// 		</>
// 	);
// };

// // Sound Effect Select Component
// const SoundEffectSelect = ({ form, field, event, game }) => {
// 	const sfxEvent = event as SoundEffectEvent;

// 	return (
// 		<FormControl>
// 			<Select
// 				defaultValue={sfxEvent.soundEffectId || ""}
// 				onValueChange={(value) => form.setValue(field.label, value)}
// 			>
// 				<SelectTrigger>
// 					<SelectValue placeholder="効果音を選択" />
// 				</SelectTrigger>
// 				<SelectContent>
// 					{Object.entries(game.resources.soundEffects || {}).map(
// 						([id, sfx]) => (
// 							<SelectItem key={id} value={id}>
// 								{sfx.filename}
// 							</SelectItem>
// 						),
// 					)}
// 				</SelectContent>
// 			</Select>
// 		</FormControl>
// 	);
// };

// // Background Select Component
// const BackgroundSelect = ({ form, field, event, game }) => {
// 	const bgEvent = event as ChangeBackgroundEvent;

// 	return (
// 		<FormControl>
// 			<Select
// 				defaultValue={bgEvent.backgroundId || ""}
// 				onValueChange={(value) => form.setValue(field.label, value)}
// 			>
// 				<SelectTrigger>
// 					<SelectValue placeholder="背景を選択" />
// 				</SelectTrigger>
// 				<SelectContent>
// 					{Object.entries(game.resources.backgroundImages || {}).map(
// 						([id, bg]) => (
// 							<SelectItem key={id} value={id}>
// 								{bg.filename}
// 							</SelectItem>
// 						),
// 					)}
// 				</SelectContent>
// 			</Select>
// 		</FormControl>
// 	);
// };

// // Effect Select Component
// const EffectSelect = ({ form, field, event }) => {
// 	const effectEvent = event as EffectEvent;

// 	return (
// 		<FormControl>
// 			<Select
// 				defaultValue={effectEvent.effectType || ""}
// 				onValueChange={(value) => form.setValue(field.label, value)}
// 			>
// 				<SelectTrigger>
// 					<SelectValue placeholder="エフェクトを選択" />
// 				</SelectTrigger>
// 				<SelectContent>
// 					<SelectItem value="fadeIn">フェードイン</SelectItem>
// 					<SelectItem value="fadeOut">フェードアウト</SelectItem>
// 					<SelectItem value="shake">シェイク</SelectItem>
// 				</SelectContent>
// 			</Select>
// 		</FormControl>
// 	);
// };

// // Character Effect Select Component
// const CharacterEffectSelect = ({ form, field, event }) => {
// 	const charEffectEvent = event as CharacterEffectEvent;

// 	return (
// 		<FormControl>
// 			<Select
// 				defaultValue={charEffectEvent.effectType || ""}
// 				onValueChange={(value) => form.setValue(field.label, value)}
// 			>
// 				<SelectTrigger>
// 					<SelectValue placeholder="エフェクトを選択" />
// 				</SelectTrigger>
// 				<SelectContent>
// 					<SelectItem value="shake">シェイク</SelectItem>
// 					<SelectItem value="flash">フラッシュ</SelectItem>
// 					<SelectItem value="bounce">バウンス</SelectItem>
// 					<SelectItem value="sway">スウェイ</SelectItem>
// 					<SelectItem value="wobble">ウォブル</SelectItem>
// 					<SelectItem value="blackOn">暗転オン</SelectItem>
// 					<SelectItem value="blackOff">暗転オフ</SelectItem>
// 				</SelectContent>
// 			</Select>
// 		</FormControl>
// 	);
// };
