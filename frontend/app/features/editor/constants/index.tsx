import { generateKeyBetween } from "fractional-indexing";
import {
	EyeOff,
	FileImage,
	HeadphoneOff,
	Headphones,
	Image,
	MessageCircleMore,
	MessageCircleOff,
	Pen,
	UserMinus,
	UserX,
	Users,
	Volume2,
	Zap,
} from "lucide-react";
import type { ReactElement } from "react";
import type { EventProperties, GameEvent, GameResources } from "~/schema";
import type { ValidationOptions } from "../utils/file-validator";

export type ComponentType =
	| "text"
	| "character-name-input"
	| "character-select"
	| "character-image-select"
	| "position-select"
	| "transition-duration"
	| "bgm-select"
	| "volume-slider"
	| "sound-effect-select"
	| "background-select"
	| "effect-select"
	| "character-effect-select"
	| "cg-select";

export type SidebarItemParameter = {
	label: string;
	component: ComponentType;
};

export type SidebarItem = {
	id: string;
	type: GameEvent["type"];
	icon: ReactElement;
	label: string;
	parameters: SidebarItemParameter[];
};

export const SideBarSettings: Record<
	GameEvent["category"],
	{
		hex: string;
		label: string;
		items: SidebarItem[];
	}
> = {
	message: {
		hex: "#6366F1", // Indigo
		label: "メッセージ",
		items: [
			{
				id: "text",
				type: "text", // matches EventType
				icon: <Pen />,
				label: "テキスト",
				parameters: [
					{
						label: "テキスト",
						component: "text",
					},
					{
						label: "キャラクタ名",
						component: "character-name-input",
					},
				],
			},
			{
				id: "appearMessageWindow",
				type: "appearMessageWindow",
				icon: <MessageCircleMore />,
				label: "メッセージウィンドウを表示",
				parameters: [
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
			{
				id: "hideMessageWindow",
				type: "hideMessageWindow",
				icon: <MessageCircleOff />,
				label: "メッセージウィンドウを非表示",
				parameters: [
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
		],
	},
	character: {
		hex: "#F59E0B", // Amber
		label: "キャラクター",
		items: [
			{
				id: "appearCharacter",
				type: "appearCharacter",
				icon: <Users />,
				label: "キャラクターを表示",
				parameters: [
					{
						label: "キャラクターと画像を選択",
						component: "character-image-select",
					},
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
			{
				id: "hideCharacter",
				type: "hideCharacter",
				icon: <UserMinus />,
				label: "キャラクターを非表示",
				parameters: [
					{
						label: "キャラクター",
						component: "character-select",
					},
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
			{
				id: "hideAllCharacters",
				type: "hideAllCharacters",
				icon: <UserX />,
				label: "すべてのキャラクターを非表示",
				parameters: [
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
			// TODO: 実装
			// {
			// 	id: "moveCharacter",
			// 	type: "moveCharacter",
			// 	icon: <Move />,
			// 	label: "キャラクターを移動",
			// 	parameters: [
			// 		{
			// 			label: "キャラクター",
			// 			component: "character-select",
			// 		},
			// 		{
			// 			label: "位置",
			// 			component: "position-select",
			// 		},
			// 		{
			// 			label: "移動時間（秒）",
			// 			component: "transition-duration",
			// 		},
			// 	],
			// },
			{
				id: "characterEffect",
				type: "characterEffect",
				icon: <Zap />,
				label: "キャラクターエフェクト",
				parameters: [
					{
						label: "キャラクター",
						component: "character-select",
					},
					{
						label: "エフェクト",
						component: "character-effect-select",
					},
					{
						label: "エフェクト時間（秒）",
						component: "transition-duration",
					},
				],
			},
		],
	},
	media: {
		hex: "#EC4899", // Pink
		label: "メディア",
		items: [
			{
				id: "bgmStart",
				type: "bgmStart",
				icon: <Headphones />,
				label: "BGM開始",
				parameters: [
					{
						label: "BGM",
						component: "bgm-select",
					},
					{
						label: "音量",
						component: "volume-slider",
					},
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
			{
				id: "bgmStop",
				type: "bgmStop",
				icon: <HeadphoneOff />,
				label: "BGM停止",
				parameters: [
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
			{
				id: "soundEffect",
				type: "soundEffect",
				icon: <Volume2 />,
				label: "効果音",
				parameters: [
					{
						label: "効果音",
						component: "sound-effect-select",
					},
					{
						label: "音量",
						component: "volume-slider",
					},
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
		],
	},
	background: {
		hex: "#10B981", // Emerald
		label: "背景",
		items: [
			{
				id: "changeBackground",
				type: "changeBackground",
				icon: <Image />,
				label: "背景を変更",
				parameters: [
					{
						label: "背景",
						component: "background-select",
					},
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
		],
	},
	effect: {
		hex: "#8B5CF6", // Violet
		label: "エフェクト",
		items: [
			{
				id: "effect",
				type: "effect",
				icon: <Zap />,
				label: "画面エフェクト",
				parameters: [
					{
						label: "エフェクト",
						component: "effect-select",
					},
					{
						label: "エフェクト時間（秒）",
						component: "transition-duration",
					},
				],
			},
		],
	},
	cg: {
		hex: "#F43F5E", // Rose
		label: "CG",
		items: [
			{
				id: "appearCG",
				type: "appearCG",
				icon: <FileImage />,
				label: "CGを表示",
				parameters: [
					{
						label: "CG",
						component: "cg-select",
					},
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
			{
				id: "hideCG",
				type: "hideCG",
				icon: <EyeOff />,
				label: "CGを非表示",
				parameters: [
					{
						label: "トランジション時間（秒）",
						component: "transition-duration",
					},
				],
			},
		],
	},
} as const;

export const createEventFromSidebarItem = (
	item: (typeof SideBarSettings)[keyof typeof SideBarSettings]["items"][number],
	resources: GameResources,
) => {
	const event = {
		id: crypto.randomUUID(),
		type: item.type,
		category: getEventCategory(item.type),
		order: generateKeyBetween(null, null),
		...getDefaultValueForType(item.type, resources),
	} as GameEvent;
	return event;
};

export const getColorFromType = (type: GameEvent["type"]): string => {
	const category = getEventCategory(type);
	return SideBarSettings[category].hex;
};

export const getEventTitle = (type: GameEvent["type"]): string => {
	const title = Object.entries(SideBarSettings)
		.flatMap(([_, value]) => {
			return value.items.map((item) => {
				if (item.type === type) {
					return item.label;
				}
			});
		})
		.filter(Boolean);

	if (title.length === 0) {
		return "不明";
	}

	return title[0] as string;
};

export const getEventCategory = (
	type: GameEvent["type"],
): GameEvent["category"] => {
	switch (type) {
		case "text":
		case "appearMessageWindow":
		case "hideMessageWindow":
			return "message";
		case "appearCharacter":
		case "hideCharacter":
		case "hideAllCharacters":
		case "moveCharacter":
		case "characterEffect":
			return "character";
		case "bgmStart":
		case "bgmStop":
		case "soundEffect":
			return "media";
		case "changeBackground":
			return "background";
		case "effect":
			return "effect";
		case "appearCG":
		case "hideCG":
			return "cg";
		default:
			return "message";
	}
};

export const getDefaultValueForType = (
	type: GameEvent["type"],
	resources: GameResources,
): EventProperties[GameEvent["type"]] => {
	const defaults = {} as EventProperties[GameEvent["type"]];

	switch (type) {
		case "text":
			return {
				text: "テキストを入力してください",
				characterName: "",
			};
		case "appearMessageWindow":
			return {
				transitionDuration: 1000,
			};
		case "hideMessageWindow":
			return {
				transitionDuration: 1000,
			};
		case "appearCharacter": {
			//TODO: 使用履歴を見て最後に選択したキャラクターを選択する
			const characterId = Object.keys(resources.characters)[0];
			const characterImageId = Object.values(
				resources.characters[characterId].images,
			)[0].id;
			return {
				characterId,
				characterImageId,
				transitionDuration: 1000,
				scale: 1,
				position: [0, 0],
			};
		}
		case "hideCharacter":
			return {
				characterId: Object.keys(resources.characters)[0],
				transitionDuration: 1000,
			};
		case "hideAllCharacters":
			return {
				transitionDuration: 1000,
			};
		case "moveCharacter":
			return {
				characterId: Object.keys(resources.characters)[0],
				position: [0, 0],
				transitionDuration: 1000,
			};
		case "characterEffect":
			return {
				characterId: Object.keys(resources.characters)[0],
				effectType: "shake",
				transitionDuration: 1000,
			};
		case "bgmStart":
			return {
				bgmId: Object.keys(resources.bgms)[0],
				volume: 1,
				loop: true,
				transitionDuration: 1000,
			};
		case "bgmStop":
			return {
				transitionDuration: 1000,
			};
		case "soundEffect":
			return {
				soundEffectId: Object.keys(resources.soundEffects)[0],
				volume: 1,
				loop: false,
				transitionDuration: 1000,
			};
		case "changeBackground":
			return {
				backgroundId: Object.keys(resources.backgroundImages)[0],
				transitionDuration: 1000,
			};
		case "effect":
			return {
				effectType: "shake",
				transitionDuration: 1000,
			};
		case "appearCG":
			return {
				cgImageId: Object.keys(resources.cgImages)[0],
				transitionDuration: 1000,
			};
		case "hideCG":
			return {
				transitionDuration: 1000,
			};
		default:
			return defaults;
	}
};

export const FILE_VALIDATION_SETTING: ValidationOptions = {
	allowedExtensions: ["jpg", "jpeg", "png", "gif", "mp3"],
	maxFileSize: 1024 * 1024 * 5, // 5MB
};
